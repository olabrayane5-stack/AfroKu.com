import React, { useEffect, useState } from 'react';
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
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  MessageCircle,
  TrendingUp,
  Landmark,
  User,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  ReservationItem,
  getReservationsForProvider,
  updateReservationStatus,
  computeCommissionSplit,
  RESERVATION_CHANGE_EVENT,
} from '../../services/reservationStore';
import {
  AvailabilitySlot,
  getAvailability,
  addAvailability,
  removeAvailability,
  AVAILABILITY_CHANGE_EVENT,
} from '../../services/availabilityStore';

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
  const category = isGuide ? 'GUIDE' : 'ARTISAN';

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

      {/* Bandeau d'information */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <p className="text-xs text-blue-900 leading-relaxed">
          AfroKu prélève une commission de <strong>20 %</strong> sur chaque réservation confirmée ;
          le solde de <strong>80 %</strong> vous revient. Les demandes ci-dessous sont reliées à votre
          nom de profil (<strong>{user.name}</strong>) — pour les tests, réservez depuis un profil du
          même nom sur la page Guides / Artisans.
        </p>
      </div>

      {/* Réservations reçues */}
      <ReservationsReceivedPanel category={category} providerId={user.id} providerName={user.name} color={roleColor} />

      <div className="grid sm:grid-cols-2 gap-4">
        <AvailabilityPanel providerEmail={user.email} color={roleColor} />
        <EarningsPanel category={category} providerId={user.id} providerName={user.name} color={roleColor} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {isGuide ? (
          <FeatureCardStub
            icon={<CalendarCheck className="w-5 h-5" />}
            title="Mon calendrier de circuits"
            description="La planification détaillée de vos circuits jour par jour arrive prochainement."
            color="amber"
          />
        ) : (
          <>
            <FeatureCardStub
              icon={<ShoppingBag className="w-5 h-5" />}
              title="Ma boutique"
              description="Ajoutez et gérez vos produits — chaque nouvel article sera soumis à validation avant publication."
              color="emerald"
            />
          </>
        )}
        <SupportPartnerPanel color={roleColor} />
      </div>
    </div>
  );
};

const COLOR_CLASSES: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

const COLOR_SOLID: Record<string, string> = {
  amber: 'bg-amber-500 hover:bg-amber-600',
  emerald: 'bg-emerald-600 hover:bg-emerald-700',
};

const COLOR_TEXT: Record<string, string> = {
  amber: 'text-amber-700',
  emerald: 'text-emerald-700',
};

/* ============================================================================
 * RÉSERVATIONS REÇUES
 * ========================================================================== */
const ReservationsReceivedPanel: React.FC<{
  category: 'GUIDE' | 'ARTISAN';
  providerId?: string;
  providerName: string;
  color: string;
}> = ({ category, providerId, providerName, color }) => {
  const [items, setItems] = useState<ReservationItem[]>([]);

  const load = () => setItems(getReservationsForProvider(category, providerId, providerName));

  useEffect(() => {
    load();
    window.addEventListener(RESERVATION_CHANGE_EVENT, load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener(RESERVATION_CHANGE_EVENT, load);
      window.removeEventListener('storage', load);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, providerId, providerName]);

  const statusBadge = (status: string) => {
    if (status === 'Confirmée') return 'bg-emerald-100 text-emerald-800';
    if (status === 'Annulée') return 'bg-rose-100 text-rose-700';
    if (status === 'Terminée') return 'bg-slate-200 text-slate-700';
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${COLOR_CLASSES[color]}`}>
          <Inbox className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Réservations reçues</h3>
          <p className="text-[11px] text-slate-500">{items.length} demande{items.length > 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500 mt-4 py-6 text-center border border-dashed border-slate-200 rounded-xl">
          Aucune réservation reçue pour l'instant. Elle apparaîtra ici automatiquement dès qu'un
          voyageur réserve votre profil.
        </p>
      ) : (
        <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {items.map((res) => {
            const { netPayoutXOF } = computeCommissionSplit(res.priceXOF);
            return (
              <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{res.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{res.dates}</p>
                    {res.customerName && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" /> {res.customerName}
                        {res.customerPhone ? ` · ${res.customerPhone}` : ''}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge(res.status)}`}>
                    {res.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500">
                    Net après commission (20%) : <strong className={COLOR_TEXT[color]}>{netPayoutXOF.toLocaleString('fr-FR')} XOF</strong>
                  </span>
                  {res.status === 'En attente' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateReservationStatus(res.id, 'Confirmée')}
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg"
                        title="Confirmer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'Annulée')}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg"
                        title="Refuser"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * MES DISPONIBILITÉS
 * ========================================================================== */
const AvailabilityPanel: React.FC<{ providerEmail: string; color: string }> = ({ providerEmail, color }) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [newDate, setNewDate] = useState('');

  const load = () => setSlots(getAvailability(providerEmail));

  useEffect(() => {
    load();
    window.addEventListener(AVAILABILITY_CHANGE_EVENT, load);
    return () => window.removeEventListener(AVAILABILITY_CHANGE_EVENT, load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerEmail]);

  const handleAdd = () => {
    if (!newDate) return;
    setSlots(addAvailability(providerEmail, newDate));
    setNewDate('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${COLOR_CLASSES[color]}`}>
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Mes disponibilités</h3>
          <p className="text-[11px] text-slate-500">Indiquez vos créneaux libres</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
        />
        <button
          onClick={handleAdd}
          disabled={!newDate}
          className={`shrink-0 p-2 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed ${COLOR_SOLID[color]}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {slots.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4 border border-dashed border-slate-200 rounded-xl">
          Aucun créneau ajouté pour le moment.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-800">
                {new Date(slot.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <button onClick={() => setSlots(removeAvailability(providerEmail, slot.id))} className="text-slate-400 hover:text-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * MES GAINS
 * ========================================================================== */
const EarningsPanel: React.FC<{
  category: 'GUIDE' | 'ARTISAN';
  providerId?: string;
  providerName: string;
  color: string;
}> = ({ category, providerId, providerName, color }) => {
  const [items, setItems] = useState<ReservationItem[]>([]);

  const load = () => setItems(getReservationsForProvider(category, providerId, providerName));

  useEffect(() => {
    load();
    window.addEventListener(RESERVATION_CHANGE_EVENT, load);
    return () => window.removeEventListener(RESERVATION_CHANGE_EVENT, load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, providerId, providerName]);

  const confirmed = items.filter((r) => r.status === 'Confirmée' || r.status === 'Terminée');
  const totalBrutXOF = confirmed.reduce((sum, r) => sum + (r.priceXOF || 0), 0);
  const { commissionXOF, netPayoutXOF } = computeCommissionSplit(totalBrutXOF);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${COLOR_CLASSES[color]}`}>
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Mes gains</h3>
          <p className="text-[11px] text-slate-500">{confirmed.length} réservation{confirmed.length > 1 ? 's' : ''} confirmée{confirmed.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Total encaissé (brut)</span>
          <span className="font-bold text-slate-900">{totalBrutXOF.toLocaleString('fr-FR')} XOF</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5" /> Commission AfroKu (20%)
          </span>
          <span className="font-bold text-rose-600">- {commissionXOF.toLocaleString('fr-FR')} XOF</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Reversé net (80%)
          </span>
          <span className={`font-black text-base ${COLOR_TEXT[color]}`}>{netPayoutXOF.toLocaleString('fr-FR')} XOF</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * SUPPORT PARTENAIRE
 * ========================================================================== */
const SupportPartnerPanel: React.FC<{ color: string }> = ({ color }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${COLOR_CLASSES[color]}`}>
        <Phone className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">Support partenaire</h3>
        <p className="text-[11px] text-slate-500">Une question ? Contactez l'équipe AfroKu</p>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <a
        href="https://wa.me/22901536370860"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp Support Partenaire
      </a>
      <a
        href="mailto:partenaires@afroku.com"
        className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2"
      >
        <Mail className="w-4 h-4" /> partenaires@afroku.com
      </a>
    </div>
  </div>
);

/* ============================================================================
 * STUB (fonctionnalités futures)
 * ========================================================================== */
const FeatureCardStub: React.FC<{
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
