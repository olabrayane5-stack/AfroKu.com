import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Phone, Mail, CheckCircle, Palette, UserCheck, Car, Utensils, Users, Compass, Landmark, Ticket, Sparkles, Wine, Briefcase, Globe } from 'lucide-react';
import { COUNTRIES_LIST, getCitiesByCountry, getCountryByName } from '../../data/countriesData';
import { useAuth } from '../../context/AuthContext';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PARTNER_OPTIONS = [
  { value: 'Hôtel, Auberge ou Gîte', label: 'Hôtel, Auberge, Gîte ou Résidence Meublée', icon: Building2 },
  { value: 'Chauffeur privé, VTC ou Location', label: 'Chauffeur privé, VTC, Taxi ou Location de véhicules', icon: Car },
  { value: 'Restaurant, Maquis & Gastronomie', label: 'Restaurant, Maquis & Gastronomie Locale / Cuisine', icon: Utensils },
  { value: 'Guide Touristique', label: 'Guide Touristique & Historien Local', icon: Users },
  { value: 'Artisanat & Création', label: 'Artisan, Sculpteur, Galerie d\'Art ou Créateur', icon: Palette },
  { value: 'Agence de Voyage & Excursions', label: 'Agence de Voyage, Excursions & Safaris', icon: Compass },
  { value: 'Site Touristique, Musée & Parc', label: 'Site Touristique, Musée, Réserve & Parc Naturel', icon: Landmark },
  { value: 'Événements Culturels & Festivals', label: 'Événements Culturels, Festivals & Cérémonies', icon: Ticket },
  { value: 'Spa & Centre de Bien-être', label: 'Spa, Massage & Centre de Bien-être Traditionnel', icon: Sparkles },
  { value: 'Bar, Lounge & Club Nocturne', label: 'Bar, Lounge, Club & Animation Nocturne', icon: Wine },
  { value: 'Autre Service Touristique', label: 'Autre Service / Prestation Touristique', icon: Briefcase },
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('Hôtel, Auberge ou Gîte');
  const [country, setCountry] = useState('Bénin');
  const [customCountry, setCustomCountry] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [customCity, setCustomCity] = useState('');
  const [contactPhone, setContactPhone] = useState('+229 01 53 63 70 86');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const availableCities = getCitiesByCountry(country);

  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    const countryData = getCountryByName(newCountryName);
    if (countryData && countryData.cities.length > 0) {
      setCity(countryData.cities[0]);
    } else {
      setCity('AUTRE');
    }
    if (countryData && countryData.phoneCode) {
      if (!contactPhone || contactPhone.startsWith('+')) {
        setContactPhone(`${countryData.phoneCode} `);
      }
    }
  };

  // Sécurité (couche 2) : refus catégorique d'affichage sans compte connecté,
  // même si ce modal était ouvert par un moyen détourné.
  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sécurité : refus catégorique de toute soumission sans compte connecté.
    if (!user) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const finalCountry = country === 'Autre pays...' ? customCountry : country;
  const finalCity = city === 'AUTRE' ? customCity : city;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in [overscroll-behavior:contain]">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 [overscroll-behavior:contain] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-2 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Ajouter mon établissement sur AfroKu.com</h2>
          <p className="text-xs text-slate-500 mt-1">
            Rejoignez le réseau mondial de l'hébergement, du transport, de la gastronomie et de la culture.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Etablissement soumis avec succès !</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Un chargé de partenariat AfroKu pour <strong>{finalCountry} ({finalCity})</strong> vous recontactera sous 24h pour finaliser la mise en ligne.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Type de partenariat *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
              >
                {PARTNER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nom de l'établissement ou de la prestation *
              </label>
              <input
                type="text"
                required
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="Ex: Royal Hotel, Chauffeur VTC Afrique, Maquis Le Kpalè..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
              />
            </div>

            {/* Pays & Ville */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pays *
                </label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                {country === 'Autre pays...' && (
                  <input
                    type="text"
                    required
                    placeholder="Saisissez votre pays..."
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    className="mt-2 w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ville / Commune *
                </label>
                {availableCities.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                  >
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                    <option value="AUTRE">➕ Autre ville / Commune...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Saisissez votre ville..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                  />
                )}

                {(city === 'AUTRE' || availableCities.length === 0) && (
                  <input
                    type="text"
                    required
                    placeholder="Saisissez la ville / commune..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="mt-2 w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+229 01 00 00 00 00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jean.dupont@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#003580]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#003580] hover:bg-[#002866] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors mt-2"
            >
              Soumettre mon établissement
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
