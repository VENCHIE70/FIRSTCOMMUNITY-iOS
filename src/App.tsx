import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  RotateCcw,
  Download,
  Calendar as CalendarIcon,
  BookUser,
  Users,
  Flame,
  Star,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Contact, CalendarEvent, EventCategory } from './types';
import { INITIAL_CONTACTS } from './data/contactsData';
import { CALENDAR_EVENTS, UPCOMING_THEME_NOTE } from './data/calendarData';
import { Header } from './components/Header';
import { ContactCard } from './components/ContactCard';
import { CalendarCard } from './components/CalendarCard';
import { ContactDetailModal } from './components/ContactDetailModal';
import { AddEditContactModal } from './components/AddEditContactModal';
import { InfoModal } from './components/InfoModal';
import { Toast, ToastMessage } from './components/Toast';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { downloadSingleVCard, downloadAllVCards } from './utils/vcard';
import { downloadAllICS } from './utils/calendarExport';

export default function App() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'calendar'>('contacts');

  // Load contacts from localStorage or default
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem('comunita_contacts_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CONTACTS;
  });

  // Save contacts to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('comunita_contacts_v1', JSON.stringify(contacts));
    } catch {
      // ignore
    }
  }, [contacts]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState<'all' | 'mobile' | 'landline' | 'starred' | 'intl'>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'eucarestia' | 'tema' | 'parola' | 'speciale'>('all');

  // Modals & Popups
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ id: String(Date.now()), text, type });
  };

  // Distinct family names for filter dropdown
  const distinctFamilies = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => {
      if (c.familyGroup) set.add(c.familyGroup);
    });
    return Array.from(set).sort();
  }, [contacts]);

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Text search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.familyGroup.toLowerCase().includes(q) ||
        (c.mobilePhone && c.mobilePhone.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))) ||
        (c.landlinePhone && c.landlinePhone.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))) ||
        (c.notes && c.notes.toLowerCase().includes(q)) ||
        (c.locationNote && c.locationNote.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Family filter
      if (selectedFamily !== 'all' && c.familyGroup !== selectedFamily) {
        return false;
      }

      // Quick filter
      if (contactFilter === 'mobile') return Boolean(c.mobilePhone);
      if (contactFilter === 'landline') return Boolean(c.landlinePhone);
      if (contactFilter === 'starred') return Boolean(c.isStarred);
      if (contactFilter === 'intl') return Boolean(c.locationNote);

      return true;
    });
  }, [contacts, searchQuery, contactFilter, selectedFamily]);

  // Filtered Calendar Events
  const filteredEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.dayOfWeek.toLowerCase().includes(q) ||
        e.date.includes(q) ||
        (e.preparationGroup && e.preparationGroup.toLowerCase().includes(q)) ||
        (e.notice && e.notice.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (calendarFilter === 'eucarestia') return e.category === 'eucarestia';
      if (calendarFilter === 'tema') return e.category === 'tema';
      if (calendarFilter === 'parola') return e.category === 'parola';
      if (calendarFilter === 'speciale') return e.category === 'speciale' || e.category === 'convivenza' || e.category === 'penitenziale';

      return true;
    });
  }, [searchQuery, calendarFilter]);

  // Actions
  const handleSaveToPhone = async (contact: Contact) => {
    const res = await downloadSingleVCard(contact);
    if (res.shared) {
      showToast(`Scheda di ${contact.fullName} aperta per aggiungerla ai Contatti!`);
    } else if (res.downloaded) {
      showToast(`File vCard scaricato per ${contact.fullName}. Aprila per salvare nei Contatti!`);
    }
  };

  const handleDownloadAllContacts = async () => {
    const res = await downloadAllVCards(contacts);
    if (res.shared) {
      showToast(`File con tutti gli ${contacts.length} contatti pronto per l'importazione!`);
    } else if (res.downloaded) {
      showToast(`Scaricato file con tutti gli ${contacts.length} contatti della Comunità!`);
    }
  };

  const handleDownloadAllCalendar = async () => {
    const res = await downloadAllICS(CALENDAR_EVENTS);
    if (res.shared) {
      showToast(`Calendario completo (${CALENDAR_EVENTS.length} eventi) pronto per Apple Calendario!`);
    } else if (res.downloaded) {
      showToast(`Scaricato calendario completo (.ics con ${CALENDAR_EVENTS.length} eventi per Apple Calendario)!`);
    }
  };

  const handleToggleStar = (id: number) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  const handleCopyNumber = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    showToast(`Numero ${label} copiato negli appunti: ${num}`);
  };

  const handleSaveContact = (updated: Partial<Contact>) => {
    if (updated.id) {
      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? ({ ...c, ...updated } as Contact) : c))
      );
      showToast('Contatto aggiornato con successo!');
    } else {
      const newId = Math.max(...contacts.map((c) => c.id), 0) + 1;
      const newContact = { ...updated, id: newId } as Contact;
      setContacts((prev) => [newContact, ...prev]);
      showToast('Nuovo contatto aggiunto alla rubrica!');
    }
  };

  const handleDeleteContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    showToast('Contatto rimosso dalla rubrica.', 'warning');
  };

  const handleResetContacts = () => {
    if (window.confirm('Vuoi ripristinare la lista originaria degli 85 contatti del PDF?')) {
      setContacts(INITIAL_CONTACTS);
      localStorage.removeItem('comunita_contacts_v1');
      showToast('Rubrica ripristinata con i dati originali!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        onOpenInfo={() => setIsInfoOpen(true)}
        onDownloadAllContacts={handleDownloadAllContacts}
        onDownloadAllCalendar={handleDownloadAllCalendar}
        contactsCount={contacts.length}
        eventsCount={CALENDAR_EVENTS.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Search & Global Actions Bar */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'contacts'
                  ? 'Cerca per nome, cognome, famiglia o numero...'
                  : 'Cerca per evento, data o chi prepara (es. "Massimo")...'
              }
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tab Specific Filter Bars */}
          {activeTab === 'contacts' ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-400 text-xs font-semibold shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filtra:
              </span>

              <button
                onClick={() => setContactFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  contactFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Tutti ({contacts.length})
              </button>

              <button
                onClick={() => setContactFilter('mobile')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  contactFilter === 'mobile'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Cellulari ({contacts.filter((c) => c.mobilePhone).length})
              </button>

              <button
                onClick={() => setContactFilter('landline')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  contactFilter === 'landline'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Fissi ({contacts.filter((c) => c.landlinePhone).length})
              </button>

              <button
                onClick={() => setContactFilter('starred')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  contactFilter === 'starred'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Preferiti ({contacts.filter((c) => c.isStarred).length})</span>
              </button>

              <button
                onClick={() => setContactFilter('intl')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  contactFilter === 'intl'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Estero ({contacts.filter((c) => c.locationNote).length})
              </button>

              {/* Family Selector */}
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 shrink-0"
              >
                <option value="all">Tutte le Famiglie ({distinctFamilies.length})</option>
                {distinctFamilies.map((fam) => (
                  <option key={fam} value={fam}>
                    Fam. {fam}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-400 text-xs font-semibold shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filtra:
              </span>

              <button
                onClick={() => setCalendarFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  calendarFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Tutti gli Eventi ({CALENDAR_EVENTS.length})
              </button>

              <button
                onClick={() => setCalendarFilter('eucarestia')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  calendarFilter === 'eucarestia'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Eucarestie ({CALENDAR_EVENTS.filter((e) => e.category === 'eucarestia').length})
              </button>

              <button
                onClick={() => setCalendarFilter('tema')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  calendarFilter === 'tema'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Temi Apocalisse ({CALENDAR_EVENTS.filter((e) => e.category === 'tema').length})
              </button>

              <button
                onClick={() => setCalendarFilter('parola')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  calendarFilter === 'parola'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Liturgie Parola ({CALENDAR_EVENTS.filter((e) => e.category === 'parola').length})
              </button>

              <button
                onClick={() => setCalendarFilter('speciale')}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                  calendarFilter === 'speciale'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Feste &amp; Convivenza
              </button>
            </div>
          )}
        </div>

        {/* =========================================================================
            TAB 1: RUBRICA CONTATTI
           ========================================================================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {/* Top Toolbar for Contacts */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800/80">
              <div className="text-xs text-slate-400">
                Visualizzati{' '}
                <strong className="text-white font-semibold">{filteredContacts.length}</strong> su{' '}
                {contacts.length} fratelli e sorelle
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setContactToEdit(null);
                    setIsAddEditOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Nuovo</span>
                </button>

                <button
                  onClick={handleDownloadAllContacts}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-medium transition active:scale-95"
                  title="Scarica tutti gli 85 contatti in un file vCard unico per iPhone (Apple Contatti)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Scarica Tutti (.vcf)</span>
                </button>

                {contacts.length !== INITIAL_CONTACTS.length && (
                  <button
                    onClick={handleResetContacts}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Ripristina lista originale degli 85 contatti"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Contacts Grid */}
            {filteredContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onSaveToPhone={handleSaveToPhone}
                    onToggleStar={handleToggleStar}
                    onCopyNumber={handleCopyNumber}
                    onSelect={(c) => setSelectedContact(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl bg-slate-900 border border-slate-800">
                <BookUser className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Nessun contatto trovato</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Nessun elemento corrisponde ai filtri selezionati o alla ricerca "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setContactFilter('all');
                    setSelectedFamily('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                >
                  Azzera Filtri
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: CALENDARIO PREPARAZIONI
           ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* Header banner with period & quick Apple Calendario action */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  CALENDARIO PREPARAZIONI 1^ COMUNITÀ
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Periodo Novembre / Dicembre 2026 - 5 Gennaio 2027
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tutti gli incontri, liturgie, eucarestie e gruppi incaricati per la preparazione.
                </p>
              </div>

              <button
                onClick={handleDownloadAllCalendar}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-950/50 transition active:scale-95 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Esporta Tutto (.ics)</span>
              </button>
            </div>

            {/* Upcoming Theme Preparation Team Announcement */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/15 to-transparent border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Prossimo Gruppo di Preparazione del {UPCOMING_THEME_NOTE.themeNumber} {UPCOMING_THEME_NOTE.title}</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {UPCOMING_THEME_NOTE.team}
              </p>
            </div>

            {/* Events List */}
            {filteredEvents.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filteredEvents.map((event) => (
                  <CalendarCard
                    key={event.id}
                    event={event}
                    onCopyDetails={(txt) => showToast('Dettagli evento copiati per WhatsApp!')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl bg-slate-900 border border-slate-800">
                <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Nessun evento trovato</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Nessun evento corrisponde alla ricerca "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCalendarFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500 transition"
                >
                  Azzera Ricerca
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ContactDetailModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onEdit={(c) => {
          setContactToEdit(c);
          setIsAddEditOpen(true);
        }}
        onDelete={handleDeleteContact}
        onCopyNumber={handleCopyNumber}
        onNotify={(msg) => showToast(msg)}
      />

      <AddEditContactModal
        isOpen={isAddEditOpen}
        contactToEdit={contactToEdit}
        onClose={() => {
          setIsAddEditOpen(false);
          setContactToEdit(null);
        }}
        onSave={handleSaveContact}
      />

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
