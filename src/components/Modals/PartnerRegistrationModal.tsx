import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserCheck,
  Palette,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Award,
  Sparkles,
  ArrowRight,
  Briefcase,
  Globe,
  User,
  Camera,
  Languages,
  DollarSign,
  Check,
  FileText,
  Upload,
  FileCheck,
  Trash2,
  Image as ImageIcon,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';
import { submitPartnerApplication } from '../../services/authService';
import { COUNTRIES_LIST, getCitiesByCountry, getCountryByName } from '../../data/countriesData';
import { useAuth } from '../../context/AuthContext';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'guide' | 'artisan';
}

export const PartnerRegistrationModal: React.FC<PartnerRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'guide',
}) => {
  const { user, token } = useAuth();
  const [partnerType, setPartnerType] = useState<'guide' | 'artisan'>(defaultType);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [country, setCountry] = useState('Bénin');
  const [customCountry, setCustomCountry] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [customCity, setCustomCity] = useState('');
  const [department, setDepartment] = useState('Atlantique');
  const [bio, setBio] = useState('');

  // File Upload states
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [cvFileName, setCvFileName] = useState<string>('');
  const [cvFileSize, setCvFileSize] = useState<string>('');

  // Guide fields
  const [languages, setLanguages] = useState<string>('Français, Fon');
  const [yearsExperience, setYearsExperience] = useState<number>(3);
  const [dailyRateXOF, setDailyRateXOF] = useState<number>(15000);
  const [specialties, setSpecialties] = useState<string>('Histoire, Culture Vaudou, Patrimoine');

  // Artisan fields
  const [workshopName, setWorkshopName] = useState('');
  const [craftType, setCraftType] = useState('Tissage traditionnel (Kanvo / Pagne Tissé)');
  const [customCraftType, setCustomCraftType] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [workshopPriceXOF, setWorkshopPriceXOF] = useState<number>(10000);

  const ARTISAN_CRAFT_TYPES = [
    'Tissage traditionnel (Kanvo / Pagne Tissé)',
    'Poterie, Céramique & Art de l Argile (Sè)',
    'Sculpture sur Bois, Statues & Masques Gèlèdé',
    'Fonderie du Bronze, Cuivre & Métaux (Abomey)',
    'Maroquinerie & Travail du Cuir (Djougou)',
    'Bijouterie, Perles & Parures Traditionnelles',
    'Couture, Stylisme Afro-Contemporain & Broderie',
    'Teinture Textile, Batik & Bogolan',
    'Vannerie, Tissage de Raphia, Bambou & Rotin',
    'Peinture, Art Plastique & Fresques Murales',
    'Fabrication d Instruments de Musique (Tam-tam, Cora, Balafon)',
    'Cosmétique Naturelle, Beurre de Karité & Savonnerie',
    'Ferronnerie d Art & Forge Traditionnelle',
    'Art Recyclé, Éco-Design & Décoration d Intérieur',
    'Tresse & Coiffure Traditionnelle / Body Art',
    'Transformation Agroalimentaire Artisanale',
    'AUTRE'
  ];

  const [error, setError] = useState('');

  const availableCities = getCitiesByCountry(country);

  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    const countryData = getCountryByName(newCountryName);
    if (countryData && countryData.cities.length > 0) {
      setCity(countryData.cities[0]);
    } else {
      setCity('AUTRE');
    }
    if (countryData && countryData.phoneCode) {
      if (!phoneWhatsApp || phoneWhatsApp.startsWith('+')) {
        setPhoneWhatsApp(`${countryData.phoneCode} `);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo ne doit pas dépasser 5 Mo.');
        return;
      }
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName('');
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Le CV ne doit pas dépasser 10 Mo.');
        return;
      }
      setCvFileName(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setCvFileSize(`${sizeInMB} Mo`);
    }
  };

  const handleRemoveCv = () => {
    setCvFileName('');
    setCvFileSize('');
  };

  // Sécurité (couche 2) : même si ce modal était ouvert par un moyen détourné
  // (ex: manipulation du state via la console), on refuse catégoriquement
  // de l'afficher sans utilisateur connecté.
  if (!isOpen || !user) return null;

  const finalCountry = country === 'Autre pays...' ? customCountry : country;
  const finalCity = city === 'AUTRE' ? customCity : city;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Sécurité : refus catégorique de toute soumission sans compte connecté.
    if (!user || !token) {
      setError('Vous devez être connecté pour soumettre une candidature.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phoneWhatsApp.trim() || !finalCity.trim()) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

    if (!bio.trim() || bio.length < 20) {
      setError('Veuillez rédiger une présentation d au moins 20 caractères.');
      return;
    }

    const defaultPhoto = partnerType === 'guide'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

    const finalCraft = craftType === 'AUTRE' ? (customCraftType.trim() || 'Artisanat divers') : craftType;

    const details = {
      fullName: fullName.trim(),
      email: email.trim(),
      phoneWhatsApp: phoneWhatsApp.trim(),
      city: `${finalCity} (${finalCountry})`,
      department,
      photoUrl: photoPreview || defaultPhoto,
      bio: bio.trim(),
      ...(partnerType === 'guide'
        ? {
            languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
            yearsExperience: Number(yearsExperience) || 1,
            dailyRateXOF: Number(dailyRateXOF) || 15000,
            specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
          }
        : {
            workshopName: workshopName.trim() || `Atelier ${fullName}`,
            craftType: finalCraft,
            physicalAddress: physicalAddress.trim() || `${finalCity}, ${finalCountry}`,
            workshopPriceXOF: Number(workshopPriceXOF) || 10000,
          }),
    };

    try {
      setSubmitting(true);
      await submitPartnerApplication(token, partnerType, details);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de la candidature.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('form');
    setFullName('');
    setEmail('');
    setPhoneWhatsApp('');
    setBio('');
    setPhotoPreview(null);
    setPhotoFileName('');
    setCvFileName('');
    setCvFileSize('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-2 sm:p-6 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-y-auto max-h-[92vh] flex flex-col scroll-smooth divide-y divide-slate-100"
        >
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-[#02132b] via-[#002866] to-[#0a2540] text-white p-6 sm:p-8 relative shrink-0 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 z-10 cursor-pointer backdrop-blur-sm"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-amber-400/15 text-amber-300 rounded-full text-[11px] font-bold tracking-wider uppercase border border-amber-400/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Réseau Officiel AfroKu
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
              {step === 'form' ? 'Rejoignez le réseau AfroKu' : 'Dossier Transmis avec Succès !'}
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              {step === 'form'
                ? 'Remplissez ce formulaire pour être certifié en tant que Guide ou Artisan et recevoir des clients directement sur WhatsApp.'
                : 'Votre profil a été soumis à notre équipe pour validation sous 24h.'}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-5 sm:p-8 space-y-7 bg-slate-50/50">
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* CHOICE ROLE CARDS */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#002866] text-white flex items-center justify-center text-[10px] font-bold">
                      1
                    </span>
                    Choisissez votre statut professionnel :
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Guide Card */}
                    <div
                      onClick={() => setPartnerType('guide')}
                      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 flex items-center gap-3.5 ${
                        partnerType === 'guide'
                          ? 'border-[#002866] bg-white text-[#002866] shadow-md ring-2 ring-[#002866]/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        partnerType === 'guide' ? 'bg-[#002866] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                          <span>Guide Touristique</span>
                          {partnerType === 'guide' && <BadgeCheck className="w-4 h-4 text-[#002866]" />}
                        </div>
                      </div>
                    </div>

                    {/* Artisan Card */}
                    <div
                      onClick={() => setPartnerType('artisan')}
                      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 flex items-center gap-3.5 ${
                        partnerType === 'artisan'
                          ? 'border-amber-600 bg-white text-amber-950 shadow-md ring-2 ring-amber-500/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        partnerType === 'artisan' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Palette className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                          <span>Artisan / Créateur</span>
                          {partnerType === 'artisan' && <BadgeCheck className="w-4 h-4 text-amber-600" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <div>{error}</div>
                  </div>
                )}

                {/* SECTION: COORDONNEES */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <User className="w-4 h-4 text-[#002866]" />
                    Informations personnelles
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dupont"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Adresse e-mail *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jean.dupont@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Numéro WhatsApp direct *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+229 01 00 00 00 00"
                        value={phoneWhatsApp}
                        onChange={(e) => setPhoneWhatsApp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION: LOCALISATION */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <Globe className="w-4 h-4 text-[#002866]" />
                    Localisation
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Pays *
                      </label>
                      <select
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-semibold text-slate-900"
                      >
                        {COUNTRIES_LIST.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Ville *
                      </label>
                      {availableCities.length > 0 ? (
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-semibold text-slate-900"
                        >
                          {availableCities.map((ct) => (
                            <option key={ct} value={ct}>
                              {ct}
                            </option>
                          ))}
                          <option value="AUTRE">➕ Autre ville...</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="Saisissez votre ville..."
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION: FICHIERS (PHOTO & CV) */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#002866]" />
                      Photo & Documents
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                      Pour l administration
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* PHOTO UPLOAD */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Photo de profil / atelier
                      </label>
                      {photoPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center group">
                          <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-200 hover:border-[#002866] bg-slate-50 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-[#002866]">Charger une photo</span>
                          <span className="text-[10px] text-slate-400">JPG, PNG (max 5 Mo)</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                      )}
                    </div>

                    {/* CV UPLOAD */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        CV / Portfolio (PDF, Word)
                      </label>
                      {cvFileName ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between h-28">
                          <div className="min-w-0 pr-2">
                            <FileCheck className="w-5 h-5 text-emerald-600 mb-1" />
                            <div className="text-xs font-bold text-slate-900 truncate">{cvFileName}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">{cvFileSize}</div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCv}
                            className="p-1.5 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-200 hover:border-[#002866] bg-slate-50 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                          <FileText className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-[#002866]">Joindre un CV</span>
                          <span className="text-[10px] text-slate-400">PDF, Word (max 10 Mo)</span>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION: SPECIFICITES */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <Award className="w-4 h-4 text-[#002866]" />
                    {partnerType === 'guide' ? 'Spécificités Guide' : 'Spécificités Artisan'}
                  </h3>

                  {partnerType === 'guide' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Langues parlées
                        </label>
                        <input
                          type="text"
                          placeholder="Français, Fon, Anglais"
                          value={languages}
                          onChange={(e) => setLanguages(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Tarif jour (FCFA)
                        </label>
                        <input
                          type="number"
                          step="1000"
                          value={dailyRateXOF}
                          onChange={(e) => setDailyRateXOF(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Nom de l Atelier
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Atelier Kanvo Rétro"
                          value={workshopName}
                          onChange={(e) => setWorkshopName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Domaine / Type d artisanat *
                        </label>
                        <select
                          value={craftType}
                          onChange={(e) => setCraftType(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-semibold text-slate-900 cursor-pointer"
                        >
                          {ARTISAN_CRAFT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type === 'AUTRE' ? '✨ Autre domaine d artisanat (Saisie libre)...' : type}
                            </option>
                          ))}
                        </select>

                        {craftType === 'AUTRE' && (
                          <input
                            type="text"
                            required
                            placeholder="Saisissez précisément votre domaine d artisanat..."
                            value={customCraftType}
                            onChange={(e) => setCustomCraftType(e.target.value)}
                            className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/60 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-900 placeholder:text-slate-500"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION: PRESENTATION */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <FileText className="w-4 h-4 text-[#002866]" />
                    Présentation
                  </h3>

                  <textarea
                    rows={3}
                    required
                    placeholder="Présentez brièvement votre expérience et vos services aux voyageurs..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002866] bg-slate-50/50 text-xs font-medium text-slate-900"
                  />
                </div>

                {/* FOOTER ACTIONS */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Transmission directe à l équipe AfroKu
                  </span>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#002866] hover:bg-[#001f52] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting && (
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      )}
                      <span>{submitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}</span>
                      {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* SUCCESS SCREEN */
              <div className="space-y-5 text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Dossier enregistré !</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Votre candidature a été transmise avec succès. L équipe d administration AfroKu examinera votre profil sous 24h.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#002866] text-white rounded-xl font-bold text-xs"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
