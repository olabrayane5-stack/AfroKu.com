import React, { useState } from 'react';
import { ShieldCheck, Upload, Hammer, CheckCircle2, AlertCircle, Phone, MapPin, Store } from 'lucide-react';
import { BENIN_DEPARTMENTS } from '../../data/departmentsData';

interface ArtisanRegisterFormProps {
  onSuccess: (formData: any) => void;
  onSwitchToLogin: () => void;
}

export const ArtisanRegisterForm: React.FC<ArtisanRegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    workshopName: '',
    artisanName: '',
    email: '',
    phoneWhatsApp: '',
    cniNumber: '',
    department: 'Zou',
    city: 'Abomey',
    physicalAddress: '',
    craftType: 'Tissage Kanvo',
    mobileMoneyNumber: '',
    workshopPriceXOF: 25000,
    bio: '',
    acceptedEthicsCharter: false,
    cniFile: null as File | null,
    workshopProofFile: null as File | null,
  });

  const [cniPreview, setCniPreview] = useState<string | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const craftCategories = [
    'Tissage du Pagne Royal Kanvo',
    'Fonderie de Bronze à la Cire Perdue',
    'Poterie Écologique en Argile Rouge',
    'Sculpture sur Bois & Masques Guèlèdè',
    'Maroquinerie & Travail du Cuir',
    'Bijouterie & Orfèvrerie Traditionnelle',
    'Peinture & Bas-reliefs Appliqués'
  ];

  const handleCniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, cniFile: file });
      setCniPreview(URL.createObjectURL(file));
    }
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, workshopProofFile: file });
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedEthicsCharter) {
      setError("Vous devez accepter la Charte du Fait-Main d'AfroKu.");
      return;
    }
    if (!formData.cniNumber) {
      setError("Veuillez remplir votre numéro de CNI ou passeport.");
      return;
    }

    setError(null);
    onSuccess(formData);
  };

  return (
    <div className="space-y-6">
      {/* En-tête Badge Sécurité */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
        <Hammer className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
            Demande de Partenariat "Maître Artisan & Coopérative"
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
            AfroKu garantit le 100% fait-main béninois. Votre dossier et vos photos d'atelier seront évalués sous 24h à 48h.
          </p>
        </div>
      </div>

      {/* Étapes du Formulaire */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className={step === 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
          1. Atelier & Identité
        </span>
        <span>→</span>
        <span className={step === 2 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
          2. Preuve Fait-Main & Charte
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom de l'Atelier ou de la Coopérative *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.workshopName}
                  onChange={e => setFormData({ ...formData, workshopName: e.target.value })}
                  placeholder="Ex: Atelier Royal du Kanvo, Coopérative Poterie de Sè..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du Maître Artisan / Responsable *
                </label>
                <input
                  type="text"
                  required
                  value={formData.artisanName}
                  onChange={e => setFormData({ ...formData, artisanName: e.target.value })}
                  placeholder="Ex: Maître Akplogan"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro CNI / CIP du Responsable *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cniNumber}
                  onChange={e => setFormData({ ...formData, cniNumber: e.target.value })}
                  placeholder="Ex: 2091827364"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail professionnel *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="artisan@example.com"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro WhatsApp de l'Atelier *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneWhatsApp}
                    onChange={e => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
                    placeholder="+229 96 00 00 00"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Département *
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                >
                  {BENIN_DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spécialité d'Artisanat majeure *
                </label>
                <select
                  value={formData.craftType}
                  onChange={e => setFormData({ ...formData, craftType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                >
                  {craftCategories.map(craft => (
                    <option key={craft} value={craft}>{craft}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!formData.workshopName || !formData.artisanName || !formData.phoneWhatsApp) {
                  setError("Veuillez remplir les champs obligatoires de l'étape 1.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              Étape suivante : Preuve d'Atelier & Charte →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Numéro Mobile Money pour la rémunération */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Numéro Mobile Money (MTN / Moov) pour la réception des ventes *
              </label>
              <input
                type="tel"
                required
                value={formData.mobileMoneyNumber}
                onChange={e => setFormData({ ...formData, mobileMoneyNumber: e.target.value })}
                placeholder="Ex: +229 97 12 34 56"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Upload CNI + Photo de l'atelier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center bg-slate-50 dark:bg-slate-800/50">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Scan CNI du Responsable *
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleCniChange}
                  className="mt-1 text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-700 cursor-pointer"
                />
                {cniPreview && <p className="text-[10px] text-emerald-600 mt-1">✓ CNI chargée</p>}
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center bg-slate-50 dark:bg-slate-800/50">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Photo de l'Atelier réels *
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofChange}
                  className="mt-1 text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-700 cursor-pointer"
                />
                {proofPreview && <p className="text-[10px] text-emerald-600 mt-1">✓ Photo atelier chargée</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Présentation de l'Atelier et du Savoir-Faire *
              </label>
              <textarea
                required
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Décrivez les techniques traditionnelles utilisées, l'histoire de l'atelier..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="artisanEthicsCheck"
                checked={formData.acceptedEthicsCharter}
                onChange={e => setFormData({ ...formData, acceptedEthicsCharter: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="artisanEthicsCheck" className="text-xs text-slate-700 dark:text-slate-300 leading-tight">
                Je certifie que toutes nos créations vendues sur AfroKu sont <span className="font-semibold text-emerald-600">100% faites à la main au Bénin</span> sans contrefaçon industrielle.
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                ← Retour
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                Soumettre mon dossier d'artisan
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Vous avez déjà un espace artisan partenaire ?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};
