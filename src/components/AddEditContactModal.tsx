import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus } from 'lucide-react';
import { Contact } from '../types';

interface AddEditContactModalProps {
  isOpen: boolean;
  contactToEdit: Contact | null;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => void;
}

export const AddEditContactModal: React.FC<AddEditContactModalProps> = ({
  isOpen,
  contactToEdit,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [familyGroup, setFamilyGroup] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [landlinePhone, setLandlinePhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setFullName(contactToEdit.fullName);
      setFamilyGroup(contactToEdit.familyGroup);
      setMobilePhone(contactToEdit.mobilePhone || '');
      setLandlinePhone(contactToEdit.landlinePhone || '');
      setAltPhone(contactToEdit.altPhone || '');
      setLocationNote(contactToEdit.locationNote || '');
      setNotes(contactToEdit.notes || '');
    } else {
      setFullName('');
      setFamilyGroup('');
      setMobilePhone('');
      setLandlinePhone('');
      setAltPhone('');
      setLocationNote('');
      setNotes('');
    }
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onSave({
      ...(contactToEdit ? { id: contactToEdit.id } : {}),
      fullName: fullName.trim(),
      familyGroup: familyGroup.trim() || fullName.trim().split(' ')[0].toUpperCase(),
      mobilePhone: mobilePhone.trim() || undefined,
      landlinePhone: landlinePhone.trim() || undefined,
      altPhone: altPhone.trim() || undefined,
      locationNote: locationNote.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              {contactToEdit ? 'Modifica Contatto' : 'Nuovo Contatto Rubrica'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Cognome e Nome *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="es. ROSSI MARIO"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Famiglia / Gruppo
            </label>
            <input
              type="text"
              value={familyGroup}
              onChange={(e) => setFamilyGroup(e.target.value)}
              placeholder="es. ROSSI"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Cellulare
              </label>
              <input
                type="tel"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="es. 340 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Telefono Fisso
              </label>
              <input
                type="tel"
                value={landlinePhone}
                onChange={(e) => setLandlinePhone(e.target.value)}
                placeholder="es. 041 5200000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Altro Recapito
              </label>
              <input
                type="tel"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                placeholder="es. +1 (203) 123456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Luogo / Sede Estera
              </label>
              <input
                type="text"
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder="es. Bridgeport (USA), Irlanda"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Note Aggiuntive
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="es. Sacerdote, Responsabile, ecc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-900/40 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{contactToEdit ? 'Salva Modifiche' : 'Aggiungi Contatto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
