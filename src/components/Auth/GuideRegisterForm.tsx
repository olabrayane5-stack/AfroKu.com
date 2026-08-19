import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle, MapPin, Award, Phone } from 'lucide-react';
import { BENIN_DEPARTMENTS } from '../../data/departmentsData';

interface GuideRegisterFormProps {
  onSuccess: (formData: any) => void;
  onSwitchToLogin: () => void;
}

export const GuideRegisterForm: React.FC<GuideRegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsApp: '',
    cniNumber: '',
    city: '',
    department: 'Atlantique',
    languages: ['Français'],
    yearsExperience: 3,
    dailyRateXOF: 40000,
    specialties: ['Histoire & Royauté', 'Culture Vaudou'],
    cniFile: null as File | null,
    licenseFile: null as File | null,
    bio: '',
    acceptedEthicsCharter: false,
  });

  const [cniPreview, setCniPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableSpecialties = [
    'Histoire & Royauté',
    'Culture Vaudou & Spiritualité',
    'Eco-Safari & Faune (Pendjari/W)',
    'Pédagogie & Famille avec enfants',
    'Gastronomie & Marchés traditionnels',
    'Randonnée & Nature (Collines/Atacora)',
    'Cité Lacustre (Ganvié)'
  ];

  const handleCniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, cniFile: file });
      setCniPreview(URL.createObjectURL(file));
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, licenseFile: file });
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (formData.specialties.includes(spec)) {
      setFormData({
        ...formData,
        specialties: formData.specialties.filter(s => s !== spec)
      });
    } else {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, spec]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedEthicsCharter) {
      setError("Vous devez signer et accepter la Charte d'Éthique AfroKu pour soumettre votre dossier.");
      return;
    }
    if (!formData.cniNumber) {
      setError("Veuillez saisir votre numéro de CNI ou de passeport.");
      return;
    }

    setError(null);
    onSuccess(formData);
  };

  return (
    <div className="space-y-6">
      {/* En-tête Badge Sécurité */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
            Dossier d'Accréditation "Guide Certifié AfroKu"
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
            Pour la sécurité des voyageurs, votre dossier sera évalué par l'équipe d'administration sous 24h à 48h avant l'activation de votre compte.
          </p>
        </div>
      </div>

      {/* Étapes du Formulaire */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className={step === 1 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
          1. Identité & CNI
        </span>
        <span>→</span>
        <span className={step === 2 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
          2. Compétences & Tarifs
        </span>
        <span>→</span>
        <span className={step === 3 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
          3. Charte d'Éthique
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ÉTAPE 1 : Identité & Pièces justificatives */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet (tel que figurant sur la CNI) *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ex: Koffi Dossou"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse e-mail professionnelle *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="koffi@example.com"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro WhatsApp / Téléphone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneWhatsApp}
                    onChange={e => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
                    placeholder="+229 97 00 00 00"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Numéro de CNI, CIP ou Passeport Béninois *
              </label>
              <input
                type="text"
                required
                value={formData.cniNumber}
                onChange={e => setFormData({ ...formData, cniNumber: e.target.value })}
                placeholder="Ex: 109283746501"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Téléversement CNI */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-800/50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Téléverser la copie rectoverso de votre CNI / Passeport *
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Format JPG, PNG ou PDF (max 5 Mo)
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleCniChange}
                className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 dark:file:bg-amber-900/50 dark:file:text-amber-300 cursor-pointer"
              />
              {cniPreview && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Document CNI chargé avec succès</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!formData.fullName || !formData.email || !formData.phoneWhatsApp || !formData.cniNumber) {
                  setError("Veuillez remplir tous les champs obligatoires de l'étape 1.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              Étape suivante : Compétences & Région →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : Compétences & Spécialités */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Département principal d'intervention *
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                >
                  {BENIN_DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name} ({dept.chefLieu})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ville de résidence *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Ouidah, Abomey, Natitingou..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Années d'expérience professionnelle *
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={formData.yearsExperience}
                  onChange={e => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tarif journalier proposé (FCFA / jour) *
                </label>
                <input
                  type="number"
                  step="5000"
                  min="20000"
                  max="100000"
                  value={formData.dailyRateXOF}
                  onChange={e => setFormData({ ...formData, dailyRateXOF: parseInt(e.target.value) || 40000 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sélectionnez vos spécialités majeures *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {availableSpecialties.map(spec => (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                      formData.specialties.includes(spec)
                        ? 'bg-amber-100 border-amber-500 text-amber-900 dark:bg-amber-900/40 dark:border-amber-500 dark:text-amber-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>{spec}</span>
                    {formData.specialties.includes(spec) && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Téléversement Carte de Guide / Attestation (Facultatif mais recommandé) */}
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Attestation / Carte Professionnelle de Guide (Optionnel)
                </span>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleLicenseChange}
                className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-200 file:text-slate-800 cursor-pointer"
              />
              {licensePreview && (
                <p className="text-[11px] text-emerald-600 font-medium mt-1">✓ Carte pro ajoutée</p>
              )}
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
                type="button"
                onClick={() => {
                  if (!formData.city) {
                    setError("Veuillez renseigner votre ville d'intervention.");
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
                className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Dernière étape : Charte d'Éthique →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Charte d'Éthique & Engagement */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Présentation courte pour les voyageurs (Bio) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Racontez en quelques lignes votre passion pour l'histoire, la nature et le guidage local..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Charte d'Éthique AfroKu */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <h5 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Engagements de la Charte "Guide Certifié AfroKu" :
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Garantir la sécurité absolue des voyageurs et fournir les équipements adéquats (gilets sur pirogues, etc.).</li>
                <li>Respecter scrupuleusement la culture locale, les sites sacrés et les communautés locales.</li>
                <li>Reverser une rémunération juste et transparente aux artisans et partenaires de terrain.</li>
                <li>Faire preuve de ponctualité, de pédagogie et de bienveillance envers tous les groupes.</li>
              </ul>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="ethicsCheck"
                checked={formData.acceptedEthicsCharter}
                onChange={e => setFormData({ ...formData, acceptedEthicsCharter: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="ethicsCheck" className="text-xs text-slate-700 dark:text-slate-300 leading-tight">
                Je certifie l'exactitude des pièces fournies et je m'engage à respecter scrupuleusement la <span className="font-semibold text-amber-600">Charte d'Éthique AfroKu</span>.
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                ← Retour
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                Soumettre mon dossier d'accréditation
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Vous avez déjà un compte certifié ?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};
