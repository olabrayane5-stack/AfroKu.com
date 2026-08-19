import React, { useState } from 'react';
import { BENIN_ARTISANS, BENIN_ARTISAN_PRODUCTS, BENIN_ARTISAN_SHOPS } from '../../data/beninData';
import { ArtisanProductItem, ArtisanShopItem } from '../../types';
import { ProductDetailModal } from '../Modals/ProductDetailModal';
import { saveReservation } from '../../services/reservationStore';
import {
  Palette,
  MapPin,
  Star,
  ShoppingBag,
  Calendar,
  Check,
  ShieldCheck,
  Filter,
  Eye,
  Award,
  Truck,
  Layers,
  Search,
  Store,
  Clock,
  Building2,
  MessageSquare,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BeninFlag } from '../BeninFlag';
import { handleImageError } from '../SafeImage';

export const ArtisansView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'shops' | 'workshops'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedProduct, setSelectedProduct] = useState<ArtisanProductItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  const [selectedArtisanObj, setSelectedArtisanObj] = useState<any | null>(null);
  const [workshopParticipants, setWorkshopParticipants] = useState<number>(1);
  const [workshopDate, setWorkshopDate] = useState<string>('');
  const [workshopNetwork, setWorkshopNetwork] = useState<'momo' | 'moov' | 'celtiis' | 'paypal' | 'card' | 'onsite'>('momo');
  const [workshopAccountInput, setWorkshopAccountInput] = useState<string>('');
  const [isBookingWorkshopSubmit, setIsBookingWorkshopSubmit] = useState<boolean>(false);
  const [bookedWorkshop, setBookedWorkshop] = useState<boolean>(false);
  const [workshopRef, setWorkshopRef] = useState<string>('');
  const [workshopSearch, setWorkshopSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Tous');

  const handleStartWorkshopBooking = (artisan: any) => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
      return;
    }
    setSelectedArtisanObj(artisan);
    setWorkshopParticipants(1);
    setWorkshopDate(artisan.nextSessionDate || new Date().toISOString().split('T')[0]);
    setWorkshopNetwork('momo');
    setWorkshopAccountInput('');
    setBookedWorkshop(false);
  };

  const handleConfirmWorkshopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtisanObj || !user) return;
    setIsBookingWorkshopSubmit(true);
    setTimeout(() => {
      const generatedRef = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsBookingWorkshopSubmit(false);
      setWorkshopRef(generatedRef);
      setBookedWorkshop(true);

      const unitPrice = selectedArtisanObj.workshopPriceXOF || 20000;
      const totalXOF = unitPrice * workshopParticipants;

      saveReservation({
        code: generatedRef,
        title: `Atelier : ${selectedArtisanObj.craft} avec ${selectedArtisanObj.name}`,
        category: 'ARTISAN',
        location: `${selectedArtisanObj.location}, Bénin`,
        dates: `${workshopDate}`,
        priceXOF: totalXOF,
        status: 'Confirmée',
        image: selectedArtisanObj.photo,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: workshopAccountInput || '+229 01 53 63 70 86',
        quantity: workshopParticipants,
        paymentMethod: workshopNetwork === 'momo' ? 'MTN MoMo' : workshopNetwork === 'moov' ? 'Moov Money' : workshopNetwork === 'celtiis' ? 'Celtiis Cash' : workshopNetwork === 'card' ? 'Carte Bancaire' : workshopNetwork === 'paypal' ? 'PayPal' : 'Sur place',
        detailsNote: `Atelier pratique à ${selectedArtisanObj.workshopName} pour ${workshopParticipants} participant(s)`,
      });
    }, 1200);
  };

  // Shops filters
  const [shopSearch, setShopSearch] = useState<string>('');
  const [selectedShopDept, setSelectedShopDept] = useState<string>('Tous');

  const categories = [
    'Tous',
    'Bijoux',
    'Statues',
    'Sculptures',
    'Masques',
    'Tissus',
    'Poteries',
    'Peintures',
    'Accessoires'
  ];

  const filteredProducts = selectedCategory === 'Tous'
    ? BENIN_ARTISAN_PRODUCTS
    : BENIN_ARTISAN_PRODUCTS.filter((p) => p.category === selectedCategory);

  const filteredShops = BENIN_ARTISAN_SHOPS.filter((shop) => {
    const matchesDept = selectedShopDept === 'Tous' || shop.department === selectedShopDept;
    const searchLower = shopSearch.toLowerCase();
    const matchesSearch = !shopSearch ||
      shop.name.toLowerCase().includes(searchLower) ||
      shop.artisanName.toLowerCase().includes(searchLower) ||
      shop.city.toLowerCase().includes(searchLower) ||
      shop.specialty.toLowerCase().includes(searchLower) ||
      shop.department.toLowerCase().includes(searchLower);
    return matchesDept && matchesSearch;
  });

  const filteredWorkshops = BENIN_ARTISANS.filter((art) => {
    const matchesDept = selectedDepartment === 'Tous' || art.department === selectedDepartment;
    const searchLower = workshopSearch.toLowerCase();
    const matchesSearch = !workshopSearch ||
      art.name.toLowerCase().includes(searchLower) ||
      art.craft.toLowerCase().includes(searchLower) ||
      art.location.toLowerCase().includes(searchLower) ||
      art.workshopName.toLowerCase().includes(searchLower) ||
      (art.department && art.department.toLowerCase().includes(searchLower));
    return matchesDept && matchesSearch;
  });

  const handleOpenProduct = (product: ArtisanProductItem) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrderSuccess = (productName: string) => {
    setOrderSuccessMessage(`Félicitations ! Votre commande pour "${productName}" a été validée. Un reçu avec certificat d'authenticité a été généré.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Artisans */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Artisanat & Galerie Royale
            </span>
            <BeninFlag className="w-5 h-3.5 rounded-xs shadow-xs" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Boutiques d'Artisans, Œuvres & Ateliers
          </h1>
          <p className="text-amber-100 text-sm leading-relaxed">
            Achetez des œuvres uniques faites main, visitez les vraies Boutiques Physiques & Centres Artisanaux du Bénin, ou réservez un atelier pratique d'initiation.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-partner-modal', { detail: 'artisan' }))}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mb-1 sm:mb-0"
          >
            <Palette className="w-4 h-4" />
            <span>Exposer mon Atelier / Créations</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-slate-950 shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catalogue ({BENIN_ARTISAN_PRODUCTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'shops'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Boutiques Physiques ({BENIN_ARTISAN_SHOPS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'workshops'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Ateliers Pratiques ({BENIN_ARTISANS.length})</span>
          </button>
        </div>
      </div>

      {orderSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <span>{orderSuccessMessage}</span>
          </div>
          <button
            onClick={() => setOrderSuccessMessage(null)}
            className="text-xs text-emerald-800 underline font-extrabold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {bookedWorkshop && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Check className="w-5 h-5 text-amber-600" />
            <span>Votre réservation d'atelier artisanal avec {selectedArtisanObj?.name || 'le maître artisan'} a été enregistrée. Un conseiller AfroKu confirmera votre visite !</span>
          </div>
          <button onClick={() => setBookedWorkshop(false)} className="text-xs text-amber-800 underline font-bold cursor-pointer">
            Fermer
          </button>
        </div>
      )}

      {/* VIEW SECTION 1: PRODUCT SHOWCASE */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Categories Horizontal Filter */}
          <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600 shrink-0 px-2">
              <Filter className="w-4 h-4 text-[#003580]" />
              <span className="hidden sm:inline">Catégories :</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#003580] text-amber-300 shadow-md font-extrabold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleOpenProduct(prod)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-white text-[#003580] text-xs font-black uppercase rounded-xl shadow-lg flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        Voir la fiche détaillée
                      </span>
                    </div>

                    <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-md shadow-xs">
                      {prod.category}
                    </span>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                      {prod.editionType}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>Artisan : {prod.artisanName}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{prod.artisanRating}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-[#003580] transition-colors line-clamp-2 font-serif">
                      {prod.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Fait Main • Certifié Bénin</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Prix</span>
                    <strong className="text-base font-black text-[#003580]">
                      {prod.priceXOF.toLocaleString('fr-FR')} XOF
                    </strong>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProduct(prod);
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW SECTION 2: PHYSICAL ARTISAN SHOPS & COOPERATIVES */}
      {activeTab === 'shops' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 border border-amber-500/30 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                  Annuaire Officiel des Boutiques & Halles
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif">
                Visitez les Boutiques Physiques & Centres Artisanaux du Bénin
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Retrouvez les adresses physiques, points de vente certifiés, horaires d'ouverture et contacts WhatsApp directs des comptoirs artisanaux à Cotonou, Abomey, Sè, Djougou et Natitingou.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 text-xs space-y-1 shrink-0">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Boutiques Physiques Vérifiées</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Paiement Mobile Money / Espèces sur place ou livraison.
              </p>
            </div>
          </div>

          {/* Search & Department Filter for Shops */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une boutique, ville ou spécialité..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003580]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Département:
              </span>
              <select
                value={selectedShopDept}
                onChange={(e) => setSelectedShopDept(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003580] cursor-pointer"
              >
                <option value="Tous">Tous les départements ({BENIN_ARTISAN_SHOPS.length})</option>
                <option value="Littoral">Littoral (Cotonou)</option>
                <option value="Zou">Zou (Abomey)</option>
                <option value="Atlantique">Atlantique (Calavi, Ouidah)</option>
                <option value="Mono">Mono (Sè)</option>
                <option value="Donga">Donga (Djougou)</option>
                <option value="Ouémé">Ouémé (Porto-Novo, Adjara)</option>
                <option value="Atacora">Atacora (Natitingou)</option>
              </select>
            </div>
          </div>

          {/* Shops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={shop.photo}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-md shadow-md">
                        {shop.department}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900/90 text-amber-300 text-[10px] font-bold rounded-md backdrop-blur-xs flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {shop.verifiedLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-black rounded-lg flex items-center gap-1 border border-amber-400/30">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-[#003580] transition-colors">
                        {shop.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-800 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{shop.artisanName}</span>
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{shop.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#003580] shrink-0" />
                        <span className="font-semibold text-slate-800">{shop.openingHours}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {shop.description}
                    </p>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Spécialités de la Boutique :
                      </span>
                      <span className="text-xs font-semibold text-slate-800 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                        {shop.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Voir les articles ({shop.featuredProductsCount})</span>
                  </button>

                  <a
                    href={`https://wa.me/${shop.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=Bonjour%20!%20Je%20souhaite%20visiter%20votre%20boutique%20${encodeURIComponent(shop.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp / Téléphone</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredShops.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 font-serif">Aucune boutique ne correspond à votre recherche</h3>
              <p className="text-xs text-slate-500">Essayez de modifier vos critères de filtrage par département.</p>
              <button
                onClick={() => {
                  setShopSearch('');
                  setSelectedShopDept('Tous');
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW SECTION 3: WORKSHOPS & ARTISANS PROFILES */}
      {activeTab === 'workshops' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-amber-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 font-serif">
                  {BENIN_ARTISANS.length} Ateliers & Sessions Pratiques d'Initiation
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Rencontrez nos maîtres artisans à Abomey, Cotonou, Sè, Natitingou ou Djougou. Façonnez votre propre œuvre sous leurs conseils avisés.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto bg-white p-2 rounded-xl border border-amber-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800">
                Matériel fourni & Certificat remis en fin de stage
              </span>
            </div>
          </div>

          {/* Search & Department Filter for Workshops */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un artisan, un métier ou une ville..."
                value={workshopSearch}
                onChange={(e) => setWorkshopSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003580]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Département:
              </span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003580] cursor-pointer"
              >
                <option value="Tous">Tous les départements ({BENIN_ARTISANS.length})</option>
                <option value="Zou">Zou (Abomey, Bohicon, Covè)</option>
                <option value="Littoral">Littoral (Cotonou)</option>
                <option value="Atlantique">Atlantique (Ouidah, Calavi, Allada)</option>
                <option value="Mono">Mono (Sè, Grand-Popo)</option>
                <option value="Ouémé">Ouémé (Porto-Novo, Adjara)</option>
                <option value="Atacora">Atacora (Natitingou, Tanguiéta, Boukoumbé)</option>
                <option value="Borgou">Borgou (Parakou, Nikki)</option>
                <option value="Donga">Donga (Djougou)</option>
                <option value="Collines">Collines (Dassa-Zoumè)</option>
                <option value="Plateau">Plateau (Kétou)</option>
              </select>
            </div>
          </div>

          {/* Workshops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={art.photo}
                      alt={art.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-md shadow-md">
                        {art.craft}
                      </span>
                      {art.department && (
                        <span className="px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-md backdrop-blur-xs">
                          {art.department}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-black rounded-lg flex items-center gap-1 border border-amber-400/30">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{art.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-[#003580] transition-colors">
                        {art.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-800 flex items-center gap-1 mt-0.5">
                        <span>{art.workshopName}</span>
                      </p>
                      {art.physicalAddress ? (
                        <p className="text-[11px] font-medium text-slate-600 flex items-start gap-1 mt-1 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{art.physicalAddress}</span>
                        </p>
                      ) : (
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{art.location}</span>
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal break-words">
                      {art.description}
                    </p>

                    {/* Included services */}
                    {art.includedServices && art.includedServices.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Inclus dans la session :
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {art.includedServices.map((srv, idx) => (
                            <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200/50 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workshop Program preview */}
                    {art.workshopProgram && art.workshopProgram.length > 0 && (
                      <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                          Programme de l'Atelier Physique :
                        </span>
                        <ul className="space-y-1">
                          {art.workshopProgram.slice(0, 3).map((step, idx) => (
                            <li key={idx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-tight">
                              <span className="text-amber-400 font-extrabold shrink-0">•</span>
                              <span className="line-clamp-1">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Session Highlights Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-[#003580] shrink-0" />
                        <span className="truncate">{art.workshopDuration || '3 heures'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{art.workshopCapacity || '4 pers. max'}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1 text-slate-700 pt-1 border-t border-slate-200/60">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate text-emerald-800 font-semibold">{art.nextSessionDate || 'Prochaine session: Ce Samedi'}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Créations & Compétences transmises :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {art.products.map((p, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                            • {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tarif Atelier</span>
                    <strong className="text-base font-black text-[#003580]">
                      {(art.workshopPriceXOF || 20000).toLocaleString('fr-FR')} XOF
                    </strong>
                    <span className="text-[10px] text-slate-500 block">/ personne</span>
                  </div>

                  <button
                    onClick={() => handleStartWorkshopBooking(art)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Réserver la session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkshops.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 font-serif">Aucun atelier ne correspond à votre recherche</h3>
              <p className="text-xs text-slate-500">Essayez de modifier vos filtres ou de réinitialiser le département.</p>
              <button
                onClick={() => {
                  setWorkshopSearch('');
                  setSelectedDepartment('Tous');
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* WORKSHOP RESERVATION MODAL */}
      {selectedArtisanObj && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 relative my-auto">
            <button
              onClick={() => setSelectedArtisanObj(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookedWorkshop ? (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Atelier Réservé avec succès !
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-serif">
                    Stage Artisanal Confirmé
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Votre place pour l'atelier avec le maître artisan <strong>{selectedArtisanObj.name}</strong> a été enregistrée.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Artisan :</span>
                    <span className="font-bold text-slate-900">{selectedArtisanObj.name} ({selectedArtisanObj.craft})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Atelier / Lieu :</span>
                    <span className="font-bold text-slate-900">{selectedArtisanObj.workshopName} ({selectedArtisanObj.location})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Participants :</span>
                    <span className="font-bold text-slate-900">{workshopParticipants} personne(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paiement :</span>
                    <span className="font-extrabold text-amber-600 uppercase">
                      {workshopNetwork === 'momo' && 'MTN MoMo Bénin'}
                      {workshopNetwork === 'moov' && 'Moov Money Africa Bénin'}
                      {workshopNetwork === 'celtiis' && 'Celtiis Cash Bénin'}
                      {workshopNetwork === 'paypal' && 'PayPal'}
                      {workshopNetwork === 'card' && 'Carte Visa/MC'}
                      {workshopNetwork === 'onsite' && 'Sur Place à l\'atelier'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-500 font-bold">Réf. Atelier :</span>
                    <span className="font-extrabold text-[#003580]">{workshopRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Total Réglé :</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {((selectedArtisanObj.workshopPriceXOF || 20000) * workshopParticipants).toLocaleString('fr-FR')} XOF
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedArtisanObj(null)}
                  className="w-full py-3 bg-[#003580] hover:bg-[#00255b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmWorkshopSubmit} className="p-6 space-y-5">
                <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                  <img
                    src={selectedArtisanObj.photo}
                    alt={selectedArtisanObj.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shrink-0 mt-0.5"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=70';
                    }}
                  />
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base">Réservation - {selectedArtisanObj.workshopName}</h3>
                    <p className="text-xs font-bold text-amber-800">{selectedArtisanObj.name} • {selectedArtisanObj.craft}</p>
                    {selectedArtisanObj.physicalAddress && (
                      <p className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>{selectedArtisanObj.physicalAddress}</span>
                      </p>
                    )}
                    <span className="text-xs text-slate-500 font-bold block">{(selectedArtisanObj.workshopPriceXOF || 20000).toLocaleString()} XOF / personne</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date de session souhaitée
                    </label>
                    <input
                      type="text"
                      value={workshopDate}
                      onChange={(e) => setWorkshopDate(e.target.value)}
                      required
                      placeholder="Ex: Ce Samedi à 09h00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#003580]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre de participants : <span className="text-amber-600 font-extrabold">{workshopParticipants} participant(s)</span>
                    </label>
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden w-fit text-xs">
                      <button
                        type="button"
                        onClick={() => setWorkshopParticipants(Math.max(1, workshopParticipants - 1))}
                        className="px-3 py-2 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 font-black text-[#003580]">{workshopParticipants}</span>
                      <button
                        type="button"
                        onClick={() => setWorkshopParticipants(workshopParticipants + 1)}
                        className="px-3 py-2 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Réseau de Paiement
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWorkshopNetwork('momo')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          workshopNetwork === 'momo'
                            ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold ring-2 ring-amber-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        MTN MoMo
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkshopNetwork('moov')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          workshopNetwork === 'moov'
                            ? 'bg-blue-50 border-blue-500 text-slate-900 font-bold ring-2 ring-blue-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Moov Money
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkshopNetwork('celtiis')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          workshopNetwork === 'celtiis'
                            ? 'bg-purple-50 border-purple-500 text-slate-900 font-bold ring-2 ring-purple-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Celtiis Cash
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkshopNetwork('paypal')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          workshopNetwork === 'paypal'
                            ? 'bg-sky-50 border-sky-500 text-slate-900 font-bold ring-2 ring-sky-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        PayPal
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkshopNetwork('card')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          workshopNetwork === 'card'
                            ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-bold ring-2 ring-emerald-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Carte Visa/MC
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkshopNetwork('onsite')}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                          workshopNetwork === 'onsite'
                            ? 'bg-slate-200 border-slate-500 text-slate-900 font-bold ring-2 ring-slate-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Sur Place à l'atelier
                      </button>
                    </div>
                  </div>

                  {workshopNetwork !== 'onsite' && (
                    <input
                      type={workshopNetwork === 'paypal' ? 'email' : 'text'}
                      placeholder={
                        workshopNetwork === 'paypal'
                          ? 'Email compte PayPal'
                          : workshopNetwork === 'card'
                          ? 'Numéro de Carte Bancaire'
                          : 'Numéro de téléphone (+229)'
                      }
                      value={workshopAccountInput}
                      onChange={(e) => setWorkshopAccountInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003580]"
                    />
                  )}
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Montant Total</span>
                    <strong className="text-lg font-black text-amber-300">
                      {((selectedArtisanObj.workshopPriceXOF || 20000) * workshopParticipants).toLocaleString('fr-FR')} XOF
                    </strong>
                  </div>

                  <button
                    type="submit"
                    disabled={isBookingWorkshopSubmit}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isBookingWorkshopSubmit ? 'Validation...' : 'Payer & Réserver'}
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
