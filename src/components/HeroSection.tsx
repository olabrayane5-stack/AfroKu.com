import React, { useRef, useState, useEffect } from 'react';
import { SearchParams } from '../types';
import { Compass, MapPin, Ticket, Users, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { handleImageError } from './SafeImage';
import pendjariSafariImg from '../assets/images/pendjari_safari_ecotourism_1785869379769.jpg';
import abomeyRoyalImg from '../assets/images/abomey_royal_dynasty_1785869286421.jpg';
import nonvitchaImg from '../assets/images/nonvitcha_grand_popo_1785869274690.jpg';
import feteGaaniImg from '../assets/images/fete_gaani_nikki_1785868950097.jpg';
import heritageMuseumImg from '../assets/images/heritage_museum_portonovo_1785869390968.jpg';
import festivalGanvieImg from '../assets/images/festival_ganvie_lake_1785868966232.jpg';

interface HeroSectionProps {
  onSearch: (params: SearchParams) => void;
  onExploreClick?: () => void;
}

const CAROUSEL_DESTINATIONS = [
  {
    id: 'abomey',
    title: 'Palais Royaux',
    name: 'Palais Royaux d\'Abomey',
    department: 'ZOU',
    image: abomeyRoyalImg,
    target: 'Abomey',
  },
  {
    id: 'ouidah',
    title: 'Porte du Non-Retour',
    name: 'Mémorial de Ouidah',
    department: 'ATLANTIQUE',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80',
    target: 'Ouidah',
  },
  {
    id: 'pendjari',
    title: 'Safari Pendjari',
    name: 'Parc de la Pendjari',
    department: 'ATACORA',
    image: pendjariSafariImg,
    target: 'Pendjari',
  },
  {
    id: 'ganvie',
    title: 'Cité Lacustre Ganvié',
    name: 'Ganvié sur Pilotis',
    department: 'ATLANTIQUE',
    image: festivalGanvieImg,
    target: 'Ganvié',
  },
  {
    id: 'boukoumbe',
    title: 'Tatas Somba',
    name: 'Châteaux Tatas Somba',
    department: 'ATACORA',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    target: 'Natitingou',
  },
  {
    id: 'nikki',
    title: 'Cavalerie Royale',
    name: 'Fête de la Gaani',
    department: 'BORGOU',
    image: feteGaaniImg,
    target: 'Nikki',
  },
  {
    id: 'portonovo',
    title: 'Musée Honmè',
    name: 'Musée Honmè & Mosquée',
    department: 'OUÉMÉ',
    image: heritageMuseumImg,
    target: 'Porto-Novo',
  },
  {
    id: 'grandpopo',
    title: 'Plages & Mangroves',
    name: 'Bouche du Roy',
    department: 'MONO',
    image: nonvitchaImg,
    target: 'Grand-Popo',
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Triple items for continuous carousel scrolling
  const carouselItems = [...CAROUSEL_DESTINATIONS, ...CAROUSEL_DESTINATIONS, ...CAROUSEL_DESTINATIONS];

  // Auto-scroll animation ticker
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.85;

    const tick = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        setScrollPos(el.scrollLeft);

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

  const handleCardClick = (target: string) => {
    onSearch({
      destination: target,
      startDate: '',
      endDate: '',
      adults: 2,
      children: 0,
      rooms: 1,
    });
  };

  const WHAT_WE_DO = [
    {
      icon: Compass,
      title: "Exploration Culturelle",
      desc: "Découvrez les 12 départements, sites sacrés, palais et parcs naturels de A à Z.",
    },
    {
      icon: Users,
      title: "Guides Locaux Certifiés",
      desc: "Réservez des accompagnateurs natifs bilingues pour une immersion authentique et humaine.",
    },
    {
      icon: Ticket,
      title: "Séjours & Billetterie",
      desc: "Accédez aux festivals majeurs (Vodun Days, Gaani) et hébergements de charme.",
    },
    {
      icon: ShoppingBag,
      title: "Artisans & Créateurs",
      desc: "Soutenez l'économie locale avec l'artisanat royal, tissages Kanvo et poteries de Sè.",
    },
  ];

  return (
    <section className="relative overflow-hidden flex flex-col justify-between bg-[#FAF7F2] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-6 pb-12 sm:pb-16 md:pb-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Background African Heritage Wallpaper & Luminous Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base layer */}
        <div className="absolute inset-0 bg-[#FAF7F2] dark:bg-slate-950" />

        {/* First Image (AfroKu Mask & Heritage Wallpaper) inside Hero Container */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20 dark:opacity-15 mix-blend-multiply dark:mix-blend-overlay"
          style={{ backgroundImage: "url('/afroku_hero_bg.jpg')" }}
        />

        {/* Soft Contrast & Warm Tone Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/60 via-transparent to-[#FAF7F2]/80 dark:from-slate-950/70 dark:via-transparent dark:to-slate-950/80" />
      </div>

      {/* TOP CURVED ROUNDED PHOTO CAROUSEL ANIMATION */}
      <div className="relative z-10 w-full overflow-hidden mb-8 sm:mb-12" style={{ perspective: '1200px' }}>
        {/* Soft Blurred Edge Masks (Left and Right Fade) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 md:w-48 bg-gradient-to-r from-[#FAF7F2] dark:from-slate-950 via-[#FAF7F2]/80 dark:via-slate-950/80 to-transparent z-20 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 md:w-48 bg-gradient-to-l from-[#FAF7F2] dark:from-slate-950 via-[#FAF7F2]/80 dark:via-slate-950/80 to-transparent z-20 backdrop-blur-[2px]" />

        {/* Scrollable Track with 3D Arch Tilt */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 sm:gap-6 md:gap-7 overflow-x-auto py-6 px-8 sm:px-16 scrollbar-none select-none cursor-grab active:cursor-grabbing items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {carouselItems.map((item, index) => {
            const cardWidth = 280;
            const cardCenter = index * (cardWidth + 24) + cardWidth / 2;
            const containerCenter = scrollPos + (typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
            const distFromCenter = cardCenter - containerCenter;
            const normalizedDist = Math.max(-1, Math.min(1, distFromCenter / 900));

            const rotateZ = normalizedDist * 4;
            const rotateY = -normalizedDist * 8;
            const translateY = Math.abs(normalizedDist) * 12;

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleCardClick(item.target)}
                style={{
                  transform: `translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
                }}
                className="group relative shrink-0 w-[240px] sm:w-[270px] md:w-[290px] h-[165px] sm:h-[190px] md:h-[205px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-[3px] border-white/90 hover:border-amber-400 transition-all duration-300 cursor-pointer bg-slate-900"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 group-hover:from-black/75 transition-colors" />

                {/* Top Badge on Hover */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/95 backdrop-blur-md text-slate-950 px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                    <MapPin className="w-3 h-3" />
                    <span>{item.department}</span>
                  </span>
                </div>

                {/* Bottom Pill Badge */}
                <div className="absolute bottom-3.5 left-0 right-0 flex justify-center px-3 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl backdrop-blur-xl border border-white/25 shadow-xl transition-all duration-300 bg-black/60 group-hover:bg-amber-400 group-hover:text-slate-950 text-white">
                    <span className="text-xs sm:text-sm font-black tracking-tight whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col items-center w-full">
        {/* Prestige Welcome Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/95 dark:bg-blue-950/80 backdrop-blur-md border border-blue-200/80 dark:border-blue-700/60 text-[#1D4ED8] dark:text-blue-300 text-xs sm:text-sm font-black tracking-wider uppercase mb-6 shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-amber-400 animate-pulse" />
          <span>BIENVENUE SUR AFROKU • LA RÉFÉRENCE TOURISME & CULTURE AU BÉNIN</span>
        </div>

        {/* Headline matching image typography and colors */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08] mb-6 max-w-6xl">
          <span>Revivez l'histoire. </span>
          <span className="font-serif italic font-semibold text-[#1D4ED8] dark:text-amber-400 inline-block drop-shadow-xs sm:ml-2">
            Rencontrez l'humain.
          </span>
        </h1>

        {/* Mission Statement: What the site does - enlarged and wider */}
        <p className="max-w-5xl text-slate-600 dark:text-slate-300 text-base sm:text-xl md:text-2xl font-medium leading-relaxed mb-10 sm:mb-12">
          AfroKu connecte les voyageurs passionnés aux merveilles du Bénin : réservez des guides locaux certifiés, découvrez le patrimoine des 12 départements, planifiez vos séjours et soutenez les créateurs locaux.
        </p>

        {/* 4 Feature Columns: "Ce que fait AfroKu" with warm ocre icon boxes and refined typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full max-w-7xl mb-10 text-left">
          {WHAT_WE_DO.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white/85 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 dark:hover:border-amber-400 p-6 sm:p-7 rounded-3xl transition-all duration-300 transform hover:-translate-y-1.5 shadow-sm hover:shadow-xl group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400 flex items-center justify-center mb-4 shadow-xs transition-all duration-300">
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-slate-900 dark:text-white group-hover:text-amber-900 dark:group-hover:text-amber-300 font-bold text-lg sm:text-xl mb-2 font-serif transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
