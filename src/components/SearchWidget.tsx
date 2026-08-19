import React, { useState } from 'react';
import { SearchParams } from '../types';
import { Search, Calendar, Users, X, ChevronDown, MapPin } from 'lucide-react';

interface SearchWidgetProps {
  onSearch: (params: SearchParams) => void;
  initialDestination?: string;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  onSearch,
  initialDestination = 'Cotonou',
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const popularDestinations = [
    'Cotonou, Bénin',
    'Ganvié (Cité Lacustre)',
    'Ouidah (Route des Esclaves)',
    'Abomey (Palais Royaux)',
    'Parc National de la Pendjari',
    'Natitingou & Pays Somba',
    'Grand-Popo (Bouche du Roi)',
    'Porto-Novo (Capitale Politique)',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      startDate,
      endDate,
      adults,
      children,
      rooms,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative z-20">
      {/* Booking.com iconic yellow-framed container */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-amber-400 p-1.5 sm:p-2 rounded-xl shadow-2xl border-2 border-amber-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200 dark:border-slate-800">
          {/* Field 1: Destination */}
          <div className="md:col-span-4 relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-2.5 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-slate-500 dark:text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none mb-1">
                Indiquez la destination ou l'expérience
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="Ex: Cotonou, Ouidah, Ganvié..."
                className="w-full font-bold text-slate-900 dark:text-white text-sm focus:outline-hidden bg-transparent truncate"
              />
            </div>
            {destination && (
              <button
                type="button"
                onClick={() => setDestination('')}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {showDestDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 max-h-60 overflow-y-auto">
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  Destinations populaires au Bénin
                </div>
                {popularDestinations.map((dest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDestination(dest);
                      setShowDestDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 dark:hover:bg-slate-800 font-medium text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{dest}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Field 2: Dates (Check-in & Check-out) */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-2.5 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500 dark:text-amber-400 shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none mb-1">
                  Arrivée
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden bg-transparent"
                />
              </div>
              <div className="border-l border-slate-200 dark:border-slate-800 pl-2">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none mb-1">
                  Départ
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Field 3: Travelers & Rooms */}
          <div className="md:col-span-2 relative p-2.5 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500 dark:text-amber-400 shrink-0" />
            <div
              onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
              className="flex-1 cursor-pointer"
            >
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none mb-1">
                Voyageurs
              </label>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span className="truncate">
                  {adults} ad. · {children} enf. · {rooms} ch.
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* Travelers Counter Dropdown */}
            {showTravelersDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Adultes</span>
                    <p className="text-xs text-slate-400">18 ans et plus</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(adults - 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center dark:text-white">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Enfants</span>
                    <p className="text-xs text-slate-400">0 à 17 ans</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(children - 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center dark:text-white">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Chambres</span>
                    <p className="text-xs text-slate-400">Hébergements</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={rooms <= 1}
                      onClick={() => setRooms(rooms - 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center dark:text-white">{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms(rooms + 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTravelersDropdown(false)}
                  className="w-full mt-2 py-1.5 bg-[#003580] hover:bg-[#002866] text-white font-bold text-xs rounded-md transition-colors"
                >
                  Terminé
                </button>
              </div>
            )}
          </div>

          {/* Action Button: Rechercher */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[46px] bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold text-base rounded-md transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
