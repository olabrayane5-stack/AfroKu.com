/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, ModalType, SearchParams, BeninDepartment } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomeView } from './components/Views/HomeView';
import { ExplorerView } from './components/Views/ExplorerView';
import { GuidesView } from './components/Views/GuidesView';
import { ArtisansView } from './components/Views/ArtisansView';
import { ReservationsView } from './components/Views/ReservationsView';
import { AdminDashboardView } from './components/Views/AdminDashboardView';
import { AiAssistant } from './components/AiAssistant';
import { AuthModal } from './components/Modals/AuthModal';
import { AddPropertyModal } from './components/Modals/AddPropertyModal';
import { CurrencyModal } from './components/Modals/CurrencyModal';
import { PartnerRegistrationModal } from './components/Modals/PartnerRegistrationModal';
import { BeninFlag } from './components/BeninFlag';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainAppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('accueil');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('XOF');
  const [selectedDepartment, setSelectedDepartment] = useState<BeninDepartment | null>(null);

  const [currentSearchResults, setCurrentSearchResults] = useState<SearchParams | null>(null);

  useEffect(() => {
    const handleOpenAuth = (e: CustomEvent) => {
      setActiveModal(e.detail || 'auth_login');
    };
    const handleOpenPartner = () => {
      setActiveModal('partner_register');
    };
    window.addEventListener('open-auth-modal' as any, handleOpenAuth);
    window.addEventListener('open-partner-modal' as any, handleOpenPartner);
    return () => {
      window.removeEventListener('open-auth-modal' as any, handleOpenAuth);
      window.removeEventListener('open-partner-modal' as any, handleOpenPartner);
    };
  }, []);

  const handleSelectDepartment = (dept: BeninDepartment | null) => {
    setSelectedDepartment(dept);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedDepartment(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleSearch = (params: SearchParams) => {
    setCurrentSearchResults(params);
    setActiveTab('accueil');
    setSelectedDepartment(null);
    // Smooth scroll down to search results / view
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans selection:bg-amber-400 selection:text-slate-950 bg-[#FAF7F2] dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. ARRIÈRE-PLAN AVEC L'IMAGE DU CLIENT (Filigrane Art Africain pour toutes les sections) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#FAF7F2] dark:bg-[#0B132B] transition-colors duration-300" />
        <div 
          className="absolute inset-0 bg-center bg-cover bg-fixed opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-soft-light transition-all duration-300"
          style={{ backgroundImage: "url('/sections_afroku_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/60 via-transparent to-[#FAF7F2]/80 dark:from-[#0B132B]/40 dark:via-transparent dark:to-[#0B132B]/50 transition-all duration-300" />
      </div>

      {/* 2. CONTENU FLOTTANT (z-10 Wrapper) */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          openModal={(m) => setActiveModal(m)}
          toggleAiDrawer={() => setAiDrawerOpen(!aiDrawerOpen)}
          selectedCurrency={selectedCurrency}
        />

        {/* Main View Area based on Active Tab */}
        <main className="flex-1" id="main-content">
          {activeTab === 'accueil' && (
            <HomeView
              setActiveTab={handleTabChange}
              onSearch={handleSearch}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={handleSelectDepartment}
            />
          )}
          {activeTab === 'explorer' && (
            <ExplorerView
              onSearch={handleSearch}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={handleSelectDepartment}
            />
          )}
          {activeTab === 'guides' && <GuidesView />}
          {activeTab === 'artisans' && <ArtisansView />}
          {activeTab === 'reservations' && <ReservationsView onNavigate={handleTabChange} />}
          {activeTab === 'admin' && <AdminDashboardView />}
        </main>

        {/* Footer */}
        <footer className="bg-slate-950/90 backdrop-blur-md text-white pt-12 pb-8 border-t border-amber-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="text-2xl font-black text-white">
                  AfroKu<span className="text-amber-400">.com</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La plateforme référence d'immersions culturelles, de réservations d'hébergements, de guides natifs et d'artisanat d'art en République du Bénin.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <BeninFlag width={26} height={17} />
                  <span className="text-xs font-semibold text-amber-300">Fait avec passion au Bénin</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Destinations Bénin</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><button onClick={() => { setActiveTab('explorer'); }} className="hover:text-amber-300">Cotonou & Littoral</button></li>
                  <li><button onClick={() => { setActiveTab('explorer'); }} className="hover:text-amber-300">Ganvié (Cité Lacustre)</button></li>
                  <li><button onClick={() => { setActiveTab('explorer'); }} className="hover:text-amber-300">Ouidah (Route des Esclaves)</button></li>
                  <li><button onClick={() => { setActiveTab('explorer'); }} className="hover:text-amber-300">Abomey & Palais Royaux</button></li>
                  <li><button onClick={() => { setActiveTab('explorer'); }} className="hover:text-amber-300">Parc National de la Pendjari</button></li>
                  <li><button onClick={() => { setActiveTab('explorer'); }} className="hover:text-amber-300">Natitingou & Pays Somba</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Services AfroKu</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><button onClick={() => setActiveTab('accueil')} className="hover:text-amber-300">Accueil & Séjours</button></li>
                  <li><button onClick={() => setActiveTab('explorer')} className="hover:text-amber-300">Explorer les départements</button></li>
                  <li><button onClick={() => setActiveTab('guides')} className="hover:text-amber-300">Guides Locaux Certifiés</button></li>
                  <li><button onClick={() => setActiveTab('artisans')} className="hover:text-amber-300">Ateliers de Maîtres Artisans</button></li>
                  <li><button onClick={() => setActiveTab('reservations')} className="hover:text-amber-300">Mes Réservations & Billets</button></li>
                  <li><button onClick={() => setActiveModal('add_property')} className="hover:text-amber-300">Ajouter mon établissement</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Assistance AfroKu IA</h4>
                <p className="text-xs text-slate-300 mb-3">
                  Besoin de conseils pour voyager au Bénin ? Posez vos questions à l'IA AfroKu !
                </p>
                <button
                  onClick={() => setAiDrawerOpen(true)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs rounded-lg shadow-md hover:from-amber-400 hover:to-yellow-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-slate-900" />
                  <span>Ouvrir AfroKu IA</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
              <p>© {new Date().getFullYear()} AfroKu.com. Tous droits réservés.</p>
              <div className="flex gap-4 text-xs">
                <a href="#" className="hover:underline">Conditions d'utilisation</a>
                <a href="#" className="hover:underline">Confidentialité</a>
                <a href="#" className="hover:underline">Charte des Guides & Artisans</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating AI Button at bottom right corner */}
      <button
        onClick={() => setAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 border-2 border-white ring-4 ring-amber-500/20"
        title="Discuter avec AfroKu IA"
      >
        <Sparkles className="w-5 h-5 text-slate-950" />
        <span className="font-black text-xs hidden sm:inline">AfroKu IA</span>
      </button>

      {/* Modals & AI Drawer */}
      <AiAssistant isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />

      <AuthModal
        type={activeModal === 'auth_signup' || activeModal === 'auth_login' ? activeModal : null}
        onClose={() => setActiveModal(null)}
        openOther={(m) => setActiveModal(m)}
      />

      <AddPropertyModal
        isOpen={activeModal === 'add_property'}
        onClose={() => setActiveModal(null)}
      />

      <CurrencyModal
        isOpen={activeModal === 'currency'}
        onClose={() => setActiveModal(null)}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />

      <PartnerRegistrationModal
        isOpen={activeModal === 'partner_register'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
