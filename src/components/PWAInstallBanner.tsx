import React, { useState } from 'react';
import { X, Share, PlusSquare, Apple } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isSafari } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed on iPhone Home screen or dismissed, don't show
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-700/40 px-4 py-2.5 text-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
              <Apple className="w-4 h-4 text-blue-300 fill-current" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Installa l'App sul tuo iPhone
              </p>
              <p className="text-[11px] text-slate-300 truncate">
                Aggiungila alla schermata Home per aprirla a schermo intero anche offline!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-950/50 transition active:scale-95"
            >
              <Share className="w-3.5 h-3.5" />
              <span>Installa su iPhone</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
              aria-label="Ignora"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Istruzioni per iPhone */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Apple className="w-4 h-4 text-blue-400 fill-current" />
                </div>
                <h3 className="text-base font-bold text-white">Installa su iPhone (iOS)</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-200">
              <p className="text-slate-300 leading-relaxed">
                Per installare l'app sulla schermata iniziale del tuo iPhone e utilizzarla a schermo intero senza barre del browser:
              </p>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="w-7 h-7 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white">Tocca il tasto Condividi</p>
                  <p className="text-slate-300 mt-0.5">
                    Nella barra in basso di Safari sul tuo iPhone, tocca l'icona{' '}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 font-medium">
                      <Share className="w-3 h-3 inline mr-1" /> Condividi
                    </span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="w-7 h-7 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white">Aggiungi a schermata Home</p>
                  <p className="text-slate-300 mt-0.5">
                    Scorri verso il basso l'elenco delle opzioni e tocca{' '}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-700 text-amber-300 font-medium">
                      <PlusSquare className="w-3 h-3 inline mr-1" /> Aggiungi a schermata Home
                    </span>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="w-7 h-7 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">Conferma "Aggiungi"</p>
                  <p className="text-slate-300 mt-0.5">
                    Tocca <strong>"Aggiungi"</strong> in alto a destra. L'icona dell'app apparirà subito tra le applicazioni del tuo iPhone!
                  </p>
                </div>
              </div>

              {!isSafari && (
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-300">
                  💡 <em>Suggerimento:</em> Assicurati di aprire la pagina con l'app <strong>Safari</strong> dell'iPhone per visualizzare l'opzione "Aggiungi a schermata Home".
                </div>
              )}
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-2xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition active:scale-95 shadow-md shadow-blue-950/50"
            >
              Ho Capito
            </button>
          </div>
        </div>
      )}
    </>
  );
};
