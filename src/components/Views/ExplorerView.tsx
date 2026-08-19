import React, { useState, useEffect } from 'react';
import { BENIN_DEPARTMENTS } from '../../data/departmentsData';
import { BeninDepartment, SearchParams } from '../../types';
import { MapPin, Search, Compass, ExternalLink, ArrowUpDown, Filter, Building2 } from 'lucide-react';
import { DepartmentPageView } from './DepartmentPageView';
import { handleImageError } from '../SafeImage';

interface ExplorerViewProps {
  onSearch: (params: SearchParams) => void;
  selectedDepartment: BeninDepartment | null;
  onSelectDepartment: (dept: BeninDepartment | null) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  onSearch,
  selectedDepartment,
  onSelectDepartment,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'Tous' | 'Sud' | 'Centre' | 'Nord'>('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  // If a department is selected, display its dedicated full page!
  if (selectedDepartment) {
    return (
      <DepartmentPageView
        department={selectedDepartment}
        onBack={() => onSelectDepartment(null)}
        onSearch={onSearch}
      />
    );
  }

  const filteredDepartments = BENIN_DEPARTMENTS.filter((dept) => {
    const matchesRegion = selectedRegion === 'Tous' || dept.region === selectedRegion;
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.chefLieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.sites.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Explorer */}
      <div className="bg-[#003580] text-white p-6 sm:p-10 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Guide Patrimonial Officiel du Bénin</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif">
            Les 12 Départements du Bénin
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
            Cliquez sur un département pour accéder à sa page dédiée et découvrir l'ensemble des sites touristiques, sanctuaires et réserves qu'il abrite, classés de <strong>A à Z</strong>.
          </p>

          <div className="pt-2 relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un département, chef-lieu ou site..."
              className="w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
            Filtrer par zone :
          </span>
          {(['Tous', 'Sud', 'Centre', 'Nord'] as const).map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedRegion === region
                  ? 'bg-[#003580] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {region === 'Tous' ? 'Tous les 12 Départements' : `Zone ${region}`}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Affichage : <strong className="text-slate-900">{filteredDepartments.length} / 12 départements</strong>
        </div>
      </div>

      {/* Grid of 12 Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => onSelectDepartment(dept)}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/60 hover:ring-2 hover:ring-amber-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Department Image & Badge */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent group-hover:via-black/10 transition-colors duration-500" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs group-hover:scale-105 transition-transform duration-300">
                    Zone {dept.region}
                  </span>
                  <span className="bg-white/90 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {dept.sites.length} sites A-Z
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-2xl font-black font-serif tracking-tight drop-shadow-xs group-hover:text-amber-300 transition-colors duration-300">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chef-lieu : {dept.chefLieu}</span>
                  </p>
                </div>
              </div>

              {/* Department Description */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {dept.description}
                </p>

                {/* Preview of Sites (A-Z) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Aperçu des sites (A à Z) :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dept.sites.slice(0, 4).map((site) => (
                      <span
                        key={site.id}
                        className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-semibold"
                      >
                        • {site.name}
                      </span>
                    ))}
                    {dept.sites.length > 4 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                        +{dept.sites.length - 4} autres...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="p-5 pt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDepartment(dept);
                }}
                className="w-full py-2.5 bg-[#003580] group-hover:bg-[#00255c] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Ouvrir la page du département {dept.name} ({dept.sites.length} sites)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

