import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  MapPin,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Printer,
  QrCode,
  Compass,
  UserCheck,
  Palette,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
  User,
  X
} from 'lucide-react';
import {
  ReservationItem,
  getStoredReservations,
  cancelReservation,
  deleteReservation,
  clearAllReservations,
  addDemoSampleReservations,
  RESERVATION_CHANGE_EVENT,
} from '../../services/reservationStore';
import { ActiveTab } from '../../types';
import { handleImageError } from '../SafeImage';

interface ReservationsViewProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({ onNavigate }) => {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  
  // Voucher Modal State
  const [selectedVoucher, setSelectedVoucher] = useState<ReservationItem | null>(null);

  // Confirmation Modals State
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);

  // Load reservations on mount and listen to changes
  useEffect(() => {
    const load = () => {
      setReservations(getStoredReservations());
    };
    load();

    const handleCustomEvent = () => load();
    window.addEventListener(RESERVATION_CHANGE_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleCustomEvent);

    return () => {
      window.removeEventListener(RESERVATION_CHANGE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleCustomEvent);
    };
  }, []);

  const handlePrintVoucher = () => {
    window.print();
  };

  const handleConfirmCancel = () => {
    if (cancelTargetId) {
      cancelReservation(cancelTargetId);
      setCancelTargetId(null);
      if (selectedVoucher && selectedVoucher.id === cancelTargetId) {
        setSelectedVoucher({ ...selectedVoucher, status: 'Annulée' });
      }
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteReservation(deleteTargetId);
      setDeleteTargetId(null);
      if (selectedVoucher && selectedVoucher.id === deleteTargetId) {
        setSelectedVoucher(null);
      }
    }
  };

  const handleConfirmClearAll = () => {
    clearAllReservations();
    setShowClearAllModal(false);
    setSelectedVoucher(null);
  };

  const totalSpentXOF = reservations
    .filter((r) => r.status === 'Confirmée')
    .reduce((sum, r) => sum + (r.priceXOF || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Reservations */}
      <div className="bg-gradient-to-r from-[#003580] via-[#002866] to-[#001840] text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            Espace Personnel & Pass
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Mes Réservations & Billets
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Consultez et téléchargez les pass de vos séjours, visites guidées, ateliers d'artisans et billets d'excursions au Bénin.
          </p>
        </div>

        {reservations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0 space-y-1 relative z-10 w-full md:w-auto">
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {reservations.length} {reservations.length > 1 ? 'Réservations' : 'Réservation'}
            </div>
            <div className="text-xs text-blue-100 font-medium">
              Total engagé : <strong className="text-white font-extrabold">{totalSpentXOF.toLocaleString('fr-FR')} XOF</strong>
            </div>
          </div>
        )}
      </div>

      {/* CASE 1: EMPTY STATE WHEN NO RESERVATION EXISTS */}
      {reservations.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-8 max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border-2 border-amber-200 shadow-inner">
            <CalendarCheck className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Vous n'avez aucune réservation pour l'instant
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Dès que vous effectuez une réservation d'hébergement, réservez un guide natif certifié, participez à un atelier d'artisanat ou achetez un ticket de circuit culturel sur <strong className="text-[#003580]">AfroKu.com</strong>, vos reçus et pass d'accès s'afficheront directement ici.
            </p>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
            <button
              onClick={() => onNavigate?.('explorer')}
              className="group bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 p-5 rounded-2xl transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#003580] flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#003580]">
                  Explorer les 12 Départements
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Découvrez les auberges, hôtels et circuits phares dans tout le Bénin.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-bold text-[#003580] group-hover:translate-x-1 transition-transform">
                <span>Voir les séjours</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('guides')}
              className="group bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 p-5 rounded-2xl transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-800">
                  Engager un Guide Natif
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  18 guides certifiés prêts à vous faire vivre des expériences authentiques.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                <span>Réserver un guide</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('artisans')}
              className="group bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 p-5 rounded-2xl transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-900">
                  Boutiques & Ateliers Artisans
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Visitez les vraies boutiques physiques et apprenez les savoir-faire royaux.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Découvrir l'artisanat</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Vos réservations sont sauvegardées en toute sécurité sur cet appareil.</span>
            </span>
          </div>
        </div>
      ) : (
        /* CASE 2: POPULATED RESERVATIONS LIST */
        <div className="space-y-4">
          {/* List of Reservation Cards */}
          {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
                >
                  {/* Left Column: Image & Details */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={res.image || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=400&q=70'}
                        alt={res.title}
                        className="w-24 h-24 sm:w-28 sm:h-24 rounded-2xl object-cover border border-slate-100 shadow-xs"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                      />
                      <span className="absolute top-1 left-1 bg-slate-900/90 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {res.category}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Réf : {res.code}
                        </span>
                        {res.customerName && (
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{res.customerName}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                        {res.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{res.location}</span>
                        </span>

                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{res.dates}</span>
                        </span>
                      </div>

                      {res.detailsNote && (
                        <p className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 inline-block font-medium">
                          {res.detailsNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Price & Action Buttons */}
                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="flex items-center justify-between md:justify-end w-full gap-3">
                      <div className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${
                        res.status === 'Confirmée'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {res.status === 'Confirmée' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>{res.status}</span>
                      </div>

                      <div className="text-xl font-black text-slate-900 font-serif">
                        {res.priceXOF.toLocaleString('fr-FR')} XOF
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedVoucher(res)}
                        className="flex-1 md:flex-initial px-4 py-2.5 bg-[#003580] hover:bg-[#002866] text-amber-300 hover:text-amber-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Voir le Pass</span>
                      </button>

                      {res.status === 'Confirmée' && (
                        <button
                          onClick={() => setCancelTargetId(res.id)}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                          title="Annuler cette réservation"
                        >
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTargetId(res.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Supprimer la fiche"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* MODAL 1: FULL PRINTABLE VOUCHER / PASS MODAL */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 relative my-auto">
            {/* Header Voucher */}
            <div className="bg-gradient-to-r from-[#003580] to-[#002255] text-white p-6 relative">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                    Pass Officiel AfroKu.com
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-200">#{selectedVoucher.code}</span>
                </div>
                <h3 className="text-xl font-extrabold text-white font-serif">
                  {selectedVoucher.title}
                </h3>
              </div>
            </div>

            {/* Printable Pass Body */}
            <div className="p-6 space-y-6 text-slate-900" id="printable-voucher">
              {/* QR Code and Status Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Statut du Pass</span>
                  <div className={`font-black text-sm flex items-center gap-1 ${
                    selectedVoucher.status === 'Confirmée' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {selectedVoucher.status === 'Confirmée' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>RÉSERVATION {selectedVoucher.status.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Présentez ce QR Code à votre arrivée au partenaire.
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs text-center shrink-0">
                  <QrCode className="w-16 h-16 text-slate-900 mx-auto" />
                  <span className="text-[9px] font-mono font-bold text-slate-400 block mt-1">VERIFIED PASS</span>
                </div>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Catégorie</span>
                  <span className="font-extrabold text-[#003580]">{selectedVoucher.category}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Lieu / Destination</span>
                  <span className="font-bold text-slate-900">{selectedVoucher.location}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Date & Horaire</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedVoucher.dates}</span>
                </div>

                {selectedVoucher.customerName && (
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Titulaire</span>
                    <span className="font-bold text-slate-900">{selectedVoucher.customerName}</span>
                  </div>
                )}

                {selectedVoucher.paymentMethod && (
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Paiement</span>
                    <span className="font-bold text-amber-800">{selectedVoucher.paymentMethod}</span>
                  </div>
                )}
              </div>

              {/* Total & Ref */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Montant Payé</span>
                  <strong className="text-lg font-black text-amber-300">
                    {selectedVoucher.priceXOF.toLocaleString('fr-FR')} XOF
                  </strong>
                </div>

                <div className="text-right text-[10px] text-slate-400">
                  <span>Emission : AfroKu.com Bénin</span>
                  <div className="font-mono text-slate-300 font-bold">{selectedVoucher.code}</div>
                </div>
              </div>

              {/* Guarantee Note */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Ce pass est garanti par le réseau des partenaires officiels AfroKu Bénin.</span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={handlePrintVoucher}
                className="px-4 py-2.5 bg-[#003580] hover:bg-[#002866] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Imprimer / PDF</span>
              </button>

              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM CANCEL */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Annuler la réservation ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le statut de la réservation passera à "Annulée". Le service client prendra contact avec vous.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Retour
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM DELETE */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Supprimer de la liste ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cette fiche de réservation sera supprimée de votre appareil.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRM CLEAR ALL */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Vider l'historique ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toutes vos réservations seront effacées. La section repassera à l'état initial.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Tout Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
