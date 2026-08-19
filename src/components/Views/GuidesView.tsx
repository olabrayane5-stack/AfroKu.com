import React, { useState } from 'react';
import { BENIN_GUIDES } from '../../data/beninData';
import { ShieldCheck, MapPin, Languages, Check, Calendar, Award, Star, MessageSquare, Send, X, UserCheck, Lock, LogIn } from 'lucide-react';
import { GuideItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { saveReservation } from '../../services/reservationStore';
import { handleImageError } from '../SafeImage';

export const GuidesView: React.FC = () => {
  const { user } = useAuth();
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentNetwork, setPaymentNetwork] = useState<'momo' | 'moov' | 'celtiis' | 'paypal' | 'card' | 'onsite'>('momo');
  const [networkInput, setNetworkInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Review Modal State
  const [reviewingGuide, setReviewingGuide] = useState<GuideItem | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  const handleStartBooking = (guide: GuideItem) => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
      return;
    }
    setSelectedGuide(guide);
    setBookingDays(1);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setSpecialRequests('');
    setPaymentNetwork('momo');
    setNetworkInput('');
    setBookedSuccess(false);
  };

  const handleConfirmGuideBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide || !user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `GDE-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setBookingRef(generatedRef);
      setBookedSuccess(true);

      // Save reservation to store
      saveReservation({
        code: generatedRef,
        title: `Guide Natif : ${selectedGuide.name}`,
        category: 'GUIDE',
        location: `${selectedGuide.location}, Bénin`,
        dates: `${bookingDate} (${bookingDays} jour${bookingDays > 1 ? 's' : ''})`,
        priceXOF: selectedGuide.pricePerDay * bookingDays,
        status: 'Confirmée',
        image: selectedGuide.photo,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: networkInput || '+229 01 53 63 70 86',
        paymentMethod: paymentNetwork === 'momo' ? 'MTN MoMo' : paymentNetwork === 'moov' ? 'Moov Money' : paymentNetwork === 'celtiis' ? 'Celtiis Cash' : paymentNetwork === 'card' ? 'Carte Bancaire' : paymentNetwork === 'paypal' ? 'PayPal' : 'Sur place',
        detailsNote: `Accompagnement par ${selectedGuide.name} (${selectedGuide.title}) pendant ${bookingDays} jour(s)`,
      });
    }, 1200);
  };

  const handleSubmitGuideReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewingGuide || !comment.trim()) return;

    setReviewSuccessMessage(`Votre avis (${rating}★) sur le guide ${reviewingGuide.name} a été publié au nom de ${user.name} ! Merci.`);
    setReviewingGuide(null);
    setComment('');
    setRating(5);

    setTimeout(() => setReviewSuccessMessage(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Guides */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 sm:p-10 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Le réseau des meilleurs guides locaux
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Guides Touristiques & Mémoires du Bénin</h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Chaque guide référencé sur AfroKu.com est un habitant natif certifié. Bénéficiez d'un accompagnement personnalisé, chaleureux et sécurisé sur tous vos circuits.
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center w-full sm:w-auto">
            <div className="text-3xl font-extrabold text-amber-300">{BENIN_GUIDES.length} Guides</div>
            <div className="text-xs text-emerald-100 mt-1">100% Natifs & Certifiés</div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-partner-modal', { detail: 'guide' }))}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            Inscrire mon profil de Guide
          </button>
        </div>
      </div>

      {reviewSuccessMessage && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-bold">
            <UserCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{reviewSuccessMessage}</span>
          </div>
          <button onClick={() => setReviewSuccessMessage(null)} className="text-xs text-amber-700 underline font-bold ml-2 shrink-0">
            Fermer
          </button>
        </div>
      )}

      {bookedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Félicitations <strong>{user?.name}</strong> ! Votre demande de réservation avec <strong>{selectedGuide?.name || 'le guide'}</strong> a été enregistrée avec succès. Notre équipe vous recontactera sous 2h.</span>
          </div>
          <button onClick={() => setBookedSuccess(false)} className="text-xs text-emerald-700 underline font-bold ml-2 shrink-0">
            Fermer
          </button>
        </div>
      )}

      {/* Tariff Grid Accordion / Section */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white">Grille Tarifaire Officielle des Guides (Tarif journalier)</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Prix indiqués en FCFA / jour</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Débutant</div>
            <div className="text-xs text-slate-300">0 – 2 ans d'expérience</div>
            <div className="text-sm font-black text-white mt-2">15 000 – 20 000 FCFA</div>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Junior</div>
            <div className="text-xs text-slate-300">2 – 5 ans d'expérience</div>
            <div className="text-sm font-black text-white mt-2">20 000 – 25 000 FCFA</div>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Confirmé</div>
            <div className="text-xs text-slate-300">5 – 8 ans d'expérience</div>
            <div className="text-sm font-black text-white mt-2">25 000 – 35 000 FCFA</div>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Expert</div>
            <div className="text-xs text-slate-300">8 – 12 ans d'expérience</div>
            <div className="text-sm font-black text-white mt-2">35 000 – 45 000 FCFA</div>
          </div>
          <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30">
            <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">Premium</div>
            <div className="text-xs text-slate-300">12 ans et +, trilingue & spécialiste</div>
            <div className="text-sm font-black text-amber-300 mt-2">45 000 – 60 000 FCFA</div>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENIN_GUIDES.map((guide) => (
          <div key={guide.id} className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Card Header Background Accent */}
              <div className="h-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 relative p-3 flex justify-end items-start">
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-950 shrink-0" />
                  <span>Natif Certifié</span>
                </span>
              </div>

              {/* Avatar & Title Section */}
              <div className="px-5 -mt-10 flex items-end gap-3 mb-3">
                <div className="relative shrink-0">
                  <img
                    src={guide.photo}
                    alt={guide.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white" title="Disponible">
                    <UserCheck className="w-3 h-3" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-extrabold text-slate-900 text-[#002866] text-base sm:text-lg leading-snug group-hover:text-emerald-800 transition-colors">
                      {guide.name}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-amber-800 leading-snug">
                    {guide.title}
                  </p>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="px-5 space-y-3.5 text-xs">
                {/* Rating & Experience Header Line */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-0">
                  <div className="flex items-center gap-1 text-amber-700 font-extrabold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                    <span>4.9</span>
                    <span className="text-slate-500 font-normal text-[11px]">(30+ avis)</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-900 font-bold shrink-0">
                    <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="text-xs">{guide.yearsOfExperience} ans d'exp.</span>
                  </div>
                </div>

                {/* Location & Languages */}
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Secteurs : <strong className="text-slate-900">{guide.location}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Langues : <strong className="text-slate-900">{guide.languages.join(', ')}</strong></span>
                  </div>
                </div>

                {/* Bio / Quote */}
                <p className="text-slate-700 italic bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed text-xs break-words">
                  "{guide.bio}"
                </p>

                {/* Specialties */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Spécialités :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.specialties.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-lg border border-emerald-200/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Price & Booking CTA */}
            <div className="p-5 pt-4 mt-4 border-t border-slate-100 space-y-2.5 bg-slate-50/40">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tarif journalier</span>
                  <div className="text-lg font-black text-slate-900">
                    {guide.pricePerDay.toLocaleString('fr-FR')} FCFA <span className="text-xs font-normal text-slate-500">/jour</span>
                  </div>
                </div>

                <button
                  onClick={() => setReviewingGuide(guide)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Avis</span>
                </button>
              </div>

              <button
                onClick={() => handleStartBooking(guide)}
                className="w-full py-3 bg-[#003580] hover:bg-[#002866] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Engager {guide.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal Dialog */}
      {reviewingGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in relative">
            <button
              onClick={() => setReviewingGuide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <img src={reviewingGuide.photo} alt={reviewingGuide.name} className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shrink-0" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Laisser un avis sur le guide</h3>
                <p className="text-xs font-bold text-emerald-800">{reviewingGuide.name}</p>
              </div>
            </div>

            {!user ? (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Connexion requise pour donner un avis</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Seuls les voyageurs connectés à leur compte AfroKu peuvent donner un avis sur un guide certifié.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewingGuide(null);
                      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Se connecter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewingGuide(null);
                      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_signup' }));
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                  >
                    <span>Créer un compte</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitGuideReview} className="space-y-4 pt-1">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs uppercase shrink-0">
                    {user.name.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Avis publié en tant que <span className="text-emerald-800">{user.name}</span></span>
                    <span className="text-[10px] text-slate-500 block">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note attribuée</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-800 ml-2">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Votre expérience & appréciation</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comment s'est passée votre excursion avec ce guide ? Ponts forts, ponctualité, explications..."
                    rows={3}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 leading-relaxed font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewingGuide(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier l'avis</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Guide Reservation & Payment Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 relative my-auto">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookedSuccess ? (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Réservation Confirmée !
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-serif">
                    Votre guide est réservé
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Un conseiller AfroKu et votre guide <strong>{selectedGuide.name}</strong> ont reçu votre réservation.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guide :</span>
                    <span className="font-bold text-slate-900">{selectedGuide.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date de début :</span>
                    <span className="font-bold text-slate-900">{bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Durée :</span>
                    <span className="font-bold text-slate-900">{bookingDays} jour(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mode de paiement :</span>
                    <span className="font-extrabold text-amber-600 uppercase">
                      {paymentNetwork === 'momo' && 'MTN MoMo Bénin'}
                      {paymentNetwork === 'moov' && 'Moov Money Africa Bénin'}
                      {paymentNetwork === 'celtiis' && 'Celtiis Cash Bénin'}
                      {paymentNetwork === 'paypal' && 'PayPal'}
                      {paymentNetwork === 'card' && 'Carte Visa/MC'}
                      {paymentNetwork === 'onsite' && 'Guichet Sur Place'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-500 font-bold">Référence :</span>
                    <span className="font-extrabold text-[#003580]">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Total Réglé :</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {(selectedGuide.pricePerDay * bookingDays).toLocaleString('fr-FR')} XOF
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-full py-3 bg-[#003580] hover:bg-[#00255b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmGuideBooking} className="p-6 space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <img
                    src={selectedGuide.photo}
                    alt={selectedGuide.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Réservation de Guide</h3>
                    <p className="text-xs font-bold text-emerald-700">{selectedGuide.name} • {selectedGuide.title}</p>
                    <span className="text-xs text-slate-500">{selectedGuide.pricePerDay.toLocaleString()} XOF / jour</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date de début d'accompagnement
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#003580]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre de jours : <span className="text-amber-600 font-extrabold">{bookingDays} jour(s)</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={bookingDays}
                      onChange={(e) => setBookingDays(parseInt(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Réseau / Mode de Paiement
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentNetwork('momo')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          paymentNetwork === 'momo'
                            ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold ring-2 ring-amber-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        MTN MoMo
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentNetwork('moov')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          paymentNetwork === 'moov'
                            ? 'bg-blue-50 border-blue-500 text-slate-900 font-bold ring-2 ring-blue-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Moov Money
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentNetwork('celtiis')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          paymentNetwork === 'celtiis'
                            ? 'bg-purple-50 border-purple-500 text-slate-900 font-bold ring-2 ring-purple-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Celtiis Cash
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentNetwork('paypal')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          paymentNetwork === 'paypal'
                            ? 'bg-sky-50 border-sky-500 text-slate-900 font-bold ring-2 ring-sky-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        PayPal
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentNetwork('card')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          paymentNetwork === 'card'
                            ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-bold ring-2 ring-emerald-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Carte Visa/MC
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentNetwork('onsite')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          paymentNetwork === 'onsite'
                            ? 'bg-slate-200 border-slate-500 text-slate-900 font-bold ring-2 ring-slate-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Paiement Sur Place
                      </button>
                    </div>
                  </div>

                  {paymentNetwork !== 'onsite' && (
                    <input
                      type={paymentNetwork === 'paypal' ? 'email' : 'text'}
                      placeholder={
                        paymentNetwork === 'paypal'
                          ? 'Email compte PayPal'
                          : paymentNetwork === 'card'
                          ? 'Numéro de Carte Bancaire'
                          : 'Numéro de téléphone (+229)'
                      }
                      value={networkInput}
                      onChange={(e) => setNetworkInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003580]"
                    />
                  )}
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Montant Total</span>
                    <strong className="text-lg font-black text-amber-300">
                      {(selectedGuide.pricePerDay * bookingDays).toLocaleString('fr-FR')} XOF
                    </strong>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Validation...' : 'Payer & Réserver'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
