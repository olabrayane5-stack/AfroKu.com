import React, { useState, useEffect } from 'react';
import { ModalType } from '../../types';
import { X, Mail, Lock, User, CheckCircle, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * ============================================================================
 * AFROKU.COM - MODALE D'AUTHENTIFICATION & RÉCUPÉRATION OTP
 * ============================================================================
 * CONSIGNES DÉVELOPPEUR BACKEND / VIB CODER :
 * 
 * Ce composant gère les 3 flux utilisateurs principaux :
 * 1. CONNEXION (login) : Authentification par e-mail + mot de passe.
 * 2. INSCRIPTION (signup) : Création de compte avec contrôle d'unicité de l'e-mail.
 * 3. MOT DE PASSE OUBLIÉ (forgot) :
 *    - Étape 1 : Saisie de l'adresse e-mail Gmail / pro.
 *    - Étape 2 : Génération et vérification d'un code OTP à 6 chiffres.
 *      (Actuellement simulé à l'écran pour la recette. À connecter à ton API Nodemailer/Resend).
 *    - Étape 3 : Saisie et mise à jour du nouveau mot de passe.
 * ============================================================================
 */

interface AuthModalProps {
  type: 'auth_signup' | 'auth_login' | null;
  onClose: () => void;
  openOther: (modal: ModalType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ type, onClose, openOther }) => {
  const { login, signup, resetPassword } = useAuth();
  const [currentView, setCurrentView] = useState<'signup' | 'login' | 'forgot'>('login');
  
  // Forgot password OTP steps: 'email_input' -> 'code_input' -> 'new_password_input'
  const [forgotStep, setForgotStep] = useState<'email_input' | 'code_input' | 'new_password_input'>('email_input');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');

  const [signupRole, setSignupRole] = useState<'tourist' | 'guide' | 'artisan'>('tourist');
  const [cniNumber, setCniNumber] = useState('');
  const [cniFile, setCniFile] = useState<File | null>(null);
  const [workshopName, setWorkshopName] = useState('');
  const [mobileMoney, setMobileMoney] = useState('');
  const [ethicsAccepted, setEthicsAccepted] = useState(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [signupNotice, setSignupNotice] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (type) {
      setCurrentView(type === 'auth_signup' ? 'signup' : 'login');
      setForgotStep('email_input');
      setGeneratedOtp('');
      setEnteredOtp('');
      setErrorMsg('');
      setSignupNotice('');
      setSuccess(false);
      setResetSuccess(false);

      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [type]);

  if (!type) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    // Check if account exists
    try {
      const saved = localStorage.getItem('afroku_users_db');
      const users = saved ? JSON.parse(saved) : [];
      const exists = users.some((u: any) => u.email.toLowerCase() === cleanEmail);

      if (!exists) {
        setErrorMsg('Aucun compte AfroKu n\'est enregistré avec cette adresse e-mail.');
        return;
      }
    } catch {
      // ignore
    }

    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setForgotStep('code_input');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (enteredOtp.trim() !== generatedOtp) {
      setErrorMsg('Code de vérification incorrect. Veuillez vérifier le code reçu.');
      return;
    }
    setForgotStep('new_password_input');
  };

  const handleFinalResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = resetPassword(email, newPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Erreur lors de la réinitialisation.');
      return;
    }
    setResetSuccess(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (currentView === 'signup') {
      if (signupRole === 'guide' || signupRole === 'artisan') {
        if (!cniNumber) {
          setErrorMsg('Veuillez saisir votre numéro de CNI ou de Passeport.');
          return;
        }
        if (!ethicsAccepted) {
          setErrorMsg("Vous devez cocher et accepter la Charte d'Éthique AfroKu.");
          return;
        }
        const dossierNum = `#AFK-${Math.floor(1000 + Math.random() * 9000)}`;
        setSignupNotice(`⏳ Dossier N° ${dossierNum} bien reçu ! Votre compte ${signupRole === 'guide' ? 'Guide' : 'Artisan'} est en cours d'évaluation par l'administrateur (délai 24h-48h). Un SMS/WhatsApp vous préviendra dès la validation.`);
        setPassword('');
        setCurrentView('login');
        return;
      }

      const res = await signup(fullName, email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Erreur lors de la création du compte.');
        return;
      }
      setPassword('');
      setSignupNotice('🎉 Compte voyageur créé avec succès ! Vous pouvez maintenant vous connecter.');
      setCurrentView('login');
    } else if (currentView === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Erreur lors de la connexion.');
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1300);
    }
  };

  const handleSwitchView = (view: 'signup' | 'login' | 'forgot') => {
    setCurrentView(view);
    setForgotStep('email_input');
    setGeneratedOtp('');
    setEnteredOtp('');
    setErrorMsg('');
    setSignupNotice('');
    setResetSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in [overscroll-behavior:contain]">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 [overscroll-behavior:contain]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-2xl font-black text-[#003580] tracking-tight">
            AfroKu<span className="text-amber-500">.com</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            {currentView === 'signup' && 'Créer un compte AfroKu'}
            {currentView === 'login' && 'Se connecter à AfroKu'}
            {currentView === 'forgot' && 'Récupération du mot de passe'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentView === 'signup' && 'Un compte unique par adresse e-mail. Vos réservations et séjours en toute sécurité.'}
            {currentView === 'login' && 'Connectez-vous pour retrouver vos billets et séjours enregistrés.'}
            {currentView === 'forgot' && (
              <>
                {forgotStep === 'email_input' && 'Saisissez votre e-mail Gmail pour recevoir un code de vérification.'}
                {forgotStep === 'code_input' && 'Saisissez le code à 6 chiffres envoyé à votre adresse e-mail.'}
                {forgotStep === 'new_password_input' && 'Choisissez un nouveau mot de passe sécurisé.'}
              </>
            )}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="font-semibold leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {signupNotice && currentView === 'login' && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs animate-fade-in shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="font-semibold leading-relaxed">{signupNotice}</div>
          </div>
        )}

        {/* SIMULATED EMAIL NOTIFICATION BANNER IF IN OTP STEP */}
        {currentView === 'forgot' && forgotStep === 'code_input' && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs shadow-sm space-y-1.5 animate-pulse">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Simulateur d'E-mail AfroKu (afroku.officiel@gmail.com)</span>
            </div>
            <p className="text-[#333]">
              Code d'activation sécurisé pour <strong className="text-slate-900">{email}</strong> :
            </p>
            <div className="text-center font-mono font-black text-lg tracking-widest text-[#003580] bg-white py-1.5 rounded-md border border-amber-200">
              {generatedOtp}
            </div>
            <p className="text-[10px] text-slate-500 italic text-center">
              (En production, ce code est expédié automatiquement via le serveur SMTP Google Workspace)
            </p>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">
              {currentView === 'signup' ? 'Compte créé avec succès !' : 'Connexion réussie !'}
            </h3>
            <p className="text-xs text-slate-500">Bienvenue sur AfroKu.com, le partenaire de vos séjours au Bénin.</p>
          </div>
        ) : resetSuccess ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Mot de passe réinitialisé !</h3>
              <p className="text-xs text-slate-600">
                Votre nouveau mot de passe a été enregistré avec succès pour l'adresse <strong>{email}</strong>.
              </p>
            </div>
            <button
              onClick={() => handleSwitchView('login')}
              className="w-full py-2.5 bg-[#003580] text-white font-bold text-sm rounded-lg hover:bg-[#002866] transition-colors cursor-pointer"
            >
              Se connecter maintenant
            </button>
          </div>
        ) : currentView === 'forgot' ? (
          /* FORGOT PASSWORD MULTI-STEP FORM */
          <div>
            {forgotStep === 'email_input' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Adresse E-mail (Gmail)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jean.dupont@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003580] hover:bg-[#002866] text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Envoyer le code à 6 chiffres
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#006ce4] font-bold hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour à la connexion</span>
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'code_input' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Code de vérification (6 chiffres)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Ex: 482915"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-mono tracking-widest text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003580] hover:bg-[#002866] text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Vérifier le code
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email_input')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#006ce4] font-bold hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Changer d'adresse e-mail</span>
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'new_password_input' && (
              <form onSubmit={handleFinalResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Saisissez le nouveau mot de passe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003580] hover:bg-[#002866] text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Valider le nouveau mot de passe
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#006ce4] font-bold hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Annuler</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* LOGIN OR SIGNUP FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentView === 'signup' && (
              <div className="space-y-3">
                {/* Sélecteur de rôle en 3 Onglets */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSignupRole('tourist')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      signupRole === 'tourist'
                        ? 'bg-[#003580] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🧳 Voyageur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('guide')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      signupRole === 'guide'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🚩 Guide 🛡️</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('artisan')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      signupRole === 'artisan'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🎨 Artisan 🔨</span>
                  </button>
                </div>

                {signupRole === 'guide' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 leading-tight">
                    🛡️ <strong>Accréditation Guide Certifié :</strong> Votre CNI et carte de guide seront évaluées par l'administrateur sous 24h-48h.
                  </div>
                )}

                {signupRole === 'artisan' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 leading-tight">
                    🔨 <strong>Partenariat Fait-Main :</strong> Votre atelier et votre engagement seront contrôlés avant activation de la boutique.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {signupRole === 'artisan' ? "Nom du Responsable de l'Atelier *" : "Nom & Prénom *"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Koffi Dossou"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                    />
                  </div>
                </div>

                {signupRole === 'artisan' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nom de l'Atelier ou de la Coopérative *
                    </label>
                    <input
                      type="text"
                      required
                      value={workshopName}
                      onChange={(e) => setWorkshopName(e.target.value)}
                      placeholder="Ex: Atelier Royal du Kanvo d'Abomey"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                    />
                  </div>
                )}

                {(signupRole === 'guide' || signupRole === 'artisan') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Numéro CNI, CIP ou Passeport Béninois *
                    </label>
                    <input
                      type="text"
                      required
                      value={cniNumber}
                      onChange={(e) => setCniNumber(e.target.value)}
                      placeholder="Ex: 1092837465"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 mt-2">
                Adresse E-mail (Gmail ou autre) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean.dupont@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                />
              </div>
            </div>

            {(signupRole === 'guide' || signupRole === 'artisan') && currentView === 'signup' && (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalEthicsCheck"
                  checked={ethicsAccepted}
                  onChange={(e) => setEthicsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="modalEthicsCheck" className="text-xs text-slate-600 leading-tight">
                  Je m'engage sur la vérité des pièces fournies et le respect de la <strong className="text-slate-900">Charte d'Éthique AfroKu</strong>.
                </label>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mot de passe
                </label>
                {currentView === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchView('forgot')}
                    className="text-xs text-[#006ce4] font-bold hover:underline cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={currentView === 'signup' ? 8 : 1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer ${
                signupRole === 'guide' && currentView === 'signup'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : signupRole === 'artisan' && currentView === 'signup'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-[#003580] hover:bg-[#002866]'
              }`}
            >
              {currentView === 'signup' && signupRole === 'tourist' && 'Créer mon compte Voyageur'}
              {currentView === 'signup' && signupRole === 'guide' && 'Soumettre mon dossier Guide (Accréditation 24h)'}
              {currentView === 'signup' && signupRole === 'artisan' && 'Soumettre mon dossier Artisan (Accréditation 24h)'}
              {currentView === 'login' && 'Se connecter'}
            </button>

            <div className="text-center pt-2">
              {currentView === 'signup' && (
                <p className="text-xs text-slate-500">
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="text-[#006ce4] font-bold underline cursor-pointer"
                  >
                    Se connecter
                  </button>
                </p>
              )}

              {currentView === 'login' && (
                <p className="text-xs text-slate-500">
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchView('signup')}
                    className="text-[#006ce4] font-bold underline cursor-pointer"
                  >
                    Créer un compte
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


