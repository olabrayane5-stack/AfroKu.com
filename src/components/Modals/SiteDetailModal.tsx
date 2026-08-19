import React, { useState, useEffect } from 'react';
import { BeninTouristSite } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  MapPin,
  Clock,
  Compass,
  Share2,
  Check,
  Sun,
  BookOpen,
  Hourglass,
  Info,
  CheckCircle2,
  Star,
  HelpCircle,
  Volume2,
  Crown,
  Camera,
  Footprints,
  Flame,
  ShieldCheck,
  Award,
  Calendar,
  ExternalLink,
  Trash2,
  Lock,
  LogIn
} from 'lucide-react';
import { handleImageError } from '../SafeImage';

interface SiteDetailModalProps {
  site: BeninTouristSite | null;
  departmentName: string;
  onClose: () => void;
  onOpenBooking?: (site: BeninTouristSite) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  departmentName,
  onClose,
  onOpenBooking,
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'legends' | 'circuit' | 'reviews'>('info');
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    { id: '1', name: 'Koffi A.', rating: 5, date: 'Il y a 2 jours', text: 'Une expérience culturelle inoubliable ! Le guide local nous a transmis des histoires fascinantes.' },
    { id: '2', name: 'Sophie L.', rating: 5, date: 'Il y a 1 semaine', text: 'Magnifique lieu préservé, facile d\'accès et très dépaysant. À visiter absolument le matin !' }
  ]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // Lock body & html scroll when modal is open
  useEffect(() => {
    if (site) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [site]);

  if (!site) return null;

  const openingHours = site.openingHours || '08h00 - 18h00 (Ouvert 7j/7 - Jours fériés inclus)';
  const recommendedDuration = site.recommendedDuration || '1h30 à 2h30 de visite';
  const bestTimeToVisit = site.bestTimeToVisit || 'Tôt le matin (8h-10h) ou en fin d\'après-midi pour bénéficier de la meilleure lumière';
  const practicalTips = site.practicalTips || 'Prévoir des chaussures de marche confortables, de l\'eau minérale, un chapeau et de quoi vous protéger du soleil. Merci de respecter la quiétude et le patrimoine culturel des lieux.';
  const historicalContext = site.historicalContext || `${site.name} est l'un des trésors patrimoniaux et culturels majeurs du département de ${departmentName}. Ce lieu préservé témoigne de la mémoire séculaire, des traditions spirituelles et de la beauté naturelle du Bénin.`;
  
  const activities = site.activities && site.activities.length > 0 ? site.activities : [
    'Visite découverte du site et de son environnement',
    'Séance photo & points de vue panoramiques',
    'Découverte des légendes et contes traditionnels',
    'Échanges culturels et immersion dans le patrimoine local',
    'Achat d\'objets d\'artisanat faits main'
  ];

  const legendsAndMythology = [
    {
      title: 'Légende de fondation & Esprits gardiens',
      content: `D'après les récits transmis par les dignitaires locaux de ${departmentName}, ${site.name} est placé sous la protection séculaire des esprits ancêtres. Les récits racontent que les premiers habitants venaient y chercher conseils et protection avant les grandes décisions.`
    },
    {
      title: 'Tradition spirituelle & Symbolique Vodoun',
      content: `Au Bénin, berceau du Vodoun, chaque pierre, arbre et cours d'eau recèle un symbole de vie. À ${site.name}, les visiteurs observent des cérémonies d'offrandes lors des fêtes traditionnelles et du 10 janvier, célébrant l'harmonie entre l'homme et la nature.`
    },
    {
      title: 'Transmission orale & Contes des Sages',
      content: `Les guides du site sont souvent descendants de familles de gardiens du temple ou de la forêt sacrée. Ils partagent avec passion les proverbes et contes populaires qui transmettent la mémoire vivante de la région.`
    }
  ];

  const circuitSteps = [
    {
      step: 'Étape 1',
      title: 'Accueil & Bénédiction d\'entrée',
      desc: 'Rencontre avec le guide local certifié et présentations du respect des codes culturels du site.'
    },
    {
      step: 'Étape 2',
      title: 'Immersion historique & Découverte guidée',
      desc: `Parcours à travers les points forts de ${site.name}, explication des monuments, sanctuaires ou éléments naturels.`
    },
    {
      step: 'Étape 3',
      title: 'Point de vue panoramique & Espace Photo',
      desc: 'Arrêt sur les meilleurs belvédères pour capturer la beauté des paysages et immortaliser votre visite.'
    },
    {
      step: 'Étape 4',
      title: 'Échanges culturels & Clôture',
      desc: 'Moment de partage avec les habitants locaux, achat de souvenirs artisanaux et conseils pour poursuivre le voyage.'
    }
  ];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userComment.trim()) return;
    setReviewsList([
      { id: Date.now().toString(), name: user.name, rating: userRating, date: 'À l\'instant', text: userComment },
      ...reviewsList
    ]);
    setUserComment('');
  };

  const handleDeleteReview = (id: string) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== id));
    setDeleteMessage('Avis supprimé.');
    setTimeout(() => setDeleteMessage(null), 3000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: site.name,
        text: `Découvrez ${site.name} dans le département de ${departmentName} sur AfroKu Bénin !`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${site.name} - ${departmentName}, Bénin. ${site.description}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto [overscroll-behavior:contain]"
      onClick={onClose}
    >
      <div
        className="bg-slate-950 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative border border-white/20 overflow-hidden my-auto text-white [overscroll-behavior:contain]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Full Image in Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={site.image}
            alt={site.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/75 backdrop-blur-[2px]" />
        </div>

        {/* Floating Header Bar */}
        <div className="relative z-20 p-4 sm:p-5 pb-0 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {site.category}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Département de {departmentName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/20 transition-colors flex items-center gap-1.5 text-xs font-bold px-3.5 cursor-pointer shadow-md"
              title="Partager ce site"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Partager'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/20 transition-colors cursor-pointer shadow-md"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body - Information flows freely over background image */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 relative z-10 scrollbar-thin scrollbar-thumb-white/20">
          
          {/* Main Site Title Header */}
          <div className="space-y-1.5 pt-1">
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight leading-tight drop-shadow-lg">
              {site.name}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs sm:text-sm text-amber-300 font-semibold flex items-center gap-1.5 drop-shadow-xs">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>{site.location} ({departmentName}, Bénin)</span>
                </p>

                <a
                  href={site.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${site.location} Benin`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 rounded-lg border border-emerald-400/30 text-[11px] font-bold transition-all"
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
                </a>
              </div>

              {/* Interactive Audio Narrative Button */}
              <button
                type="button"
                onClick={toggleAudio}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-xl border border-amber-400/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-amber-400' : ''}`} />
                <span>{isPlayingAudio ? 'Écoute en cours...' : 'Écouter le récit audio'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/15 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'info'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Général & Visite</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('legends')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'legends'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Légendes & Traditions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('circuit')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'circuit'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Circuit & Découvertes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Avis ({reviewsList.length})</span>
            </button>
          </div>

          {/* TAB 1: GENERAL & VISITE */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fade-in">
              {/* Quick Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl flex items-start gap-3">
                  <div className="p-2.5 bg-amber-400/20 rounded-xl text-amber-300 shrink-0 border border-amber-400/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-amber-200/70 text-[11px] font-extrabold uppercase tracking-wider">Horaires d'ouverture</p>
                    <p className="text-xs sm:text-sm font-black text-white leading-snug">{openingHours}</p>
                  </div>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl flex items-start gap-3">
                  <div className="p-2.5 bg-amber-400/20 rounded-xl text-amber-300 shrink-0 border border-amber-400/30">
                    <Hourglass className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-amber-200/70 text-[11px] font-extrabold uppercase tracking-wider">Durée conseillée</p>
                    <p className="text-xs sm:text-sm font-black text-white leading-snug">{recommendedDuration}</p>
                  </div>
                </div>
              </div>

              {/* Presentation & History */}
              <div className="bg-slate-900/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl text-white space-y-3">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-serif">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>Présentation & Histoire de {site.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {site.description}
                </p>
                <div className="text-xs sm:text-sm text-amber-100 leading-relaxed bg-amber-500/10 border-l-4 border-amber-400 p-3.5 rounded-r-xl italic backdrop-blur-xs">
                  "{historicalContext}"
                </div>
              </div>

              {/* Activities Available */}
              <div className="bg-slate-900/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl text-white space-y-3">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-serif">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>Activités & Expériences sur Place</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activities.map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-100 font-medium">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarifs & Formules de Visite */}
              <div className="bg-slate-900/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-amber-400/30 shadow-xl text-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-serif">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>Grille Tarifaire Indicative</span>
                  </h3>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 uppercase">
                    Bénin Tourisme
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Visite simple</p>
                      <p className="text-[11px] text-slate-400">Entrée libre & autonomie</p>
                    </div>
                    <p className="text-xs font-black text-amber-300 pt-1">5 000 à 10 000 FCFA</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-amber-400/30 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <span className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg">Populaire</span>
                    <div>
                      <p className="text-xs font-bold text-white">Visite guidée</p>
                      <p className="text-[11px] text-slate-400">Guide local certifié & anecdotes</p>
                    </div>
                    <p className="text-xs font-black text-amber-300 pt-1">15 000 à 30 000 FCFA</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Circuit d'une journée</p>
                      <p className="text-[11px] text-slate-400">Excursion 1 jour & repas</p>
                    </div>
                    <p className="text-xs font-black text-amber-300 pt-1">30 000 à 100 000 FCFA</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Circuit plusieurs jours</p>
                      <p className="text-[11px] text-slate-400">Immersion 2-5 jours & logistique</p>
                    </div>
                    <p className="text-xs font-black text-amber-300 pt-1">100 000 FCFA et +</p>
                  </div>
                </div>
              </div>

              {/* Practical Advice & Best Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-xl text-white space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs sm:text-sm">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Meilleur moment pour visiter</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {bestTimeToVisit}
                  </p>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-xl text-white space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs sm:text-sm">
                    <Info className="w-4 h-4 text-sky-400" />
                    <span>Conseils & Usages locaux</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {practicalTips}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LÉGENDES & TRADITIONS */}
          {activeTab === 'legends' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl space-y-4">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-serif">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>Croyances, Récits Sacrés & Mémoire Séculaire</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Le patrimoine béninois ne se résume pas à ses monuments : il vit à travers la parole, les rituels et la mémoire ancestrale du département de {departmentName}.
                </p>

                <div className="space-y-3">
                  {legendsAndMythology.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sacred Codes & Respect */}
              <div className="bg-amber-400/10 backdrop-blur-md p-5 rounded-3xl border border-amber-400/20 shadow-xl space-y-2">
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Respect du Patrimoine & Règles Coutumières</span>
                </h4>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Avant d'entrer dans certains périmètres sacrés, demandez conseil à votre guide local. Il est coutume de saluer les dignitaires avec déférence et d'éviter les prises de vues directes sans autorisation préalable.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CIRCUIT & DÉCOUVERTES */}
          {activeTab === 'circuit' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl space-y-4">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-serif">
                  <Footprints className="w-5 h-5 text-amber-400" />
                  <span>Circuit de Visite Recommandé sur Place</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Pour profiter pleinement de {site.name}, voici les étapes clés recommandées par les guides locaux :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {circuitSteps.map((step, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-md">
                        {step.step}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white pt-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo & Highlights */}
              <div className="bg-slate-900/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Spots Photo Incontournables & Meilleures Lumières</span>
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Ne manquez pas l'angle de vue principal au lever du soleil ou vers 16h30 lorsque les reflets dorés illuminent le site de {site.name}.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & INTERACTION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-fade-in">
              {deleteMessage && (
                <div className="p-3 bg-red-500/20 border border-red-400/40 rounded-2xl flex items-center gap-2 text-red-200 text-xs font-bold animate-fade-in">
                  <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{deleteMessage}</span>
                </div>
              )}

              {/* Add a Review Form or Auth Banner */}
              {!user ? (
                <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Connexion requise</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Seuls les voyageurs connectés à leur compte AfroKu peuvent publier un avis sur ce site.
                  </p>
                  <div className="pt-1 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Se connecter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_signup' }));
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors cursor-pointer"
                    >
                      <span>Créer un compte</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-[10px] uppercase">
                        {user.name.slice(0, 1)}
                      </div>
                      <span className="text-xs font-bold text-white">Avis de <span className="text-amber-300">{user.name}</span></span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="text-amber-400 cursor-pointer focus:outline-none"
                        >
                          <Star className={`w-4 h-4 ${star <= userRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                      <span className="text-xs text-amber-300 font-bold ml-1">{userRating}/5</span>
                    </div>
                  </div>

                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Qu'avez-vous pensé de votre visite ? Des conseils pour les futurs voyageurs ?"
                    className="w-full bg-slate-950/80 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    rows={2}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Publier mon avis
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-2.5">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-amber-300">{rev.name}</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Supprimer cet avis"
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-200">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="relative z-20 bg-slate-950/90 backdrop-blur-md border-t border-white/10 p-3.5 px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <span className="truncate pr-2 font-medium hidden sm:inline">Fiche touristique officielle — {site.name} ({departmentName})</span>
          <div className="flex items-center gap-2.5 ml-auto">
            {onOpenBooking && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (!user) {
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
                  } else {
                    onOpenBooking(site);
                  }
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black transition-colors cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Réserver une visite</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors cursor-pointer shrink-0 border border-white/10"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

