import React from 'react';
import {
  X,
  Calendar,
  UserPlus,
  CheckCircle,
  Apple,
  Share,
  PlusSquare,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/90 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Apple className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Guida all'Uso su iPhone (iOS)
              </h2>
              <p className="text-xs text-slate-400">1^ Comunità S.AP. iOS · Apple Contatti &amp; Calendario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm text-slate-300">
          {/* Section 1: Salvare i contatti su iPhone (Apple Contatti) */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <UserPlus className="w-4 h-4 text-blue-400" />
              <h3>1. Come salvare i contatti su Apple Contatti (iPhone)</h3>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Singolo contatto:</strong> tocca il pulsante blu{' '}
                  <span className="text-blue-300 font-semibold">"Salva nei Contatti iPhone"</span> su qualsiasi scheda. Su iOS si apre direttamente il foglio di condivisione di iPhone: tocca l'icona <strong>Contatti</strong> o seleziona <strong>"Crea nuovo contatto"</strong> per confermare il salvataggio in rubrica.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tutti gli 85 contatti insieme:</strong> tocca in alto{' '}
                  <span className="text-blue-300 font-semibold">"Tutti i Contatti (.vcf)"</span>. Verrà generato un unico file vCard 3.0: toccalo nei download di Safari su iPhone per aggiungere l'intera comunità in pochi secondi!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Chiamate, iMessage &amp; WhatsApp:</strong> puoi toccare la cornetta verde per chiamare direttamente con il tuo iPhone, l'icona di iMessage/SMS per inviare un messaggio o l'icona verde di WhatsApp per aprire la chat.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 2: Apple Calendario su iPhone */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3>2. Come salvare gli eventi su Apple Calendario (iPhone)</h3>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Singolo evento:</strong> tocca il pulsante{' '}
                  <span className="text-amber-300 font-semibold">"Aggiungi ad Apple Calendario"</span> su qualsiasi evento. Si aprirà la schermata di iOS con data, ora, luogo e gruppo di preparazione già pronti; tocca <strong>"Aggiungi"</strong> in alto a destra.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tutto il calendario completo (.ics):</strong> tocca in alto{' '}
                  <span className="text-amber-300 font-semibold">"Apple Calendario (.ics)"</span> per scaricare e importare tutti i 19 eventi di Novembre, Dicembre 2026 e Gennaio 2027 nel Calendario del tuo iPhone.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Installare l'app su Schermata Home di iPhone */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Apple className="w-4 h-4 text-blue-400 fill-current" />
              <h3>3. Aggiungere l'app alla schermata Home del tuo iPhone</h3>
            </div>
            <p className="text-xs leading-relaxed">
              Per avere l'icona dell'app sulla Home dell'iPhone e aprirla a schermo intero come una vera app nativa:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
              <li>Apri il link con il browser <strong>Safari</strong> sul tuo iPhone.</li>
              <li>
                Tocca l'icona <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-400" /> <strong>Condividi</strong> (quadrato con la freccia verso l'alto) nella barra inferiore.
              </li>
              <li>
                Scorri verso il basso nel menu e tocca <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-amber-400" /> <strong>"Aggiungi a schermata Home"</strong>.
              </li>
              <li>Tocca <strong>"Aggiungi"</strong> in alto a destra. Troverai l'app sulla schermata principale!</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition active:scale-95 shadow-md shadow-blue-950/50"
          >
            Ho Capito, Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
