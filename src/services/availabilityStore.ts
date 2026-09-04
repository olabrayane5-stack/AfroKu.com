/**
 * ============================================================================
 * AFROKU.COM - DISPONIBILITÉS DES PRESTATAIRES (GUIDES / ARTISANS)
 * ============================================================================
 * Stockage local (par compte, via son e-mail) des créneaux que le
 * prestataire déclare comme libres. À terme, ceci doit être remplacé par une
 * vraie table `availabilities` (id, provider_email, date, note, created_at)
 * exposée par le backend.
 * ============================================================================
 */

export interface AvailabilitySlot {
  id: string;
  date: string; // format YYYY-MM-DD
  note?: string;
}

const STORAGE_PREFIX = 'afroku_guide_availability_';
export const AVAILABILITY_CHANGE_EVENT = 'afroku-availability-changed';

function storageKey(providerEmail: string): string {
  return `${STORAGE_PREFIX}${providerEmail.trim().toLowerCase()}`;
}

export function getAvailability(providerEmail: string): AvailabilitySlot[] {
  if (typeof window === 'undefined' || !providerEmail) return [];
  try {
    const raw = localStorage.getItem(storageKey(providerEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Erreur de lecture des disponibilités:', e);
    return [];
  }
}

export function addAvailability(providerEmail: string, date: string, note?: string): AvailabilitySlot[] {
  const current = getAvailability(providerEmail);
  if (current.some((slot) => slot.date === date)) return current; // pas de doublon
  const updated = [...current, { id: `AVL-${Date.now()}`, date, note }].sort((a, b) => a.date.localeCompare(b.date));
  try {
    localStorage.setItem(storageKey(providerEmail), JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur d\'ajout de disponibilité:', e);
  }
  window.dispatchEvent(new CustomEvent(AVAILABILITY_CHANGE_EVENT));
  return updated;
}

export function removeAvailability(providerEmail: string, slotId: string): AvailabilitySlot[] {
  const current = getAvailability(providerEmail);
  const updated = current.filter((slot) => slot.id !== slotId);
  try {
    localStorage.setItem(storageKey(providerEmail), JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur de suppression de disponibilité:', e);
  }
  window.dispatchEvent(new CustomEvent(AVAILABILITY_CHANGE_EVENT));
  return updated;
}
