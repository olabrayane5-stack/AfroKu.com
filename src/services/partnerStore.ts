/**
 * ============================================================================
 * AFROKU.COM - GESTION DES CANDIDATURES PARTENAIRES (GUIDES & ARTISANS)
 * ============================================================================
 * Ce module gère les inscriptions des Guides Touristiques et Artisans qui
 * souhaitent rejoindre la plateforme AfroKu, ainsi que la validation par l équipe AfroKu.
 * ============================================================================
 */

import { PartnerApplication } from '../types';

const APPLICATIONS_KEY = 'afroku_partner_applications';
export const PARTNER_CHANGE_EVENT = 'afroku-partner-applications-changed';

/**
 * Récupère la liste de toutes les candidatures enregistrées
 */
export function getStoredApplications(): PartnerApplication[] {
  if (typeof window === 'undefined') return getInitialDemoApplications();
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) {
      const initial = getInitialDemoApplications();
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Erreur lors de la lecture des candidatures:', e);
    return getInitialDemoApplications();
  }
}

/**
 * Soumet une nouvelle candidature (Guide ou Artisan)
 */
export function saveApplication(
  app: Omit<PartnerApplication, 'id' | 'status' | 'submittedAt'>
): PartnerApplication {
  const current = getStoredApplications();
  const newApp: PartnerApplication = {
    ...app,
    id: 'AFK-APP-' + Math.floor(100000 + Math.random() * 900000),
    status: 'En attente',
    submittedAt: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  const updated = [newApp, ...current];
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde de la candidature:', e);
  }

  window.dispatchEvent(new CustomEvent(PARTNER_CHANGE_EVENT, { detail: newApp }));
  return newApp;
}

/**
 * Met à jour le statut d'une candidature (Approuvé / Rejeté) par Le Boss Admin
 */
export function updateApplicationStatus(id: string, status: 'Approuvé' | 'Rejeté', adminNote?: string): void {
  const current = getStoredApplications();
  const updated = current.map((app) =>
    app.id === id ? { ...app, status, adminNote: adminNote || app.adminNote } : app
  );

  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur de mise à jour du statut:', e);
  }

  window.dispatchEvent(new CustomEvent(PARTNER_CHANGE_EVENT));
}

/**
 * Supprime définitivement une candidature
 */
export function deleteApplication(id: string): void {
  const current = getStoredApplications();
  const updated = current.filter((app) => app.id !== id);

  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur de suppression de la candidature:', e);
  }

  window.dispatchEvent(new CustomEvent(PARTNER_CHANGE_EVENT));
}

/**
 * Données démo initiales pour tester le Dashboard Admin
 */
function getInitialDemoApplications(): PartnerApplication[] {
  return [
    {
      id: 'AFK-APP-884210',
      type: 'guide',
      fullName: 'Koffi Bienvenu SOSSOU',
      email: 'koffi.sossou@gmail.com',
      phoneWhatsApp: '+229 97 12 34 56',
      city: 'Ouidah',
      department: 'Atlantique',
      photoUrl: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=600&q=70',
      languages: ['Français', 'Fon', 'Anglais'],
      yearsExperience: 6,
      dailyRateXOF: 18000,
      specialties: ['Histoire de la Traite Négrière', 'Culte Vaudou', 'Route des Esclaves'],
      bio: 'Passionné par l histoire de Ouidah et titulaire d une licence en patrimoine culturel. Je fais visiter Ouidah avec authenticité et respect des traditions.',
      status: 'En attente',
      submittedAt: '11 août 2026 à 14:20',
    },
    {
      id: 'AFK-APP-773192',
      type: 'artisan',
      fullName: 'Mélanie ADANHO',
      email: 'melanie.adanho@gmail.com',
      phoneWhatsApp: '+229 96 88 44 22',
      city: 'Abomey-Calavi',
      department: 'Atlantique',
      photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=70',
      workshopName: 'Atelier Kanvo Rétro Bénin',
      craftType: 'Tissage traditionnel (Tissu Kanvo)',
      physicalAddress: 'Quartier Akassato, calavi',
      workshopPriceXOF: 12000,
      bio: 'Maître tisseuse de Kanvo depuis 12 ans. Mon atelier forme les jeunes filles et fabrique du tissu royal fait main d une qualité exceptionnelle.',
      status: 'En attente',
      submittedAt: '11 août 2026 à 15:45',
    },
  ];
}
