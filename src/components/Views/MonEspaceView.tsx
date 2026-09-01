import React from 'react';
import {
  UserCheck,
  Palette,
  BadgeCheck,
  Clock,
  Mail,
  Phone,
  Wallet,
  CalendarCheck,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Espace personnel affiché aux comptes Guide et Artisan validés.
 *
 * Sécurité (défense en profondeur) : ce composant vérifie lui-même le rôle
 * de l'utilisateur avant d'afficher quoi que ce soit — même si "Mon Espace"
 * n'est normalement accessible que via la Navbar (déjà conditionnée sur
 * isPrestataire), on ne fait jamais confiance uniquement à l'interface.
 */
export const MonEspaceView: React.FC = () => {
  const { user } = useAuth();

  if (!user || (user.role !== 'guide' && user.role !== 'artisan')) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <ShieldAlert className="w-14 h-14 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Accès non autorisé</h2>
        <p className="text-sm text-slate-500 mt-2">
          Cet espace est réservé aux comptes Guide et Artisan validés.
        </p>
      </div>
    );
  }

  const isGuide = user.role === 'guide';
  const roleLabel = isGuide ? 'Guide touristique' : 'Artisan / Créateur';
  const roleColor = isGuide ? 'amber' : 'emerald';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* En-tête du profil */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
          isGuide ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {isGuide ? <UserCheck className="w-8 h-8" /> : <Palette className="w-8 h-8" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-black text-slate-900">{user.name}</h1>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              isGuide ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <BadgeCheck className="w-3.5 h-3.5" />
              {roleLabel} — Vérifié
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
        </div>
      </div>

      {/* Bandeau d'information : fonctionnalités à venir */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        
        <p className="text-xs text-blue-900 leading-relaxed">
          Votre espace personnel est en cours d'enrichissement. Les fonctionnalités ci-dessous
          seront activées progressivement — votre compte est déjà prêt à les recevoir.
        </p>
      </div>

      {/* Cartes de fonctionnalités selon le rôle */}
      <div className="grid sm:grid-cols-2 gap-4">
        {isGuide ? (
          <>
            <FeatureCard
              icon={<CalendarCheck className="w-5 h-5" />}
              title="Réservations reçues"
              description="La liste des demandes de réservation de vos futurs clients apparaîtra ici."
              color="amber"
            />
            <FeatureCard
              icon={<Clock className="w-5 h-5" />}
              title="Mes disponibilités"
              description="Indiquez vos créneaux libres pour que les touristes puissent réserver."
              color="amber"
            />
          </>
        ) : (
          <>
            <FeatureCard
              icon={<ShoppingBag className="w-5 h-5" />}
              title="Ma boutique"
              description="Ajoutez et gérez vos produits — chaque nouvel article sera soumis à validation avant publication."
              color="emerald"
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Mes réalisations"
              description="Présentez votre savoir-faire artisanal aux visiteurs de la plateforme."
              color="emerald"
            />
          </>
        )}
        <FeatureCard
          icon={<Wallet className="w-5 h-5" />}
          title="Mes gains"
          description="Le suivi de vos revenus générés sur AfroKu sera disponible ici."
          color={roleColor}
        />
        <FeatureCard
          icon={<Phone className="w-5 h-5" />}
          title="Support partenaire"
          description="Une ligne de contact dédiée aux prestataires sera bientôt disponible."
          color={roleColor}
        />
      </div>
    </div>
  );
};

const COLOR_CLASSES: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 opacity-90">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${COLOR_CLASSES[color] || COLOR_CLASSES.amber}`}>
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
          Bientôt
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);
