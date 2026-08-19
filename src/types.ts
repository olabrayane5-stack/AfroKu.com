/**
 * ============================================================================
 * AFROKU.COM - SCHÉMAS DE DONNÉES & TYPES TYPESCRIPT
 * ============================================================================
 * NOTE AU DÉVELOPPEUR BACKEND :
 * 
 * Ces interfaces définissent la structure des données transmises entre le
 * Frontend React et la Base de données / API Backend.
 * 
 * TES TABLES BASE DE DONNÉES DEVRONT REPRODUIRE CES SCHÉMAS :
 * - `users` (id, name, email, password_hash, created_at)
 * - `tourist_sites` (id, name, category, description, location, entry_fee, ...)
 * - `departments` (id, name, chef_lieu, region, ...)
 * - `guides` (id, name, title, price_per_day, specialties, is_verified, ...)
 * - `artisans` & `artisan_products` (id, name, price_xof, materials, authenticity, ...)
 * - `reservations` (id, code, user_email, category, price_xof, status, ...)
 * ============================================================================
 */

export type ActiveTab = 'accueil' | 'explorer' | 'guides' | 'artisans' | 'reservations' | 'admin';

export type ModalType = 'auth_signup' | 'auth_login' | 'add_property' | 'currency' | 'partner_register' | 'pending_approval' | 'forgot_password' | null;

export type UserRole = 'tourist' | 'guide' | 'artisan' | 'admin';

export type AccreditationStatus = 'pending' | 'verified' | 'rejected' | 'info_requested';

export type ApplicationStatus = 'En attente' | 'Approuvé' | 'Rejeté';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phoneWhatsApp?: string;
  role: UserRole;
  accreditationStatus: AccreditationStatus;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  cniNumber?: string;
  cniPhotoUrl?: string;
  guideLicenseUrl?: string;
  workshopProofUrl?: string;
  departments?: string[];
  specialties?: string[];
  avatarUrl?: string;
}

export interface PartnerApplication {
  id: string;
  type: 'guide' | 'artisan';
  fullName: string;
  email: string;
  phoneWhatsApp: string;
  city: string;
  department: string;
  photoUrl: string;
  
  // Champs spécifiques Guide
  languages?: string[];
  yearsExperience?: number;
  dailyRateXOF?: number;
  specialties?: string[];
  
  // Champs spécifiques Artisan
  workshopName?: string;
  craftType?: string;
  physicalAddress?: string;
  workshopPriceXOF?: number;
  
  bio: string;
  status: ApplicationStatus;
  submittedAt: string;
  adminNote?: string;
}

export interface SearchParams {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  rooms: number;
}

export interface BeninTouristSite {
  id: string;
  name: string;
  category: 'Patrimoine' | 'Nature' | 'Vaudou & Culture' | 'Artisanat' | 'Plage & Eau' | 'Histoire';
  description: string;
  location: string;
  mapUrl?: string;
  image: string;
  entryFee?: string;
  openingHours?: string;
  recommendedDuration?: string;
  bestTimeToVisit?: string;
  activities?: string[];
  practicalTips?: string;
  historicalContext?: string;
  guidedTourPrice?: string;
}

export interface BeninDepartment {
  id: string;
  name: string;
  chefLieu: string;
  region: 'Sud' | 'Centre' | 'Nord';
  description: string;
  image: string;
  sites: BeninTouristSite[];
}

export interface BeninDestination {
  id: string;
  name: string;
  department: string;
  shortDesc: string;
  image: string;
  highlights: string[];
  guidesAvailable: number;
  artisansCount: number;
  popularTag?: string;
}

export interface GuideItem {
  id: string;
  name: string;
  title: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  yearsOfExperience: number;
  languages: string[];
  photo: string;
  bio: string;
  pricePerDay: number;
  specialties: string[];
  isVerified: boolean;
}

export interface ArtisanProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ArtisanProductItem {
  id: string;
  // 1. Informations générales
  name: string;
  category: 'Bijoux' | 'Statues' | 'Sculptures' | 'Masques' | 'Tissus' | 'Poteries' | 'Peintures' | 'Accessoires';
  priceXOF: number;
  availability: 'En stock' | 'Sur commande';
  artisanId: string;
  artisanName: string;
  image: string;
  galleryImages?: string[];

  // 2. Description
  historyInspiration: string;
  culturalSignificance: string;
  manufacturingTechnique: string;
  specialFeatures: string;

  // 3. Caractéristiques
  materials: string[];
  dimensions: string;
  weight: string;
  colors: string[];
  isHandmade: boolean;
  editionType: 'Pièce unique' | 'Série limitée' | 'Édition artisanale';

  // 4. Authenticité & Qualité
  is100PercentHandmade: boolean;
  madeInBenin: boolean;
  hasCertificateOfAuthenticity: boolean;
  qualityMaterials: string;
  qualityCheckDone: boolean;

  // 5. Livraison
  nationalDelivery: string;
  internationalDelivery: string;
  estimatedDeliveryTime: string;
  deliveryFee: string;
  pickupAvailable: boolean;
  pickupLocation?: string;

  // 6. Protection & Garanties
  securePayment: string;
  purchaseProtection: string;
  returnPolicy: string;
  securePackaging: string;
  customerSupport: string;

  // 7. À propos de l'artisan
  artisanExperienceYears: number;
  artisanCity: string;
  artisanCreationCount: number;
  artisanBio: string;
  artisanRating: number;
  artisanReviewCount: number;
  reviews: ArtisanProductReview[];
}

export interface ArtisanItem {
  id: string;
  name: string;
  craft: string;
  workshopName: string;
  location: string;
  rating: number;
  photo: string;
  description: string;
  hasWorkshop: boolean;
  products: string[];
  experienceYears?: number;
  creationCount?: number;
  workshopDuration?: string;
  workshopPriceXOF?: number;
  workshopCapacity?: string;
  nextSessionDate?: string;
  department?: string;
  physicalAddress?: string;
  includedServices?: string[];
  workshopProgram?: string[];
}

export interface ArtisanShopItem {
  id: string;
  name: string;
  artisanName: string;
  specialty: string;
  city: string;
  department: string;
  address: string;
  openingHours: string;
  phoneWhatsApp: string;
  rating: number;
  photo: string;
  description: string;
  featuredProductsCount: number;
  productIds: string[];
  verifiedLabel: string;
}

export interface ReservationItem {
  id: string;
  title: string;
  category: 'Séjour' | 'Guide' | 'Artisan' | 'Circuit';
  location: string;
  dates: string;
  status: 'Confirmée' | 'En attente' | 'Terminée';
  priceXOF: number;
  image: string;
  code: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface CulturalEvent {
  id?: string;
  title: string;
  badge: string;
  date: string;
  time?: string;
  location: string;
  desc: string;
  price: string;
  organizer?: string;
  image: string;
}
