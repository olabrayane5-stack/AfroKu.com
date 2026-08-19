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
}

const STORAGE_KEY = 'afroku_user_reservations';
export const RESERVATION_CHANGE_EVENT = 'afroku-reservations-changed';

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

