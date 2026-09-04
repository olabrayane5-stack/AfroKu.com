/**
 * Récupère les profils Guide / Artisan réellement approuvés par un
 * administrateur (via AfroKu-Admin), publiés par le backend sur
 * GET /api/guides et GET /api/artisans. Ces profils viennent s'ajouter
 * aux fiches de démonstration (BENIN_GUIDES / données artisans statiques)
 * pour que les voyageurs puissent réellement les réserver.
 */
import { GuideItem, ArtisanItem } from '../types';

export async function getPublishedGuides(): Promise<GuideItem[]> {
  try {
    const response = await fetch('/api/guides');
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.guides) ? data.guides : [];
  } catch (e) {
    console.error('Erreur de chargement des guides validés:', e);
    return [];
  }
}

export async function getPublishedArtisans(): Promise<ArtisanItem[]> {
  try {
    const response = await fetch('/api/artisans');
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.artisans) ? data.artisans : [];
  } catch (e) {
    console.error('Erreur de chargement des artisans validés:', e);
    return [];
  }
}
