import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Compass } from 'lucide-react';
import { handleImageError } from './SafeImage';
import { SearchParams } from '../types';

import pendjariSafariImg from '../assets/images/pendjari_safari_ecotourism_1785869379769.jpg';
import abomeyRoyalImg from '../assets/images/abomey_royal_dynasty_1785869286421.jpg';
import nonvitchaImg from '../assets/images/nonvitcha_grand_popo_1785869274690.jpg';
import feteGaaniImg from '../assets/images/fete_gaani_nikki_1785868950097.jpg';
import heritageMuseumImg from '../assets/images/heritage_museum_portonovo_1785869390968.jpg';
import festivalGanvieImg from '../assets/images/festival_ganvie_lake_1785868966232.jpg';

export interface DestinationCardItem {
  id: string;
  title: string;
  department: string;
  category: string;
  image: string;
  target: string;
  desc: string;
}

export const DESTINATION_CARDS: DestinationCardItem[] = [
  {
    id: 'dest-1',
    title: 'Safari Pendjari',
    department: 'Atacora',
    category: 'Safari & Faune Sauvage',
    image: pendjariSafariImg,
    target: 'Pendjari',
    desc: 'Rencontre avec les éléphants, lions et paysages grandioses au cœur du Parc National de la Pendjari.',
  },
  {
    id: 'dest-2',
    title: 'Palais Royaux',
    department: 'Zou (Abomey)',
    category: 'Histoire & Dynasties',
    image: abomeyRoyalImg,
    target: 'Abomey',
    desc: 'Haut lieu de l\'épopée des Rois du Dahomey, trônes sacrés et bas-reliefs classés UNESCO.',
  },
  {
    id: 'dest-3',
    title: 'Plages & Mangroves',
    department: 'Mono (Grand-Popo)',
    category: 'Lagune & Écotourisme',
    image: nonvitchaImg,
    target: 'Grand-Popo',
    desc: 'La Bouche du Roy, cocotiers sauvages, balades en pirogue et sérénité au bord de l\'océan.',
  },
  {
    id: 'dest-4',
    title: 'Cavalerie Royale',
    department: 'Borgou (Nikki)',
    category: 'Fêtes & Traditions',
    image: feteGaaniImg,
    target: 'Nikki',
    desc: 'Grande fête de la Gaani, défilé des cavaliers princiers et tambours sacrés de la dynastie Baatombu.',
  },
  {
    id: 'dest-5',
    title: 'Musée Honmè',
    department: 'Ouémé (Porto-Novo)',
    category: 'Architecture & Patrimoine',
    image: heritageMuseumImg,
    target: 'Porto-Novo',
    desc: 'Ancien palais royal du Roi Toffa et remarquable architecture coloniale afro-brésilienne.',
  },
  {
    id: 'dest-6',
    title: 'Cité Lacustre Ganvié',
    department: 'Atlantique',
    category: 'Patrimoine Vivant',
    image: festivalGanvieImg,
    target: 'Ganvié',
    desc: 'La Venise africaine bâtie entièrement sur pilotis au cœur du lac Nokoué.',
  },
  {
    id: 'dest-7',
    title: 'Porte du Non-Retour',
    department: 'Atlantique (Ouidah)',
    category: 'Mémoire & Vodoun',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    target: 'Ouidah',
    desc: 'Mémorial sacré de la Route des Esclaves et haut lieu de la spiritualité Vodoun.',
  },
  {
    id: 'dest-8',
    title: 'Tatas Somba',
    department: 'Atacora (Boukoumbé)',
    category: 'Architecture Traditionnelle',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    target: 'Natitingou',
    desc: 'Châteaux-forts miniatures en terre crue et paille au pied de la chaîne de l\'Atacora.',
  },
];

interface DestinationCarouselProps {
  onSearch: (params: SearchParams) => void;
}

export const DestinationCarousel: React.FC<DestinationCarouselProps> = ({ onSearch }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCard, setActiveCard] = useState<DestinationCardItem | null>(null);

  // Duplicated list for seamless marquee scrolling effect
  const carouselItems = [...DESTINATION_CARDS, ...DESTINATION_CARDS, ...DESTINATION_CARDS];

  // Auto-scroll animation effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.75; // Smooth slow scroll

    const step = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed;
        // Seamless infinite loop check
        if (container.scrollLeft >= (container.scrollWidth / 3) * 2) {
          container.scrollLeft = container.scrollWidth / 3;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCardClick = (item: DestinationCardItem) => {
    setActiveCard(item);
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
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background Soft Glow & Savanna Tint */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/70 via-[#FAF7F2] to-amber-50/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-80 bg-gradient-to-r from-amber-200/20 via-orange-200/25 to-blue-200/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section matching Image 2 typography */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-400/30 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Destinations Incontournables</span>
          </div>

          {/* Headline pairing Photo 2 style: Serif Bold + Electric Blue Script/Italic */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 font-serif tracking-tight leading-tight">
            <span>Explorez des Lieux </span>
            <span className="block sm:inline font-serif italic font-semibold text-[#1D4ED8] sm:ml-2 drop-shadow-xs">
              Qui Valent le Voyage
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            Laissez-vous transporter par la diversité des paysages, des palais royaux séculaires aux réserves sauvages du nord du Bénin.
          </p>

          {/* Quick Destination Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-3xl mx-auto">
            {[
              { label: '🐘 Safari Pendjari', target: 'Pendjari' },
              { label: '👑 Palais Abomey', target: 'Abomey' },
              { label: '🌊 Ouidah & Vodoun', target: 'Ouidah' },
              { label: '🛶 Ganvié Lacustre', target: 'Ganvié' },
              { label: '🌴 Grand-Popo Plages', target: 'Grand-Popo' },
              { label: '🏰 Tatas Somba', target: 'Natitingou' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSearch({ destination: chip.target, startDate: '', endDate: '', adults: 2, children: 0, rooms: 1 })}
                className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-amber-400 hover:text-slate-950 text-slate-800 text-xs font-bold border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-blue-700 border border-slate-200 shadow-md hover:shadow-lg transition-all transform hover:-translate-x-0.5 active:scale-95 cursor-pointer"
              title="Faire défiler vers la gauche"
              aria-label="Défiler à gauche"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider px-2">
              {isPaused ? 'Défilement en pause' : 'Défilement continu • Cliquez pour explorer'}
            </span>

            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-blue-700 border border-slate-200 shadow-md hover:shadow-lg transition-all transform hover:translate-x-0.5 active:scale-95 cursor-pointer"
              title="Faire défiler vers la droite"
              aria-label="Défiler à droite"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrolling Carousel Strip matching Photo 1 */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 sm:gap-6 overflow-x-auto py-4 px-2 scrollbar-none select-none scroll-smooth cursor-grab active:cursor-grabbing"
          style={{ scrollSnapType: 'none' }}
        >
          {carouselItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => handleCardClick(item)}
              className="group relative shrink-0 w-[240px] sm:w-[280px] md:w-[310px] h-[165px] sm:h-[190px] md:h-[210px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-white/90 hover:border-amber-400/90 transition-all duration-500 transform hover:-translate-y-1.5 cursor-pointer bg-slate-900"
            >
              {/* Photo */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover group-hover:scale-108 group-hover:brightness-105 transition-transform duration-700 ease-out"
              />

              {/* Gentle Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-colors duration-300" />

              {/* Top Department Chip on Hover */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-950" />
                  <span>{item.department}</span>
                </span>
              </div>

              {/* Bottom Pill Badge - Exact match with User's Photo 1 */}
              <div className="absolute bottom-3.5 left-0 right-0 flex justify-center px-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black/65 group-hover:bg-amber-400 group-hover:text-slate-950 backdrop-blur-md border border-white/20 group-hover:border-amber-300 shadow-xl transition-all duration-300">
                  <span className="text-xs sm:text-sm font-black text-white group-hover:text-slate-950 tracking-tight whitespace-nowrap">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
