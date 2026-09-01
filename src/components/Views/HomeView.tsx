import React, { useState } from 'react';
import { BENIN_GUIDES, BENIN_ARTISANS, BENIN_ARTISAN_PRODUCTS } from '../../data/beninData';
import { BENIN_DEPARTMENTS } from '../../data/departmentsData';
import { ActiveTab, SearchParams, BeninDepartment, CulturalEvent, ArtisanProductItem } from '../../types';
import { MapPin, ShieldCheck, ArrowRight, Compass, Languages, Award, Calendar, Ticket, ChevronDown, ChevronUp, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { DepartmentPageView } from './DepartmentPageView';
import { TicketReservationModal } from '../Modals/TicketReservationModal';
import { ProductDetailModal } from '../Modals/ProductDetailModal';
import { GalleryModal, BENIN_CULTURAL_PHOTOS } from '../Modals/GalleryModal';
import { GuideContactModal } from '../Modals/GuideContactModal';
import { GuideItem } from '../../types';
import { motion } from 'motion/react';
import { handleImageError } from '../SafeImage';
import { HeroSection } from '../HeroSection';

import vodunDaysImg from '../../assets/images/vodun_days_celebration_1785868922661.jpg';
import festivalMasquesImg from '../../assets/images/festival_masques_benin_1785868936804.jpg';
import feteGaaniImg from '../../assets/images/fete_gaani_nikki_1785868950097.jpg';
import festivalGanvieImg from '../../assets/images/festival_ganvie_lake_1785868966232.jpg';
import festivalVodouMusicImg from '../../assets/images/festival_vodou_music_1785869195446.jpg';
import siabCraftImg from '../../assets/images/siab_craft_benin_1785869210162.jpg';
import gueledeMaskImg from '../../assets/images/guelede_mask_festival_1785869222350.jpg';
import weloveyaConcertImg from '../../assets/images/weloveya_music_concert_1785869236162.jpg';
import fithebTheaterImg from '../../assets/images/fitheb_theater_benin_1785869249882.jpg';
import artsVodunImg from '../../assets/images/arts_vodun_exhibition_1785869262125.jpg';
import nonvitchaImg from '../../assets/images/nonvitcha_grand_popo_1785869274690.jpg';
import abomeyRoyalImg from '../../assets/images/abomey_royal_dynasty_1785869286421.jpg';
import novArtImg from '../../assets/images/nov_art_exhibition_1785869300492.jpg';
import kaletaCarnivalImg from '../../assets/images/kaleta_carnival_agoudas_1785869313085.jpg';
import eyaConcertImg from '../../assets/images/eya_live_concert_1785869325099.jpg';
import ouidahFilmImg from '../../assets/images/ouidah_film_festival_1785869340902.jpg';
import endogenousCulturesImg from '../../assets/images/endogenous_cultures_1785869353923.jpg';
import craftsKanvoImg from '../../assets/images/crafts_kanvo_textile_1785869365654.jpg';
import pendjariSafariImg from '../../assets/images/pendjari_safari_ecotourism_1785869379769.jpg';
import heritageMuseumImg from '../../assets/images/heritage_museum_portonovo_1785869390968.jpg';
import touristBookingImg from '../../assets/images/tourist_booking_service_1786020138917.jpg';
import localArtisanImg from '../../assets/images/local_benin_artisan_1786020154308.jpg';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSearch: (params: SearchParams) => void;
  selectedDepartment: BeninDepartment | null;
  onSelectDepartment: (dept: BeninDepartment | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onSearch,
  selectedDepartment,
  onSelectDepartment,
}) => {
  // If user selected a department, render the full dedicated page!
  if (selectedDepartment) {
    return (
      <DepartmentPageView
        department={selectedDepartment}
        onBack={() => onSelectDepartment(null)}
        onSearch={onSearch}
      />
    );
  }

  // Show 6 preview guides on HomeView
  const displayedGuides = BENIN_GUIDES.slice(0, 6);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<CulturalEvent | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ArtisanProductItem | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedGuideForContact, setSelectedGuideForContact] = useState<GuideItem | null>(null);

  return (
    <div className="space-y-0 pb-16">
      {/* 1. Ce que fait le site / Revivez l'histoire • Rencontrez l'humain */}
      <HeroSection onSearch={onSearch} onExploreClick={() => setActiveTab('explorer')} />

      {/* 3. Les 3 Piliers de la Plateforme AfroKu */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-center"
      >
        <div className="space-y-3 max-w-3xl mx-auto mb-8 sm:mb-10">
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Les 3 Piliers de la Plateforme
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            Une solution globale conçue pour valoriser le patrimoine béninois, simplifier vos séjours et soutenir l'économie locale.
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {/* Card 1: Découverte des Sites Touristiques */}
          <div 
            onClick={() => setActiveTab('explorer')}
            className="group bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-4 shadow-xl hover:shadow-2xl hover:border-amber-400/80 transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-2"
          >
            <div>
              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-500">
                <img
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=500&q=70"
                  alt="Découverte des sites touristiques"
                  className="w-full h-full object-cover rounded-2xl filter brightness-95 contrast-105 saturate-110 opacity-95 group-hover:opacity-100 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500 ease-in-out"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                
                <span className="absolute top-3 left-4 text-4xl font-black font-serif text-white/90 drop-shadow-md tracking-tighter">
                  01
                </span>

                <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-slate-900 px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                  Exploration Patrimoniale
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                    12 DÉPARTEMENTS & CARTOGRAPHIE
                  </span>
                  <h3 className="text-xl font-black text-white font-serif leading-tight drop-shadow-xs">
                    Découverte des Sites Touristiques
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mt-4 px-1 font-semibold">
                Explorez la carte interactive du Bénin, les monuments classés UNESCO, les circuits patrimoniaux et les trésors cachés de chaque département.
              </p>
            </div>

            <div className="pt-4 px-1">
              <button className="text-xs font-black text-amber-800 group-hover:text-amber-900 flex items-center gap-1.5 transition-colors">
                <span>Explorer les destinations</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Réservation de Services Touristiques */}
          <div 
            onClick={() => setActiveTab('reservations')}
            className="group bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-4 shadow-xl hover:shadow-2xl hover:border-amber-400/80 transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-2"
          >
            <div>
              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-500">
                <img
                  src={touristBookingImg}
                  alt="Réservation de services touristiques"
                  className="w-full h-full object-cover rounded-2xl filter brightness-95 contrast-105 saturate-110 opacity-95 group-hover:opacity-100 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500 ease-in-out"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                <span className="absolute top-3 left-4 text-4xl font-black font-serif text-white/90 drop-shadow-md tracking-tighter">
                  02
                </span>

                <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-slate-900 px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                  Services Clé en Main
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                    BILLETTERIE & HÔTELLERIE
                  </span>
                  <h3 className="text-xl font-black text-white font-serif leading-tight drop-shadow-xs">
                    Réservation de Services Touristiques
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mt-4 px-1 font-semibold">
                Réservez directement vos hébergements certifiés, vos pass événements (Vodun Days, WeLoveEya) et vos transports en toute simplicité via MoMo.
              </p>
            </div>

            <div className="pt-4 px-1">
              <button className="text-xs font-black text-amber-800 group-hover:text-amber-900 flex items-center gap-1.5 transition-colors">
                <span>Accéder aux réservations</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Valorisation des Acteurs Locaux */}
          <div 
            onClick={() => setActiveTab('guides')}
            className="group bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-4 shadow-xl hover:shadow-2xl hover:border-amber-400/80 transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-2"
          >
            <div>
              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-500">
                <img
                  src={localArtisanImg}
                  alt="Valorisation des acteurs locaux"
                  className="w-full h-full object-cover rounded-2xl filter brightness-95 contrast-105 saturate-110 opacity-95 group-hover:opacity-100 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500 ease-in-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                <span className="absolute top-3 left-4 text-4xl font-black font-serif text-white/90 drop-shadow-md tracking-tighter">
                  03
                </span>

                <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-slate-900 px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                  Impact Local & Équitable
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                    GUIDES NATIFS & ARTISANS
                  </span>
                  <h3 className="text-xl font-black text-white font-serif leading-tight drop-shadow-xs">
                    Valorisation des Acteurs Locaux
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mt-4 px-1 font-semibold">
                Mettez en lumière les guides touristiques natifs accrédités et achetez des créations artisanales d'art en circuit court direct producteurs.
              </p>
            </div>

            <div className="pt-4 px-1">
              <button className="text-xs font-black text-amber-800 group-hover:text-amber-900 flex items-center gap-1.5 transition-colors">
                <span>Découvrir nos guides & artisans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Trust Highlights Banner */}
        <div className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="border-r sm:border-r border-slate-200/60 last:border-0 pr-2">
            <span className="block text-xl font-black text-slate-900 font-serif">12 / 12</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Départements Couverts</span>
          </div>
          <div className="border-r sm:border-r border-slate-200/60 last:border-0 pr-2">
            <span className="block text-xl font-black text-slate-900 font-serif">100%</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Guides Locaux Vérifiés</span>
          </div>
          <div className="last:border-0 pr-2">
            <span className="block text-xl font-black text-slate-900 font-serif">24h / 24</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Assistance AfroKu IA</span>
          </div>
        </div>
      </motion.section>

      {/* 12 Départements du Bénin Section with Scroll Fade-in */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-serif">
              Explorez le Bénin par Département
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Cliquez sur un département pour afficher sa page dédiée avec tous ses sites touristiques classés de <strong>A à Z</strong>.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explorer')}
            className="mt-3 sm:mt-0 text-sm font-bold text-[#006ce4] hover:text-[#0057b8] flex items-center gap-1 group"
          >
            <span>Voir tous les 12 départements</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grille des 12 Départements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENIN_DEPARTMENTS.map((dept, idx) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              onClick={() => onSelectDepartment(dept)}
              className="group bg-white rounded-2xl shadow-xs hover:shadow-2xl hover:border-amber-400/60 hover:ring-2 hover:ring-amber-400/20 border border-slate-200 overflow-hidden cursor-pointer transition-all duration-500 ease-out transform hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/30 to-transparent group-hover:via-black/20 transition-colors duration-500" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs group-hover:scale-105 transition-transform duration-300">
                      Zone {dept.region}
                    </span>
                    <span className="bg-white/90 text-slate-900 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
                      {dept.sites.length} sites touristiques
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-2xl font-black font-serif tracking-tight group-hover:text-amber-300 transition-colors duration-300">{dept.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Chef-lieu : {dept.chefLieu}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {dept.description}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Sites phares (Triés A-Z) :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dept.sites.slice(0, 3).map((site) => (
                        <span
                          key={site.id}
                          className="text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                        >
                          • {site.name}
                        </span>
                      ))}
                      {dept.sites.length > 3 && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          +{dept.sites.length - 3} autres...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDepartment(dept);
                  }}
                  className="w-full py-2 bg-[#003580] group-hover:bg-[#00255c] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ouvrir la page du département {dept.name}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Guides Locaux Certifiés (Section Guides) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Guides passionnés & natifs du Bénin
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Laissez-vous raconter l'histoire par ceux qui la vivent chaque jour.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('guides')}
              className="mt-3 sm:mt-0 text-sm font-bold text-[#006ce4] hover:text-[#0057b8] flex items-center gap-1"
            >
              <span>Page Tous les guides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedGuides.map((guide, idx) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header Accent Bar */}
                  <div className="h-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 relative p-3 flex justify-end items-start">
                    <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-slate-950 shrink-0" />
                      <span>Natif Certifié</span>
                    </span>
                  </div>

                  {/* Avatar & Info Header */}
                  <div className="px-5 -mt-10 flex items-end gap-3 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <h3 className="font-serif font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-800 transition-colors">
                        {guide.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-800 truncate leading-tight">
                        {guide.title}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-5 space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-0">
                      <div className="flex items-center gap-1 text-amber-700 font-extrabold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                        <span>4.9</span>
                        <span className="text-slate-500 font-normal text-[10px]">(30+ avis)</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-900 font-bold shrink-0">
                        <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="text-xs">{guide.yearsOfExperience} ans d'exp.</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-slate-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Secteurs : <strong className="text-slate-900">{guide.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Languages className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Langues : <strong className="text-slate-900">{guide.languages.join(', ')}</strong></span>
                      </div>
                    </div>

                    <p className="text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed text-xs break-words">
                      "{guide.bio}"
                    </p>

                    <div>
                      <div className="flex flex-wrap gap-1">
                        {guide.specialties.slice(0, 3).map((spec, i) => (
                          <span key={i} className="text-[10px] bg-emerald-50 text-emerald-900 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-3 mt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tarif journalier</span>
                    <div className="text-base font-black text-slate-900">
                      {guide.pricePerDay.toLocaleString('fr-FR')} FCFA <span className="text-xs font-normal text-slate-500">/j</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGuideForContact(guide)}
                    className="px-4 py-2 bg-[#003580] hover:bg-[#002866] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Contacter
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton Voir tous les guides */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveTab('guides')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#003580] hover:bg-[#002866] text-white rounded-xl font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Voir tous nos guides passionnés ({BENIN_GUIDES.length} disponibles)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Artisans & Savoir-faire béninois */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Savoir-faire Ancestral
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Les Maîtres Artisans du Bénin
              </h2>
              <p className="text-amber-100 text-sm leading-relaxed max-w-xl">
                Participez à des ateliers de tissage royal à Abomey, de fonte de bronze à cire perdue à Cotonou ou de poterie sacrée à Sè. Rapportez un morceau d'art authentique avec une traçabilité directe.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('artisans')}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Découvrir les ateliers d'artisans
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {BENIN_ARTISANS.slice(0, 2).map((art) => (
                <div key={art.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white">
                  <img src={art.photo} alt={art.name} className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" onError={handleImageError} />
                  <h4 className="font-bold text-xs truncate">{art.name}</h4>
                  <p className="text-[10px] text-amber-200 truncate">{art.craft}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Artisan Products Preview Row */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              
              <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Créations & Œuvres d'Artisans
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('artisans')}
              className="text-xs font-bold text-[#003580] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tout le catalogue ({BENIN_ARTISAN_PRODUCTS.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENIN_ARTISAN_PRODUCTS.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProductForModal(prod)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-md shadow-xs">
                      {prod.category}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                      {prod.editionType}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>{prod.artisanName}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{prod.artisanRating}</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-xs font-serif leading-snug group-hover:text-[#003580] transition-colors">
                      {prod.name}
                    </h4>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Prix Officiel</span>
                    <strong className="text-sm font-black text-[#003580]">
                      {prod.priceXOF.toLocaleString('fr-FR')} XOF
                    </strong>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductForModal(prod);
                    }}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Acheter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Grands Événements & Festivals Culturels du Bénin */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Événements à ne pas manquer
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Vivez le Bénin autrement à travers ses célébrations uniques et ses rendez-vous culturels majeurs.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('explorer')}
              className="text-sm font-bold text-[#006ce4] hover:text-[#0057b8] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Page Tous les événements</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid of Events Cards: 3 columns (3 on top row, 3 on bottom row = 6 initially) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'Vodun Days 2027',
                badge: 'ÉVÉNEMENT MAJEUR',
                date: '10 janvier 2027',
                time: '09h00',
                location: 'Ouidah, Bénin',
                organizer: 'Ministère du Tourisme',
                desc: 'Célébration culturelle et spirituelle du Vodoun au Bénin.',
                price: 'Gratuit',
                image: vodunDaysImg
              },
              {
                title: 'Festival des Masques',
                badge: 'TRADITION',
                date: '17 - 19 Janvier 2027',
                time: '14h00',
                location: 'Kouandé & Porto-Novo',
                organizer: 'Ministère de la Culture',
                desc: 'Danses traditionnelles et masques sacrés.',
                price: 'Gratuit',
                image: festivalMasquesImg
              },
              {
                title: 'Fête de la Gaani',
                badge: 'CULTURE',
                date: '11 Novembre 2026',
                time: '08h30',
                location: 'Dassa-Zoumè & Nikki',
                organizer: 'Cour Royale de Nikki',
                desc: 'Parades équestres et grande fête princière du Royaume de Nikki.',
                price: 'Gratuit',
                image: feteGaaniImg
              },
              {
                title: 'Festival International Vodou',
                badge: 'MUSIQUE & ART',
                date: '9 - 11 Janvier 2026',
                location: 'Ouidah',
                desc: 'Tambours sacrés, rythmes ancestraux et spiritualité au cœur du Vodou.',
                price: 'Gratuit',
                image: festivalVodouMusicImg
              },
              {
                title: "Salon International de l'Artisanat",
                badge: 'ART & ARTISANAT',
                date: 'Juillet 2026',
                location: 'Cotonou',
                desc: 'Exposition-vente d\'artisanat d\'art, poteries et créations locales.',
                price: 'Gratuit',
                image: siabCraftImg
              },
              {
                title: 'Festival Guèlèdè (UNESCO)',
                badge: 'PATRIMOINE UNESCO',
                date: '15 - 18 Février 2026',
                location: 'Kétou & Sakété',
                desc: 'Hommage aux mères et esprits sacrés par le masque Guèlèdè.',
                price: 'Gratuit',
                image: gueledeMaskImg
              },
              {
                title: 'WeLoveya Festival',
                badge: 'MUSIQUE URBAINE',
                date: 'Août 2026',
                location: 'Cotonou',
                desc: 'Grand concert des musiques actuelles, afrobeat et hip-hop.',
                price: 'Gratuit',
                image: weloveyaConcertImg
              },
              {
                title: 'Festival de Théâtre (FITHEB)',
                badge: 'THÉÂTRE',
                date: 'Mars 2026',
                location: 'Cotonou & Parakou',
                desc: 'Rencontre majeure des arts scéniques et dramaturges d\'Afrique.',
                price: 'Gratuit',
                image: fithebTheaterImg
              },
              {
                title: 'Festival des Arts Vodun',
                badge: 'ART CONTEMPORAIN',
                date: 'Janvier 2026',
                location: 'Ouidah',
                desc: 'Expositions d\'art contemporain, sculpteurs et mémoire Vodun.',
                price: 'Gratuit',
                image: artsVodunImg
              },
              {
                title: 'Nonvitcha (Grand-Popo)',
                badge: 'TRADITION',
                date: 'Pentecôte 2026',
                location: 'Grand-Popo',
                desc: 'Plus ancienne fête fraternelle des peuples Xwla et Pedah au bord de mer.',
                price: 'Gratuit',
                image: nonvitchaImg
              },
              {
                title: 'Célébrations Royales d\'Abomey',
                badge: 'HISTOIRE ROYALE',
                date: 'Avril 2026',
                location: 'Abomey',
                desc: 'Hommage aux dynasties et Palais Royaux du Royaume du Danxomé.',
                price: 'Gratuit',
                image: abomeyRoyalImg
              },
              {
                title: 'Nov\'Art (Art contemporain)',
                badge: 'EXPOSITION',
                date: 'Novembre 2026',
                location: 'Cotonou',
                desc: 'Biennale de création visuelle, peintures et photographies.',
                price: 'Gratuit',
                image: novArtImg
              },
              {
                title: 'Carnaval Kaléta & Arts Agoudas',
                badge: 'CARNAVAL',
                date: 'Décembre 2026',
                location: 'Cotonou & Ouidah',
                desc: 'Parades costumées, défilés masqués et héritage afro-brésilien.',
                price: 'Gratuit',
                image: kaletaCarnivalImg
              },
              {
                title: 'Festival EYA',
                badge: 'CONCERT LIVE',
                date: 'Décembre 2026',
                location: 'Cotonou',
                desc: 'Grande scène festive célébrant la musique live et les talents béninois.',
                price: 'Gratuit',
                image: eyaConcertImg
              },
              {
                title: 'Festival de Cinéma de Ouidah',
                badge: 'CINÉMA',
                date: 'Février 2026',
                location: 'Ouidah',
                desc: 'Projections de films, documentaires et fictions panafricaines.',
                price: 'Gratuit',
                image: ouidahFilmImg
              },
              {
                title: 'Festival des Cultures Endogènes',
                badge: 'PATRIMOINE',
                date: 'Mai 2026',
                location: 'Allada',
                desc: 'Valorisation des rites sacrés, pharmacopée et savoirs ancestraux.',
                price: 'Gratuit',
                image: endogenousCulturesImg
              },
              {
                title: 'Journées de l\'Artisanat',
                badge: 'ARTISANAT',
                date: 'Octobre 2026',
                location: 'Parakou',
                desc: 'Promotion du textile tissé Kanvo, vannerie et sculpture sur bois.',
                price: 'Gratuit',
                image: craftsKanvoImg
              },
              {
                title: 'Festival Lacustre de Ganvié',
                badge: 'LACUSTRE',
                date: 'Août 2026',
                location: 'Ganvié (Lac Nokoué)',
                desc: 'Courses de pirogues traditionnelles et festivités sur la cité lacustre.',
                price: 'Gratuit',
                image: festivalGanvieImg
              },
              {
                title: 'Festival Écotouristique Pendjari',
                badge: 'NATURE',
                date: 'Mai 2026',
                location: 'Parc de la Pendjari',
                desc: 'Safari guidé, sensibilisation à la faune sauvage et tourisme vert.',
                price: 'Gratuit',
                image: pendjariSafariImg
              },
              {
                title: 'Journées du Patrimoine Culturel',
                badge: 'CULTURE & HISTOIRE',
                date: 'Septembre 2026',
                location: 'Porto-Novo',
                desc: 'Visites guidées des musées, bâtisses afro-brésiliennes et conférences.',
                price: 'Gratuit',
                image: heritageMuseumImg
              },
            ].slice(0, showAllEvents ? 20 : 6).map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Image with Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-medium text-slate-700">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Footer / Price & Action */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">À partir de</span>
                      <span className="text-base font-extrabold text-slate-900">{item.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEventForBooking(item)}
                    className="w-full py-2.5 bg-[#003580] hover:bg-[#00255c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Réserver un ticket</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Toggle / See More Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>{showAllEvents ? 'Réduire la liste' : 'Voir plus d\'événements (+14)'}</span>
              {showAllEvents ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => setSelectedEventForBooking({
                title: 'Vodun Days 2027',
                badge: 'ÉVÉNEMENT MAJEUR',
                date: '10 janvier 2027',
                time: '09h00',
                location: 'Ouidah, Bénin',
                organizer: 'Ministère du Tourisme',
                desc: 'Grand rassemblement annuel et célébration culturelle et spirituelle du Vodoun au Bénin.',
                price: '5 000 XOF',
                image: vodunDaysImg
              })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#003580] hover:bg-[#00255c] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Réserver Vodun Days 2027</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* Immersion Visuelle & Galerie Photos du Bénin */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-serif">
              Le Bénin en Images Haute Définition
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Cliquez sur une image pour l'agrandir en mode Galerie Plein Écran et découvrir l'histoire du site.
            </p>
          </div>
          <button
            onClick={() => {
              setGalleryIndex(0);
              setGalleryOpen(true);
            }}
            className="mt-3 sm:mt-0 text-sm font-bold text-[#006ce4] hover:text-[#0057b8] flex items-center gap-1 group"
          >
            <span>Ouvrir la galerie plein écran</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BENIN_CULTURAL_PHOTOS.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => {
                setGalleryIndex(index);
                setGalleryOpen(true);
              }}
              className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-2 right-2 p-1.5 bg-slate-950/60 rounded-full text-white/80 group-hover:text-amber-400 backdrop-blur-md transition-colors">
                <Eye className="w-4 h-4" />
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {photo.department}
                </span>
                <h4 className="text-sm font-bold truncate group-hover:text-amber-200 transition-colors">
                  {photo.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Modal de réservation de billet */}
      <TicketReservationModal
        event={selectedEventForBooking}
        isOpen={!!selectedEventForBooking}
        onClose={() => setSelectedEventForBooking(null)}
      />

      {/* Modal de détail produit artisan */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* Modal de contact de Guide */}
      <GuideContactModal
        guide={selectedGuideForContact}
        onClose={() => setSelectedGuideForContact(null)}
      />

      {/* Modal Galerie Grand Format */}
      <GalleryModal
        isOpen={galleryOpen}
        initialIndex={galleryIndex}
        onClose={() => setGalleryOpen(false)}
        onAction={(type) => {
          setGalleryOpen(false);
          setActiveTab(type as ActiveTab);
        }}
      />
    </div>
  );
};
