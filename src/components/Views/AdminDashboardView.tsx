import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Clock, XCircle, Trash2, MapPin, Mail, Phone, Building2, UserCheck, Palette, Sparkles, Filter, Globe } from 'lucide-react';
import { getStoredApplications, updateApplicationStatus, deleteApplication } from '../../services/partnerStore';
import { PartnerApplication } from '../../types';

export const AdminDashboardView: React.FC = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const reloadApps = () => {
    setApplications(getStoredApplications());
  };

  useEffect(() => {
    reloadApps();
  }, []);

  const handleStatusChange = (id: string, status: 'Approuvé' | 'Rejeté') => {
    updateApplicationStatus(id, status);
    reloadApps();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette demande de partenariat ?')) {
      deleteApplication(id);
      reloadApps();
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterType !== 'all' && app.type !== filterType) return false;
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span>Espace d'Administration & Gestion des Partenariats</span>
            </div>
            <h1 className="text-3xl font-black text-white">Demandes de Partenariat AfroKu</h1>
            <p className="text-sm text-slate-400 mt-1">
              Validez les candidatures d'hébergements, chauffeurs, guides, restaurants et artisans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-sm rounded-xl">
              {applications.filter((a) => a.status === 'pending').length} En attente
            </span>
            <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-extrabold text-sm rounded-xl">
              {applications.filter((a) => a.status === 'approved').length} Approuvées
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Filtrer par type :</span>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">Tous les types</option>
              <option value="guide">Guide touristique</option>
              <option value="artisan">Artisan / Atelier</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <span>Statut :</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>
        </div>

        {/* List of Applications */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-dashed border-slate-700 space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-bold text-slate-300">Aucune demande de partenariat ne correspond à vos filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 space-y-4 shadow-xl relative flex flex-col justify-between"
              >
                <div>
                  {/* Badge type & status */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${
                        app.type === 'guide'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {app.type === 'guide' ? <UserCheck className="w-3.5 h-3.5" /> : <Palette className="w-3.5 h-3.5" />}
                      {app.type === 'guide' ? 'Guide Touristique' : 'Artisan / Créateur'}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        app.status === 'Approuvé'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'Rejeté'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {app.status === 'Approuvé'
                        ? 'Approuvé'
                        : app.status === 'Rejeté'
                        ? 'Rejeté'
                        : 'En examen'}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={app.photoUrl}
                      alt={app.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-600 shrink-0 shadow-md"
                    />
                    <div>
                      <h3 className="font-extrabold text-white text-base leading-tight">{app.fullName}</h3>
                      <p className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{app.city}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Inscrit le {app.submittedAt}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-white">{app.phoneWhatsApp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{app.email}</span>
                    </div>

                    {app.type === 'guide' ? (
                      <>
                        <div className="text-slate-400">
                          <strong>Langues:</strong> {app.languages?.join(', ')}
                        </div>
                        <div className="text-slate-400">
                          <strong>Tarif:</strong> {app.dailyRateXOF?.toLocaleString()} FCFA / jour
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-400">
                          <strong>Atelier:</strong> {app.workshopName} ({app.craftType})
                        </div>
                        <div className="text-slate-400">
                          <strong>Atelier découverte:</strong> {app.workshopPriceXOF?.toLocaleString()} FCFA
                        </div>
                      </>
                    )}

                    <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 line-clamp-3 mt-2">
                      "{app.bio}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    {app.status !== 'Approuvé' && (
                      <button
                        onClick={() => handleStatusChange(app.id, 'Approuvé')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approuver</span>
                      </button>
                    )}
                    {app.status !== 'Rejeté' && (
                      <button
                        onClick={() => handleStatusChange(app.id, 'Rejeté')}
                        className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-rose-800/50 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejeter</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-xl transition-all cursor-pointer"
                    title="Supprimer la candidature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
