import React, { useState } from 'react';
import {
  X,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Minus,
  Plus,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Download,
  Printer,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { CulturalEvent } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { saveReservation } from '../../services/reservationStore';
import { handleImageError } from '../SafeImage';

interface TicketReservationModalProps {
  event: CulturalEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketReservationModal: React.FC<TicketReservationModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const { user, login, logout } = useAuth();

  // Step: 'auth' | 'form' | 'payment' | 'processing' | 'success'
  const [currentStep, setCurrentStep] = useState<'auth' | 'form' | 'payment' | 'processing' | 'success'>('auth');

  // Auth Form State (used if user is not logged in)
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Synchronize auth state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (!user) {
        setCurrentStep('auth');
      } else {
        setCurrentStep('form');
      }
    }
  }, [isOpen]);

  // Participant Information derived from logged in user
  const defaultName = user?.name || 'Voyageur Connecté';
  const defaultEmail = user?.email || 'voyageur@example.com';
  
  const [phone, setPhone] = useState('+229 01 53 63 70 86');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'moov' | 'celtiis' | 'paypal' | 'card' | 'onsite'>('momo');
  const [paypalEmail, setPaypalEmail] = useState('');
  
  const [bookingRef, setBookingRef] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [momoPhone, setMomoPhone] = useState('+229 01 53 63 70 86');
  const [cardName, setCardName] = useState('Voyageur Connecté');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  if (!isOpen || !event) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authEmail.includes('@')) {
      setAuthError('Veuillez renseigner une adresse e-mail valide.');
      return;
    }
    if (!authPassword || authPassword.length < 3) {
      setAuthError('Le mot de passe doit contenir au moins 3 caractères.');
      return;
    }

    const nameToRegister = authTab === 'signup'
      ? (authFullName.trim() || authEmail.split('@')[0] || 'Voyageur Connecté')
      : (authFullName.trim() || authEmail.split('@')[0] || 'Voyageur Connecté');

    login(nameToRegister, authEmail.trim());
    setAuthError('');
    setCurrentStep('form');
  };

  // Extract numerical price if present (e.g., "5 000 XOF" -> 5000)
  const parsePrice = (priceStr: string): number => {
    if (!priceStr || priceStr.toLowerCase().includes('gratuit')) return 0;
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  const unitPriceNumber = parsePrice(event.price);
  const isFree = unitPriceNumber === 0;
  const totalPriceNumber = unitPriceNumber * quantity;

  const formattedTotalPrice = isFree
    ? 'Gratuit'
    : `${totalPriceNumber.toLocaleString('fr-FR')} XOF`;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFree || paymentMethod === 'onsite') {
      // Free or on-site payment skips online payment gateway
      triggerProcessingAndComplete();
    } else {
      // Proceed to Payment gateway step
      setMomoPhone(phone);
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerProcessingAndComplete();
  };

  const triggerProcessingAndComplete = () => {
    setCurrentStep('processing');
    setProcessingProgress(20);

    const randomRef = `BENIN-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomTxn = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setBookingRef(randomRef);
    setTransactionId(randomTxn);

    setTimeout(() => setProcessingProgress(60), 700);
    setTimeout(() => setProcessingProgress(90), 1400);
    setTimeout(() => {
      setProcessingProgress(100);
      setCurrentStep('success');

      // Save reservation into store
      saveReservation({
        code: randomRef,
        title: `Billet : ${event.title}`,
        category: 'BILLET',
        location: `${event.location}, Bénin`,
        dates: `${event.date} (${event.time})`,
        priceXOF: totalPriceNumber,
        status: 'Confirmée',
        image: event.image,
        customerName: defaultName,
        customerPhone: phone,
        customerEmail: defaultEmail,
        quantity: quantity,
        paymentMethod: paymentMethod === 'momo' ? 'MTN MoMo' : paymentMethod === 'moov' ? 'Moov Money' : paymentMethod === 'celtiis' ? 'Celtiis Cash' : paymentMethod === 'card' ? 'Carte Bancaire' : paymentMethod === 'paypal' ? 'PayPal' : 'Sur place',
        detailsNote: `${quantity} Billet(s) pour ${event.title}`,
      });
    }, 2000);
  };

  const handleResetAndClose = () => {
    setCurrentStep('form');
    setQuantity(1);
    setShowEmailPreview(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#003580] via-[#00255c] to-[#00173b] px-6 py-5 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-sm">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {currentStep === 'auth' && "Connexion ou Inscription requise"}
                {currentStep === 'form' && "Formulaire de réservation de billet"}
                {currentStep === 'payment' && "Paiement sécurisé en ligne"}
                {currentStep === 'processing' && "Validation du paiement..."}
                {currentStep === 'success' && "Billet Électronique Validé"}
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                {currentStep === 'auth' && "Veuillez vous identifier pour émettre un billet nominatif"}
                {currentStep === 'form' && "Billetterie officielle & Accès prioritaire"}
                {currentStep === 'payment' && "Paiement Mobile Money / Carte bancaire"}
                {currentStep === 'processing' && "Interconnexion avec l'opérateur de paiement..."}
                {currentStep === 'success' && "Facture acquittée & Pass prêt pour l'accès"}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 0: AUTHENTICATION REQUIRED (MATCHING AFROKU SPEC) */}
        {currentStep === 'auth' && (
          <form onSubmit={handleAuthSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Header matching screenshot */}
            <div className="text-center space-y-1 pb-2 border-b border-slate-100">
              <div className="text-2xl font-black text-[#003580] tracking-tight">
                AfroKu<span className="text-amber-500">.com</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {authTab === 'signup' ? 'Créer un compte AfroKu' : 'Se connecter à AfroKu'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {authTab === 'signup'
                  ? 'Créez un compte pour enregistrer votre profil et recevoir votre e-ticket.'
                  : 'Connectez-vous pour retrouver vos billets et séjours enregistrés.'}
              </p>
            </div>

            {/* Event Preview Pill */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-amber-300">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">Billet sélectionné</span>
                  <strong className="text-slate-900 font-bold block truncate">{event.title}</strong>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-500 text-white font-extrabold text-xs rounded-lg shrink-0 shadow-2xs">
                {event.price}
              </span>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold text-xs rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-4">
              {authTab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NOM & PRÉNOM
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="Ex: Kouandété Codjo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#003580] focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ADRESSE E-MAIL
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#003580] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  MOT DE PASSE
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#003580] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#003580] hover:bg-[#002866] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {authTab === 'signup' ? 'Créer un compte & Continuer' : 'Se connecter'}
            </button>

            <div className="text-center pt-1 text-xs text-slate-600">
              {authTab === 'login' ? (
                <span>
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                    className="text-[#006ce4] font-bold hover:underline cursor-pointer"
                  >
                    Créer un compte
                  </button>
                </span>
              ) : (
                <span>
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthTab('login'); setAuthError(''); }}
                    className="text-[#006ce4] font-bold hover:underline cursor-pointer"
                  >
                    Se connecter
                  </button>
                </span>
              )}
            </div>
          </form>
        )}

        {currentStep === 'form' && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* SECTION 1: Informations de l'événement (lecture seule) */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[#003580] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#003580]" />
                  Informations de l'événement (lecture seule)
                </span>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {event.price}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-1 items-start sm:items-center">
                <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-700 w-full">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Événement :</span>
                    <strong className="text-slate-900 font-bold text-sm block leading-tight">{event.title}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Lieu :</span>
                    <div className="flex items-center gap-1 text-slate-900 font-semibold mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Date :</span>
                    <div className="flex items-center gap-1 text-slate-900 font-semibold mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Heure :</span>
                    <div className="flex items-center gap-1 text-slate-900 font-semibold mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{event.time || '09h00 (Ouverture des portes)'}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-200/60 mt-1">
                    <span className="text-slate-400 font-medium block text-[11px]">Organisateur :</span>
                    <div className="flex items-center gap-1.5 text-slate-900 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{event.organizer || 'Ministère du Tourisme, de la Culture et des Arts du Bénin'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Informations du participant */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#003580]" />
                  Informations du participant
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Compte connecté
                </span>
              </div>

              <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#003580] text-amber-400 font-extrabold flex items-center justify-center text-xs shadow-xs">
                    {defaultName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">{defaultName}</span>
                    <span className="text-slate-600 text-[11px]">{defaultEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[10px] font-extrabold uppercase text-[#003580] bg-blue-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                    Compte Vérifié
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setCurrentStep('auth');
                    }}
                    className="text-[11px] font-bold text-[#003580] hover:text-amber-600 bg-white border border-blue-200 hover:border-amber-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Changer de compte
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom complet */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom complet <span className="text-slate-500 font-normal">(Issu de votre compte • Non modifiable)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={defaultName}
                      readOnly
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 cursor-not-allowed select-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Adresse e-mail */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse e-mail <span className="text-slate-500 font-normal">(Issu de votre compte • Gmail)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={defaultEmail}
                      readOnly
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 cursor-not-allowed select-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone <span className="text-emerald-700 font-medium">(pré-rempli, modifiable si nécessaire)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+229 01 00 00 00 00"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20 rounded-xl text-xs font-bold text-slate-900 outline-none transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Votre réservation */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#003580]" />
                Votre réservation
              </h3>

              {/* Sélecteur de quantité */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Nombre de billets</span>
                  <span className="text-xs text-slate-500">Choisissez la quantité souhaitée (max. 10 billets)</span>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 border border-slate-300 rounded-2xl shadow-xs">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Diminuer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-10 text-center text-lg font-black text-slate-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= 10}
                    className="p-2 rounded-xl bg-[#003580] hover:bg-[#00255c] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Augmenter"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mode de paiement */}
              {!isFree && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mode de paiement / Réseau réseau
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'momo'
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span className="text-[11px]">MTN MoMo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('moov')}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'moov'
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="text-[11px]">Moov Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('celtiis')}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'celtiis'
                          ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      <span className="text-[11px]">Celtiis Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'paypal'
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-sky-600" />
                      <span className="text-[11px]">PayPal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px]">Carte Visa/MC</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('onsite')}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'onsite'
                          ? 'bg-slate-100 border-slate-500 ring-2 ring-slate-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-slate-600" />
                      <span className="text-[11px]">Guichet Sur Place</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Résumé du total */}
              <div className="bg-[#00224f] text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                <div>
                  <span className="text-xs text-slate-300 block">Total à régler</span>
                  <span className="text-xs font-medium text-amber-300">
                    {quantity} billet{quantity > 1 ? 's' : ''} x {event.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-white">{formattedTotalPrice}</span>
                </div>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#003580] to-[#00255c] hover:from-[#00255c] hover:to-[#00173b] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>
                  {isFree || paymentMethod === 'onsite'
                    ? `Confirmer la réservation (${formattedTotalPrice})`
                    : `Procéder au paiement de ${formattedTotalPrice}`}
                </span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Transaction sécurisée SSL & Envoi automatique e-ticket Gmail
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT GATEWAY INTERFACE */}
        {currentStep === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-amber-700 block">Commande Billetterie</span>
                <span className="text-sm font-extrabold text-slate-900">{event.title} ({quantity} billet{quantity > 1 ? 's' : ''})</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Montant total</span>
                <span className="text-lg font-black text-[#003580]">{formattedTotalPrice}</span>
              </div>
            </div>

            {/* Mobile Money Payment (MTN, Moov, Celtiis) */}
            {(paymentMethod === 'momo' || paymentMethod === 'moov' || paymentMethod === 'celtiis') && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs ${
                    paymentMethod === 'momo' ? 'bg-amber-500' : paymentMethod === 'moov' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {paymentMethod === 'momo' ? 'MTN' : paymentMethod === 'moov' ? 'MOOV' : 'CELTIIS'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Paiement via {paymentMethod === 'momo' ? 'MTN Mobile Money' : paymentMethod === 'moov' ? 'Moov Money' : 'Celtiis Cash'}
                    </h4>
                    <p className="text-xs text-slate-500">Une demande de débit USSD sera envoyée sur votre téléphone Bénin.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Numéro de téléphone du compte Mobile Money
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20 rounded-xl text-xs font-bold text-slate-900 outline-none"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                  <p className="font-semibold">📲 Étapes après validation :</p>
                  <ol className="list-decimal list-inside text-[11px] space-y-0.5 text-blue-800">
                    <li>Vous recevrez un prompt USSD sur le numéro <strong>{momoPhone}</strong>.</li>
                    <li>Saisissez votre code PIN secret pour autoriser le paiement de <strong>{formattedTotalPrice}</strong>.</li>
                    <li>Votre billet officiel avec QR Code sera instantanément délivré et envoyé sur Gmail.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                    PP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Paiement via PayPal</h4>
                    <p className="text-xs text-slate-500">Règlement sécurisé pour cartes et comptes internationaux.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Adresse e-mail de votre compte PayPal
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={paypalEmail || defaultEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      required
                      placeholder="nom@exemple.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/20 rounded-xl text-xs font-bold text-slate-900 outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            )}

            {/* Credit Card Payment */}
            {paymentMethod === 'card' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">Carte Bancaire Visa / MasterCard</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom sur la carte</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de carte</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expiration</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        defaultValue="888"
                        required
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('form')}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Confirmer et Payer ({formattedTotalPrice})</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROCESSING ANIMATION */}
        {currentStep === 'processing' && (
          <div className="p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-25" />
              <div className="w-20 h-20 border-4 border-[#003580] border-t-amber-400 rounded-full animate-spin" />
              <Ticket className="w-8 h-8 text-[#003580] absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Paiement en cours de validation...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Veuillez patienter pendant que nous communiquons avec les serveurs bancaires et générons votre billet sécurisé.
              </p>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden max-w-md mx-auto border border-slate-200">
              <div
                className="bg-gradient-to-r from-[#003580] to-amber-400 h-full transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              />
            </div>

            <p className="text-[11px] font-mono font-bold text-amber-700">
              {processingProgress < 40 && "1/3 Initialisation de la transaction..."}
              {processingProgress >= 40 && processingProgress < 80 && "2/3 Validation du débit Mobile Money / Carte..."}
              {processingProgress >= 80 && "3/3 Génération du QR Code & Envoi Gmail..."}
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS & TICKET DELIVERED */}
        {currentStep === 'success' && (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {isFree ? 'Réservation confirmée !' : 'Paiement confirmé & Billet émis !'}
              </h3>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statut : Facture Acquittée ({transactionId || 'PAIEMENT-VALIDE'})</span>
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-1">
                Votre réservation pour <strong className="text-slate-900">{event.title}</strong> a été validée avec succès.
                Le récapitulatif ainsi que votre billet PDF ont été envoyés à <span className="font-semibold text-slate-900">{defaultEmail}</span>.
              </p>
            </div>

            {/* Email Notification Indicator & Preview Toggle */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">E-mail de confirmation envoyé</span>
                  <span className="text-slate-600">Envoyé à <strong>{defaultEmail}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="px-4 py-2 bg-white hover:bg-amber-100 text-[#003580] border border-amber-300 font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>{showEmailPreview ? "Masquer l'aperçu Gmail" : "Voir l'e-mail Gmail reçu"}</span>
              </button>
            </div>

            {/* Simulated Gmail Message Box */}
            {showEmailPreview && (
              <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 text-xs space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="font-bold text-slate-900">Boîte de Réception Gmail - Confirmation de Billet</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">À l'instant</span>
                </div>

                <div className="space-y-1 text-slate-700">
                  <p><strong>De :</strong> Billetterie Officielle Tourisme Bénin &lt;billetterie@tourisme.gouv.bj&gt;</p>
                  <p><strong>À :</strong> {defaultName} &lt;{defaultEmail}&gt;</p>
                  <p><strong>Objet :</strong> 🎫 Votre billet officiel pour {event.title} (Réf: {bookingRef})</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-slate-800">
                  <p className="font-bold text-slate-900">Bonjour {defaultName},</p>
                  <p>
                    Nous vous confirmons la réservation de <strong>{quantity} billet(s)</strong> pour l'événement <strong>{event.title}</strong>.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                    <p>• <strong>Événement :</strong> {event.title}</p>
                    <p>• <strong>Lieu :</strong> {event.location}</p>
                    <p>• <strong>Date :</strong> {event.date} à {event.time || '09h00'}</p>
                    <p>• <strong>Référence Billet :</strong> {bookingRef}</p>
                    <p>• <strong>Montant Payé :</strong> {formattedTotalPrice}</p>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Veuillez présenter le QR Code présent sur votre pass ou le PDF ci-joint à l'entrée de l'événement.
                  </p>
                  <p className="text-slate-500 font-medium text-[11px] pt-1">
                    Cordialement,<br />
                    L'équipe de la Billetterie Touristique du Bénin
                  </p>
                </div>
              </div>
            )}

            {/* Visual E-Ticket Card */}
            <div className="bg-gradient-to-br from-slate-900 via-[#00224f] to-slate-900 text-white rounded-3xl p-6 border border-amber-500/30 shadow-xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Pass Électronique Officiel</span>
                </div>
                <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-md border border-white/20 text-slate-200">
                  Ref: {bookingRef}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="text-lg font-black text-white leading-tight">{event.title}</h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Date :</strong> {event.date}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Lieu :</strong> {event.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Participant :</strong> {defaultName}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Quantité :</strong> {quantity} billet{quantity > 1 ? 's' : ''}</span>
                    </p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex flex-col items-center justify-center p-3 bg-white text-slate-900 rounded-2xl border-2 border-amber-400 shadow-md">
                  <QrCode className="w-20 h-20 text-slate-900" />
                  <span className="text-[10px] font-mono font-bold text-slate-600 mt-1 uppercase">Scan Guichet</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Organisateur: {event.organizer || 'Ministère du Tourisme'}</span>
                <span className="font-extrabold text-amber-400 text-sm">{formattedTotalPrice}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert(`Téléchargement du billet PDF (${bookingRef})...`)}
                className="w-full sm:w-auto px-6 py-3 bg-[#003580] hover:bg-[#00255c] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Télécharger le billet PDF</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimer</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
