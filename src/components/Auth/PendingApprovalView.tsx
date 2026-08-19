import React from 'react';
import { Clock, ShieldCheck, Mail, Phone, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserAccount } from '../../types';

interface PendingApprovalViewProps {
  user: UserAccount;
  onClose: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ user, onClose }) => {
  return (
    <div className="space-y-6 text-center py-2">
      {/* Icone Animée Horloge & Badge */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center border-4 border-amber-200 dark:border-amber-700 animate-pulse">
          <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Titre & Message Principal */}
      <div>
        <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
          Dossier en cours d'évaluation ⏳
        </h3>
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mt-1">
          Numéro de Dossier : <span className="font-mono font-bold">#AFK-{user.id.substring(0, 6).toUpperCase()}</span>
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left space-y-3 text-xs text-slate-700 dark:text-slate-300">
        <p className="leading-relaxed">
          Bonjour <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span>, votre dossier de candidature pour devenir <span className="font-semibold text-amber-600">{user.role === 'guide' ? 'Guide Certifié' : 'Maître Artisan Partenaire'}</span> sur AfroKu.com a été bien reçu et est actuellement en cours d'étude par notre équipe de sécurité.
        </p>

        <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pièces justificatives (CNI / Photo atelier) reçues</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Délai de traitement estimé : <strong className="text-slate-900 dark:text-slate-100">24h à 48h ouvrées</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>L'accès au Dashboard sera débloqué dès validation</span>
          </div>
        </div>
      </div>

      {/* Notification Canaux */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-left">
        <h5 className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5 mb-1">
          <Phone className="w-3.5 h-3.5" />
          Comment serez-vous informé ?
        </h5>
        <p className="text-[11px] text-amber-800 dark:text-amber-300">
          Dès que l'administrateur aura validé vos pièces, vous recevrez automatiquement un <strong className="underline">SMS et un message WhatsApp</strong> de confirmation avec votre Badge Officiel.
        </p>
      </div>

      {/* Support Contact */}
      <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
        Une question urgente ? Contactez l'assistance :{' '}
        <a href="mailto:support@afroku.com" className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-1">
          <Mail className="w-3 h-3" /> support@afroku.com
        </a>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
      >
        <span>J'ai compris, me déconnecter en attendant</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
