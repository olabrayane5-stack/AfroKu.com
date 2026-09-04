/**
 * ============================================================================
 * AFROKU.COM - GESTION DU PANIER & DES RÉSERVATIONS
 * ============================================================================
 * INSTRUCTIONS POUR LE DÉVELOPPEUR BACKEND / VIB CODER :
 * 
 * Ce module gère la création, la lecture, l'annulation et la suppression des 
 * réservations d'hébergements (SÉJOURS), guides touristiques, ateliers d'artisans,
 * billets de musées et circuits.
 * 
 * TA FEUILLE DE ROUTE BACKEND :
 * 1. Base de données SQL (Table `reservations`) :
 *    - Colonnes : id, code, user_email, category, title, location, dates, price_xof, status, payment_method, details_note, created_at.
 * 2. API Endpoints à brancher :
 *    - `POST /api/reservations` -> Créer une réservation & générer le code unique (ex: AFK-XXXXX-BJ)
 *    - `GET /api/reservations/user/:email` -> Récupérer l'historique d'un utilisateur
 *    - `PATCH /api/reservations/:id/cancel` -> Annuler la réservation
 *    - `DELETE /api/reservations/:id` -> Supprimer la réservation
 * 3. Événement local `RESERVATION_CHANGE_EVENT` :
 *    - Utilisé par le React Frontend pour rafraîchir le badge du panier et la liste en temps réel.
 * ============================================================================
 */

export interface ReservationItem {
  id: string;
  code: string;
  title: string;
  category: 'SÉJOUR' | 'GUIDE' | 'ARTISAN' | 'BILLET' | 'EXCURSION';
  location: string;
  dates: string;
  priceXOF: number;
  status: string;
  image: string;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  quantity?: number;
  paymentMethod?: string;
  detailsNote?: string;
  // Lien vers le prestataire (guide ou artisan) concerné par cette réservation.
  providerId?: string;
  providerName?: string;
}

const STORAGE_KEY = 'afroku_user_reservations';
export const RESERVATION_CHANGE_EVENT = 'afroku-reservations-changed';

/** Commission prélevée par AfroKu sur chaque réservation reversée à un prestataire. */
export const COMMISSION_RATE = 0.2;

/** Normalise un nom (minuscules, sans accents, espaces compressés) pour comparer prestataire ↔ compte connecté. */
export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Calcule la part plateforme (20%) et le reversement net au prestataire pour un montant donné. */
export function computeCommissionSplit(priceXOF: number): { commissionXOF: number; netPayoutXOF: number } {
  const commissionXOF = Math.round(priceXOF * COMMISSION_RATE);
  return { commissionXOF, netPayoutXOF: priceXOF - commissionXOF };
}

/**
 * Récupère les réservations enregistrées localement
 */
export function getStoredReservations(): ReservationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Erreur de lecture des réservations dans localStorage:', e);
    return [];
  }
}

/**
 * Enregistre une nouvelle réservation et déclenche l'événement global
 */
export function saveReservation(item: Omit<ReservationItem, 'id' | 'createdAt'>): ReservationItem {
  const current = getStoredReservations();
  const newReservation: ReservationItem = {
    ...item,
    id: `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newReservation, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde de la réservation:', e);
  }

  // Notification globale au Frontend React
  window.dispatchEvent(new CustomEvent(RESERVATION_CHANGE_EVENT, { detail: newReservation }));
  return newReservation;
}

/**
 * Annule une réservation par son ID
 */
export function cancelReservation(id: string): void {
  const current = getStoredReservations();
  const updated = current.map((res) => (res.id === id ? { ...res, status: 'Annulée' } : res));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur d\'annulation de la réservation:', e);
  }
  window.dispatchEvent(new CustomEvent(RESERVATION_CHANGE_EVENT));
}

/**
 * Met à jour le statut d'une réservation (ex: un guide qui confirme ou
 * refuse une demande reçue depuis son espace personnel)
 */
export function updateReservationStatus(id: string, status: string): void {
  const current = getStoredReservations();
  const updated = current.map((res) => (res.id === id ? { ...res, status } : res));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur de mise à jour du statut de la réservation:', e);
  }
  window.dispatchEvent(new CustomEvent(RESERVATION_CHANGE_EVENT));
}

/**
 * Récupère les réservations liées à un prestataire (guide ou artisan) donné,
 * dans une catégorie donnée, en comparant l'ID exact ou le nom normalisé
 * (utile tant que les comptes réels ne sont pas encore reliés en base aux
 * fiches Guide/Artisan de démonstration).
 */
export function getReservationsForProvider(
  category: ReservationItem['category'],
  providerId?: string,
  providerName?: string
): ReservationItem[] {
  const normalizedTarget = providerName ? normalizeName(providerName) : '';
  return getStoredReservations().filter((res) => {
    if (res.category !== category) return false;
    if (providerId && res.providerId === providerId) return true;
    if (normalizedTarget && res.providerName && normalizeName(res.providerName) === normalizedTarget) return true;
    return false;
  });
}

/**
 * Supprime définitivement une réservation
 */
export function deleteReservation(id: string): void {
  const current = getStoredReservations();
  const updated = current.filter((res) => res.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur de suppression de la réservation:', e);
  }
  window.dispatchEvent(new CustomEvent(RESERVATION_CHANGE_EVENT));
}

/**
 * Vide toutes les réservations
 */
export function clearAllReservations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Erreur de suppression du panier:', e);
  }
  window.dispatchEvent(new CustomEvent(RESERVATION_CHANGE_EVENT));
}

/**
 * Injecte des réservations démo de test si le panier est vide
 */
export function addDemoSampleReservations(): void {
  const demoList: ReservationItem[] = [
    {
      id: 'demo-1',
      code: 'AFK-88291-BJ',
      title: 'Auberge du Lac Ganvié - Chambre Vue Pirogues',
      category: 'SÉJOUR',
      location: 'Ganvié, Bénin',
      dates: '15 Oct. 2026 — 18 Oct. 2026',
      priceXOF: 75000,
      status: 'Confirmée',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=70',
      createdAt: new Date().toISOString(),
      customerName: 'Voyageur Exemple',
    },
    {
      id: 'demo-2',
      code: 'AFK-49201-GD',
      title: 'Excursion Mémoire & Vaudou avec Koffi Dossou',
      category: 'GUIDE',
      location: 'Ouidah, Bénin',
      dates: '16 Oct. 2026 (Journée complète)',
      priceXOF: 25000,
      status: 'Confirmée',
      image: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=600&q=70',
      createdAt: new Date().toISOString(),
      customerName: 'Voyageur Exemple',
    },
  ];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoList));
  } catch (e) {
    console.error('Erreur de chargement des réservations démo:', e);
  }
  window.dispatchEvent(new CustomEvent(RESERVATION_CHANGE_EVENT));
}
