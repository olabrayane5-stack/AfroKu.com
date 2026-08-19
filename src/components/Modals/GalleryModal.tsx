import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Tag, Calendar, Share2, Sparkles, ShoppingBag, Compass } from 'lucide-react';
import { handleImageError } from '../SafeImage';

export interface GalleryPhoto {
  id: string;
  title: string;
  location: string;
  department: string;
  category: 'Patrimoine' | 'Culture & Vaudou' | 'Nature & Safari' | 'Artisanat' | 'Architecture';
  url: string;
  description: string;
  photographer?: string;
  relatedAction?: {
    type: 'explorer' | 'guides' | 'artisans' | 'reservations';
    label: string;
  };
}

export const BENIN_CULTURAL_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Ganvié - La Venise de l\'Afrique',
    location: 'Lac Nokoué, Ganvié',
    department: 'Atlantique',
    category: 'Patrimoine',
    url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    description: 'Plus grande cité lacustre d\'Afrique bâtie entièrement sur pilotis au XVIIe siècle par les réfugiés Tofinu échappant aux razzias du Dahomey.',
    relatedAction: { type: 'explorer', label: 'Découvrir la cité lacustre' },
  },
  {
    id: 'photo-2',
    title: 'Porte du Non-Retour - Ouidah',
    location: 'Plage de Ouidah',
    department: 'Atlantique',
    category: 'Patrimoine',
    url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    description: 'Mémorial sacré érigé par l\'UNESCO marquant le lieu d\'embarquement des captifs sur la Route des Esclaves vers le Nouveau Monde.',
    relatedAction: { type: 'guides', label: 'Réserver un guide mémoire' },
  },
  {
    id: 'photo-3',
    title: 'Tisseuse de Tissu Kanvo Traditionnel',
    location: 'Atelier Royal, Abomey',
    department: 'Zou',
    category: 'Artisanat',
    url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80',
    description: 'Technique séculaire de tissage du Pagne Tissé (Kanvo) autrefois réservé aux rois du Dahomey, tissé fil à fil sur métier de bois.',
    relatedAction: { type: 'artisans', label: 'Acheter du vrai Kanvo' },
  },
  {
    id: 'photo-4',
    title: 'Château-Fort Tata Somba',
    location: 'Boukoumbé, Pays Somba',
    department: 'Atacora',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    description: 'Architecture fortifiée à deux niveaux construite en terre crue et paille par le peuple Otammari pour la défense ancestrale.',
    relatedAction: { type: 'explorer', label: 'Explorer le Pays Somba' },
  },
  {
    id: 'photo-5',
    title: 'Éléphants du Parc National de la Pendjari',
    location: 'Réserve de Biosphère, Tanguiéta',
    department: 'Atacora',
    category: 'Nature & Safari',
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    description: "L'un des derniers refuges de grands mammifères sauvages (éléphants, lions, buffles, hippo) en Afrique de l'Ouest.",
    relatedAction: { type: 'reservations', label: 'Réserver un Safari Eco-Lodge' },
  },
  {
    id: 'photo-6',
    title: 'Célébration des Vodun Days',
    location: 'Ouidah & Cotonou',
    department: 'Atlantique',
    category: 'Culture & Vaudou',
    url: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=1200&q=80',
    description: 'Fête nationale annuelle des cultures endogènes et de la spiritualité vaudou rassemblant des adeptes du monde entier.',
    relatedAction: { type: 'reservations', label: 'Pass Vodun Days 2026' },
  },
  {
    id: 'photo-7',
    title: 'Palais Royaux d\'Abomey',
    location: 'Abomey, Zou',
    department: 'Zou',
    category: 'Patrimoine',
    url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    description: 'Ensemble de palais en terre construits par les 12 rois du royaume du Dahomey entre 1625 et 1900, classés au patrimoine mondial de l\'UNESCO.',
    relatedAction: { type: 'explorer', label: 'Explorer le Royaume d\'Abomey' },
  },
  {
    id: 'photo-8',
    title: 'Masque Guèlèdè Sacré',
    location: 'Kétou & Sakété',
    department: 'Plateau',
    category: 'Culture & Vaudou',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    description: 'Patrimoine Immatériel de l\'UNESCO honorant le pouvoir spirituel des mères ancestrales à travers danses et masques sculptés.',
    relatedAction: { type: 'artisans', label: 'Ateliers de sculpture' },
  }
];

interface GalleryModalProps {
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
  onAction?: (type: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  initialIndex = 0,
  onClose,
  onAction,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const photo = BENIN_CULTURAL_PHOTOS[currentIndex] || BENIN_CULTURAL_PHOTOS[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? BENIN_CULTURAL_PHOTOS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === BENIN_CULTURAL_PHOTOS.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-2xl">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2.5 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full transition-all border border-white/20 shadow-lg"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main photo viewer container */}
      <div className="relative w-full max-w-5xl bg-slate-900/95 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Left / Top: Photo area */}
        <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full object-cover max-h-[70vh] md:max-h-[85vh]"
            onError={handleImageError}
          />

          {/* Nav arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/70 text-white rounded-full hover:bg-amber-500 hover:text-slate-950 transition-all border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/70 text-white rounded-full hover:bg-amber-500 hover:text-slate-950 transition-all border border-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter pill */}
          <div className="absolute bottom-3 left-4 px-3 py-1 bg-slate-950/80 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 backdrop-blur-md">
            {currentIndex + 1} / {BENIN_CULTURAL_PHOTOS.length}
          </div>
        </div>

        {/* Right / Bottom: Photo Details */}
        <div className="p-6 md:w-2/5 flex flex-col justify-between overflow-y-auto bg-slate-900 text-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {photo.category}
              </span>
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                title="Partager cette photo"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-2xl font-black font-serif text-amber-100 leading-tight">
              {photo.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{photo.location} ({photo.department})</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              {photo.description}
            </p>
          </div>

          <div className="pt-6 space-y-3 border-t border-slate-800 mt-6">
            {photo.relatedAction && (
              <button
                onClick={() => {
                  onClose();
                  if (onAction && photo.relatedAction) {
                    onAction(photo.relatedAction.type);
                  }
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:from-amber-400 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Compass className="w-4 h-4" />
                <span>{photo.relatedAction.label}</span>
              </button>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Crédit photo : AfroKu Benin Media</span>
              <span>République du Bénin 🇧🇯</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
