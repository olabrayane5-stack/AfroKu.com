import React, { useState } from 'react';
import { KeyRound, Phone, Mail, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onBackToLogin }) => {
  const [method, setMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'request' | 'otp' | 'success'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Veuillez saisir votre numéro WhatsApp ou votre e-mail.');
      return;
    }

    // Générer un code OTP simulé (ex: 482910)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(code);
    setError(null);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedOtp && otpCode !== '123456') {
      setError('Code de vérification incorrect. Veuillez vérifier votre SMS / WhatsApp.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setError(null);
    setStep('success');
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600 dark:text-amber-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
          Réinitialisation du Mot de Passe
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {step === 'request' && 'Recevez un code secret sur votre téléphone ou par email'}
          {step === 'otp' && 'Saisissez le code reçu et votre nouveau mot de passe'}
          {step === 'success' && 'Mot de passe réinitialisé avec succès !'}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ÉTAPE 1 : Choix de la méthode & Saisie numéro */}
      {step === 'request' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setMethod('whatsapp')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                method === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>SMS / WhatsApp (Conseillé)</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                method === 'email'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {method === 'whatsapp' ? 'Numéro de Téléphone / WhatsApp' : 'Adresse E-mail du compte'}
            </label>
            <input
              type={method === 'whatsapp' ? 'tel' : 'email'}
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder={method === 'whatsapp' ? '+229 97 00 00 00' : 'votre.email@example.com'}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Envoyer le Code de Vérification
          </button>
        </form>
      )}

      {/* ÉTAPE 2 : Saisie de l'OTP & du Nouveau Mot de Passe */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {/* Notification du code pour la démo */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300">
            <p className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Code d'activation envoyé à {identifier} !
            </p>
            <p className="mt-1 text-[11px]">
              Code secret d'accès rapide (démo) : <strong className="font-mono bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-950 dark:text-emerald-100">{simulatedOtp}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Code à 6 chiffres reçu *
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              placeholder="Ex: 482910"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-center font-mono font-bold text-lg tracking-widest bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nouveau Mot de Passe *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-md"
          >
            Valider le nouveau mot de passe
          </button>
        </form>
      )}

      {/* ÉTAPE 3 : Succès */}
      {step === 'success' && (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Votre mot de passe a été modifié avec succès ! Vous pouvez maintenant vous connecter.
          </p>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
          >
            Retour à la Connexion
          </button>
        </div>
      )}

      {step !== 'success' && (
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la page de connexion</span>
          </button>
        </div>
      )}
    </div>
  );
};
