import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MessageSquare,
  UserPlus,
  Copy,
  Edit2,
  Trash2,
  MapPin,
  Share2,
} from 'lucide-react';
import { Contact } from '../types';
import { cleanPhoneNumber, getWhatsAppNumber, downloadSingleVCard } from '../utils/vcard';

interface ContactDetailModalProps {
  contact: Contact | null;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  onCopyNumber: (num: string, label: string) => void;
  onNotify: (msg: string) => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  onClose,
  onEdit,
  onDelete,
  onCopyNumber,
  onNotify,
}) => {
  if (!contact) return null;

  const cleanMobile = cleanPhoneNumber(contact.mobilePhone);
  const waNumber = getWhatsAppNumber(contact.mobilePhone);
  const cleanLandline = cleanPhoneNumber(contact.landlinePhone);
  const cleanAlt = cleanPhoneNumber(contact.altPhone);

  const handleShare = () => {
    const text = `1^ Comunità S.AP.\n${contact.fullName}\nFamiglia: ${contact.familyGroup}${
      contact.mobilePhone ? '\nCellulare: ' + contact.mobilePhone : ''
    }${contact.landlinePhone ? '\nFisso: ' + contact.landlinePhone : ''}${
      contact.altPhone ? '\nAltro: ' + contact.altPhone : ''
    }`;

    if (navigator.share) {
      navigator.share({ title: contact.fullName, text }).catch(() => {
        navigator.clipboard.writeText(text);
        onNotify('Dettagli copiati negli appunti!');
      });
    } else {
      navigator.clipboard.writeText(text);
      onNotify('Dettagli copiati negli appunti!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Scheda Contatto N° {contact.id}
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">{contact.fullName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap my-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Famiglia {contact.familyGroup}
          </span>
          {contact.locationNote && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <MapPin className="w-3.5 h-3.5" />
              {contact.locationNote}
            </span>
          )}
          {contact.notes && !contact.locationNote && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {contact.notes}
            </span>
          )}
        </div>

        {/* Phone numbers list */}
        <div className="space-y-3">
          {contact.mobilePhone && (
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Cellulare
                  </span>
                  <p className="text-base font-bold text-white font-mono">{contact.mobilePhone}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${cleanMobile}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 shadow-sm"
                    title="Chiama subito"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white transition active:scale-95 shadow-sm"
                      title="Apri WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`sms:${cleanMobile}`}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 shadow-sm"
                    title="Invia SMS"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onCopyNumber(contact.mobilePhone!, contact.fullName)}
                    className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition active:scale-95 shadow-sm"
                    title="Copia numero"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {contact.landlinePhone && (
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Telefono Fisso
                  </span>
                  <p className="text-base font-bold text-white font-mono">{contact.landlinePhone}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${cleanLandline}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 shadow-sm"
                    title="Chiama fisso"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onCopyNumber(contact.landlinePhone!, contact.fullName)}
                    className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition active:scale-95 shadow-sm"
                    title="Copia fisso"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {contact.altPhone && (
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Recapito secondario
                  </span>
                  <p className="text-base font-bold text-white font-mono">{contact.altPhone}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${cleanAlt}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 shadow-sm"
                    title="Chiama secondario"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onCopyNumber(contact.altPhone!, contact.fullName)}
                    className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition active:scale-95 shadow-sm"
                    title="Copia"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Big Save Button */}
        <div className="mt-5 space-y-2">
          <button
            onClick={async () => {
              const res = await downloadSingleVCard(contact);
              if (res.shared) {
                onNotify(`Scheda di ${contact.fullName} pronta per essere salvata nei Contatti!`);
              } else if (res.downloaded) {
                onNotify(`File vCard scaricato! Aprilo per salvare nei Contatti.`);
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-950/50 transition active:scale-98"
          >
            <UserPlus className="w-5 h-5" />
            <span>Salva nei Contatti iPhone (.vcf)</span>
          </button>
          <p className="text-center text-[11px] text-slate-400">
            Ottimizzato per iPhone (iOS): tocca per aprire la scheda e salvarla direttamente in Apple Contatti.
          </p>
        </div>

        {/* Secondary actions: Edit, Share, Delete */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Condividi</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(contact);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Modifica</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Sei sicuro di voler eliminare ${contact.fullName}?`)) {
                  onDelete(contact.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
              title="Elimina contatto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
