# 🇧🇯 AfroKu - Plateforme Digitale du Tourisme & de la Culture du Bénin

> **Spécifications Techniques, Fonctionnalités Temps Réel, Parcours Utilisateurs & Cahier des Charges Backend**

---

## ⚡ 1. Fonctionnalités Temps Réel du Site

L'application **AfroKu** est une Single Page Application (SPA) développée en **React 18, TypeScript et Tailwind CSS**. Elle intègre des mécaniques de mise à jour instantanée en temps réel côté client :

### 🗺️ Carte Interactive Géographique des 12 Départements
* **Exploration Géographique** : Représentation interactive des 12 départements du Bénin (*Atacora, Alibori, Donga, Borgou, Collines, Zou, Plateau, Couffo, Mono, Atlantique, Ouémé, Littoral*).
* **Réactivité synchrone** : Le clic sur un département met à jour sur-le-champ la fiche de la région (*chef-lieu, attractions majeures comme la Pendjari, Ganvié, Tata Somba, Porte du Non-Retour, Cascades*) et filtre immédiatement la liste des hébergements, safaris et guides sans rechargement de page.

### 🔔 Bus d'Événements & Notification de Réservation (`Custom Event Bus`)
* **Mise à jour synchrone du compteur** : Dès qu'une réservation de lodge, de billet ou de guide est validée, l'événement global `RESERVATION_CHANGE_EVENT` est émis sur `window`.
* **Badge réactif** : Le Header capture l'événement et incrémente en temps réel le badge d'état de l'onglet **"Mes Réservations"** sans nécessiter de rafraîchissement de page.

### 💱 Conversion de Devises Réactive
* **Prise en charge de 7 monnaies** : `FCFA (XOF)`, `Euros (€)`, `Dollars ($)`, `Dollars Canadien ($)`, `Livres Sterling (£)`, `Francs Suisses (CHF)`, `Naira NGN (₦)`.
* **Calcul instantané** : Le changement de devise dans la modale recalculera synchroniquement l'ensemble des prix affichés sur le site.

### 🎟️ Billetterie Numérique & Génération de QR Code
* **Génération synchrone** : Une fois la simulation de paiement Mobile Money (*MTN, Moov, Celtiis*) ou Carte effectuée, le billet sécurisé avec son **QR Code unique** est généré et stocké instantanément.

### 🌙 Commutateur Thématique `Royal Night 🌙` / `Royal Day ☀️`
* **Basculement de thème en temps réel** : Passage immédiat du mode nuit royal (*fond bleu nuit `#020617` et accents dorés*) au mode jour royal (*fond crème ivoire et bleu royal*), mémorisé automatiquement dans `localStorage`.

---

## 🔄 2. Description Détaillée des Parcours Utilisateurs (User Journeys)

### 👤 PARCOURS 1 : Le Voyageur / Touriste (Réservation d'un Séjour & Safari)
1. **Étape 1 - Arrivée sur AfroKu** : Le voyageur choisit sa devise (*ex: EUR € ou FCFA XOF*) et son thème d'affichage préféré (`Royal Day ☀️` ou `Royal Night 🌙`).
2. **Étape 2 - Exploration via la Carte Interactive** :
   * Le voyageur clique sur le département **Atacora** sur la carte du Bénin.
   * La fiche du département s'affiche (*chef-lieu Natitingou, Parc de la Pendjari, Tata Somba*).
   * La liste des offres ci-dessous est automatiquement filtrée pour l'Atacora.
3. **Étape 3 - Consultation des Avis & Photos** :
   * Il consulte la fiche du *Lodge de la Pendjari*.
   * Il ouvre la modale des avis, filtre sur *"🦁 Safari Pendjari"*, agrandit les photos de voyage en haute définition et clique sur le bouton **"J'aime"** d'un retour client.
4. **Étape 4 - Prise de Réservation & Sélection de Guide** :
   * Il clique sur **"Réserver ce Séjour"**, choisit sa date, le nombre de personnes et sélectionne un guide certifié d'État (*ex: Guide Koffi Sossou*).
5. **Étape 5 - Paiement Mobile Money / Carte** :
   * Il choisit son mode de paiement (*MTN Mobile Money* ou *Carte Visa*), saisit son numéro et valide.
6. **Étape 6 - Confirmation & Billet QR Code** :
   * Le paiement est confirmé. Le compteur **"Mes Réservations"** dans le Header s'incrémente en temps réel et son **Billet électronique avec QR Code** est immédiatement disponible.

---

### 👨‍💼 PARCOURS 2 : Le Partenaire Hôtelier / Guide / Artisan (Enregistrement Pro)
1. **Étape 1 - Demande de Partenariat** : Le professionnel (gérant d'hôtel, guide certifié ou artisan tisseur Kanvo) clique sur **"Devenir Partenaire / Pro"** ou **"Ajouter un établissement"**.
2. **Étape 2 - Saisie du Formulaire** : Il indique la catégorie (*Hôtel / Lodge*, *Guide*, *Artisan*), le nom de son établissement, son département (*ex: Zou - Abomey*), son numéro WhatsApp et email.
3. **Étape 3 - Validation & Notification** : La demande est transmise avec le statut `pending` (en attente d'approbation par les administrateurs AfroKu).

---

### 💬 PARCOURS 3 : Le Voyageur (Déposer un Avis & une Photo)
1. **Étape 1 - Formulaire d'Avis** : Le voyageur clique sur **"Déposer mon avis & photo"**.
2. **Étape 2 - Rédaction & Note** : Il sélectionne l'expérience (*ex: 🛶 Visite de Ganvié*), attribue une note de 1 à 5 étoiles, écrit son commentaire et précise sa ville d'origine (*ex: Lyon, France*).
3. **Étape 3 - Ajout de Photo & Publication** : Il télécharge sa photo de vacances et valide. Son avis est immédiatement publié avec le badge **"Avis Vérifié AfroKu"**.

---

## 🛠️ 3. Spécifications pour l'Équipe Backend

### 🗄️ Schémas de Données Recommandés (DB Schemas)
1. **Users** : `id`, `name`, `email`, `passwordHash`, `role` (`visitor`, `partner`, `guide`, `artisan`, `admin`), `phone`, `createdAt`.
2. **Properties** : `id`, `title`, `category` (`hotel`, `lodge`, `excursion`, `circuit`, `monument`), `department` (1 des 12 départements), `locationName`, `priceXOF`, `unitLabel`, `rating`, `imageUrl`, `galleryImages[]`, `description`, `highlights[]`, `verifiedPartner`.
3. **Guides** : `id`, `name`, `avatarUrl`, `department`, `specialties[]`, `languages[]`, `experienceYears`, `rating`, `dailyRateXOF`, `phoneWhatsApp`, `bio`, `isAvailable`.
4. **Reviews** : `id`, `authorName`, `authorLocation`, `avatarUrl`, `rating`, `date`, `experienceTitle`, `experienceCategory`, `comment`, `photos[]`, `guideOrHostName`, `verifiedBooking`, `likesCount`.
5. **Reservations** : `id`, `userId`, `type` (`accommodation`, `excursion`, `ticket`, `guide`), `itemTitle`, `date`, `clientName`, `clientEmail`, `clientPhone`, `totalXOF`, `status` (`confirmed`, `pending`, `cancelled`), `qrCodeData`, `createdAt`.

### 🔌 Endpoints API REST à développer
* `GET /api/properties` : Liste des logements/safaris (filtres par `department`, `category`, `keyword`).
* `GET /api/guides` : Répertoire des 29 guides officiels.
* `GET /api/reviews` : Avis voyageurs filtrables par `experienceCategory`.
* `POST /api/reviews` : Publication d'un avis avec photo.
* `POST /api/reviews/:id/like` : Incrémentation du nombre de likes.
* `POST /api/reservations` : Création de réservation et génération de QR Code.
* `GET /api/reservations/user/:userId` : Historique des réservations d'un utilisateur.
* `POST /api/partners/register` : Soumission de dossier partenaire.
* `POST /api/auth/register` & `POST /api/auth/login` : Authentification sécurisée par JWT.

---

*Document de Spécifications Techniques AfroKu - Tourisme & Culture du Bénin 🇧🇯*
