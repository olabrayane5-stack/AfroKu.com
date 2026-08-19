import React, { useEffect, useState } from 'react';
import { BeninTouristSite, BeninDepartment, SearchParams } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Hourglass,
  Info,
  CheckCircle2,
  Compass,
  Share2,
  Check,
  Sun,
  BookOpen,
  Calendar,
  ExternalLink,
  Star,
  MessageSquare,
  Send,
  UserCheck,
  Trash2,
  Lock,
  LogIn
} from 'lucide-react';
import { BookingModal } from '../Modals/BookingModal';
import { handleImageError } from '../SafeImage';

interface SitePageViewProps {
  site: BeninTouristSite;
  department: BeninDepartment;
  onBackToDepartment: () => void;
  onSearch?: (params: SearchParams) => void;
}

export const SitePageView: React.FC<SitePageViewProps> = ({
  site,
  department,
  onBackToDepartment,
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState([
    { id: '1', name: 'Koffi Agbossou', rating: 5, date: 'Il y a 3 jours', comment: `Une expérience mémorable à ${site.name} ! La richesse de l'histoire et l'accueil des locaux rendent ce lieu incontournable.` },
    { id: '2', name: 'Sarah Mendès', rating: 5, date: 'Il y a 1 semaine', comment: `Lieu empreint de sérénité et de beauté naturelle. À visiter absolument lors de votre séjour dans le département de ${department.name}.` },
    { id: '3', name: 'Jean-Baptiste Tossou', rating: 4, date: 'Il y a 2 semaines', comment: `Site très bien entretenu. Je recommande vivement de prendre un guide certifié pour en apprécier toutes les histoires.` },
  ]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userComment.trim()) return;

    const newRev = {
      id: Date.now().toString(),
      name: user.name,
      rating: userRating,
      date: 'Aujourd\'hui',
      comment: userComment.trim()
    };

    setReviewsList([newRev, ...reviewsList]);
    setUserComment('');
    setUserRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };


  const handleDeleteReview = (id: string) => {
    setReviewsList((prev) => prev.filter((rev) => rev.id !== id));
    setDeleteMessage('Votre avis a été supprimé avec succès.');
    setTimeout(() => setDeleteMessage(null), 4000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [site]);

  // Defaults for rich display (without tariffs or guide pricing)
  const openingHours = site.openingHours || '08h00 - 18h00 (Ouvert 7j/7 - Jours fériés inclus)';
  const recommendedDuration = site.recommendedDuration || '1h30 à 2h30 de visite';
  const bestTimeToVisit = site.bestTimeToVisit || 'Tôt le matin (8h-10h) ou en fin d\'après-midi pour bénéficier de la meilleure lumière';
  const practicalTips = site.practicalTips || 'Prévoir des chaussures de marche confortables, de l\'eau minérale, un chapeau et de quoi vous protéger du soleil. Merci de respecter la quiétude et le patrimoine culturel des lieux.';
  const historicalContext = site.historicalContext || `${site.name} est l'un des trésors patrimoniaux et culturels d'exception du département de ${department.name}. Ce lieu emblématique témoigne de l'histoire séculaire, des traditions spirituelles et de la richesse naturelle du Bénin.`;
  const activities = site.activities && site.activities.length > 0 ? site.activities : [
    'Visite découverte du site et de son environnement',
    'Séance photo & points de vue panoramiques',
    'Découverte du patrimoine historique et culturel',
    'Immersion dans les traditions locales',
    'Échanges enrichissants avec les habitants'
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: site.name,
        text: `Découvrez ${site.name} dans le département de ${department.name} au Bénin !`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${site.name} - ${department.name}, Bénin.`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen text-white pb-20 animate-fade-in bg-slate-950">
      
      {/* Fullscreen Fixed Background Image */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={site.image}
          alt={site.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/85 to-slate-950/95 backdrop-blur-[2px]" />
      </div>

      {/* Relative Content Container - Scrollable over background */}
      <div className="relative z-10">
        
        {/* Top Navigation Bar */}
        <div className="bg-slate-950/80 backdrop-blur-md text-white py-3 px-4 sm:px-8 border-b border-white/10 sticky top-0 z-30 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToDepartment}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-colors backdrop-blur-md border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Retour au département de {department.name}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Lien copié !' : 'Partager'}</span>
            </button>
          </div>
        </div>

        {/* Hero Title Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {site.category}
            </span>
            <span className="bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Département de {department.name}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif text-white tracking-tight leading-tight drop-shadow-xl">
            {site.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <p className="text-sm sm:text-base text-amber-300 font-semibold flex items-center gap-2 drop-shadow-md">
              <Compass className="w-4.5 h-4.5 text-amber-400" />
              <span>{site.location} ({department.name}, Bénin)</span>
            </p>

            <a
              href={site.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${site.location} Benin`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 rounded-xl border border-emerald-400/30 text-xs font-bold transition-all shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voir la localisation sur Google Maps</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* Main Page Body: Frosted Glass Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          
          {/* Info Grid: Horaires & Durée conseillée */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-amber-200/70 text-xs font-bold uppercase tracking-wider">Horaires d'ouverture</p>
                <p className="text-sm sm:text-base font-extrabold text-white">{openingHours}</p>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                <Hourglass className="w-6 h-6" />
              </div>
              <div>
                <p className="text-amber-200/70 text-xs font-bold uppercase tracking-wider">Durée conseillée de visite</p>
                <p className="text-sm sm:text-base font-extrabold text-white">{recommendedDuration}</p>
              </div>
            </div>
          </div>

          {/* Presentation & History */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 font-serif">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>Présentation & Histoire de {site.name}</span>
            </h2>
            <p className="text-base text-slate-200 leading-relaxed font-normal">
              {site.description}
            </p>
            <div className="bg-amber-400/10 border-l-4 border-amber-400 p-4 rounded-r-2xl italic text-sm text-amber-100 leading-relaxed backdrop-blur-xs">
              "{historicalContext}"
            </div>
          </div>

          {/* Activities */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 font-serif">
              <Compass className="w-6 h-6 text-amber-400" />
              <span>Activités & Expériences sur Place</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activities.map((act, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-100 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Advice & Best Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl space-y-3">
              <div className="flex items-center gap-2.5 text-amber-300 font-extrabold text-base">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>Meilleur moment pour visiter</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {bestTimeToVisit}
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl space-y-3">
              <div className="flex items-center gap-2.5 text-sky-300 font-extrabold text-base">
                <Info className="w-5 h-5 text-sky-400" />
                <span>Conseils pratiques & Usages</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {practicalTips}
              </p>
            </div>
          </div>

          {/* Avis & Témoignages des visiteurs */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 font-serif">
                  <MessageSquare className="w-6 h-6 text-amber-400" />
                  <span>Avis & Témoignages des visiteurs ({reviewsList.length})</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Découvrez les retours d'expérience authentiques ou partagez votre propre avis sur {site.name}.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 w-fit shrink-0">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-extrabold text-amber-300">4.9 / 5</span>
                <span className="text-xs text-amber-200/70">({reviewsList.length} avis)</span>
              </div>
            </div>

            {/* Notification de confirmation */}
            {reviewSubmitted && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center gap-3 text-emerald-200 text-xs font-bold animate-fade-in">
                <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Merci ! Votre avis a été publié avec succès.</span>
              </div>
            )}

            {deleteMessage && (
              <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-2xl flex items-center gap-3 text-red-200 text-xs font-bold animate-fade-in">
                <Trash2 className="w-5 h-5 text-red-400 shrink-0" />
                <span>{deleteMessage}</span>
              </div>
            )}

            {/* Formulaire pour laisser un avis ou invite de connexion */}
            {!user ? (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/30">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Connexion requise pour laisser un avis</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Seuls les utilisateurs connectés à leur compte AfroKu peuvent partager un avis sur {site.name}.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }))}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Se connecter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_signup' }))}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Créer un compte</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xs uppercase">
                      {user.name.slice(0, 1)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Avis au nom de <span className="text-amber-300">{user.name}</span></span>
                      <span className="text-[10px] text-slate-400 block">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-300 font-semibold mr-1">Note :</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs text-amber-300 font-bold ml-1">{userRating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Votre commentaire & expérience</label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Qu'avez-vous particulièrement apprécié ? Des conseils pratiques pour les prochains visiteurs ?"
                    rows={3}
                    required
                    className="w-full bg-slate-950/80 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Publier mon avis</span>
                </button>
              </form>
            )}

            {/* Liste des avis existants */}
            <div className="space-y-3 pt-2">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 group relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {rev.name.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-white block">{rev.name}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Supprimer cet avis"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed pl-10">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Banner Action */}
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 backdrop-blur-md p-6 rounded-3xl border border-amber-400/30 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-amber-300">
              Souhaitez-vous visiter {site.name} avec un guide certifié ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto">
              Réservez votre créneau en quelques clics. Bénéficiez d'un accompagnement personnalisé et obtenez immédiatement votre Pass officiel de visite.
            </p>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
                } else {
                  setIsBookingOpen(true);
                }
              }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer text-sm"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              <span>Réserver une visite guidée maintenant</span>
            </button>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onBackToDepartment}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/15 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Retourner aux sites de {department.name}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Booking Modal Overlay */}
      <BookingModal
        site={isBookingOpen ? site : null}
        departmentName={department.name}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
