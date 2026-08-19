import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { handleImageError } from './SafeImage';
import { SearchParams } from '../types';

import pendjariSafariImg from '../assets/images/pendjari_safari_ecotourism_1785869379769.jpg';
import abomeyRoyalImg from '../assets/images/abomey_royal_dynasty_1785869286421.jpg';
import nonvitchaImg from '../assets/images/nonvitcha_grand_popo_1785869274690.jpg';
import feteGaaniImg from '../assets/images/fete_gaani_nikki_1785868950097.jpg';
import heritageMuseumImg from '../assets/images/heritage_museum_portonovo_1785869390968.jpg';
import festivalGanvieImg from '../assets/images/festival_ganvie_lake_1785868966232.jpg';

export interface CurvedCarouselCard {
  id: string;
  title: string;
  department: string;
  category: string;
  image: string;
  target: string;
  description: string;
}

export const CURVED_CAROUSEL_ITEMS: CurvedCarouselCard[] = [
  {
    id: 'curve-1',
    title: 'Safari Pendjari',
    department: 'Atacora',
    category: 'Safari & Faune Sauvage',
    image: pendjariSafariImg,
    target: 'Pendjari',
    description: 'Parc National de la Pendjari, éléphants et savane préservée.',
  },
  {
    id: 'curve-2',
    title: 'Palais Royaux',
    department: 'Zou (Abomey)',
    category: 'Patrimoine & Histoire',
    image: abomeyRoyalImg,
    target: 'Abomey',
    description: 'Palais des Rois du Dahomey, trônes sacrés et bas-reliefs UNESCO.',
  },
  {
    id: 'curve-3',
    title: 'Plages & Mangroves',
    department: 'Mono (Grand-Popo)',
    category: 'Lagune & Écotourisme',
    image: nonvitchaImg,
    target: 'Grand-Popo',
    description: 'La Bouche du Roy, cocotiers sauvages et balades en pirogue.',
  },
  {
    id: 'curve-4',
    title: 'Cavalerie Royale',
    department: 'Borgou (Nikki)',
    category: 'Traditions & Fêtes',
    image: feteGaaniImg,
    target: 'Nikki',
    description: 'Fête de la Gaani et cavaliers impériaux de Nikki.',
  },
  {
    id: 'curve-5',
    title: 'Musée Honmè',
    department: 'Ouémé (Porto-Novo)',
    category: 'Architecture & Dynastie',
    image: heritageMuseumImg,
    target: 'Porto-Novo',
    description: 'Palais du Roi Toffa et patrimoine afro-brésilien.',
  },
  {
    id: 'curve-6',
    title: 'Cité Lacustre Ganvié',
    department: 'Atlantique',
    category: 'Cité Lacustre',
    image: festivalGanvieImg,
    target: 'Ganvié',
    description: 'Maisons sur pilotis au cœur du lac Nokoué.',
  },
  {
    id: 'curve-7',
    title: 'Porte du Non-Retour',
    department: 'Atlantique (Ouidah)',
    category: 'Mémoire & Spiritualité',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    target: 'Ouidah',
    description: 'Mémorial international de la Route des Esclaves.',
  },
  {
    id: 'curve-8',
    title: 'Tatas Somba',
    department: 'Atacora (Boukoumbé)',
    category: 'Architecture Otammari',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    target: 'Natitingou',
    description: 'Châteaux-forts en terre crue au pied de l\'Atacora.',
  },
];

interface CurvedPhotoCarouselProps {
  onSearch: (params: SearchParams) => void;
}

export const CurvedPhotoCarousel: React.FC<CurvedPhotoCarouselProps> = ({ onSearch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Triple the array for seamless infinite looping
  const items = [...CURVED_CAROUSEL_ITEMS, ...CURVED_CAROUSEL_ITEMS, ...CURVED_CAROUSEL_ITEMS];

  // Automatic smooth scrolling ticker
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.85;

    const tick = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        setScrollPos(el.scrollLeft);

        // Infinite loop reset
        const thirdWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= thirdWidth * 2) {
          el.scrollLeft = thirdWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft = thirdWidth;
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const amount = 340;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleCardSelect = (item: CurvedCarouselCard) => {
    onSearch({
      destination: item.target,
      startDate: '',
      endDate: '',
      adults: 2,
      children: 0,
      rooms: 1,
    });
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#FAFAF7] via-[#F4EDE2] to-[#FAF7F2] pt-6 sm:pt-8 pb-10 sm:pb-14 overflow-hidden border-b border-amber-900/10">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-400/15 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-950 border border-amber-400/40 text-xs font-black uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Panorama Visuel du Bénin</span>
        </div>
      </div>

      {/* Curved Perspective Carousel Track */}
      <div className="relative w-full py-4 overflow-hidden" style={{ perspective: '1200px' }}>
        {/* Left / Right Nav Arrows Overlay */}
        <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => handleManualScroll('left')}
            className="p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-blue-700 shadow-xl border border-slate-200 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => handleManualScroll('right')}
            className="p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-blue-700 shadow-xl border border-slate-200 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container with Smooth Curved Card Tilt Effect */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 sm:gap-6 md:gap-7 overflow-x-auto py-8 px-8 sm:px-16 scrollbar-none select-none cursor-grab active:cursor-grabbing items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            // Calculate a subtle curved tilt based on card index and scroll position
            const cardWidth = 280;
            const cardCenter = index * (cardWidth + 24) + cardWidth / 2;
            const containerCenter = scrollPos + (typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
            const distFromCenter = cardCenter - containerCenter;
            const normalizedDist = Math.max(-1, Math.min(1, distFromCenter / 900));

            // Curvature: card lifts slightly in center, tilts on sides (arch effect from reference image)
            const rotateZ = normalizedDist * 4; // subtle z tilt in degrees
            const rotateY = -normalizedDist * 8; // 3D yaw
            const translateY = Math.abs(normalizedDist) * 12; // curve downward on outer edges

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleCardSelect(item)}
                style={{
                  transform: `translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
                }}
                className="group relative shrink-0 w-[240px] sm:w-[270px] md:w-[290px] h-[170px] sm:h-[195px] md:h-[210px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border-[3px] border-white/90 hover:border-amber-400 transition-all duration-300 cursor-pointer bg-slate-900"
              >
                {/* Photo with fallback safety */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Ambient Soft Top Glass Highlight & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:from-black/75 transition-colors" />

                {/* Subtle Department Tag on Hover */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{item.department}</span>
                  </span>
                </div>

                {/* Centered Pill Badge - Exact match to user's photo */}
                <div className="absolute bottom-3.5 left-0 right-0 flex justify-center px-3 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black/70 group-hover:bg-amber-400 group-hover:text-slate-950 backdrop-blur-md border border-white/20 group-hover:border-amber-300 shadow-xl transition-all duration-300">
                    <span className="text-xs sm:text-sm font-black text-white group-hover:text-slate-950 tracking-tight whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
