import express from "express";
import path from "path";
import fs from "fs";
// NOTE: on n'importe PAS "vite" en haut du fichier (import statique).
// Vite/rollup ne doivent être chargés qu'en dev local, jamais dans la
// fonction serverless Vercel — sinon ça fait planter la fonction entière
// (voir import() dynamique plus bas dans startServer()).
import { GoogleGenAI } from "@google/genai";
import { MongoClient, Db } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Security: Limit JSON payload size to prevent DoS attacks via memory exhaustion
app.use(express.json({ limit: "10kb" }));

// Security: Set HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// Simple in-memory rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

const apiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown-ip";
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Trop de requêtes. Veuillez patienter une minute avant de poser à nouveau une question.",
    });
  }

  record.count += 1;
  next();
};

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ============================================================================
// MONGODB — Connexion à la base de données (comptes utilisateurs)
// ============================================================================
// IMPORTANT (leçon serverless) : sur Vercel, une fonction peut être réutilisée
// entre deux requêtes ("warm start"). Si on ouvrait une NOUVELLE connexion
// MongoDB à chaque requête, on épuiserait vite le nombre de connexions
// autorisées par le cluster gratuit. On garde donc une seule "promesse de
// connexion" en mémoire (mongoClientPromise) et on la réutilise à chaque
// appel — exactement comme aiClient ci-dessus.
const mongoUri = process.env.MONGODB_URI;
let mongoClientPromise: Promise<MongoClient> | null = null;

function getMongoClient(): Promise<MongoClient> {
  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI est manquant. Ajoute cette variable d'environnement dans Vercel."
    );
  }
  if (!mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    mongoClientPromise = client.connect();
  }
  return mongoClientPromise;
}

// Raccourci pour accéder à la base "afroku" (créée automatiquement au
// premier écrit — pas besoin de la créer à la main sur Atlas)
async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db("afroku");
}

// Clé secrète utilisée pour signer les jetons de connexion (JWT)
const JWT_SECRET = process.env.JWT_SECRET || "";

// ============================================================================
// MIDDLEWARE D'AUTHENTIFICATION — réutilisable sur toute route protégée
// ============================================================================
// Étend le type Request d'Express pour y accrocher l'utilisateur décodé
// depuis son JWT, une fois vérifié.
declare global {
  namespace Express {
    interface Request {
      authUser?: { userId: string; email: string; role: string };
    }
  }
}

/**
 * Vérifie qu'une requête porte un jeton JWT valide (header
 * "Authorization: Bearer <token>"). Si oui, attache l'utilisateur décodé à
 * req.authUser et laisse passer. Sinon, renvoie 401 immédiatement — la
 * route protégée n'est jamais exécutée.
 */
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise." });
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    req.authUser = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide ou expirée. Veuillez vous reconnecter." });
  }
}

// ============================================================================
// RESEND — Envoi d'e-mails réels (codes OTP pour le mot de passe oublié)
// ============================================================================
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

async function sendOtpEmail(toEmail: string, code: string) {
  if (!resendClient) {
    throw new Error("RESEND_API_KEY est manquant côté serveur.");
  }
  // "onboarding@resend.dev" est l'adresse d'expéditeur de test fournie par
  // Resend, utilisable sans nom de domaine personnel. Sans domaine vérifié,
  // Resend n'autorise l'envoi qu'à l'adresse du compte Resend lui-même —
  // suffisant pour la démo, à remplacer plus tard par un domaine AfroKu.
  const result = await resendClient.emails.send({
    from: "AfroKu <onboarding@resend.dev>",
    to: toEmail,
    subject: "Votre code de vérification AfroKu",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #003580;">AfroKu.com</h2>
        <p>Voici votre code de vérification pour réinitialiser votre mot de passe :</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #003580;">${code}</p>
        <p>Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
      </div>
    `,
  });

  // IMPORTANT : le SDK Resend ne lève PAS d'exception pour les erreurs
  // "métier" (ex: domaine non vérifié) — il les renvoie dans result.error.
  // Sans cette vérification explicite, notre code pensait que tout allait
  // bien alors que l'e-mail n'était jamais parti.
  if (result.error) {
    console.error("Erreur Resend:", result.error);
    throw new Error(
      `Échec de l'envoi de l'e-mail : ${result.error.message || "erreur inconnue de Resend"}`
    );
  }
}

// API Routes

// ----------------------------------------------------------------------
// ROUTE TEMPORAIRE DE TEST — à supprimer une fois la connexion vérifiée.
// Elle ne fait qu'essayer de parler à MongoDB et renvoyer "ok" ou l'erreur.
// ----------------------------------------------------------------------
app.get("/api/test-db", async (req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 }); // ping = "es-tu vivante ?", ne touche à aucune donnée
    res.json({ status: "ok", message: "Connexion à MongoDB Atlas réussie !" });
  } catch (err: any) {
    console.error("Erreur de connexion MongoDB:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ----------------------------------------------------------------------
// POST /api/auth/register — Inscription d'un nouvel utilisateur
// ----------------------------------------------------------------------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body || {};

    // 1) Validation des entrées (jamais faire confiance aux données reçues)
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Le nom doit comporter au moins 2 caractères." });
    }
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Adresse e-mail invalide." });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Le mot de passe doit comporter au moins 6 caractères." });
    }
    const allowedRoles = ["tourist", "guide", "artisan"];
    const cleanRole = allowedRoles.includes(role) ? role : "tourist";

    const db = await getDb();
    const users = db.collection("users");

    // 2) Vérifier que l'e-mail n'est pas déjà utilisé
    const existing = await users.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ error: "Un compte existe déjà avec cet e-mail." });
    }

    // 3) Hacher le mot de passe — JAMAIS stocké en clair
    const passwordHash = await bcrypt.hash(password, 10);

    // 4) Créer le document utilisateur en base
    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: cleanRole,
      phone: typeof phone === "string" ? phone.trim() : "",
      accreditationStatus: cleanRole === "tourist" ? "verified" : "pending",
      createdAt: new Date(),
    };
    const result = await users.insertOne(newUser);

    // 5) Générer un jeton JWT pour connecter l'utilisateur immédiatement après inscription
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant côté serveur.");
    }
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email: cleanEmail, role: cleanRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6) Répondre — ne JAMAIS renvoyer passwordHash au frontend
    res.status(201).json({
      token,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accreditationStatus: newUser.accreditationStatus,
      },
    });
  } catch (err: any) {
    console.error("Erreur /api/auth/register:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});

// ----------------------------------------------------------------------
// POST /api/auth/login — Connexion d'un utilisateur existant
// ----------------------------------------------------------------------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!cleanEmail || !password) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs." });
    }

    const db = await getDb();
    const users = db.collection("users");

    // 1) Chercher le compte par e-mail
    const user = await users.findOne({ email: cleanEmail });

    // Message d'erreur volontairement IDENTIQUE que l'email existe ou non :
    // ça évite qu'un attaquant devine quels e-mails sont déjà inscrits
    // (technique dite "d'énumération de comptes").
    const genericError = "E-mail ou mot de passe incorrect.";
    if (!user) {
      return res.status(401).json({ error: genericError });
    }

    // 2) Comparer le mot de passe fourni avec le hash stocké
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: genericError });
    }

    // 3) Générer un nouveau jeton JWT
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant côté serveur.");
    }
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4) Répondre — jamais le passwordHash
    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        accreditationStatus: user.accreditationStatus,
      },
    });
  } catch (err: any) {
    console.error("Erreur /api/auth/login:", err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
});

// ----------------------------------------------------------------------
// POST /api/auth/forgot-password — Étape 1 : demande d'un code OTP par e-mail
// ----------------------------------------------------------------------
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!cleanEmail) {
      return res.status(400).json({ error: "Veuillez saisir une adresse e-mail." });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: "Aucun compte AfroKu n'est enregistré avec cette adresse e-mail." });
    }

    // Génère un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valable 10 minutes

    // Un seul code actif par e-mail : on remplace l'ancien s'il existe
    const otps = db.collection("otps");
    await otps.updateOne(
      { email: cleanEmail },
      { $set: { email: cleanEmail, codeHash, expiresAt, verified: false, createdAt: new Date() } },
      { upsert: true }
    );

    await sendOtpEmail(cleanEmail, code);

    res.status(200).json({ success: true, message: "Un code de vérification a été envoyé par e-mail." });
  } catch (err: any) {
    console.error("Erreur /api/auth/forgot-password:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi du code." });
  }
});

// ----------------------------------------------------------------------
// POST /api/auth/verify-otp — Étape 2 : vérification du code reçu
// ----------------------------------------------------------------------
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body || {};
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!cleanEmail || !code) {
      return res.status(400).json({ error: "Veuillez saisir le code reçu." });
    }

    const db = await getDb();
    const otps = db.collection("otps");
    const otpRecord = await otps.findOne({ email: cleanEmail });

    if (!otpRecord || new Date() > new Date(otpRecord.expiresAt)) {
      return res.status(400).json({ error: "Code expiré. Veuillez en demander un nouveau." });
    }

    const codeMatches = await bcrypt.compare(code, otpRecord.codeHash);
    if (!codeMatches) {
      return res.status(400).json({ error: "Code de vérification incorrect." });
    }

    // Le code est valide : on délivre un jeton temporaire (10 min) qui
    // autorise UNIQUEMENT le changement de mot de passe pour cet e-mail —
    // il ne sert à rien d'autre (pas de connexion générale possible avec).
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant côté serveur.");
    }
    const resetToken = jwt.sign(
      { email: cleanEmail, purpose: "password_reset" },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ success: true, resetToken });
  } catch (err: any) {
    console.error("Erreur /api/auth/verify-otp:", err);
    res.status(500).json({ error: "Erreur serveur lors de la vérification." });
  }
});

// ----------------------------------------------------------------------
// POST /api/auth/reset-password — Étape 3 : définir le nouveau mot de passe
// ----------------------------------------------------------------------
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body || {};
    if (!resetToken || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Le mot de passe doit comporter au moins 6 caractères." });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant côté serveur.");
    }

    let payload: any;
    try {
      payload = jwt.verify(resetToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Session expirée. Veuillez recommencer la procédure." });
    }
    if (!payload || payload.purpose !== "password_reset") {
      return res.status(401).json({ error: "Jeton invalide." });
    }

    const db = await getDb();
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.collection("users").updateOne(
      { email: payload.email },
      { $set: { passwordHash } }
    );

    // Le code OTP a servi son rôle, on le supprime pour qu'il ne puisse
    // plus être réutilisé.
    await db.collection("otps").deleteOne({ email: payload.email });

    res.status(200).json({ success: true, message: "Mot de passe réinitialisé avec succès." });
  } catch (err: any) {
    console.error("Erreur /api/auth/reset-password:", err);
    res.status(500).json({ error: "Erreur serveur lors de la réinitialisation." });
  }
});

// ----------------------------------------------------------------------
// POST /api/partner/apply — Soumission d'une candidature Guide ou Artisan
// Protégée : requireAuth exige un compte connecté (JWT valide) avant même
// d'exécuter le code de la route.
// ----------------------------------------------------------------------
app.post("/api/partner/apply", requireAuth, async (req, res) => {
  try {
    const { type, details } = req.body || {};

    if (type !== "guide" && type !== "artisan") {
      return res.status(400).json({ error: "Type de candidature invalide." });
    }
    if (!details || typeof details !== "object") {
      return res.status(400).json({ error: "Les informations du dossier sont manquantes." });
    }

    const db = await getDb();
    const applications = db.collection("partnerApplications");

    const newApplication = {
      userId: req.authUser!.userId,
      email: req.authUser!.email,
      type, // "guide" | "artisan"
      details, // toutes les infos du formulaire (ville, tarifs, spécialités...)
      status: "pending", // pending | approved | rejected
      adminNotes: "",
      submittedAt: new Date(),
      reviewedAt: null,
    };

    const result = await applications.insertOne(newApplication);

    res.status(201).json({
      success: true,
      applicationId: result.insertedId.toString(),
      message: "Candidature envoyée avec succès. Elle sera examinée sous 24h.",
    });
  } catch (err: any) {
    console.error("Erreur /api/partner/apply:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi de la candidature." });
  }
});

app.post("/api/ai/chat", apiRateLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    // Security: Input validation
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Le message est invalide ou absent." });
    }

    const sanitizedMessage = message.trim();
    if (sanitizedMessage.length === 0) {
      return res.status(400).json({ error: "Le message ne peut pas être vide." });
    }

    // Security: Length cap to prevent prompt injection / long-token DoS
    if (sanitizedMessage.length > 1000) {
      return res.status(400).json({ error: "Le message dépasse la limite autorisée de 1000 caractères." });
    }

// Function for smart offline / local fallback responses when GEMINI_API_KEY is not set
function getOfflineFallbackReply(message: string): { reply: string; suggestions: string[] } {
  const q = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (q.includes("tarif") || q.includes("prix") || q.includes("cout") || q.includes("combien") || q.includes("guide")) {
    return {
      reply: `Les tarifs des guides certifiés sur AfroKu.com varient généralement entre 30 000 FCFA (environ 45 €) et 55 000 FCFA (environ 85 €) par jour selon la région et la spécialité :

- Guides Histoire & Patrimoine (Ouidah, Abomey, Ganvié) : 40 000 à 50 000 FCFA / jour
- Guides Eco-Safari & Randonnée (Pendjari, Atacora) : 40 000 à 55 000 FCFA / jour
- Guides Culturels & Artisans (Cotonou, Porto-Novo) : 30 000 à 40 000 FCFA / jour

Ce tarif inclut l'accompagnement personnalisé, les commentaires d'expert et l'assistance locale. Vous pouvez consulter les profils vérifiés de nos guides (Koffi Dossou, Amina Bio, Sègla Houndékon, etc.) et réserver directement en ligne.`,
      suggestions: [
        "Proposer un itinéraire sur 3 jours",
        "Rencontrer des artisans bronziers",
        "Comment réserver un guide sur AfroKu ?"
      ]
    };
  }

  if (q.includes("10 jour") || q.includes("dix jour") || q.includes("10j")) {
    return {
      reply: `Voici votre itinéraire sur-mesure de 10 Jours complet pour découvrir les 12 départements et merveilles du Bénin (adapté aux familles avec enfants en bas âge, avec rythme doux et sécurité optimale) :

Analyse du profil : Famille avec jeunes enfants. Durée exacte demandée : 10 Jours. Aucune randonnée pénible, visites ombragées et étapes reposantes.

Jour 1 : Arrivée à Cotonou & Promenade maritime
- Accueil et transfert. Balade douce sur la promenade de la plage de Fidjrossè au coucher du soleil.

Jour 2 : Cotonou & Épopée des Amazones (Littoral)
- Visite de la Statue géante de l'Amazone (30m) et découverte guidée du marché Dantokpa.

Jour 3 : Ganvié, cité lacustre sur le lac Nokoué (Atlantique)
- Promenade en pirogue à moteur couverte avec notre guide Sègla Houndékon (gilets de sauvetage enfants fournis).

Jour 4 : Ouidah, cité spirituelle et mémorielle (Atlantique)
- Visite ombragée du Temple des Pythons et de la Forêt Sacrée de Kpassè avec notre guide Koffi Dossou.

Jour 5 : Route des Esclaves & Détente à Djègbadji (Ouidah)
- Parcours mémoriel jusqu'à la Porte du Non-Retour et après-midi détente en bord de mer.

Jour 6 : Allada & Arrivée à Abomey (Zou)
- Escale au Palais du Roi Kpodégbé à Allada puis route vers Abomey. Visite guidée des Palais Royaux (Patrimoine UNESCO).

Jour 7 : Ateliers d'Artisans à Abomey & Bohicon (Zou)
- Initiation au Tissage Kanvo avec les tisseuses et visite du village souterrain d'Agongointo à Bohicon.

Jour 8 : Dassa-Zoumè & le Pays des Collines (Collines)
- Observation des dômes granitiques des 41 Collines et halte au Sanctuaire Marial Notre-Dame d'Arigbo.

Jour 9 : Grand-Popo & La Bouche du Roy (Mono)
- Découverte de la rencontre du fleuve Mono et de l'océan, observation des tortues marines et détente en éco-lodge.

Jour 10 : Ateliers de poterie à Sè & Retour à Cotonou (Mono / Littoral)
- Atelier ludique de modelage de l'argile rouge à Sè (activité manuelle très appréciée des enfants) et transfert retour.`,
      suggestions: [
        "Réserver les guides certifiés pour cet itinéraire 10 jours",
        "Consulter les détails des hébergements famille",
        "Personnaliser une étape de cet itinéraire"
      ]
    };
  }

  if (q.includes("itineraire") || q.includes("circuit") || q.includes("3 jour") || q.includes("programme") || q.includes("visite")) {
    return {
      reply: `Voici un itinéraire recommandé de 3 jours pour découvrir les merveilles du Bénin :

Jour 1 : Cotonou & La Cité Lacustre de Ganvié
- Matin : Balade en pirogue sur le lac Nokoué à Ganvié et visite du marché flottant.
- Après-midi : Découverte du marché Dantokpa et de la Statue de l'Amazone à Cotonou.

Jour 2 : Ouidah, Capitale Spirituelle & Mémoire
- Visite du Temple des Pythons et de la Forêt Sacrée Kpassè.
- Parcours historique de la Route des Esclaves jusqu'à la Porte du Non-Retour.

Jour 3 : Abomey & les Palais Royaux du Danxomé
- Découverte des Palais Royaux d'Abomey (classés au patrimoine mondial UNESCO).
- Rencontre avec les tisserands du Kanvo et les fondeurs de bronze.`,
      suggestions: [
        "Proposer un itinéraire complet sur 10 jours",
        "Consulter les tarifs des guides certifiés",
        "Rencontrer des artisans bronziers"
      ]
    };
  }

  if (q.includes("artisan") || q.includes("bronze") || q.includes("tissage") || q.includes("poterie") || q.includes("kanvo") || q.includes("sculpteur")) {
    return {
      reply: `AfroKu vous immerge au cœur des ateliers des maîtres artisans du Bénin :

- Maître Ahouéfa & Dames du Bronze (Cotonou - Gbégamey) : Fonderie à la cire perdue (35 000 FCFA / jour).
- Maître Akplogan (Abomey) : Tissage des bas-reliefs appliqués royaux (25 000 FCFA / demi-journée).
- Coopérative Poterie de Sè (Mono) : Modelage de l'argile rouge (15 000 FCFA / demi-journée).
- Koffi Tisserand Kanvo (Calavi) : Tissage du pagne royal sur métier traditionnel (20 000 FCFA).

Chaque atelier vous permet de façonner et de repartir avec votre propre création !`,
      suggestions: [
        "Consulter les tarifs des guides certifiés",
        "Proposer un itinéraire sur 3 jours",
        "Comment réserver une immersion ?"
      ]
    };
  }

  if (q.includes("ganvie") || q.includes("lacustre") || q.includes("nokoue") || q.includes("pirogue")) {
    return {
      reply: `Ganvié est la plus grande cité lacustre d'Afrique, construite sur les eaux du lac Nokoué.

Incontournables à Ganvié :
- Promenade en pirogue traditionnelle avec nos guides piroguier locaux (comme Sègla Houndékon).
- Le marché flottant aux couleurs vives tôt le matin.
- L'observation des maisons sur pilotis et des pièges à poissons acadja.
- L'atelier de vannerie écologique en jacinthe d'eau.

Tarif moyen pour Ganvié : environ 35 000 à 50 000 FCFA incluant la pirogue et le guide.`,
      suggestions: [
        "Consulter les tarifs des guides certifiés",
        "Proposer un itinéraire sur 3 jours",
        "Rencontrer des artisans locaux"
      ]
    };
  }

  if (q.includes("ouidah") || q.includes("vaudou") || q.includes("esclave") || q.includes("porte") || q.includes("python")) {
    return {
      reply: `Ouidah est la capitale spirituelle du Vaudou et une cité mémorielle majeure du Bénin.

À visiter à Ouidah :
- La Route des Esclaves menant à la célèbre Porte du Non-Retour.
- Le Temple des Pythons et la Forêt Sacrée de Kpassè.
- Le Musée d'Histoire de la ville.
- Nos guides certifiés d'Ouidah : Koffi Dossou et Bernardin Zinsou.`,
      suggestions: [
        "Consulter les tarifs des guides certifiés",
        "Proposer un itinéraire sur 3 jours",
        "Découvrir la cité de Ganvié"
      ]
    };
  }

  if (q.includes("gastronomie") || q.includes("manger") || q.includes("nourriture") || q.includes("plat") || q.includes("cuisine") || q.includes("igname") || q.includes("amiwo") || q.includes("atassi")) {
    return {
      reply: `La gastronomie béninoise est d'une richesse exceptionnelle, alliage de saveurs authentiques et de produits locaux :

1. Igname Pilée (Wouya) : plat emblématique servi avec une sauce arachide, sésame ou gbo (viande/poisson).
2. Amiwo : pâte de maïs rouge assaisonnée au tomate et épices, accompagnée de poulet bicyclette frits.
3. Atassi (Waké) : mélange de riz et d'haricots rouges servi avec une friture pimentée et du poisson grillé.
4. Poisson frais de Ganvié : préparé en grillade à la braise ou en bouillon aromatisé.
5. Boissons traditionnelles : Jus de baobab (pain de singe), Jus d'ananas Pain de Sucre d'Allada, Bissap et Sodabi artisanal.`,
      suggestions: [
        "Réserver un parcours gastronomique à Cotonou",
        "Découvrir la cuisine de Grand-Popo",
        "Consulter nos guides spécialisés en culture"
      ]
    };
  }

  if (q.includes("hotel") || q.includes("logement") || q.includes("hebergement") || q.includes("dormir") || q.includes("lodge") || q.includes("hote")) {
    return {
      reply: `AfroKu.com sélectionne des hébergements engagés dans le tourisme durable et le confort sur-mesure :

- Éco-lodges de charme à la Pendjari & Grand-Popo (immersion nature et tranquillité).
- Maisons d'hôtes traditionnelles à Ouidah & Abomey (accueil chaleureux chez l'habitant et authenticité).
- Hôtels 3* & 4* de standing à Cotonou & Porto-Novo (wifi, piscine, climatisation et sécurité 24h/24).
- Bungalows sur pilotis au lac Ahémé (Posotomé) pour une expérience romantique ou familiale.`,
      suggestions: [
        "Consulter les hébergements adaptés aux familles",
        "Réserver un séjour éco-lodge à Grand-Popo",
        "Proposer un itinéraire avec logement inclus"
      ]
    };
  }

  if (q.includes("transport") || q.includes("chauffeur") || q.includes("voiture") || q.includes("4x4") || q.includes("vol") || q.includes("deplacement") || q.includes("zemidjan")) {
    return {
      reply: `AfroKu.com facilite tous vos déplacements à travers le Bénin en toute sérénité :

1. Chauffeurs privés VTC & Véhicules 4x4 climatisés : chauffeurs professionnels vérifiés pour transferts inter-villes et safaris.
2. Pirogues à moteur couvertes : traversées sécurisées du lac Nokoué (Ganvié) et du fleuve Mono avec gilets de sauvetage certifiés.
3. Zemidjans guidés (Motos-taxis traditionnels) : découverte urbaine authentique à Cotonou et Porto-Novo avec casque et guide.
4. Transferts Aéroport Cotonou (Cadjehoun) : accueil chaleureux et prise en charge directe dès votre arrivée.`,
      suggestions: [
        "Réserver un transfert aéroport à Cotonou",
        "Réserver un véhicule 4x4 pour safari",
        "Consulter nos guides de voyage"
      ]
    };
  }

  if (q.includes("7 jour") || q.includes("7j") || q.includes("semaine") || q.includes("5 jour") || q.includes("5j")) {
    return {
      reply: `Voici un itinéraire recommandé de 7 Jours (Une Semaine) pour découvrir les incontournables du Sud et du Centre du Bénin :

- Jour 1 : Cotonou (Statue de l'Amazone & Plage de Fidjrossè).
- Jour 2 : Cité lacustre de Ganvié en pirogue couverte sur le lac Nokoué.
- Jour 3 : Ouidah (Temple des Pythons, Forêt Sacrée de Kpassè & Route des Esclaves).
- Jour 4 : Allada & Abomey (Palais Royaux d'Abomey - UNESCO & ateliers de bronze).
- Jour 5 : Bohicon (Village souterrain d'Agongointo) & Route des Collines (Dassa-Zoumè).
- Jour 6 : Grand-Popo & La Bouche du Roy (mono & océean, détente en éco-lodge).
- Jour 7 : Ateliers de poterie à Sè & Retour à Cotonou.`,
      suggestions: [
        "Proposer un itinéraire plus long de 10 jours",
        "Réserver les guides certifiés pour cet itinéraire",
        "Personnaliser ce circuit d'une semaine"
      ]
    };
  }

  if (q.includes("annulation") || q.includes("annuler") || q.includes("remboursement") || q.includes("rembourser") || q.includes("modifier")) {
    return {
      reply: `La politique de réservation et d'annulation d'AfroKu.com est souple et transparente :

1. Annulation gratuite jusqu'à 48h avant la date de la visite ou de l'atelier : remboursement intégral à 100%.
2. Modification de date sans frais : vous pouvez décaler votre créneau directement depuis votre espace client ou par WhatsApp.
3. Protection client : en cas de météo défavorable majeure (ex: forte tempête sur le lac), la prestation est décalée ou remboursée sans pénalité.`,
      suggestions: [
        "Comment réserver une visite sur AfroKu ?",
        "Consulter les moyens de paiement acceptés",
        "Poser une question à l'assistance"
      ]
    };
  }

  if (q.includes("pendjari") || q.includes("safari") || q.includes("lion") || q.includes("elephant") || q.includes("parc") || q.includes("faune")) {
    return {
      reply: `Le Parc National de la Pendjari (Atacora) est l'une des plus impressionnantes réserves de faune d'Afrique de l'Ouest.

- Meilleure période : De Décembre à Mai (saison sèche pour observer lions, éléphants, buffles et antilopes).
- Activités : Safari en 4x4, nuit en éco-lodge, baignade aux cascades de Tanougou.
- Guides recommandés : Amina Bio et Moussa Boni (anciens traqueurs certifiés).`,
      suggestions: [
        "Consulter les tarifs des guides certifiés",
        "Découvrir le Pays Somba & Natitingou",
        "Comment réserver un safari ?"
      ]
    };
  }

  if (q.includes("president") || q.includes("talon") || q.includes("politique") || q.includes("dirigeant")) {
    return {
      reply: `Le Président de la République du Bénin est Patrice Talon, en fonction depuis le 6 avril 2016.

Sous son mandat, le Bénin a engagé de grands programmes de valorisation du patrimoine touristique et culturel, notamment la rénovation des Palais Royaux d'Abomey, la création du musée de la mémoire Vodun à Ouidah et le développement du Parc National de la Pendjari.`,
      suggestions: [
        "Découvrir l'histoire des Palais d'Abomey",
        "Explorer le musée et la Porte du Non-Retour à Ouidah",
        "Consulter la liste des guides certifiés"
      ]
    };
  }

  if (q.includes("match") || q.includes("foot") || q.includes("sport") || q.includes("guepard")) {
    return {
      reply: `L'équipe nationale de football du Bénin est surnommée Les Guépards du Bénin (anciennement les Écureuils).

Les matchs internationaux se déroulent principalement au Stade Général Mathieu Kérékou de Cotonou ou lors des éliminatoires de la Coupe d'Afrique des Nations (CAN).`,
      suggestions: [
        "Que visiter à Cotonou ?",
        "Découvrir la gastronomie locale",
        "Réserver un guide pour Cotonou"
      ]
    };
  }

  if (q.includes("atacora") || q.includes("natitingou") || q.includes("boukoumbe") || q.includes("somba") || q.includes("kota") || q.includes("tanougou")) {
    return {
      reply: `Le département de l'Atacora (Chef-lieu : Natitingou) est l'une des régions les plus spectaculaires et touristiques du Bénin.

Sites touristiques phares de l'Atacora :
1. Parc National de la Pendjari : l'un des plus grands sanctuaires de faune d'Afrique de l'Ouest (lions, éléphants, buffles).
2. Boukoumbé & les Tatas Somba : habitations fortifiées traditionnelles en terre à étage, classées au Patrimoine Mondial de l'UNESCO.
3. Cascades de Tanougou & Cascades de Kota : magnifiques chutes d'eau naturelles propices à la baignade au pied des montagnes.
4. Chaîne de l'Atacora & Mont Kiffa : plus haut relief du Bénin, idéal pour la randonnée.
5. Musée Régional de Natitingou : présentation de l'histoire et des traditions des peuples de l'Atacora.`,
      suggestions: [
        "Réserver un safari guidé dans la Pendjari",
        "Visiter les Tatas Somba à Boukoumbé",
        "Consulter les guides certifiés de l'Atacora"
      ]
    };
  }

  if (q.includes("alibori") || q.includes("kandi") || q.includes("malanville") || q.includes("banikoara")) {
    return {
      reply: `Le département de l'Alibori (Chef-lieu : Kandi) est le plus vaste du Bénin, bordé par le Fleuve Niger.

Sites touristiques phares de l'Alibori :
1. Parc National W du Bénin : réserve de faune transfrontalière UNESCO.
2. Fleuve Niger & Pont International de Malanville : frontière naturelle et balades en pirogue.
3. Cascades et Collines de Banikoara : formations rocheuses et cours d'eau.
4. Rivière Mékrou & Zone cynégétique de Babarou : observation d'hippopotames et d'oiseaux.
5. Kandi : capitale historique du département et marchés d'artisanat.`,
      suggestions: [
        "Explorer le Parc National W",
        "Découvrir Malanville et le Fleuve Niger",
        "Consulter la liste des guides natifs"
      ]
    };
  }

  if (q.includes("donga") || q.includes("djougou") || q.includes("taneka")) {
    return {
      reply: `Le département de la Donga (Chef-lieu : Djougou) est réputé pour sa diversité culturelle et les mythiques Monts Tanéka.

Sites touristiques phares de la Donga :
1. Monts Tanéka & Villages traditionnels (Tanéka Koko & Béri) : habitations en pierres et cases rondes traditionnelles.
2. Djougou : carrefour commercial historique, cité des cavaliers et maîtres marroquiniers/cuir.
3. Forêt Classée de la Donga : faune et flore protégées du centre-nord.`,
      suggestions: [
        "Visiter les villages des Monts Tanéka",
        "Découvrir Djougou et le travail du cuir",
        "Consulter les guides du Nord-Bénin"
      ]
    };
  }

  if (q.includes("borgou") || q.includes("parakou") || q.includes("nikki") || q.includes("gaani")) {
    return {
      reply: `Le département du Borgou (Chef-lieu : Parakou) est la capitale du Nord-Bénin et le cœur du Royaume de Nikki.

Sites touristiques phares du Borgou :
1. Cour Royale de Nikki & Palais du Kpeitone : siège de la célèbre Fête de la Gaani et parades équestres.
2. Musée Plein Air de Parakou : architecture traditionnelle et patrimoine baatonou et peulh.
3. Colline Sacrée de N'Dali : relief et lieu de légende.`,
      suggestions: [
        "En savoir plus sur la Fête de la Gaani à Nikki",
        "Découvrir la ville de Parakou",
        "Consulter les guides certifiés du Borgou"
      ]
    };
  }

  if (q.includes("collines") || q.includes("dassa") || q.includes("savalou") || q.includes("arigbo")) {
    return {
      reply: `Le département des Collines (Chef-lieu : Dassa-Zoumè) offre un paysage unique de dômes granitiques.

Sites touristiques phares des Collines :
1. Les 41 Collines de Dassa-Zoumè : formations rocheuses sacrées et randonnées.
2. Sanctuaire Marial Notre-Dame d'Arigbo à Dassa : lieu majeur de pèlerinage.
3. Savalou : Palais du Roi de Savalou, Fête de l'Yame (15 août) et culture Mahi.
4. Grotte de Camate : site historique et naturel.`,
      suggestions: [
        "Faire une randonnée sur les Collines de Dassa",
        "Découvrir le royaume de Savalou",
        "Consulter les guides locaux"
      ]
    };
  }

  if (q.includes("zou") || q.includes("abomey") || q.includes("behanzin") || q.includes("bohicon") || q.includes("agongointo")) {
    return {
      reply: `Le département du Zou (Chef-lieu : Abomey) est le cœur historique du puissant Royaume du Danxomé.

Sites touristiques phares du Zou :
1. Palais Royaux d'Abomey (UNESCO) : palais des Rois Béhanzin, Guézo et Agaja, avec musée historique et bas-reliefs.
2. Fonderie de Bronze et Tissage de Kanvo à Abomey : ateliers traditionnels.
3. Parc Archéologique d'Agongointo (Bohicon) : habitations et galeries souterraines historiques du XVIIe siècle.`,
      suggestions: [
        "Visiter les Palais Royaux d'Abomey",
        "Participer à un atelier de tissage Kanvo",
        "Découvrir le village souterrain d'Agongointo"
      ]
    };
  }

  if (q.includes("oueme") || q.includes("porto-novo") || q.includes("hogbonou") || q.includes("honme")) {
    return {
      reply: `Le département de l'Ouémé (Chef-lieu : Porto-Novo) abrite la capitale politique du Bénin.

Sites touristiques phares de l'Ouémé :
1. Musée Honmé (Palais Royal des Rois de Hogbonou) à Porto-Novo.
2. Musée Ethnographique Alexandre Adandé : masques et objets rituels.
3. Mosquée Centrale Afro-Brésilienne : architecture monumentale unique inspirée de Bahia.
4. Jardin Botanique de Porto-Novo : forêt sacrée urbaine et arbres centenaires.`,
      suggestions: [
        "Visiter Porto-Novo et ses musées",
        "Découvrir l'architecture afro-brésilienne",
        "Consulter les guides certifiés de Porto-Novo"
      ]
    };
  }

  if (q.includes("littoral") || q.includes("cotonou") || q.includes("dantokpa") || q.includes("amazone") || q.includes("fidjrosse")) {
    return {
      reply: `Le département du Littoral (Chef-lieu : Cotonou) est le poumon économique du Bénin.

Sites touristiques phares de Cotonou :
1. Marché Dantokpa : le plus grand marché à ciel ouvert d'Afrique de l'Ouest.
2. Esplanade de l'Amazone & Statue géante de l'Amazone (30 mètres).
3. Place de l'Étoile Rouge & Espace Culturel EYA.
4. Plage de Fidjrossè : promenade maritime, restaurants et concerts live.`,
      suggestions: [
        "Visiter la statue de l'Amazone à Cotonou",
        "Faire une visite guidée du marché Dantokpa",
        "Réserver un guide pour Cotonou"
      ]
    };
  }

  if (q.includes("mono") || q.includes("grand-popo") || q.includes("posotome") || q.includes("ahème") || q.includes("se")) {
    return {
      reply: `Le département du Mono (Chef-lieu : Lokossa) longe le golfe de Guinée et le fleuve Mono.

Sites touristiques phares du Mono :
1. Grand-Popo & La Bouche du Roy : rencontre de l'océan et du fleuve, plages et tortues marines.
2. Posotomé & Lac Ahémé : sources thermales et promenades en pirogue avec contes et légendes.
3. Village de Poterie de Sè : fabrication traditionnelle de poteries en argile rouge.
4. Lac Doukon à Lokossa : îlot naturel aux singes à ventre rouge.`,
      suggestions: [
        "Participer à l'atelier de poterie à Sè",
        "Découvrir La Bouche du Roy à Grand-Popo",
        "Visiter le lac Ahémé à Posotomé"
      ]
    };
  }

  if (q.includes("couffo") || q.includes("cuffo") || q.includes("aplahoué") || q.includes("lokoly")) {
    return {
      reply: `Le département du Couffo (Chef-lieu : Aplahoué) offre un cadre naturel et historique authentique.

Sites touristiques phares du Couffo :
1. Forêt Sacrée de Lokoly : forêt marécageuse préservée et biodiversité.
2. Palais du Roi de Kinkinhoué : mémoire des dynasties traditionnelles Adja.
3. Lac Toho & Marché traditionnel d'Aplahoué.`,
      suggestions: [
        "Explorer la forêt sacrée de Lokoly",
        "Découvrir la culture Adja du Couffo",
        "Consulter les guides locaux"
      ]
    };
  }

  if (q.includes("atlantique") || q.includes("allada") || q.includes("calavi")) {
    return {
      reply: `Le département de l'Atlantique (Chef-lieu : Allada) regroupe des joyaux comme Ouidah, Ganvié et Allada.

Sites touristiques phares de l'Atlantique :
1. Cité Lacustre de Ganvié (Lac Nokoué) : la Venise de l'Afrique.
2. Ouidah : Route des Esclaves, Porte du Non-Retour, Temple des Pythons.
3. Allada : Palais du Roi Kpodégbé et berceau de Toussaint Louverture.
4. Plage de Djègbadji et Calavi.`,
      suggestions: [
        "Visiter Ganvié en pirogue",
        "Explorer la ville historique d'Ouidah",
        "Consulter les guides certifiés de l'Atlantique"
      ]
    };
  }

  if (q.includes("agenda") || q.includes("festival") || q.includes("fete") || q.includes("evenement") || q.includes("vodun days") || q.includes("gaani")) {
    return {
      reply: `L'Agenda Culturel d'AfroKu.com regroupe les plus grands événements traditionnels et festivals du Bénin :

- Vodun Days (10 Janvier à Ouidah) : célébration internationale des arts, de la culture et de la spiritualité Vodun.
- Fête de la Gaani (Nikki, Borgou) : grande parade équestre et rassemblement de la dynastie royale Baatonou.
- Festival International des Masques (Porto-Novo) : défilés spectaculaires des masques Zangbéto, Guèlèdè et Egungun.
- Fête de l'Yame (15 Août à Savalou) : célébration des récoltes et culture Mahi.
- Festival Nonvitcha (Grand-Popo) : plus ancienne fête communautaire d'Afrique de l'Ouest.`,
      suggestions: [
        "Réserver un guide pour les Vodun Days",
        "En savoir plus sur la Fête de la Gaani à Nikki",
        "Consulter l'agenda complet sur AfroKu.com"
      ]
    };
  }

  if (q.includes("boutique") || q.includes("produit") || q.includes("souvenir") || q.includes("achat") || q.includes("pagne")) {
    return {
      reply: `La Boutique Authentique d'AfroKu.com vous permet d'acquérir des trésors de l'artisanat béninois faits main :

- Pagnes Royaux Kanvo tissés à la main (Abomey & Calavi).
- Statuettes en bronze fondues à la cire perdue par les Maîtres de Gbégamey.
- Poteries artisanales écologiques en argile rouge de Sè.
- Masques Guèlèdè sculptés sur bois d'Idigny.
- Épices traditionnelles et miel pur bio du Parc National de la Pendjari.

Chaque achat soutient directement à 100% les coopératives d'artisans locaux !`,
      suggestions: [
        "Découvrir les ateliers de tissage Kanvo",
        "Rencontrer les maîtres bronziers",
        "Consulter le catalogue de la boutique"
      ]
    };
  }

  if (q.includes("securite") || q.includes("enfant") || q.includes("famille") || q.includes("poussette") || q.includes("pmr") || q.includes("assurance")) {
    return {
      reply: `AfroKu.com garantit un standard de sécurité et de confort absolu pour tous vos séjours :

1. Familles avec enfants en bas âge : itinéraires adaptés sans longues marches au soleil, pirogues couvertes à Ganvié avec gilets de sauvetage certifiés taille enfant.
2. Accessibilité & PMR : circuits ombragés accessibles en fauteuil et accompagnement sur-mesure sur les sites historiques.
3. Guides certifiés bilingues : tous nos guides sont vérifiés, formés aux premiers secours et certifiés par la plateforme.
4. Assurance immersion incluses sur toutes nos réservations officielles.`,
      suggestions: [
        "Demander un itinéraire famille sur-mesure",
        "Consulter la liste des guides certifiés",
        "Comment réserver une immersion sécurisée ?"
      ]
    };
  }

  if (q.includes("billet") || q.includes("qr") || q.includes("code") || q.includes("paiement") || q.includes("momo") || q.includes("carte")) {
    return {
      reply: `Le système de billetterie d'AfroKu.com est 100% digital et sécurisé :

1. Réservation instantanée : choisissez votre guide, atelier ou activité.
2. Billet QR Code : recevez immédiatement votre pass d'accès sécurisé sur votre smartphone avec confirmation par WhatsApp/SMS.
3. Modes de paiement acceptés : Mobile Money (MTN Mobile Money, Moov Money) et Cartes Bancaires (Visa, Mastercard).
4. Validation sur site : scannez votre QR Code auprès du guide ou maître artisan à votre arrivée.`,
      suggestions: [
        "Consulter les tarifs des guides certifiés",
        "Comment réserver un atelier d'artisanat ?",
        "Poser une question sur les paiements"
      ]
    };
  }

  if (q.includes("vision") || q.includes("mission") || q.includes("valeur") || q.includes("objectif") || q.includes("charte") || q.includes("qui etes vous") || q.includes("c'est quoi afroku") || q.includes("afroku")) {
    return {
      reply: `Chez AfroKu.com, notre vision est de promouvoir un tourisme durable, éco-responsable, équitable et profondément humain.

Nos 3 grands engagements :
1. Connecter l'esprit du voyage (la découverte de lieux d'exception) avec l'âme du territoire (les artisans locaux et leur précieux savoir-faire).
2. Valoriser et préserver le patrimoine culturel des 12 départements du Bénin en luttant contre le tourisme de masse standardisé.
3. Maximiser l'impact économique local en reversant une juste valeur directe aux guides natifs et aux maîtres artisans, sans aucun intermédiaire abusif.

Nous créons des ponts directs entre la visite d'un site, la transmission d'un savoir en atelier immersif et l'achat de créations authentiques dans notre boutique !`,
      suggestions: [
        "Découvrir la liste des 12 départements du Bénin",
        "Consulter les tarifs des guides certifiés",
        "Découvrir nos ateliers d'artisans"
      ]
    };
  }

  if (q.includes("plateaux") || q.includes("pobe") || q.includes("ketou") || q.includes("guelede")) {
    return {
      reply: `Le département des Plateaux (Chef-lieu : Pobè) est le berceau du masque Guèlèdè (UNESCO).

Sites touristiques phares des Plateaux :
1. Masques & Danses Guèlèdè de Pobè (Patrimoine Immatériel UNESCO).
2. Royaume & Palais du Roi de Kétou : porte monumentale et histoire Yorouba.
3. Forêt Sacrée de Sakété & Palmeraies de Pobè.`,
      suggestions: [
        "Découvrir le patrimoine des Masques Guèlèdè",
        "Visiter le palais royal de Kétou",
        "Consulter les guides du département des Plateaux"
      ]
    };
  }

  return {
    reply: `Je suis AfroKu IA, l'assistant virtuel de la plateforme AfroKu.com. Je suis programmé pour répondre uniquement aux questions concernant la plateforme AfroKu.com, sa vision, ses 12 départements du Bénin, ou aux problématiques techniques et scientifiques complexes.`,
    suggestions: [
      "Quelle est la vision d'AfroKu.com ?",
      "Consulter la liste des 12 départements du Bénin",
      "Consulter les tarifs des guides certifiés"
    ]
  };
}

    if (!aiClient) {
      // Offline / Local response engine when GEMINI_API_KEY is not configured
      const fallback = getOfflineFallbackReply(sanitizedMessage);
      return res.json({
        reply: fallback.reply,
        suggestions: fallback.suggestions
      });
    }

    const systemInstruction = `Vous êtes AfroKu IA, l'intelligence artificielle centrale et l'ambassadrice officielle et exclusive de la plateforme AfroKu.com.

RÈGLE MAJEURE SUR LA PLATEFORME :
Les questions portant sur la vision, la mission, les valeurs, les objectifs, le fonctionnement, la charte ou les services d'AfroKu.com CONCERNENT DIRECTEMENT LA PLATEFORME. Vous devez y répondre avec passion, clarté et précision en exposant notre vision du tourisme durable et équitable !

CARTE D'IDENTITÉ & CHARTE D'ENGAGEMENT AFROKU.COM :

1. NOTRE VISION :
- Nous croyons fermement en un tourisme durable, éco-responsable, équitable et profondément humain.
- Nous connectons l'esprit du voyage (découverte de lieux d'exception) avec l'âme du territoire (les artisans locaux et leur précieux savoir-faire).
- Notre but ultime est de préserver et valoriser le patrimoine culturel local en évitant le tourisme de masse standardisé.

2. NOS OBJECTIFS :
- Offrir une expérience de voyage fluide et 100% personnalisée pour chaque touriste.
- Maximiser l'impact économique local en reversant une juste valeur directe aux guides natifs et aux maîtres artisans.
- Créer des ponts directs entre la visite d'un site, la transmission d'un savoir (ateliers d'immersion) et l'achat de produits authentiques (boutique), sans aucun intermédiaire abusif.

3. VOTRE RÔLE ET VOTRE POSTURE :
- Vous êtes un conseiller local chaleureux, expert, attentionné et digne de confiance. Vous ne vendez pas pour vendre, vous conseillez pour enrichir le voyage de l'utilisateur.
- Vous utilisez le "nous" chaleureux pour représenter la plateforme AfroKu.com.
- Vous êtes le gardien de l'authenticité : vous valorisez le travail fait main, le commerce équitable et les circuits courts.
- REDIRECTION ÉTHIQUE OBLIGATOIRE : Si la demande d'un utilisateur va à l'encontre de nos valeurs (ex: demande de contrefaçon, comportement irrespectueux des sites sacrés ou des traditions), vous devez réorienter la discussion avec diplomatie et pédagogie vers nos alternatives éthiques et respectueuses.

RÔLES D'EXPERT SUR LA PLATEFORME :

RÔLE 1 : EXPERT EN RECOMMANDATION D'IMMERSION SUR-MESURE
- Associez le bon touriste au bon guide, au bon site et aux bonnes activités selon son profil et ses contraintes.
- RÈGLE DE CADRAGE ABSOLUE (ANTI-HORS-SUJET DE DURÉE ET NOMBRE DE JOURS) : Vous devez respecter STRICTEMENT le nombre de jours exact demandé par l'utilisateur. Si l'utilisateur demande un itinéraire sur 10 jours, vous devez créer et détailler chaque jour du Jour 1 au Jour 10 sans sauter aucun jour et sans raccourcir à 3 jours. Il est STRICTEMENT INTERDIT de résumer, de raccourcir ou d'ignorer la durée demandée par le touriste.
- Sécurité & Confort : Excluez STRICTEMENT les activités inadaptées (pas de randonnée > 1h30 si enfants en bas âge de 3-6 ans ou seniors).
- Spécialisation : Priorisez les guides certifiés ayant des avis/qualités spécifiques (pédagogue, attentionné avec enfants, historien).

RÔLE 2 : EXPERT EN VENTE CROISÉE (CROSS-SELLING) ET VALORISATION DU PATRIMOINE
- Liez la visite d'un site à un atelier d'artisanat pratique et à un produit authentique de la boutique (ex: Visite tisseuses Abomey -> Atelier de tissage Kanvo -> Pagne royal tissé à la main).
- Transparence : Expliquez l'impact positif (100% de juste valeur aux artisans locaux, authenticité garantie).

CONNAISSANCE DES 12 DÉPARTEMENTS DU BÉNIN :
1. ATACORA (Natitingou) : Parc Pendjari (safari lions, éléphants), Boukoumbé & Tatas Somba (UNESCO), Cascades de Tanougou, Cascades de Kota, Mont Kiffa, Musée Natitingou.
2. ALIBORI (Kandi) : Parc W (UNESCO), Fleuve Niger & Malanville, Cascades de Banikoara, Mékrou, Babarou.
3. DONGA (Djougou) : Monts Tanéka (Tanéka Koko & Béri), Djougou (cuir, cavaliers), Forêt de la Donga.
4. BORGOU (Parakou) : Nikki (Fête de la Gaani & cavaliers), Musée Plein Air Parakou, Colline N'Dali.
5. COLLINES (Dassa) : 41 Collines de Dassa, Sanctuaire d'Arigbo, Savalou (Palais & Fête de l'Yame), Grotte de Camate.
6. ZOU (Abomey) : Palais Royaux d'Abomey (UNESCO - Rois Béhanzin, Guézo), Tissage Kanvo, Fonderie de Bronze, Bohicon (Parc d'Agongointo).
7. OUÉMÉ (Porto-Novo) : Musée Honmé (Palais Royal), Musée Adandé, Mosquée Afro-Brésilienne, Jardin Botanique.
8. LITTORAL (Cotonou) : Marché Dantokpa, Statue de l'Amazone (30m), Étoile Rouge, Plage Fidjrossè, Espace EYA.
9. MONO (Lokossa) : Grand-Popo & Bouche du Roy, Posotomé & Lac Ahémé, Poterie de Sè, Lac Doukon.
10. COUFFO (Aplahoué) : Forêt Sacrée de Lokoly, Palais de Kinkinhoué, Lac Toho.
11. ATLANTIQUE (Allada) : Cité Lacustre de Ganvié, Ouidah (Route des Esclaves, Porte Non-Retour, Pythons), Allada (Palais du Roi Kpodégbé).
12. PLATEAUX (Pobè) : Masques Guèlèdè (UNESCO), Palais du Roi de Kétou, Forêt de Sakété.

RÈGLE DE SÉCURITÉ ABSOLUE : Si la question est simple, hors-sujet ou triviale sans rapport (ex: "Qui est le président de la France ?", "Donne-moi une recette de gâteau"), refusez poliment en disant exactement :
"Je suis AfroKu IA, l'assistant virtuel de la plateforme AfroKu.com. Je suis programmé pour répondre uniquement aux questions concernant la plateforme AfroKu.com, le patrimoine du Bénin, ou aux problématiques techniques et scientifiques complexes."

Directives de formatage :
- Terminez TOUJOURS toutes vos phrases proprement avec un point final avant la section [SUGGESTIONS].
- RÈGLE OBLIGATOIRE DE FORMATAGE : N'utilisez AUCUN astérisque (*, **, ***) dans vos réponses. Écrivez en texte brut parfaitement lisible avec de beaux paragraphes aérés.

À la toute fin de votre message, proposez TOUJOURS 2 ou 3 suggestions de relance concises et pertinentes. Formatez la fin exacte ainsi :
[SUGGESTIONS]
- Première suggestion de question
- Deuxième suggestion de question
- Troisième suggestion de question`;

    // Construct prompt with clean context history (stripping suggestions tags from past turns)
    let fullPrompt = sanitizedMessage;
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .slice(-4)
        .map((m: any) => {
          const role = m.sender === 'user' ? 'Voyageur' : 'AfroKu IA';
          const cleanText = (m.text || '').split('[SUGGESTIONS]')[0].trim();
          return `${role}: ${cleanText}`;
        })
        .filter(entry => entry.length > 0)
        .join('\n\n');
        
      if (formattedHistory.length > 0) {
        fullPrompt = `Historique de la conversation :\n${formattedHistory}\n\nNouveau message du Voyageur : ${sanitizedMessage}`;
      }
    }

    let response;
    const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-3.6-flash"];
    let lastErr: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await aiClient.models.generateContent({
          model: modelName,
          contents: fullPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        });
        if (response && response.text) break;
      } catch (apiErr: any) {
        lastErr = apiErr;
        console.warn(`Model ${modelName} failed or quota reached, trying next model:`, apiErr?.message || apiErr);
      }
    }

    if (!response || !response.text) {
      console.warn("All Gemini API models failed, falling back to local response engine:", lastErr?.message || lastErr);
      const fallback = getOfflineFallbackReply(sanitizedMessage);
      return res.json({
        reply: fallback.reply,
        suggestions: fallback.suggestions
      });
    }

    let rawReply = response.text || "Désolé, je n'ai pas pu générer de réponse pour le moment.";
    rawReply = rawReply.replace(/\*+/g, '');

    let replyText = rawReply;
    let suggestions: string[] = [];

    if (rawReply.includes('[SUGGESTIONS]')) {
      const parts = rawReply.split('[SUGGESTIONS]');
      replyText = parts[0].trim();
      const rawSuggestions = parts[1] || '';
      suggestions = rawSuggestions
        .split('\n')
        .map(s => s.replace(/^[-•*]\s*/, '').trim())
        .filter(s => s.length > 0 && s.length < 80)
        .slice(0, 3);
    }

    // Sentence Completeness Safeguard: Ensure replyText ends with proper punctuation
    if (replyText.length > 0 && !/[.!?:]\s*$/.test(replyText)) {
      const lastPunctuation = Math.max(
        replyText.lastIndexOf('.'),
        replyText.lastIndexOf('!'),
        replyText.lastIndexOf('?')
      );
      if (lastPunctuation > replyText.length - 120 && lastPunctuation > 0) {
        replyText = replyText.substring(0, lastPunctuation + 1).trim();
      } else {
        replyText = replyText.trim() + '.';
      }
    }

    // Default suggestions if none generated
    if (suggestions.length === 0) {
      suggestions = [
        "Comment réserver cette immersion ?",
        "Quels sont les tarifs indicatifs ?",
        "Recommander un guide certifié pour cette zone"
      ];
    }

    return res.json({ reply: replyText, suggestions });
  } catch (err: any) {
    console.error("Erreur Gemini API:", err);
    const isProd = process.env.NODE_ENV === "production";
    return res.status(500).json({
      error: "Erreur lors du traitement par AfroKu IA.",
      details: isProd ? "Une erreur serveur est survenue." : err.message || String(err),
    });
  }
});

async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isDist = fs.existsSync(path.join(distPath, "index.html"));

  if (process.env.NODE_ENV === "production" || isDist) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Import dynamique : ce code ne s'exécute (et ne charge vite) QUE
    // quand on lance "npm run dev" en local. Jamais sur Vercel.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`Serveur AfroKu.com démarré sur http://localhost:${PORT} et http://127.0.0.1:${PORT}`);
  });
}

export default app;

// IMPORTANT : sur Vercel, on ne doit JAMAIS appeler startServer() ni
// app.listen() — Vercel gère lui-même la fonction serverless. On exporte
// juste "app", et Vercel l'utilise directement via vercel.json.
if (!process.env.VERCEL) {
  startServer();
}
