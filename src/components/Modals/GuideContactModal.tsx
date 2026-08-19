import React, { useState } from 'react';
import { GuideItem } from '../../types';
import { X, Calendar, MessageSquare, Phone, MapPin, CheckCircle2, Languages, ShieldCheck, User, Clock, Star } from 'lucide-react';

interface GuideContactModalProps {
  guide: GuideItem | null;
  onClose: () => void;
}

export const GuideContactModal: React.FC<GuideContactModalProps> = ({ guide, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [groupSize, setGroupSize] = useState('2 personnes');
  const [selectedLanguage, setSelectedLanguage] = useState(guide?.languages[0] || 'Français');
  const [message, setMessage] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!guide) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-amber-500/20 overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-6 text-slate-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/10 hover:bg-slate-950/30 text-slate-950 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={guide.photo}
              alt={guide.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-950/20 shadow-md"
            />
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full mb-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Guide Certifié AfroKu
              </span>
              <h3 className="text-xl font-black font-serif text-slate-950 leading-tight">
                {guide.name}
              </h3>
              <p className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {guide.location}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black font-serif text-slate-900">
                Demande de réservation envoyée !
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Merci <strong>{clientName}</strong>. Le guide <strong>{guide.name}</strong> a bien reçu votre demande pour le <strong>{selectedDate || 'votre date souhaitée'}</strong> et vous recontactera par WhatsApp/SMS au <strong>{clientPhone}</strong>.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Guide :</span>
                  <span>{guide.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tarif indicatif :</span>
                  <span className="font-bold text-amber-900">{guide.pricePerDay.toLocaleString('fr-FR')} FCFA / jour</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Langue choisie :</span>
                  <span className="font-bold text-slate-800">{selectedLanguage}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors mt-4"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Votre Nom Complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Dupont"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Numéro Téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+229 01 00 00 00 00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date souhaitée de visite *
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Taille du Groupe
                  </label>
                  <select
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                  >
                    <option value="1 personne (Solo)">1 personne (Solo)</option>
                    <option value="2 personnes (Couple)">2 personnes (Couple)</option>
                    <option value="3 à 5 personnes (Famille / Amis)">3 à 5 personnes</option>
                    <option value="Groupe (6+ personnes)">Groupe (6+ personnes)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Langue souhaitée pour le guidage
                </label>
                <div className="flex flex-wrap gap-2">
                  {guide.languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedLanguage === lang
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Précisez vos souhaits / circuit particulier
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Nous aimerions visiter la Route des Esclaves, le temple des pythons et déjeuner au bord de la lagune..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Tarif estimé :</span>
                <span className="text-base font-black text-amber-900">
                  {guide.pricePerDay.toLocaleString('fr-FR')} FCFA / jour
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-slate-950" />
                <span>Envoyer la demande au Guide</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
