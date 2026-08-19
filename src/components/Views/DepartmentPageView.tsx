import React, { useState, useMemo, useEffect } from 'react';
import { BeninDepartment, BeninTouristSite, SearchParams } from '../../types';
import { ArrowLeft, MapPin, Compass, Search, ArrowUpDown, Filter, Calendar, Check, Building2, ChevronRight, Info, Eye } from 'lucide-react';
import { SiteDetailModal } from '../Modals/SiteDetailModal';
import { BookingModal } from '../Modals/BookingModal';
import { useAuth } from '../../context/AuthContext';
import { handleImageError } from '../SafeImage';

interface DepartmentPageViewProps {
  department: BeninDepartment;
  onBack: () => void;
  onSearch: (params: SearchParams) => void;
}

export const DepartmentPageView: React.FC<DepartmentPageViewProps> = ({
  department,
  onBack,
  onSearch,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A'>('A-Z');
  const [bookedSiteName, setBookedSiteName] = useState<string | null>(null);
  const [activeSite, setActiveSite] = useState<BeninTouristSite | null>(null);
  const [siteToBook, setSiteToBook] = useState<BeninTouristSite | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [department]);

  const categories = ['Tous', 'Patrimoine', 'Nature', 'Vaudou & Culture', 'Artisanat', 'Plage & Eau', 'Histoire'];

  const filteredAndSortedSites = useMemo(() => {
    let list = department.sites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || site.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Alphabetical sort from A to Z or Z to A
    list.sort((a, b) => {
      if (sortOrder === 'A-Z') {
        return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
      } else {
        return b.name.localeCompare(a.name, 'fr', { sensitivity: 'base' });
      }
    });

    return list;
  }, [department, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* Navigation Breadcrumb & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={onBack}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#003580]" />
            <span>Retour aux 12 Départements</span>
          </button>
          
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 shrink-0 text-xs">Bénin</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 shrink-0 text-xs">Zone {department.region}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-[#003580] shrink-0 text-xs">Département de {department.name}</span>
        </div>

        <div className="text-xs font-semibold text-slate-500 shrink-0 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
          Patrimoine : <strong className="text-emerald-950 font-bold">{department.sites.length} sites répertoriés</strong>
        </div>
      </div>

      {/* Hero Department Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[280px] sm:min-h-[340px] flex items-end">
        <img
          src={department.image}
          alt={department.name}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/30" />

        <div className="relative z-10 p-6 sm:p-10 space-y-3 text-white max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Département du Bénin (Zone {department.region})
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              Chef-lieu : {department.chefLieu}
            </span>
            <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {department.sites.length} sites touristiques de A à Z
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white drop-shadow-md">
            Département de {department.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {department.description}
          </p>
        </div>
      </div>

      {/* Confirmation Notification Banner */}
      {bookedSiteName && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-white rounded-full">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-extrabold text-emerald-900">Réservation de visite enregistrée !</p>
              <p className="text-emerald-800 font-normal">
                Votre demande de réservation pour le site <strong>"{bookedSiteName}"</strong> dans le département de {department.name} a bien été prise en compte.
              </p>
            </div>
          </div>
          <button
            onClick={() => setBookedSiteName(null)}
            className="px-3 py-1.5 bg-emerald-200 hover:bg-emerald-300 text-emerald-900 rounded-lg text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Rechercher un site dans ${department.name}...`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580] transition-all"
            />
          </div>

          {/* Sort & Stats */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-3">
            <span className="text-xs font-bold text-slate-600">
              Affichage : <strong>{filteredAndSortedSites.length} / {department.sites.length} sites</strong>
            </span>

            <button
              onClick={() => setSortOrder(sortOrder === 'A-Z' ? 'Z-A' : 'A-Z')}
              className="px-4 py-2 bg-[#003580] hover:bg-[#00255c] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Tri Ordre Alphabetique ({sortOrder})</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrer :
          </span>
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isSel
                    ? 'bg-[#003580] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Tourist Sites in this Department */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-serif">
            <Compass className="w-6 h-6 text-amber-600" />
            <span>Sites Touristiques de {department.name} (Tri de A à Z)</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline-block">
            Classement alphabétique officiel du patrimoine béninois
          </span>
        </div>

        {filteredAndSortedSites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Aucun site touristique trouvé</h3>
            <p className="text-xs text-slate-500">
              Aucun résultat pour "{searchTerm}" avec la catégorie "{selectedCategory}".
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }}
              className="px-4 py-2 bg-[#003580] text-white text-xs font-bold rounded-lg"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSites.map((site, index) => (
              <div
                key={site.id}
                onClick={() => setActiveSite(site)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={site.image}
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-slate-900/90 text-amber-400 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-400/30 shadow-xs">
                        #{index + 1} • {site.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs uppercase">
                        {site.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                        <Eye className="w-3 h-3" />
                        <span>Fiche complète</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {site.location}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-[#003580] transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {site.description}
                    </p>

                    <div className="pt-1 flex items-center text-xs font-bold text-amber-700 gap-1">
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      <span>Cliquez pour afficher la fiche complète du site</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSite(site);
                    }}
                    className="w-full py-2.5 bg-[#003580] hover:bg-[#00255c] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Voir toutes les informations du site</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
                      } else {
                        setSiteToBook(site);
                      }
                    }}
                    className="w-full py-2.5 bg-[#003580] hover:bg-[#00255c] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Réserver une visite pour {site.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom return link */}
      <div className="pt-6 border-t border-slate-200 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Retourner à la liste des 12 Départements du Bénin</span>
        </button>
      </div>

      {/* Site Detail Modal Overlay */}
      <SiteDetailModal
        site={activeSite}
        departmentName={department.name}
        onClose={() => setActiveSite(null)}
        onOpenBooking={(site) => {
          if (!user) {
            window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'auth_login' }));
          } else {
            setSiteToBook(site);
          }
        }}
      />

      {/* Booking Modal Overlay */}
      <BookingModal
        site={siteToBook}
        departmentName={department.name}
        onClose={() => setSiteToBook(null)}
        onSuccessBooking={(res) => setBookedSiteName(res.siteName)}
      />
    </div>
  );
};
