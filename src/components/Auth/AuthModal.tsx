import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Compass, Hammer, Lock, Mail, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { UserRole, UserAccount } from '../../types';
import { GuideRegisterForm } from './GuideRegisterForm';
import { ArtisanRegisterForm } from './ArtisanRegisterForm';
import { PendingApprovalView } from './PendingApprovalView';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'select_role' | 'register_tourist' | 'register_guide' | 'register_artisan' | 'pending' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touristName, setTouristName] = useState('');
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Simulation de la connexion avec vérification du statut d'accréditation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Détection Super Admin
    if (cleanEmail === 'admin@afroku.com' || cleanEmail === 'admin') {
      const adminUser: UserAccount = {
        id: 'usr_admin_001',
        name: 'Administrateur AfroKu',
        email: 'admin@afroku.com',
        role: 'admin',
        accreditationStatus: 'verified',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      };
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // 2. Détection de comptes tests non validés (Pending)
    if (cleanEmail.includes('pending') || cleanEmail.includes('attente') || cleanEmail.includes('nouveau')) {
      const pendingAccount: UserAccount = {
        id: 'usr_pending_' + Date.now(),
        name: email.split('@')[0],
        email: cleanEmail,
        role: cleanEmail.includes('artisan') ? 'artisan' : 'guide',
        accreditationStatus: 'pending',
        submittedAt: new Date().toLocaleDateString('fr-FR')
      };
      setPendingUser(pendingAccount);
      setView('pending');
      return;
    }

    // 3. Connexion utilisateur classique (Touriste ou Guide/Artisan Certifié)
    const authenticatedUser: UserAccount = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'Voyageur AfroKu',
      email: cleanEmail,
      role: cleanEmail.includes('guide') ? 'guide' : cleanEmail.includes('artisan') ? 'artisan' : 'tourist',
      accreditationStatus: 'verified',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    };

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  // Soumission inscription Touriste
  const handleTouristSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!touristName || !email) {
      setError('Veuillez saisir votre nom et adresse e-mail.');
      return;
    }

    const newTourist: UserAccount = {
      id: 'usr_tourist_' + Date.now(),
      name: touristName,
      email: email.trim().toLowerCase(),
      role: 'tourist',
      accreditationStatus: 'verified'
    };

    onLoginSuccess(newTourist);
    onClose();
  };

  // Soumission dossier Guide
  const handleGuideSubmitSuccess = (guideData: any) => {
    const pendingGuide: UserAccount = {
      id: 'usr_guide_' + Date.now(),
      name: guideData.fullName,
      email: guideData.email,
      phoneWhatsApp: guideData.phoneWhatsApp,
      role: 'guide',
      accreditationStatus: 'pending',
      submittedAt: new Date().toLocaleDateString('fr-FR'),
      cniNumber: guideData.cniNumber,
      specialties: guideData.specialties,
      departments: [guideData.department]
    };

    setPendingUser(pendingGuide);
    setView('pending');
  };

  // Soumission dossier Artisan
  const handleArtisanSubmitSuccess = (artisanData: any) => {
    const pendingArtisan: UserAccount = {
      id: 'usr_artisan_' + Date.now(),
      name: artisanData.artisanName,
      email: artisanData.email,
      phoneWhatsApp: artisanData.phoneWhatsApp,
      role: 'artisan',
      accreditationStatus: 'pending',
      submittedAt: new Date().toLocaleDateString('fr-FR'),
      cniNumber: artisanData.cniNumber,
      specialties: [artisanData.craftType],
      departments: [artisanData.department]
    };

    setPendingUser(pendingArtisan);
    setView('pending');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. ÉCRAN DE CONNEXION */}
        {view === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Espace Membre AfroKu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Accédez à vos réservations, vos billets QR Code ou votre tableau de bord.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail ou Identifiant *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ex: voyageur@gmail.com ou guide@afroku.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mot de passe *
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot_password')}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Vous n'avez pas encore de compte ?
              </p>
              <button
                type="button"
                onClick={() => setView('select_role')}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold py-2.5 rounded-xl text-xs transition-colors"
              >
                Créer un compte ou Devenir Partenaire →
              </button>
            </div>
          </div>
        )}

        {/* 2. CHOIX DU TYPE DE COMPTE (SÉLECTION DU RÔLE) */}
        {view === 'select_role' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Rejoignez AfroKu.com
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choisissez votre profil d'inscription
              </p>
            </div>

            <div className="space-y-3">
              {/* Carte Touriste */}
              <button
                onClick={() => setView('register_tourist')}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all group flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-amber-600">
                    Je suis un Voyageur / Touriste
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Inscription gratuite et immédiate. Réservez vos visites et accédez à vos billets QR Code.
                  </p>
                </div>
              </button>

              {/* Carte Guide */}
              <button
                onClick={() => setView('register_guide')}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all group flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-amber-600">
                      Je suis un Guide Certifié
                    </h4>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Vérification 24h</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Soumettez votre dossier d'accréditation (CNI, diplôme) pour obtenir le badge et proposer vos visites.
                  </p>
                </div>
              </button>

              {/* Carte Artisan */}
              <button
                onClick={() => setView('register_artisan')}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all group flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-600">
                      Je suis un Maître Artisan / Coopérative
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Fait-main</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Proposez vos ateliers d'immersion et vendez vos créations authentiques dans notre boutique.
                  </p>
                </div>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* 3. INSCRIPTION INSTANTANÉE TOURISTE */}
        {view === 'register_tourist' && (
          <div className="space-y-5">
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Inscription Voyageur 🧳
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Création de compte gratuite en 30 secondes
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleTouristSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={touristName}
                  onChange={e => setTouristName(e.target.value)}
                  placeholder="Ex: Sophie Martin"
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sophie@example.com"
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Créer mon compte Voyageur
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView('select_role')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ← Changer de profil
              </button>
            </div>
          </div>
        )}

        {/* 4. FORMULAIRE D'ACCRÉDITATION GUIDE */}
        {view === 'register_guide' && (
          <GuideRegisterForm
            onSuccess={handleGuideSubmitSuccess}
            onSwitchToLogin={() => setView('login')}
          />
        )}

        {/* 5. FORMULAIRE DE PARTENARIAT ARTISAN */}
        {view === 'register_artisan' && (
          <ArtisanRegisterForm
            onSuccess={handleArtisanSubmitSuccess}
            onSwitchToLogin={() => setView('login')}
          />
        )}

        {/* 6. ÉCRAN D'ATTENTE D'ÉVALUATION 24-48H */}
        {view === 'pending' && pendingUser && (
          <PendingApprovalView
            user={pendingUser}
            onClose={onClose}
          />
        )}

        {/* 7. MOT DE PASSE OUBLIÉ */}
        {view === 'forgot_password' && (
          <ForgotPasswordModal
            onClose={onClose}
            onBackToLogin={() => setView('login')}
          />
        )}
      </div>
    </div>
  );
};
