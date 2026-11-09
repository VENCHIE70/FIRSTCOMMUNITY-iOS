import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { CalendarEvent, EventCategory } from '../types';
import { downloadSingleICS } from '../utils/calendarExport';

interface CalendarCardProps {
  event: CalendarEvent;
  onCopyDetails: (text: string) => void;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({ event, onCopyDetails }) => {
  // Parse date
  const [yearStr, monthStr, dayStr] = event.date.split('-');
  const monthNames = [
    'GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU',
    'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'
  ];
  const monthLabel = monthNames[parseInt(monthStr, 10) - 1] || '';

  const categoryStyles: Record<
    EventCategory,
    { label: string; bg: string; text: string; border: string; accent: string }
  > = {
    eucarestia: {
      label: 'Eucarestia',
      bg: 'bg-amber-950/40',
      text: 'text-amber-300',
      border: 'border-amber-800/60',
      accent: 'border-l-amber-500',
    },
    parola: {
      label: 'Liturgia della Parola',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-300',
      border: 'border-emerald-800/60',
      accent: 'border-l-emerald-500',
    },
    tema: {
      label: 'Tema Apocalisse',
      bg: 'bg-blue-950/40',
      text: 'text-blue-300',
      border: 'border-blue-800/60',
      accent: 'border-l-blue-500',
    },
    convivenza: {
      label: 'Convivenza',
      bg: 'bg-purple-950/40',
      text: 'text-purple-300',
      border: 'border-purple-800/60',
      accent: 'border-l-purple-500',
    },
    penitenziale: {
      label: 'Penitenziale',
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      border: 'border-rose-800/60',
      accent: 'border-l-rose-500',
    },
    speciale: {
      label: 'Solennità / Feste',
      bg: 'bg-indigo-950/40',
      text: 'text-indigo-300',
      border: 'border-indigo-800/60',
      accent: 'border-l-indigo-500',
    },
    avviso: {
      label: 'Avviso Importante',
      bg: 'bg-red-950/50',
      text: 'text-red-300',
      border: 'border-red-800/60',
      accent: 'border-l-red-500',
    },
    incontro: {
      label: 'Incontro',
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
      accent: 'border-l-slate-400',
    },
  };

  const style = categoryStyles[event.category] || categoryStyles.incontro;

  const handleShare = () => {
    const text = `📅 1^ Comunità: ${event.title}\n🗓️ ${event.dayOfWeek} ${event.date}${
      event.time ? ' ore ' + event.time : ''
    }${event.location ? ' presso ' + event.location : ''}${
      event.preparationGroup ? '\n👥 Preparazione: ' + event.preparationGroup : ''
    }${event.notice ? '\nℹ️ ' + event.notice : ''}`;

    if (navigator.share) {
      navigator.share({ title: `1^ Comunità: ${event.title}`, text }).catch(() => {
        onCopyDetails(text);
      });
    } else {
      onCopyDetails(text);
    }
  };

  return (
    <div
      className={`group relative bg-slate-800/85 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 border-l-4 ${style.accent} shadow-sm hover:shadow-lg`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Date block */}
        <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-16 sm:h-18 rounded-xl bg-slate-900 border border-slate-700/70 shrink-0 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {monthLabel}
          </span>
          <span className="text-xl sm:text-2xl font-black text-white leading-none my-0.5">
            {dayStr}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
            {yearStr}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {event.dayOfWeek}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}
            >
              {style.label}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
            {event.title}
          </h3>

          {/* Time & Location */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 flex-wrap">
            {event.time && (
              <span className="flex items-center gap-1 font-medium bg-slate-900/60 px-2 py-0.8 rounded-md border border-slate-700/50">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Ore {event.time}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 font-medium bg-slate-900/60 px-2 py-0.8 rounded-md border border-slate-700/50">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {event.location}
              </span>
            )}
          </div>

          {/* Notice Banner */}
          {event.notice && (
            <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{event.notice}</p>
            </div>
          )}

          {/* Gruppo di Preparazione */}
          {event.preparationGroup && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Gruppo di Preparazione</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {event.preparationGroup}
              </p>
            </div>
          )}

          {/* Action Buttons: Apple Calendario (iPhone / iOS) */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
            {/* Apple Calendario (.ics per iPhone) */}
            <button
              onClick={async () => {
                const res = await downloadSingleICS(event);
                if (res.shared) {
                  onCopyDetails(`Evento "${event.title}" aperto nel foglio di condivisione per Apple Calendario!`);
                } else if (res.downloaded) {
                  onCopyDetails(`File evento .ics scaricato! Aprilo per aggiungerlo ad Apple Calendario.`);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-950/40 transition active:scale-[0.98]"
              title="Aggiungi ad Apple Calendario del tuo iPhone"
            >
              <CalendarIcon className="w-4 h-4 shrink-0" />
              <span>Aggiungi ad Apple Calendario</span>
            </button>

            {/* Condividi per iMessage o WhatsApp */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95 shrink-0"
              title="Condividi dettagli via iMessage o WhatsApp"
              aria-label="Condividi evento"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Condividi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
