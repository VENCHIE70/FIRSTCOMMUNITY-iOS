import React from 'react';
import {
  Phone,
  MessageSquare,
  UserPlus,
  Copy,
  Star,
  ExternalLink,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { Contact } from '../types';
import { cleanPhoneNumber, getWhatsAppNumber } from '../utils/vcard';

interface ContactCardProps {
  contact: Contact;
  onSaveToPhone: (contact: Contact) => void;
  onToggleStar: (id: number) => void;
  onCopyNumber: (num: string, label: string) => void;
  onSelect: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onSaveToPhone,
  onToggleStar,
  onCopyNumber,
  onSelect,
}) => {
  // Generate consistent background color based on family name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-600 to-indigo-700',
      'from-emerald-600 to-teal-700',
      'from-amber-600 to-orange-700',
      'from-purple-600 to-violet-700',
      'from-rose-600 to-pink-700',
      'from-cyan-600 to-blue-700',
      'from-indigo-600 to-cyan-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    const clean = name.replace(/^(don|in|ved\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const cleanMobile = cleanPhoneNumber(contact.mobilePhone);
  const waNumber = getWhatsAppNumber(contact.mobilePhone);
  const cleanLandline = cleanPhoneNumber(contact.landlinePhone);
  const cleanAlt = cleanPhoneNumber(contact.altPhone);

  return (
    <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-blue-950/20">
      {/* Top row: Avatar, Info, Favorite */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0" onClick={() => onSelect(contact)} role="button">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarColor(
              contact.familyGroup
            )} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-inner`}
          >
            {getInitials(contact.fullName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {contact.familyGroup}
              </span>
              {contact.locationNote && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                  <MapPin className="w-2.5 h-2.5" />
                  {contact.locationNote}
                </span>
              )}
              {contact.notes && !contact.locationNote && (
                <span className="text-[11px] font-medium text-amber-300 bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.2 rounded">
                  {contact.notes}
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate leading-snug hover:text-blue-300 transition-colors">
              {contact.fullName}
            </h3>
            <span className="text-[11px] text-slate-400">N° {contact.id}</span>
          </div>
        </div>

        <button
          onClick={() => onToggleStar(contact.id)}
          className={`p-2 rounded-lg transition active:scale-90 ${
            contact.isStarred
              ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
          }`}
          title={contact.isStarred ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          aria-label="Preferito"
        >
          <Star className={`w-4 h-4 ${contact.isStarred ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Phone numbers section */}
      <div className="mt-3.5 space-y-2 pt-3 border-t border-slate-700/50">
        {/* Mobile Phone */}
        {contact.mobilePhone && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Cellulare</p>
                <a
                  href={`tel:${cleanMobile}`}
                  className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-blue-400 tracking-wide font-mono transition"
                >
                  {contact.mobilePhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`tel:${cleanMobile}`}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                title="Chiama subito dal telefono"
                aria-label="Chiama cellulare"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white transition active:scale-95"
                  title="Apri chat WhatsApp"
                  aria-label="Messaggio WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              )}

              <a
                href={`sms:${cleanMobile}`}
                className="p-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white transition active:scale-95 hidden sm:flex"
                title="Invia SMS"
                aria-label="Invia SMS"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onCopyNumber(contact.mobilePhone!, contact.fullName)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                title="Copia numero"
                aria-label="Copia numero"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Landline Phone */}
        {contact.landlinePhone && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Telefono Fisso</p>
                <a
                  href={`tel:${cleanLandline}`}
                  className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-amber-400 tracking-wide font-mono transition"
                >
                  {contact.landlinePhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`tel:${cleanLandline}`}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                title="Chiama telefono fisso"
                aria-label="Chiama fisso"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => onCopyNumber(contact.landlinePhone!, contact.fullName)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                title="Copia numero fisso"
                aria-label="Copia fisso"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Alternate Phone (e.g. Bridgeport second phone) */}
        {contact.altPhone && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Altro recapito</p>
                <a
                  href={`tel:${cleanAlt}`}
                  className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-purple-400 tracking-wide font-mono transition"
                >
                  {contact.altPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`tel:${cleanAlt}`}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                title="Chiama recapito secondario"
                aria-label="Chiama secondario"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => onCopyNumber(contact.altPhone!, contact.fullName)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                title="Copia numero"
                aria-label="Copia numero"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button: Salva nei contatti iPhone */}
      <div className="mt-3.5 pt-2 flex items-center gap-2">
        <button
          onClick={() => onSaveToPhone(contact)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-950/40 transition active:scale-[0.98]"
          title="Salva nei Contatti del tuo iPhone"
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>Salva nei Contatti iPhone</span>
        </button>
        <button
          onClick={() => onSelect(contact)}
          className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 shrink-0"
          title="Dettagli e Condivisione"
          aria-label="Dettagli contatto"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
