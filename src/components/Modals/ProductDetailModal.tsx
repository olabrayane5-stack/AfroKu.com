import React, { useState } from 'react';
import { ArtisanProductItem, ArtisanProductReview } from '../../types';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Lock,
  UserCheck,
  Award,
  PackageCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Layers,
  Ruler,
  Weight,
  Palette,
  RotateCcw,
  Headphones,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Send,
  User
} from 'lucide-react';
import { BeninFlag } from '../BeninFlag';
import { useAuth } from '../../context/AuthContext';
import { handleImageError } from '../SafeImage';

interface ProductDetailModalProps {
  product: ArtisanProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'caracteristiques' | 'authenticite' | 'livraison' | 'artisan'>('details');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [selectedNetwork, setSelectedNetwork] = useState<'momo' | 'moov' | 'celtiis' | 'paypal' | 'card' | 'delivery'>('momo');
  const [networkAccount, setNetworkAccount] = useState<string>('');
  const [showCheckoutStep, setShowCheckoutStep] = useState<boolean>(false);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  // Reviews local state
  const [localReviews, setLocalReviews] = useState<ArtisanProductReview[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewPostedMsg, setReviewPostedMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setOrderQuantity(1);
      setOrderComplete(false);
      setIsOrdering(false);
      setShowCheckoutStep(false);
      setNetworkAccount('');
      setLocalReviews(product.reviews || []);
      setNewRating(5);
      setNewComment('');
      setReviewPostedMsg(null);
    }
  }, [product]);

  const handleAddProductReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
      return;
    }
    if (!newComment.trim()) return;

    const newRev: ArtisanProductReview = {
      id: Date.now().toString(),
      userName: user.name,
      rating: newRating,
      date: "À l'instant",
      comment: newComment.trim(),
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewComment('');
    setNewRating(5);
    setReviewPostedMsg(`Votre avis (${newRating}★) a été publié avec succès sous le nom de ${user.name}.`);
    setTimeout(() => setReviewPostedMsg(null), 5000);
  };

  if (!isOpen || !product) return null;

  const priceEUR = Math.round(product.priceXOF / 655.957);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
      return;
    }
    if (!showCheckoutStep) {
      setShowCheckoutStep(true);
      return;
    }
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderComplete(true);
      if (onOrderSuccess) {
        onOrderSuccess(product.name);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal Bar */}
        <div className="bg-gradient-to-r from-[#003580] via-[#00255c] to-amber-950 px-6 py-4 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-lg tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-2">
              <BeninFlag className="w-5 h-3.5 rounded-xs shadow-xs" />
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wide hidden sm:inline">
                Artisanat Authentique du Bénin
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Commande Validée avec succès !
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Merci pour votre soutien à l'artisanat béninois
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Votre commande pour <strong>{product.name}</strong> a été enregistrée. L'artisan <strong>{product.artisanName}</strong> prépare votre création. Un conseiller AfroKu vous contactera par WhatsApp/Email sous peu.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Client :</span>
                <span className="font-bold text-slate-900">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Produit :</span>
                <span className="font-bold text-slate-900">{product.name} (x{orderQuantity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Réseau de paiement :</span>
                <span className="font-extrabold text-amber-600 uppercase">
                  {selectedNetwork === 'momo' && 'MTN Mobile Money Bénin'}
                  {selectedNetwork === 'moov' && 'Moov Money Africa Bénin'}
                  {selectedNetwork === 'celtiis' && 'Celtiis Cash Bénin'}
                  {selectedNetwork === 'paypal' && 'PayPal International'}
                  {selectedNetwork === 'card' && 'Carte Visa / MC'}
                  {selectedNetwork === 'delivery' && 'Paiement à la livraison'}
                </span>
              </div>
              {networkAccount && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Compte/Réf :</span>
                  <span className="font-bold text-slate-800">{networkAccount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500">Total :</span>
                <span className="font-extrabold text-[#003580]">{(product.priceXOF * orderQuantity).toLocaleString('fr-FR')} XOF</span>
              </div>
            </div>

            <button
              onClick={() => setOrderComplete(false)}
              className="px-6 py-3 bg-[#003580] hover:bg-[#00255c] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              Retour à la fiche produit
            </button>
          </div>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Top Product Hero & Quick Overview */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 border-b border-slate-200">
              {/* Product Gallery */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-300"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
                    product.availability === 'En stock'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {product.availability}
                  </span>

                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-extrabold border border-amber-400/30">
                    {product.editionType}
                  </span>
                </div>

                {/* Thumbnails */}
                {product.galleryImages && product.galleryImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {product.galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                          selectedImage === img ? 'border-[#003580] scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Aperçu ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={handleImageError} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* General Information & Pricing */}
              <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.artisanRating} ({product.artisanReviewCount} avis)</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight font-serif">
                    {product.name}
                  </h1>

                  {/* Artisan Badge */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-8 h-8 rounded-full bg-[#003580] text-amber-400 font-bold flex items-center justify-center text-xs shadow-xs">
                      {product.artisanName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Artisan Créateur</span>
                      <strong className="text-xs text-slate-800 font-extrabold">{product.artisanName}</strong>
                      <span className="text-[11px] text-slate-500"> ({product.artisanCity}, Bénin)</span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex items-baseline justify-between mt-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#003580] uppercase tracking-wider block">Prix Officiel d'Atelier</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#003580]">
                        {product.priceXOF.toLocaleString('fr-FR')} XOF
                      </span>
                      <span className="text-xs font-bold text-slate-500 ml-2">
                        (≈ {priceEUR} €)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md block">
                        Disponibilité : {product.availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Highlights Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium">100% Fait Main au Bénin</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-slate-700 font-medium">Certificat d'Authenticité</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-700 font-medium">Livraison Nationale & Intl.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="text-slate-700 font-medium">Paiement Sécurisé SSL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
              <div className="flex overflow-x-auto px-6 space-x-6 scrollbar-none">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'details'
                      ? 'border-[#003580] text-[#003580]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  📝 Description & Histoire
                </button>
                <button
                  onClick={() => setActiveTab('caracteristiques')}
                  className={`py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'caracteristiques'
                      ? 'border-[#003580] text-[#003580]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  📐 Caractéristiques
                </button>
                <button
                  onClick={() => setActiveTab('authenticite')}
                  className={`py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'authenticite'
                      ? 'border-[#003580] text-[#003580]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  🛡️ Authenticité & Qualité
                </button>
                <button
                  onClick={() => setActiveTab('livraison')}
                  className={`py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'livraison'
                      ? 'border-[#003580] text-[#003580]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  🚚 Livraison & Garanties
                </button>
                <button
                  onClick={() => setActiveTab('artisan')}
                  className={`py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'artisan'
                      ? 'border-[#003580] text-[#003580]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  👨🏽🎨 À Propos de l'Artisan
                </button>
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 space-y-6">
              {/* TAB 1: DESCRIPTION */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      Histoire & Inspiration
                    </h3>
                    <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                      {product.historyInspiration}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#003580]" />
                        Signification Culturelle
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {product.culturalSignificance}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#003580]" />
                        Technique de Fabrication
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {product.manufacturingTechnique}
                      </p>
                    </div>
                  </div>

                  {product.specialFeatures && (
                    <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-1">
                      <h4 className="text-xs font-extrabold text-[#003580] uppercase tracking-wider">
                        Particularités du Produit
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {product.specialFeatures}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CARACTÉRISTIQUES */}
              {activeTab === 'caracteristiques' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        Matériau(x)
                      </span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.materials.map((m, idx) => (
                          <span key={idx} className="bg-white border border-slate-300 text-slate-800 font-extrabold text-xs px-2.5 py-1 rounded-lg">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-blue-600" />
                        Dimensions
                      </span>
                      <strong className="text-xs font-extrabold text-slate-900 block pt-1">
                        {product.dimensions}
                      </strong>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Weight className="w-3.5 h-3.5 text-emerald-600" />
                        Poids
                      </span>
                      <strong className="text-xs font-extrabold text-slate-900 block pt-1">
                        {product.weight}
                      </strong>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-purple-600" />
                        Couleur(s)
                      </span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.colors.map((c, idx) => (
                          <span key={idx} className="bg-white border border-slate-300 text-slate-800 font-bold text-xs px-2 py-0.5 rounded-md">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Fabrication Artisanal
                      </span>
                      <strong className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200 pt-1">
                        {product.isHandmade ? 'Oui (100% Fait Main)' : 'Non'}
                      </strong>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Édition & Tirage
                      </span>
                      <strong className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block border border-amber-200 pt-1">
                        {product.editionType}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AUTHENTICITÉ & QUALITÉ */}
              {activeTab === 'authenticite' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-emerald-950">
                          Garantie d'AuthenticitéAfroKu
                        </h3>
                        <p className="text-xs text-emerald-800">
                          Chaque œuvre référencée est certifiée provenant directement des ateliers artisanaux agréés du Bénin.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Produit 100% Artisanal fait main</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-slate-800">
                        <BeninFlag className="w-5 h-3.5 rounded-xs shrink-0" />
                        <span>Fabriqué localement au Bénin</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Certificat d'Authenticité Officiel inclus</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-slate-800">
                        <PackageCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Contrôle qualité individuel effectué</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1 text-xs">
                    <h4 className="font-extrabold text-slate-900 uppercase">Engagement Matériaux Nobles</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {product.qualityMaterials}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: LIVRAISON & GARANTIES */}
              {activeTab === 'livraison' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Delivery Block */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#003580]" />
                        Options de Livraison
                      </h3>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Livraison Nationale :</strong> {product.nationalDelivery}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Livraison Internationale :</strong> {product.internationalDelivery}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Délais d'expédition :</strong> {product.estimatedDeliveryTime}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Retrait sur place :</strong> {product.pickupAvailable ? `Disponible (${product.pickupLocation})` : 'Non disponible'}
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Guarantees Block */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#003580]" />
                        Protections & Garanties
                      </h3>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Paiement Sécurisé :</strong> {product.securePayment}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Politique de Retour :</strong> {product.returnPolicy}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <PackageCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Emballage Sécurisé :</strong> {product.securePackaging}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Headphones className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Assistance Client :</strong> {product.customerSupport}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: À PROPOS DE L'ARTISAN */}
              {activeTab === 'artisan' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#003580] text-amber-400 font-extrabold text-xl flex items-center justify-center shadow-md border-2 border-amber-300 shrink-0">
                          {product.artisanName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 font-serif">
                            {product.artisanName}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            <span>Atelier à {product.artisanCity}, Bénin</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-2xs">
                        <div className="text-center border-r border-slate-200 pr-3">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Expérience</span>
                          <strong className="text-xs font-black text-slate-900">{product.artisanExperienceYears} Ans</strong>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Créations</span>
                          <strong className="text-xs font-black text-[#003580]">{product.artisanCreationCount}+ pièces</strong>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Biographie de l'Artisan</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {product.artisanBio}
                      </p>
                    </div>
                  </div>

                  {/* Customer Reviews Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-serif">
                        <MessageSquare className="w-4.5 h-4.5 text-[#003580]" />
                        <span>Avis et Évaluations de l'Œuvre ({localReviews.length})</span>
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-extrabold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{product.artisanRating} / 5.0</span>
                      </div>
                    </div>

                    {/* Add Review Form Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          <span>Donner votre avis sur cette création</span>
                        </h5>
                        {user ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Connecté en tant que : {user.name}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            Connexion requise
                          </span>
                        )}
                      </div>

                      {reviewPostedMsg && (
                        <div className="p-3 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-300">
                          {reviewPostedMsg}
                        </div>
                      )}

                      {!user ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900">
                          <p className="font-semibold">
                            Vous devez être connecté à votre compte pour publier un avis sous votre nom.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }))}
                              className="px-3 py-1.5 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#00255c] transition-colors cursor-pointer"
                            >
                              Se connecter
                            </button>
                            <button
                              type="button"
                              onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_signup' }))}
                              className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
                            >
                              S'inscrire
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleAddProductReview} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">Votre note :</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setNewRating(star)}
                                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={`Bonjour ${user.name}, partagez votre avis sur l'authenticité et la qualité de ce produit...`}
                            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#003580] focus:outline-hidden"
                            required
                          />

                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 italic">
                              L'avis apparaîtra publiquement sous le nom : <strong>{user.name}</strong>
                            </span>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#003580] hover:bg-[#00255c] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-400" />
                              <span>Publier mon avis</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Review Cards List */}
                    <div className="space-y-3">
                      {localReviews.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-4">
                          Aucun avis pour l'instant. Soyez le premier à donner votre avis sous votre nom !
                        </p>
                      ) : (
                        localReviews.map((rev) => (
                          <div key={rev.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#003580] text-amber-400 font-extrabold flex items-center justify-center text-xs">
                                  {rev.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-extrabold text-slate-900 block leading-none">{rev.userName}</span>
                                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal pt-1">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STICKY BOTTOM CHECKOUT & ACTION BAR */}
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800 sticky bottom-0 z-20 space-y-3">
              {showCheckoutStep && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-amber-400/40 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Sélectionnez votre réseau de paiement
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutStep(false)}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Masquer
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('momo')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        selectedNetwork === 'momo'
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold ring-1 ring-amber-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span>MTN MoMo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('moov')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        selectedNetwork === 'moov'
                          ? 'bg-blue-400/20 border-blue-400 text-blue-300 font-bold ring-1 ring-blue-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                      <span>Moov Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('celtiis')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        selectedNetwork === 'celtiis'
                          ? 'bg-purple-400/20 border-purple-400 text-purple-300 font-bold ring-1 ring-purple-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                      <span>Celtiis Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('paypal')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        selectedNetwork === 'paypal'
                          ? 'bg-sky-400/20 border-sky-400 text-sky-300 font-bold ring-1 ring-sky-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                      <span>PayPal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('card')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        selectedNetwork === 'card'
                          ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300 font-bold ring-1 ring-emerald-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>Carte Visa/MC</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('delivery')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        selectedNetwork === 'delivery'
                          ? 'bg-slate-400/20 border-slate-300 text-slate-200 font-bold ring-1 ring-slate-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      <span>Paiement à la livraison</span>
                    </button>
                  </div>

                  {selectedNetwork !== 'delivery' && (
                    <input
                      type={selectedNetwork === 'paypal' ? 'email' : 'text'}
                      placeholder={
                        selectedNetwork === 'paypal'
                          ? 'Email de votre compte PayPal'
                          : selectedNetwork === 'card'
                          ? 'Numéro de Carte Visa / MasterCard'
                          : 'Numéro de téléphone (+229 XX XX XX XX)'
                      }
                      value={networkAccount}
                      onChange={(e) => setNetworkAccount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Prix Total</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-xl font-black text-amber-400">
                        {(product.priceXOF * orderQuantity).toLocaleString('fr-FR')} XOF
                      </strong>
                      <span className="text-xs text-slate-400 font-semibold">
                        (≈ {Math.round((product.priceXOF * orderQuantity) / 655.957)} €)
                      </span>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-700 bg-slate-800 rounded-xl overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="px-3 py-2 font-bold text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 font-extrabold text-amber-300">{orderQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="px-3 py-2 font-bold text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit} className="w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isOrdering}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isOrdering
                        ? 'Validation du paiement...'
                        : showCheckoutStep
                        ? 'Valider et Payer'
                        : 'Commander cette œuvre'}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
