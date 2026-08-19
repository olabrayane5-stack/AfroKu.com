import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { handleImageError } from './SafeImage';
import { SearchParams } from '../types';

import pendjariSafariImg from '../assets/images/pendjari_safari_ecotourism_1785869379769.jpg';
import abomeyRoyalImg from '../assets/images/abomey_royal_dynasty_1785869286421.jpg';
import nonvitchaImg from '../assets/images/nonvitcha_grand_popo_1785869274690.jpg';
import feteGaaniImg from '../assets/images/fete_gaani_nikki_1785868950097.jpg';
import heritageMuseumImg from '../assets/images/heritage_museum_portonovo_1785869390968.jpg';
import festivalGanvieImg from '../assets/images/festival_ganvie_lake_1785868966232.jpg';

export interface DestinationSpot {
  id: string;
  title: string;
  name: string;
  department: string;
  location: string;
  category: string;
  unesco: boolean;
  image: string;
  target: string;
  inscriptionText: string;
  guideNarrative: string;
  visualHighlights: string[];
  bestSeason: string;
}

export const DESTINATIONS_DATA: DestinationSpot[] = [
  {
    id: 'abomey',
    title: 'Palais Royaux',
    name: 'Palais Royaux d\'Abomey & Bas-Reliefs',
    department: 'ZOU (ABOMEY)',
    location: 'Cité historique du Danxomé, Plateau d\'Abomey',
    category: 'PATRIMOINE IMPÉRIAL & TRÔNES SACRÉS',
    unesco: true,
    image: abomeyRoyalImg,
    target: 'Abomey',
    inscriptionText: '« Si tous les enfants du pays venaient de leurs mains assemblées boucher les trous de la jarre percée, le pays serait sauvé. » — Devise gravée du Roi Ghézo (1818-1858) au fronton de la cour royale d\'Abomey.',
    guideNarrative: 'Votre guide natif vous contera l\'épopée des 12 souverains du Danxomé, la bravoure légendaire des Agoodjié (le régiment d\'élite féminin des Amazones), ainsi que les techniques ancestrales de construction en terre argileuse mélangée à de la sève végétale.',
    visualHighlights: [
      'Trônes royaux sculptés dans un seul bloc de bois d\'iroko',
      'Bas-reliefs polychromes classés au Patrimoine Mondial de l\'UNESCO',
      'Sépultures sacrées des rois Glèlè et Béhanzin',
      'Tentures appliquées traditionnelles décrivant les symboles dynastiques'
    ],
    bestSeason: 'Toute l\'année (festivals culturels en décembre et janvier)'
  },
  {
    id: 'ouidah',
    title: 'Porte du Non-Retour',
    name: 'Porte du Non-Retour & Mémorial de Ouidah',
    department: 'ATLANTIQUE (OUIDAH)',
    location: 'Plage de Djègbadji & Centre Spirituel de Ouidah',
    category: 'MÉMORIAL HISTORIQUE & SPIRITUALITÉ VODOUN',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80',
    target: 'Ouidah',
    inscriptionText: '« En ce lieu où des millions d\'êtres humains furent arrachés à leur terre natale, la mémoire demeure vivante pour que jamais ne s\'éteigne la flamme de la fraternité humaine et du pardon. » — Mémorial international de l\'UNESCO.',
    guideNarrative: 'En parcourant la Route des Esclaves, votre guide vous fera marquer un arrêt sous l\'Arbre de l\'Oubli avant de contempler l\'arche monumentale qui fait face à l\'immensité de l\'Atlantique, symbole universel de résilience et de réconciliation.',
    visualHighlights: [
      'L\'Arche monumentale ornée de bas-reliefs et bronzes sculptés',
      'Le Temple des Pythons sacrés au cœur de la ville',
      'La Forêt Sacrée de Kpassè et ses arbres centenaires déifiés',
      'Le Musée International du Vodoun et de la Mémoire'
    ],
    bestSeason: 'Novembre à Mars (particulièrement le 10 Janvier pour les Vodun Days)'
  },
  {
    id: 'pendjari',
    title: 'Safari Pendjari',
    name: 'Parc National de la Pendjari & Grande Faune',
    department: 'ATACORA (BATIA / PENDJARI)',
    location: 'Massif de l\'Atacora, Réserve de Biosphère W-Arly-Pendjari',
    category: 'SAFARI SAUVAGE & GRANDE FAUNE AFRICAINE',
    unesco: true,
    image: pendjariSafariImg,
    target: 'Pendjari',
    inscriptionText: '« Réserve de Biosphère UNESCO : Dernier grand refuge intact de la mégafaune d\'Afrique de l\'Ouest. Sanctuaire vital pour les éléphants, les lions d\'Afrique de l\'Ouest, les guépards et les cobes de Buffon. » — Stèle d\'accueil du Parc National.',
    guideNarrative: 'Dès l\'aube, votre pisteur émérite vous emmène le long de la mare Bali où les troupeaux d\'éléphants viennent s\'abreuver. Il vous apprendra à lire les empreintes de félins et à reconnaître les chants des 460 espèces d\'oiseaux de la savane.',
    visualHighlights: [
      'Troupeaux d\'éléphants d\'Afrique et hippopotames dans les mares naturelles',
      'Lions d\'Afrique de l\'Ouest et antilopes rares (Bubale majeur, Hippotrague)',
      'Cascades naturelles de Tanougou et baignade dans les vasques cristallines',
      'Éco-lodges intégrés avec vue panoramique sur les falaises de l\'Atacora'
    ],
    bestSeason: 'Décembre à Mai (période sèche idéale pour observer les grands animaux)'
  },
  {
    id: 'ganvie',
    title: 'Cité Lacustre Ganvié',
    name: 'Cité Lacustre de Ganvié & Marché Flottant',
    department: 'ATLANTIQUE (GANVIÉ)',
    location: 'Lac Nokoué, Cité bâtie entièrement sur pilotis',
    category: 'PATRIMOINE VIVANT & VIE LACUSTRE',
    unesco: true,
    image: festivalGanvieImg,
    target: 'Ganvié',
    inscriptionText: '« Gan-vié : "Nous avons trouvé la paix, la collectivité est sauvée." Cité refuge édifiée sur l\'eau au XVIIIe siècle pour échapper aux razzias dahoméennes. » — Guide historique de la Commune d\'Abomey-Calavi.',
    guideNarrative: 'Glissant silencieusement en pirogue à perche, vous découvrirez comment plus de 30 000 habitants vivent en harmonie totale avec le lac depuis trois siècles, avec leurs écoles sur pilotis, leur marché flottant et les branchages de pêche traditionnels « Acadjas ».',
    visualHighlights: [
      'Maisons traditionnelles en bambou sur pilotis sur fond d\'eau étincelante',
      'Marché flottant matinal animé par les commerçantes en pirogues colorées',
      'Système séculaire de pêche écologique par branchages Acadjas',
      'Artisanat lacustre et filets confectionnés à la main'
    ],
    bestSeason: 'Toute l\'année (lumière magique au lever et au coucher du soleil)'
  },
  {
    id: 'boukoumbe',
    title: 'Tatas Somba',
    name: 'Châteaux Tatas Somba de Boukoumbé',
    department: 'ATACORA (BOUKOUMBÉ)',
    location: 'Pays Bétammaribé, Vallée de Koussoukoingou',
    category: 'ARCHITECTURE TRADITIONNELLE FORTIFIÉE',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    target: 'Natitingou',
    inscriptionText: '« Koutammakou, le pays des Batammariba : Paysage culturel d\'architecture en terre vivante où chaque château Tata incarne l\'harmonie entre l\'esprit des ancêtres, la famille et la montagne. » — Déclaration UNESCO.',
    guideNarrative: 'Votre guide Somba vous fera monter par l\'échelle en tronc sculpté jusqu\'à l\'étage supérieur où sèchent le mil et le sorgho à ciel ouvert, vous dévoilant les secrets de protection spirituelle et de défense de ces forteresses miniatures en terre glaise.',
    visualHighlights: [
      'Forteresses miniatures en terre crue et tourelles à toits de paille coniques',
      'Greniers à céréales sacrés intégrés dans la structure du château',
      'Fresques géométriques traditionnelles gravées à la main sur les façades',
      'Randonnées panoramiques le long des crêtes rocheuses de l\'Atacora'
    ],
    bestSeason: 'Octobre à Avril (climat doux et récoltes traditionnelles)'
  },
  {
    id: 'nikki',
    title: 'Cavalerie Royale',
    name: 'Cavalerie Royale & Cité Impériale de Nikki',
    department: 'BORGOU (NIKKI)',
    location: 'Cour Impériale des Baatombu (Bariba)',
    category: 'DYNASTIE ROYALE & CAVALERIE SACRÉE',
    unesco: false,
    image: feteGaaniImg,
    target: 'Nikki',
    inscriptionText: '« Cour Impériale de Nikki : Capitale historique de l\'Empire des Bariba, fondée par Sunon Séro. Foyer de la Gaani, fête séculaire de la vaillance équestre, de l\'allégeance et de la paix. » — Mémorial du Palais de l\'Empereur.',
    guideNarrative: 'Le griot de la cour vous expliquera le rôle des trompes géantes Kakaki et des tambours sacrés de la Gaani, tout en assistant au spectacle envoûtant des cavaliers princiers vêtus de tuniques brodées d\'or effectuant des prouesses équestres devant le trône impérial.',
    visualHighlights: [
      'Palais royal de l\'Empereur Sinaboko et sa cour d\'audience traditionnelle',
      'Parade équestre des cavaliers aux caparaçons richement décorés',
      'Musée de la civilisation Bariba et armes d\'apparat historiques',
      'Trompes impériales en cuivre Kakaki résonnant lors des réjouissances'
    ],
    bestSeason: 'Période de la Fête de la Gaani et Novembre à Février'
  },
  {
    id: 'portonovo',
    title: 'Musée Honmè',
    name: 'Musée Honmè & Mosquée Afro-Brésilienne',
    department: 'OUÉMÉ (PORTO-NOVO)',
    location: 'Capitale historique & Quartier Djassin',
    category: 'ARCHITECTURE COLONIALE & HISTOIRE ROYALE',
    unesco: false,
    image: heritageMuseumImg,
    target: 'Porto-Novo',
    inscriptionText: '« Musée Honmè : Ancien palais des Rois d\'Adjatchè (Hogbonou). Résidence du Roi Toffa Ier, gardienne des insignes royaux, des autels d\'ancêtres et des traités historiques du XIXe siècle. » — Plaque du Ministère de la Culture.',
    guideNarrative: 'En sillonnant les ruelles pavées de Porto-Novo, votre guide vous racontera l\'épopée des Agoudas — anciens esclaves affranchis revenus du Brésil qui ont conçu la Grande Mosquée aux allures d\'église baroque de Salvador de Bahia.',
    visualHighlights: [
      'La Grande Mosquée à l\'architecture baroque afro-brésilienne polychrome',
      'Les cours intérieures du Palais Honmè et les cloches royales sacrées',
      'Le Jardin des Plantes et de la Nature (JPN) aux arbres médicinaux séculaires',
      'Le Musée Ethnographique Alexandre Sènou Adandé'
    ],
    bestSeason: 'Toute l\'année'
  },
  {
    id: 'grandpopo',
    title: 'Plages & Mangroves',
    name: 'La Bouche du Roy & Lagunes de Grand-Popo',
    department: 'MONO (GRAND-POPO)',
    location: 'Embouchure du fleuve Mono & Île de Sel',
    category: 'LAGUNE PRÉSERVÉE & PLAGES SAUVAGES',
    unesco: false,
    image: nonvitchaImg,
    target: 'Grand-Popo',
    inscriptionText: '« Réserve de Biosphère Transfrontalière du Mono : Sanctuaire naturel où le fleuve Mono embrasse l\'Océan Atlantique. Espace protégé pour la ponte des tortues marines luths et la régénération des mangroves. » — Conservatoire Littoral.',
    guideNarrative: 'Embarquez sur une pirogue traditionnelle pour remonter le fleuve jusqu\'à l\'île aux oiseaux et aux mangroves. Vous découvrirez les ateliers traditionnels d\'extraction de sel par les femmes de la lagune et l\'hospitalité légendaire du peuple Xweda.',
    visualHighlights: [
      'L\'embouchure spectaculaire de la Bouche du Roy où le fleuve se jette dans la mer',
      'Les plages immenses bordées de cocotiers sauvages et de sable doré',
      'Les îles artisanales de production de sel traditionnel',
      'Le sanctuaire communautaire de protection des tortues marines'
    ],
    bestSeason: 'Octobre à Mai (climat doux et ponte des tortues en saison)'
  }
];

interface ExploreDestinationsShowcaseProps {
  onSearch: (params: SearchParams) => void;
}

export const ExploreDestinationsShowcase: React.FC<ExploreDestinationsShowcaseProps> = ({ onSearch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Triple items for continuous carousel scrolling
  const carouselItems = [...DESTINATIONS_DATA, ...DESTINATIONS_DATA, ...DESTINATIONS_DATA];

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

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const amount = 320;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleCardClick = (spot: DestinationSpot) => {
    onSearch({
      destination: spot.target,
      startDate: '',
      endDate: '',
      adults: 2,
      children: 0,
      rooms: 1,
    });
  };

  return (
    <section className="relative w-full bg-[#FAF7F2]/90 backdrop-blur-2xl pt-6 sm:pt-8 pb-16 overflow-hidden border-b border-white/60">
      {/* Background Subtle Luminous Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-amber-200/50 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-100/40 blur-3xl rounded-full" />
      </div>

      {/* 1. TOP CURVED PHOTO CAROUSEL (Image 2 Top Animation with Glass Effects) */}
      <div className="relative w-full overflow-hidden mb-6 sm:mb-10" style={{ perspective: '1200px' }}>
        {/* Left / Right Nav Arrows */}
        <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => handleManualScroll('left')}
            className="p-3 rounded-full bg-white/70 hover:bg-white text-slate-800 hover:text-blue-700 shadow-lg border border-white/80 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xl"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => handleManualScroll('right')}
            className="p-3 rounded-full bg-white/70 hover:bg-white text-slate-800 hover:text-blue-700 shadow-lg border border-white/80 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xl"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

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
                onClick={() => handleCardClick(item)}
                style={{
                  transform: `translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
                }}
                className="group relative shrink-0 w-[240px] sm:w-[270px] md:w-[290px] h-[165px] sm:h-[190px] md:h-[205px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-[3px] border-white/80 hover:border-amber-400 transition-all duration-300 cursor-pointer bg-slate-900"
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

                {/* Top Badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/90 backdrop-blur-md text-slate-950 px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                    <MapPin className="w-3 h-3" />
                    <span>{item.department}</span>
                  </span>
                </div>

                {/* Bottom Pill Badge - Exact match to image 2 */}
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

      {/* 2. THE GRAND TITLE FROM IMAGE 2 (Exact Typography & Line Break) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 font-serif tracking-tight leading-tight">
          <span>Explorez des Lieux </span>
          <span className="font-serif italic font-semibold text-[#1D4ED8] drop-shadow-xs ml-1 sm:ml-2">
            Qui
          </span>
          <span className="block font-serif italic font-semibold text-[#1D4ED8] drop-shadow-xs">
            Valent le Voyage
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Découvrez les restaurants, cités lacustres, parcs safari, hôtels et merveilles culturelles incontournables du Bénin.
        </p>
      </div>
    </section>
  );
};
