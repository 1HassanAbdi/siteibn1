import React, { useState, useMemo } from 'react';
import { Calculator, Send, Lock, Trophy, Loader2, Ruler, Volume2, User, GraduationCap } from 'lucide-react';

// Imports des fichiers JSON
import Eval_Maths_2a from './Eval_Maths_2a.json';
import Eval_Maths_3a from './Eval_Maths_3a.json';

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbwgCLzl-x7L28GEz9H15sJp0SZsuIMMa0drhuPrZG8n4_f2botIsKzxF9XILcaFVM7VFQ/exec";

export default function PortailMaths() {
  const [view, setView] = useState('home');
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentInfo, setStudentInfo] = useState({ nom: '', classe: '', code: '' });
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestions = useMemo(() => selectedSession?.parties[0].sections.flatMap(s => s.questions) || [], [selectedSession]);
  const q = currentQuestions[currentQuestionIdx];

  // --- FONCTION AUDIO ---
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const submitToGoogle = async () => {
    window.speechSynthesis.cancel();
    setIsSubmitting(true);
    const correctMap = {};
    currentQuestions.forEach(item => { if(item.options) correctMap[item.numero] = item.reponse_correcte; });

    const payload = {
      nom: studentInfo.nom,
      classe: studentInfo.classe,
      titre: selectedSession.test_info.session,
      subject: "maths",
      sheetTarget: selectedSession.test_info.target,
      answers: answers,
      correctAnswers: correctMap
    };

    await fetch(GOOGLE_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
    setView('finished');
    setIsSubmitting(false);
  };

  // --- VUES ---

  if (view === 'home') return (
    <div className="h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-10 border-[10px] border-black">
      <Calculator size={60} className="text-blue-500 mb-4" />
      <h1 className="text-4xl font-black italic mb-10 text-center uppercase tracking-tighter">Mathématiques OQRE</h1>
      <div className="grid gap-4 w-full max-w-sm">
        <button onClick={() => { setSelectedSession(Eval_Maths_2a); setView('login'); }} className="group bg-slate-900 border-4 border-black p-6 rounded-3xl hover:border-blue-500 transition-all text-left">
          <span className="text-blue-500 font-black text-xs block mb-1 uppercase italic">Primaire</span>
          <span className="text-white font-bold text-xl uppercase">2e Année (2A)</span>
        </button>
        <button onClick={() => { setSelectedSession(Eval_Maths_3a); setView('login'); }} className="group bg-slate-900 border-4 border-black p-6 rounded-3xl hover:border-blue-500 transition-all text-left">
          <span className="text-blue-500 font-black text-xs block mb-1 uppercase italic">Primaire</span>
          <span className="text-white font-bold text-xl uppercase">3e Année (3A)</span>
        </button>
      </div>
    </div>
  );

  if (view === 'login') return (
    <div className="h-screen bg-black flex items-center justify-center p-6">
      <form onSubmit={(e) => { e.preventDefault(); setView('quiz'); }} className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-blue-600 w-full max-w-sm shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl rotate-3 shadow-lg">
            <Lock size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-white font-black mb-8 text-center italic uppercase tracking-widest text-xl">Identification</h2>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-500" size={20} />
            <input required placeholder="NOM ET PRÉNOM" className="w-full p-4 pl-12 bg-black border-2 border-slate-800 rounded-xl text-white font-bold uppercase outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, nom: e.target.value.toUpperCase()})} />
          </div>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-4 text-slate-500" size={20} />
            <select required className="w-full p-4 pl-12 bg-black border-2 border-slate-800 rounded-xl text-white font-bold appearance-none outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, classe: e.target.value})}>
              <option value="">CHOISIR TA CLASSE</option>
              <option value="2A">2e ANNÉE A</option>
              <option value="3A">3e ANNÉE A</option>
            </select>
          </div>
          <input required type="password" placeholder="CODE SECRET" className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold text-center tracking-widest outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, code: e.target.value})} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-lg transition-all active:scale-95 uppercase italic">Lancer le Test</button>
        </div>
      </form>
    </div>
  );

  if (view === 'finished') return (
    <div className="h-screen bg-blue-600 flex items-center justify-center p-6 border-[12px] border-black">
      <div className="bg-white p-12 rounded-[3.5rem] border-8 border-black text-center shadow-[20px_20px_0_rgba(0,0,0,1)]">
        <Trophy size={80} className="text-orange-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black uppercase italic text-black">C'est terminé !</h2>
        <p className="font-bold text-slate-600 mt-4 italic text-lg">Bravo {studentInfo.nom}, tes réponses ont été envoyées.</p>
        <button onClick={() => window.location.reload()} className="mt-10 bg-black text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform uppercase italic">Quitter</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-950 flex flex-col border-[8px] md:border-[12px] border-black">
      {/* HEADER AVEC NOM ET CLASSE */}
      <header className="h-16 bg-black flex items-center justify-between px-6 border-b-2 border-blue-900 text-white">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-blue-500 font-black text-[9px] uppercase tracking-tighter leading-none">Élève</span>
            <span className="font-bold text-sm uppercase truncate max-w-[150px]">{studentInfo.nom}</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-blue-500 font-black text-[9px] uppercase tracking-tighter leading-none">Classe</span>
            <span className="font-bold text-sm uppercase">{studentInfo.classe}</span>
          </div>
        </div>
        <div className="hidden md:block bg-blue-600 px-4 py-1 rounded-full text-white font-black text-[10px] italic uppercase tracking-widest">
           {selectedSession.test_info.session}
        </div>
      </header>

      <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-4">
        {isSubmitting && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white font-black italic">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            ENVOI DES RÉSULTATS...
          </div>
        )}
        
        <div className="w-full max-w-xl bg-slate-800 p-8 pt-12 rounded-[2.5rem] border-4 border-black shadow-2xl relative">
           
           {/* NUMÉRO DE LA QUESTION */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 border-4 border-black text-white px-8 py-2 rounded-2xl font-black text-sm shadow-xl z-10 uppercase italic">
              Question {currentQuestionIdx + 1} sur {currentQuestions.length}
           </div>

           {/* BOUTON AUDIO ORANGE */}
           <div className="flex justify-center mb-6">
              <button 
                onClick={() => speak(q.enonce)}
                className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all active:scale-90 border-4 border-slate-800"
                title="Écouter la question"
              >
                <Volume2 size={28} />
              </button>
           </div>

           <h3 className="text-white font-bold text-xl mb-8 leading-tight text-center px-2">{q.enonce}</h3>
           
           <div className="grid gap-3">
             {q.options.map((opt, i) => (
               <button 
                 key={i} 
                 onClick={() => setAnswers({...answers, [q.numero]: opt})} 
                 className={`w-full p-4 rounded-xl text-left font-black border-4 transition-all ${answers[q.numero] === opt ? "bg-blue-600 border-white text-white translate-x-1" : "bg-slate-700 border-black text-slate-400 hover:bg-slate-600"}`}
               >
                 <span className="mr-3 opacity-30 italic text-sm">{i + 1}.</span> {opt}
               </button>
             ))}
           </div>
        </div>

        <footer className="w-full max-w-xl mt-8 flex gap-4">
          <button 
            onClick={() => { window.speechSynthesis.cancel(); setCurrentQuestionIdx(i => Math.max(0, i-1)); }} 
            disabled={currentQuestionIdx === 0}
            className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase italic disabled:opacity-0 transition-all border-b-4 border-black"
          >
            Précédent
          </button>
          
          {currentQuestionIdx === currentQuestions.length - 1 ? 
            <button onClick={submitToGoogle} className="flex-[2] py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase italic border-b-4 border-green-900 shadow-lg">Envoyer Maths</button> :
            <button 
              onClick={() => { window.speechSynthesis.cancel(); setCurrentQuestionIdx(i => i + 1); }} 
              className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase italic border-b-4 border-blue-900 shadow-lg"
            >
              Suivant
            </button>
          }
        </footer>
      </div>
    </div>
  );
}