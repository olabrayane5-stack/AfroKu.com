import React, { useState, useEffect } from 'react';
import { ActiveTab, ModalType } from '../types';
import { BeninFlag } from './BeninFlag';
import { useAuth } from '../context/AuthContext';
import { getStoredReservations, RESERVATION_CHANGE_EVENT } from '../services/reservationStore';
import { useTheme } from '../context/ThemeContext';
import {
  Home,
  Compass,
  UserCheck,
  Palette,
  CalendarCheck,
  HelpCircle,
  Sparkles,
  Menu,
  X,
  LogOut,
  Phone,
  Mail,
  Info,
  Moon,
  Sun,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openModal: (modal: ModalType) => void;
  toggleAiDrawer: () => void;
  selectedCurrency: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openModal,
  toggleAiDrawer,
  selectedCurrency,
}) => {
  const { user, logout } = useAuth();

  // Sécurité : ouvre le modal demandé UNIQUEMENT si un utilisateur est
  // connecté. Sinon, redirige vers la connexion — utilisé par les boutons
  // "Devenir Partenaire" et "Ajouter un hébergement", qui ne doivent
  // jamais être accessibles à un visiteur non authentifié.
  const openProtectedModal = (modal: ModalType) => {
    if (!user) {
      openModal('auth_login');
      return;
    }
    openModal(modal);
  };

  // Un compte Guide ou Artisan (approuvé) voit la disposition fusionnée de
  // la Navbar, avec "Mon Espace". Tout visiteur non connecté ou Touriste
  // garde la disposition d'origine en 2 groupes séparés.
  const isPrestataire = !!user && (user.role === 'guide' || user.role === 'artisan');
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [resCount, setResCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      const items = getStoredReservations();
      setResCount(items.length);
    };
    updateCount();

    window.addEventListener(RESERVATION_CHANGE_EVENT, updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener(RESERVATION_CHANGE_EVENT, updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'accueil', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { id: 'explorer', label: 'Explorer', icon: <Compass className="w-4 h-4" /> },
    { id: 'guides', label: 'Guides', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'artisans', label: 'Artisans', icon: <Palette className="w-4 h-4" /> },
    { id: 'reservations', label: 'Réservations', icon: <CalendarCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="relative z-50 bg-[#003580] text-white border-b border-white/15 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* LIGNE DU HAUT : Logo, Pays/Devise, Auth & Bouton Concierge */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between h-16 sm:h-18 border-b border-white/10 gap-4">
          {/* À GAUCHE : Logo AfroKu.com + Sélecteurs Pays/Devise */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#accueil"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('accueil');
              }}
              className="group flex items-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white hover:opacity-95 transition-opacity shrink-0"
            >
              <span>AfroKu</span>
              <span className="text-amber-400 font-black">.com</span>
            </a>

            {/* Sélecteurs directs pays & devise */}
            <div className="hidden sm:flex items-center pl-3 sm:pl-4 border-l border-white/20">
              <button
                onClick={() => openModal('currency')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer border border-white/10"
                title="Pays & Devise de consultation"
              >
                <BeninFlag width={20} height={13} />
                <span className="font-bold tracking-wide">BÉNIN</span>
                <span className="text-amber-400 font-bold">•</span>
                <span className="text-white/90 uppercase">{selectedCurrency}</span>
              </button>
            </div>
          </div>

          {/* À DROITE : Connexion, Inscription & AfroKu Concierge */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5">
            {user ? (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xs uppercase">
                  {user.name.slice(0, 1)}
                </div>
                <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.name}</span>
                <button
                  onClick={logout}
                  title="Se déconnecter"
                  className="p-1 text-white/70 hover:text-red-300 transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 lg:gap-4">
                {/* Lien texte simple et blanc pour Connexion */}
                <button
                  onClick={() => openModal('auth_login')}
                  className="text-sm font-medium text-white hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Connexion
                </button>

                {/* Bouton blanc épuré pour S'inscrire */}
                <button
                  onClick={() => openModal('auth_signup')}
                  className="px-4 py-1.5 text-xs sm:text-sm font-bold bg-white text-[#003580] hover:bg-slate-100 rounded-full transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  S'inscrire
                </button>
              </div>
            )}

            {/* Bouton d'action principal AfroKu IA en Jaune Ocre Vibrant */}
            <button
              onClick={toggleAiDrawer}
              className="relative group px-4 sm:px-5 py-2 text-xs sm:text-sm font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full transition-all shadow-md hover:shadow-amber-400/25 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 border border-amber-300/80"
              title="Ouvrir AfroKu IA"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950/20 shrink-0" />
              <span>AfroKu IA</span>
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
              </span>
            </button>

            {/* Bouton Icône Lune / Soleil pour Basculer en Mode Sombre (Royal Night) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 transition-all shadow-xs cursor-pointer border border-white/20 flex items-center justify-center shrink-0"
              title={theme === 'royal_night' ? "Passer en mode jour (Royal Day ☀️)" : "Passer en mode nuit (Royal Night 🌙)"}
              aria-label="Basculer le thème"
            >
              {theme === 'royal_night' ? (
                <Sun className="w-4 h-4 text-amber-300 fill-amber-300/30" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300/30" />
              )}
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 text-amber-300 hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center cursor-pointer"
              title="Basculer le thème"
              aria-label="Basculer le thème"
            >
              {theme === 'royal_night' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300" />
              )}
            </button>
            <button
              onClick={toggleAiDrawer}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AfroKu IA</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 text-white focus:outline-hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LIGNE DU BAS : Onglets Navigation, Liens Pro & Widget Météo */}
        {/* ========================================================= */}
        <div className="hidden md:flex items-center justify-between h-13 py-1">
          {/* Structure TOUJOURS en 2 groupes séparés, pour tout le monde.
              Seul le CONTENU du groupe de droite change selon le rôle. */}

          {/* GROUPE GAUCHE : navigation principale — identique pour tous */}
          <nav className="flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 lg:px-4 py-1.5 text-xs lg:text-sm rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-amber-300 border border-amber-400/80 font-bold shadow-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10 border border-transparent font-medium'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'reservations' && resCount > 0 && (
                    <span className={`ml-1 text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white'
                    }`}>
                      {resCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* GROUPE DROITE : contenu conditionnel selon le rôle */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {isPrestataire ? (
              // Guide/Artisan : "Devenir Partenaire" absent (rôle déjà
              // verrouillé), "Mon Espace" présent.
              <div className="flex items-center space-x-3 lg:space-x-5 text-xs lg:text-sm font-medium text-white/85">
                <button
                  onClick={() => openProtectedModal('add_property')}
                  className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                 Agenda des festivités
                </button>
                <span className="text-white/30">•</span>
                <button
                  onClick={() => setActiveTab('mon_espace' as ActiveTab)}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mon Espace</span>
                </button>
              </div>
            ) : (
              // Touriste / non connecté : disposition d'origine
              <div className="flex items-center space-x-3 lg:space-x-5 text-xs lg:text-sm font-medium text-white/85">
                <button
                  onClick={() => openProtectedModal('partner_register')}
                  className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Devenir Partenaire
                </button>
                <span className="text-white/30">•</span>
                <button
                  onClick={() => openProtectedModal('add_property')}
                  className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Agenda des festivités
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MENU MOBILE DÉROULANT */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 bg-[#002866] rounded-b-2xl px-4 space-y-3 mt-1 shadow-xl">
            {/* Onglets Navigation Mobile */}
            <div className="space-y-1 pb-3 border-b border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold px-2 block mb-1">
                Navigation
              </span>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.id === 'reservations' && resCount > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950'
                      }`}>
                        {resCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pays & Devise Mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BeninFlag width={22} height={15} />
                <span className="text-xs font-semibold text-white/90">BÉNIN ({selectedCurrency})</span>
              </div>
              <button
                onClick={() => {
                  openModal('currency');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-amber-300 font-bold cursor-pointer"
              >
                Changer
              </button>
            </div>

            {/* Liens Professionnels Mobile — UNIQUEMENT pour touriste/
                visiteur non connecté (disposition d'origine, séparée). */}
            {!isPrestataire && (
              <div className="space-y-1 pb-2 border-b border-white/10 text-xs">
                <button
                  onClick={() => {
                    openProtectedModal('partner_register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-white/90 hover:text-white flex items-center gap-2 font-medium"
                >
                  <span>Devenir Partenaire (Guide / Artisan)</span>
                </button>
                <button
                  onClick={() => {
                    openProtectedModal('add_property');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-white/90 hover:text-white flex items-center gap-2 font-medium"
                >
                  <span>Agenda des festivités</span>
                </button>
              </div>
            )}

            {/* Prestataire (Guide/Artisan) : même position que le bloc
                ci-dessus, mais sans "Devenir Partenaire" (rôle déjà
                verrouillé) et avec "Mon Espace" en plus. */}
            {isPrestataire && (
              <div className="space-y-1 pb-2 border-b border-white/10 text-xs">
                <button
                  onClick={() => {
                    openProtectedModal('add_property');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-white/90 hover:text-white flex items-center gap-2 font-medium"
                >
                  <span>Agenda des festivités</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mon_espace' as ActiveTab);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-amber-300 hover:text-amber-200 flex items-center gap-2 font-bold"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mon Espace</span>
                </button>
              </div>
            )}

            {/* Auth Mobile */}
            {user ? (
              <div className="pt-2 flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xs uppercase">
                    {user.name.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{user.name}</span>
                    <span className="text-[10px] text-amber-300 block">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    openModal('auth_signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-bold bg-white text-[#003580] rounded-full"
                >
                  S'inscrire
                </button>
                <button
                  onClick={() => {
                    openModal('auth_login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-bold bg-white/15 text-white rounded-full border border-white/20"
                >
                  Connexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help & Support Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 relative my-auto text-slate-900">
            {/* Modal Header */}
            <div className="bg-[#003580] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Centre d'Aide & Support</h3>
                  <p className="text-[11px] text-amber-300 font-medium">Assistance Client AfroKu.com</p>
                </div>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#003580]">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contacter notre équipe au Bénin</span>
                </h4>

                <div className="space-y-2 text-slate-700 font-medium">
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold">Téléphone / WhatsApp :</span>
                    <strong className="text-slate-900 font-extrabold">+229 01 53 63 70 86</strong>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold">E-mail Support :</span>
                    <strong className="text-slate-900 font-extrabold text-[11px] sm:text-xs">afroku.officiel@gmail.com</strong>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold">Horaires :</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      7j/7 • 08h - 22h (GMT+1)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-[#003580] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Questions Fréquentes (FAQ)</span>
                </h4>

                <div className="space-y-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">1. Comment réserver un séjour ou une activité ?</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      Sélectionnez un hébergement, un guide ou un atelier, puis réglez directement par Mobile Money (MTN MoMo, Moov, Celtiis) ou Carte bancaire.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">2. Les guides et artisans sont-ils vérifiés ?</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      Oui, tous nos guides natifs et maîtres artisans possèdent le label certifié AfroKu Bénin.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setHelpModalOpen(false)}
                className="w-full py-3 bg-[#003580] hover:bg-[#00255c] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Fermer l'assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
