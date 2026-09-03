import React, { useEffect } from 'react';
import { X, CalendarDays, Clock, MapPin, Ticket, ChevronRight } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FestivalEvent {
  day: string;
  month: string;
  title: string;
  badge: string;
  date: string;
  time?: string;
  location: string;
  price: string;
}

const UPCOMING_EVENTS: FestivalEvent[] = [
  {
    day: 'SEP',
    month: '2026',
    title: 'Journées du Patrimoine Culturel',
    badge: 'CULTURE & HISTOIRE',
    date: 'Septembre 2026',
    location: 'Porto-Novo',
    price: 'Gratuit',
  },
  {
    day: 'OCT',
    month: '2026',
    title: 'Journées de l’Artisanat',
    badge: 'ARTISANAT',
    date: 'Octobre 2026',
    location: 'Parakou',
    price: 'Gratuit',
  },
  {
    day: '11',
    month: 'NOV',
    title: 'Fête de la Gaani',
    badge: 'CULTURE',
    date: '11 novembre 2026',
    time: '08h30',
    location: 'Dassa-Zoumè & Nikki',
    price: 'Gratuit',
  },
  {
    day: 'NOV',
    month: '2026',
    title: 'Nov’Art',
    badge: 'EXPOSITION',
    date: 'Novembre 2026',
    location: 'Cotonou',
    price: 'Gratuit',
  },
  {
    day: 'DÉC',
    month: '2026',
    title: 'Carnaval Kaléta & Arts Agoudas',
    badge: 'CARNAVAL',
    date: 'Décembre 2026',
    location: 'Cotonou & Ouidah',
    price: 'Gratuit',
  },
  {
    day: 'DÉC',
    month: '2026',
    title: 'Festival EYA',
    badge: 'CONCERT LIVE',
    date: 'Décembre 2026',
    location: 'Cotonou',
    price: 'Gratuit',
  },
  {
    day: '10',
    month: 'JAN',
    title: 'Vodun Days 2027',
    badge: 'ÉVÉNEMENT MAJEUR',
    date: '10 janvier 2027',
    time: '09h00',
    location: 'Ouidah, Bénin',
    price: 'Gratuit',
  },
  {
    day: '17',
    month: 'JAN',
    title: 'Festival des Masques',
    badge: 'TRADITION',
    date: '17–19 janvier 2027',
    time: '14h00',
    location: 'Kouandé & Porto-Novo',
    price: 'Gratuit',
  },
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in [overscroll-behavior:contain]">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 [overscroll-behavior:contain] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-2 shadow-xs">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Agenda des festivités</h2>
          <p className="text-xs text-slate-500 mt-1">
            Retrouvez les prochains événements culturels à ne pas manquer au Bénin.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#003580] text-white"
          >
            À venir
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600"
          >
            Tous
          </button>
        </div>

        <div className="space-y-2.5 max-h-[52vh] overflow-y-auto pr-1 [overscroll-behavior:contain]">
          {UPCOMING_EVENTS.map((event, index) => (
            <div
              key={index}
              className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-amber-400 hover:shadow-xs transition-all"
            >
              <div className="shrink-0 w-14 h-14 rounded-lg bg-[#003580] text-white flex flex-col items-center justify-center leading-none">
                <span className="text-base font-extrabold">{event.day}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide">{event.month}</span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                  {event.badge}
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate">{event.title}</h3>

                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    {event.time ? <Clock className="w-3 h-3 shrink-0" /> : <CalendarDays className="w-3 h-3 shrink-0" />}
                    <span className="truncate">
                      {event.date}
                      {event.time ? ` · ${event.time}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Ticket className="w-3 h-3 shrink-0" />
                    <span className="truncate">{event.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-3.5 bg-[#003580] hover:bg-[#002866] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors mt-4 flex items-center justify-center gap-1.5"
        >
          Voir tous les événements
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
