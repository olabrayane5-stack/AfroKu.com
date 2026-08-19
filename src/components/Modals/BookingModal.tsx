import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveReservation } from '../../services/reservationStore';
import {
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  User,
  Compass,
  MapPin,
  HelpCircle,
  FileText,
  ChevronRight,
  Download,
  Share2,
  Check,
  Lock,
  LogIn
} from 'lucide-react';
import { BeninTouristSite } from '../../types';
import { handleImageError } from '../SafeImage';

interface BookingModalProps {
  site: BeninTouristSite | null;
  departmentName: string;
  onClose: () => void;
  onSuccessBooking?: (reservation: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  site,
  departmentName,
  onClose,
  onSuccessBooking,
}) => {
  // Form Formulas
  type VisitFormula = 'simple' | 'guided' | 'day_circuit' | 'multi_day_circuit';

  const FORMULAS = [
    {
      id: 'simple' as VisitFormula,
      title: 'Visite simple',
      rangeText: '5 000 à 10 000 FCFA',
      basePrice: 5000,
      description: "Billet d'entrée simple au site, plan de visite & découverte en toute autonomie.",
      badge: undefined,
    },
    {
      id: 'guided' as VisitFormula,
      title: 'Visite guidée',
      rangeText: '15 000 à 30 000 FCFA',
      basePrice: 15000,
      description: "Guide local francophone/fon certifié, récit historique passionnant & rituels traditionnels.",
      badge: 'Populaire',
    },
    {
      id: 'day_circuit' as VisitFormula,
      title: "Circuit d'une journée",
      rangeText: '30 000 à 100 000 FCFA',
      basePrice: 35000,
      description: "Excursion guidée complète 1 journée, transport local privé & pause culinaire béninoise.",
      badge: 'Excursion',
    },
    {
      id: 'multi_day_circuit' as VisitFormula,
      title: 'Circuit plusieurs jours',
      rangeText: '100 000 FCFA et +',
      basePrice: 100000,
      description: "Immersion culturelle 2 à 5 jours, hébergement inclus, itinéraire complet & chauffeur-guide.",
      badge: 'Immersion VIP',
    },
  ];

  // Form State
  const [visitFormula, setVisitFormula] = useState<VisitFormula>('guided');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [visitDate, setVisitDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('09:30');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const { user } = useAuth();

  // Visitor Details
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Français');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'momo' | 'moov' | 'celtiis' | 'paypal' | 'card'>('momo');
  const [paymentDetails, setPaymentDetails] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // If user is not authenticated when modal is opened, trigger Auth Modal
  useEffect(() => {
    if (site && !user) {
      onClose();
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
    }
  }, [site, user, onClose]);

  // Submit & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Lock background scroll when modal is open
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

  const currentFormula = FORMULAS.find((f) => f.id === visitFormula) || FORMULAS[1];

  // Pricing calculations
  const childPriceMultiplier = 0.5;
  const adultTotal = adults * currentFormula.basePrice;
  const childTotal = children * (currentFormula.basePrice * childPriceMultiplier);
  const totalPrice = adultTotal + childTotal;
  const totalPriceEUR = (totalPrice / 655.957).toFixed(2);

  const timeSlots = ['08:30', '09:30', '11:00', '14:00', '15:30', '17:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
      return;
    }
    if (!phone) {
      alert('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `BENIN-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(generatedRef);
      setIsSubmitting(false);
      setIsConfirmed(true);

      // Save reservation into store
      saveReservation({
        code: generatedRef,
        title: `${site.name} — ${currentFormula.title}`,
        category: 'EXCURSION',
        location: `${site.location || departmentName}, Bénin`,
        dates: `${visitDate} à ${timeSlot}`,
        priceXOF: totalPrice,
        status: 'Confirmée',
        image: site.image,
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        paymentMethod: paymentMethod === 'momo' ? 'MTN MoMo' : paymentMethod === 'moov' ? 'Moov Money' : paymentMethod === 'celtiis' ? 'Celtiis Cash' : paymentMethod === 'card' ? 'Carte Bsncaire' : paymentMethod === 'paypal' ? 'PayPal' : 'Sur place',
        detailsNote: `${currentFormula.title} | ${adults} Adulte(s), ${children} Enfant(s)`,
      });

      if (onSuccessBooking) {
        onSuccessBooking({
          id: generatedRef,
          siteName: site.name,
          departmentName,
          visitDate,
          timeSlot,
          adults,
          children,
          totalPrice,
          fullName,
          phone,
          email,
          formula: visitFormula,
        });
      }
    }, 900);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto [overscroll-behavior:contain]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto text-white flex flex-col max-h-[90vh] [overscroll-behavior:contain]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-950/90 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={site.image}
              alt={site.name}
              className="w-12 h-12 rounded-xl object-cover border border-amber-400/40 shadow-xs"
              referrerPolicy="no-referrer"
              onError={handleImageError}
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                Réservation de visite
              </span>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white leading-tight truncate max-w-[240px] sm:max-w-md">
                {site.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{site.location} ({departmentName})</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-white/20">
          {!isConfirmed ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Choix de la formule */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>1. Choisissez votre formule de visite</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FORMULAS.map((f) => {
                    const isSelected = visitFormula === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setVisitFormula(f.id)}
                        className={`p-4 rounded-2xl border relative transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400'
                            : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        {f.badge && (
                          <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                            {f.badge}
                          </span>
                        )}
                        <div>
                          <div className="flex items-center justify-between pb-1">
                            <span className="font-extrabold text-xs sm:text-sm text-white">{f.title}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-500'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-amber-300 font-semibold">{f.rangeText}</p>
                          <p className="text-[11px] text-slate-400 leading-snug pt-1">{f.description}</p>
                        </div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Tarif calculé :</span>
                          <span className="font-extrabold text-amber-300 text-xs">{f.basePrice.toLocaleString('fr-FR')} FCFA <span className="text-[10px] font-normal text-slate-400">/pers</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date & Créneau Horaire */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>2. Date & Horaire de la visite</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-xs text-slate-300 mb-1">Date souhaitée</span>
                    <input
                      type="date"
                      value={visitDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-slate-950/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      required
                    />
                  </div>

                  <div>
                    <span className="block text-xs text-slate-300 mb-1">Créneau horaire disponible</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            timeSlot === slot
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-slate-950/60 text-slate-300 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Nombre de Visiteurs */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>3. Nombre de personnes</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/60 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Adulte(s)</p>
                      <p className="text-[10px] text-slate-400">Plein tarif</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-extrabold text-amber-300 w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Enfant(s)</p>
                      <p className="text-[10px] text-slate-400">Tarif réduit (-50%)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-extrabold text-amber-300 w-4 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Coordonnées du réservant */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>4. Vos coordonnées de réservation</span>
                </label>

                {user && (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 border border-emerald-400/30 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs uppercase shrink-0">
                          {user.name.slice(0, 1)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Réservation au nom de <span className="text-amber-300">{user.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block">{user.email}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 shrink-0">
                        Compte connecté
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-xs text-slate-300 mb-1">Téléphone (WhatsApp conseillé) *</span>
                        <input
                          type="tel"
                          placeholder="+229 01 00 00 00 00"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div>
                        <span className="block text-xs text-slate-300 mb-1">Langue souhaitée pour le guide</span>
                        <select
                          value={preferredLanguage}
                          onChange={(e) => setPreferredLanguage(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="Français">Français</option>
                          <option value="English">English</option>
                          <option value="Fon">Fon / Fongbé</option>
                          <option value="Yoruba">Yoruba / Nago</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 5: Mode de Paiement / Réseau */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>5. Choisissez votre réseau de paiement</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paymentMethod === 'momo'
                        ? 'bg-amber-400/20 border-amber-400 text-white font-bold ring-1 ring-amber-400'
                        : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">MTN MoMo</span>
                      <span className="text-[10px] text-amber-300">Bénin (+229)</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('moov')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paymentMethod === 'moov'
                        ? 'bg-blue-400/20 border-blue-400 text-white font-bold ring-1 ring-blue-400'
                        : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">Moov Money</span>
                      <span className="text-[10px] text-blue-300">Africa Bénin</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('celtiis')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paymentMethod === 'celtiis'
                        ? 'bg-purple-400/20 border-purple-400 text-white font-bold ring-1 ring-purple-400'
                        : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">Celtiis Cash</span>
                      <span className="text-[10px] text-purple-300">SBIN Bénin</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paymentMethod === 'paypal'
                        ? 'bg-sky-400/20 border-sky-400 text-white font-bold ring-1 ring-sky-400'
                        : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">PayPal</span>
                      <span className="text-[10px] text-sky-300">Compte International</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-400/20 border-emerald-400 text-white font-bold ring-1 ring-emerald-400'
                        : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">Carte Visa / MC</span>
                      <span className="text-[10px] text-emerald-300">Bancaire</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('onsite')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paymentMethod === 'onsite'
                        ? 'bg-slate-400/20 border-slate-300 text-white font-bold ring-1 ring-slate-300'
                        : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">Paiement sur place</span>
                      <span className="text-[10px] text-slate-400">À l'accueil du site</span>
                    </div>
                  </button>
                </div>

                {/* Input according to selected network */}
                {paymentMethod !== 'onsite' && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-white/10 text-xs space-y-2">
                    <span className="text-[11px] font-bold text-amber-300 block">
                      {paymentMethod === 'momo' && "Coordonnées du compte MTN Mobile Money (+229)"}
                      {paymentMethod === 'moov' && "Coordonnées du compte Moov Money (+229)"}
                      {paymentMethod === 'celtiis' && "Coordonnées du compte Celtiis Cash (+229)"}
                      {paymentMethod === 'paypal' && "Adresse e-mail associée à votre compte PayPal"}
                      {paymentMethod === 'card' && "Numéro de Carte Bancaire Visa / MasterCard"}
                    </span>
                    <input
                      type={paymentMethod === 'paypal' ? 'email' : 'text'}
                      placeholder={
                        paymentMethod === 'paypal'
                          ? 'compte.paypal@exemple.com'
                          : paymentMethod === 'card'
                          ? '4000 1234 5678 9010'
                          : phone || '+229 01 53 63 70 86'
                      }
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      className="w-full bg-slate-900 border border-white/20 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* Total Calculation & Submit Action */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total estimé à régler</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-amber-300">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                    <span className="text-xs text-slate-400"> (~{totalPriceEUR} €)</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Réservation gratuite - Aucun frais caché</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Traitement en cours...</span>
                  ) : (
                    <>
                      <span>Confirmer et Obtenir mon Pass</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation Screen (Pass / Ticket) */
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
                  Réservation Confirmée !
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-serif text-white pt-2">
                  Votre Pass de Visite est prêt
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
                  Un SMS et un email de confirmation vous ont été envoyés. Présentez ce pass ou le code ci-dessous à votre arrivée.
                </p>
              </div>

              {/* Pass Ticket Card */}
              <div className="bg-slate-950 border border-amber-400/40 rounded-2xl p-5 text-left space-y-4 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl">
                  Pass Officiel
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/20"
                  />
                  <div>
                    <p className="text-xs font-bold text-amber-300">{site.name}</p>
                    <p className="text-[11px] text-slate-300">{site.location} ({departmentName})</p>
                    <p className="text-[10px] text-slate-400 pt-0.5">Formule : <span className="font-semibold text-white">{currentFormula.title} ({currentFormula.rangeText})</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Code de Réservation</span>
                    <div className="flex items-center gap-1.5 font-mono font-black text-amber-400 text-sm">
                      <span>{bookingRef}</span>
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copier le code"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Date & Heure</span>
                    <span className="font-extrabold text-white">{visitDate} à {timeSlot}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Visiteurs</span>
                    <span className="font-bold text-white">{adults} Adulte(s) {children > 0 ? `, ${children} Enfant(s)` : ''}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Responsable</span>
                    <span className="font-bold text-white">{fullName}</span>
                  </div>
                </div>

                <div className="bg-amber-400/10 p-3 rounded-xl border border-amber-400/20 text-[11px] text-amber-200 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Point de rendez-vous :</span>
                  </p>
                  <p className="text-slate-300">Accueil principal du site 15 minutes avant le créneau. Votre guide local désigné vous contactera au {phone}.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Téléchargement du Pass ${bookingRef}.pdf simulé avec succès !`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Télécharger mon Pass PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
