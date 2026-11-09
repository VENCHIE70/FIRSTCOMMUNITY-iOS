import React, { useState } from 'react';
import { BookUser, Calendar, Download, HelpCircle, Apple, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  activeTab: 'contacts' | 'calendar';
  onTabChange: (tab: 'contacts' | 'calendar') => void;
  onOpenInfo: () => void;
  onDownloadAllContacts: () => void;
  onDownloadAllCalendar: () => void;
  contactsCount: number;
  eventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenInfo,
  onDownloadAllContacts,
  onDownloadAllCalendar,
  contactsCount,
  eventsCount,
}) => {
  const { isInstalled } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top bar with Branding & Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-blue-950/50 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="text-amber-400 font-bold text-base tracking-tighter">1^</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">1^ Comunità S.AP.</h1>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
                  <Apple className="w-2.5 h-2.5 fill-current" /> iPhone
                </span>
              </div>
              <p className="text-xs text-slate-400">Rubrica Apple Contatti &amp; Apple Calendario</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Install on iPhone Button (shows if not in standalone mode) */}
            {!isInstalled && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-950/50 transition active:scale-95"
                title="Aggiungi alla schermata Home del tuo iPhone"
              >
                <Apple className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Installa su iPhone</span>
                <span className="sm:hidden">iPhone</span>
              </button>
            )}

            {/* Quick Bulk Download for iPhone based on current tab */}
            {activeTab === 'contacts' ? (
              <button
                onClick={onDownloadAllContacts}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
                title="Scarica tutti gli 85 contatti per iPhone (.vcf)"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Tutti i Contatti (.vcf)</span>
                <span className="md:hidden">Contatti .vcf</span>
              </button>
            ) : (
              <button
                onClick={onDownloadAllCalendar}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
                title="Esporta calendario per Apple Calendario (.ics)"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Apple Calendario (.ics)</span>
                <span className="md:hidden">Calendario .ics</span>
              </button>
            )}

            {/* Help / iPhone Guide */}
            <button
              onClick={onOpenInfo}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Guida all'uso per iPhone (Apple Contatti & Calendario)"
              aria-label="Istruzioni iPhone"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher - iOS-style segmented control */}
        <div className="mt-3 grid grid-cols-2 p-1 bg-slate-950 border border-slate-800/90 rounded-2xl shadow-inner">
          <button
            onClick={() => onTabChange('contacts')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'contacts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookUser className="w-4 h-4 shrink-0" />
            <span>Rubrica Contatti</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded ${
                activeTab === 'contacts' ? 'bg-blue-800/70 text-blue-100' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {contactsCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('calendar')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Calendario</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded ${
                activeTab === 'calendar' ? 'bg-amber-800/70 text-amber-100' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {eventsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Modal Istruzioni Installazione Schermata Home iPhone */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Apple className="w-5 h-5 text-blue-400 fill-current" />
              <h3 className="text-base font-bold text-white">Installa su iPhone</h3>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-slate-200 leading-relaxed">
              <p className="text-slate-300">
                Aggiungi questa applicazione alla schermata iniziale del tuo iPhone per usarla a schermo intero come una vera app nativa:
              </p>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <span>In Safari, tocca il tasto <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-400" /> <strong>Condividi</strong> in basso.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <span>Scorri e tocca <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-amber-400" /> <strong>"Aggiungi a schermata Home"</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <span>Premi <strong>"Aggiungi"</strong> in alto a destra.</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-2xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md shadow-blue-950/50"
            >
              Ho Capito
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
