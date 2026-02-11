import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Send, ChevronRight, ChevronLeft, Trophy, Loader2, 
  CheckCircle2, BookOpen, Volume2, Square, GraduationCap, 
  ChevronDown, AlertCircle, Calculator, Calendar, ShieldCheck, Mail, VolumeX 
} from 'lucide-react';

// --- CONFIGURATION DYNAMIQUE ---
import configExercices from './data/config_exercices.json'; 
const allModules = import.meta.glob('./data/**/*.json');
const TEACHER_CODE = "2025"; 
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTBjRTgiO0JVqwjCfsnggzP5o1wN_lNMewT-H2ILejDNhKqUcDjz7cX2wfPIk0dX8/exec"; 

export default function PortailOQRE({ exerciseSlug, level, onBack }) {
  // États de base
  const [view, setView] = useState('login');
  const [selectedSession, setSelectedSession] = useState(null);
  const [activePartIdx, setActivePartIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentInfo, setStudentInfo] = useState({ 
    nom: '', 
    classe: level === 6 ? '6A' : '3A', // Si level est 6 -> 6A, sinon 3A
    email: '', 
    code: '' 
  });
  
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastPartScore, setLastPartScore] = useState({ score: 0, total: 0 });
  const [currentlyReadingId, setCurrentlyReadingId] = useState(null);

  // --- 1. SÉCURITÉ CLASSE : Force la classe selon le niveau du Hub ---
  // Sécurité : Si le niveau change dynamiquement (optionnel)
  useEffect(() => {
    if (level) {
      setStudentInfo(prev => ({ 
        ...prev, 
        classe: level === 6 ? '6A' : '3A' 
      }));
    }
  }, [level]);

  

  // --- 2. CHARGEMENT DYNAMIQUE DU JSON ---
  useEffect(() => {
    const loadData = async () => {
      const info = configExercices.find(ex => ex.slug === exerciseSlug);
      if (info) {
        try {
          const importFunc = allModules[info.chemin];
          const module = await importFunc();
          setSelectedSession(module.default);
        } catch (e) {
          alert("Erreur de chargement du fichier JSON.");
        }
      }
    };
    loadData();
  }, [exerciseSlug]);

  // --- 3. MÉLANGE DES OPTIONS (SHUFFLE ARRAY) ---
  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // --- 4. LOGIQUE AUDIO (TOGGLE & ARRÊT) ---
  const toggleSpeak = (text, id) => {
    if (currentlyReadingId === id) {
      window.speechSynthesis.cancel();
      setCurrentlyReadingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Chercher une voix française de qualité
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('fr-CA') || v.lang.includes('fr-FR'));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.lang = 'fr-FR'; 
      utterance.rate = 0.95;
      utterance.onend = () => setCurrentlyReadingId(null);
      window.speechSynthesis.speak(utterance);
      setCurrentlyReadingId(id);
    }
  };

  const stopAllAudio = () => {
    window.speechSynthesis.cancel();
    setCurrentlyReadingId(null);
  };

  // Arrêt automatique si on change de page ou ferme le composant
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, [currentQuestionIdx, view]);

  // --- 5. CALCUL DES QUESTIONS AVEC MÉLANGE ---
  const currentPart = selectedSession?.parties[activePartIdx];
  
  const currentQuestions = useMemo(() => {
    const questions = currentPart?.sections.flatMap(s => s.questions) || [];
    // On mélange les options pour chaque question unique
    return questions.map(q => ({
      ...q,
      options: q.options ? shuffleArray(q.options) : null
    }));
  }, [currentPart, selectedSession]);

  const currentQuestion = currentQuestions[currentQuestionIdx];

  const isPartComplete = useMemo(() => {
    if (currentQuestions.length === 0) return false;
    return currentQuestions.every(q => {
      const a = answers[q.numero];
      return q.options ? !!a : (typeof a === 'string' && a.trim().length > 0);
    });
  }, [currentQuestions, answers]);

  const progress = Math.round(((currentQuestionIdx + 1) / (currentQuestions.length || 1)) * 100);

  // --- ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (studentInfo.code === TEACHER_CODE && studentInfo.nom.trim().length >= 3) setView('quiz');
    else alert("Erreur d'identification ou code secret incorrect.");
  };

  const submitPart = async () => {
    stopAllAudio();
    setIsSubmitting(true);
    let score = 0, totalQcm = 0;
    const openAnswers = {};
    const correctAnswersMap = {};

    currentQuestions.forEach(q => {
      if (q.options) {
        totalQcm++;
        correctAnswersMap[q.numero] = q.reponse_correcte;
        if (answers[q.numero] === q.reponse_correcte) score++;
      } else {
        openAnswers[q.numero] = answers[q.numero] || "";
      }
    });

    const payload = { 
      nom: studentInfo.nom, 
      classe: studentInfo.classe, 
      email: studentInfo.email, 
      titre: `${selectedSession.test_info.session} - ${currentPart.id}`,
      sheetTarget: studentInfo.classe === '3A' ? "OQRE_3A" : "OQRE_6A",
      answers: answers,
      correctAnswers: correctAnswersMap,
      openAnswers: openAnswers
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      setLastPartScore({ score, total: totalQcm });
      setView('summary');
    } catch (e) { alert("Erreur lors de l'envoi."); }
    setIsSubmitting(false);
  };

  // --- VUES ---
  if (view === 'login') return <LoginView studentInfo={studentInfo} setStudentInfo={setStudentInfo} handleLogin={handleLogin} onBack={onBack} />;
  if (view === 'summary') return <SummaryView score={lastPartScore} part={currentPart} isLast={activePartIdx === selectedSession.parties.length - 1} onNext={() => { if(activePartIdx < selectedSession.parties.length - 1) { setActivePartIdx(activePartIdx + 1); setCurrentQuestionIdx(0); setView('quiz'); } else setView('finished'); }} onStop={onBack} />;
  if (view === 'finished') return <FinishView nom={studentInfo.nom} onHome={onBack} />;

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden border-[10px] border-black">
      <header className="h-14 bg-black flex items-center justify-between px-8 border-b border-slate-900">
        <div className="flex flex-col">
            <span className="text-white font-black text-[10px] uppercase leading-none">{studentInfo.nom} | {studentInfo.classe}</span>
            <span className="text-slate-500 text-[8px] uppercase tracking-tighter">{selectedSession?.test_info?.session}</span>
        </div>
        <div className="flex items-center gap-4">
            {currentlyReadingId && (
                <button onClick={stopAllAudio} className="flex items-center gap-2 bg-red-600/20 text-red-500 px-3 py-1 rounded text-[10px] font-black border border-red-600/30 animate-pulse">
                    <VolumeX size={12}/> STOP AUDIO
                </button>
            )}
            <div className="bg-indigo-600 px-4 py-1 rounded text-white font-black text-[10px] italic">{currentPart?.id}</div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* TEXTE */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-8 overflow-y-auto border-r border-black custom-scrollbar">
          <h2 className="text-indigo-400 font-black text-2xl uppercase italic border-b border-slate-800 pb-4 mb-6">{currentPart?.sections[0]?.titre}</h2>
          {currentPart?.sections[0]?.texte_integral?.map((t, i) => {
            const pid = `para-${i}`;
            return (
              <div key={i} className="group relative bg-slate-900/50 hover:bg-slate-800/30 p-4 rounded-xl transition-all mb-4">
                <p className="text-slate-300 text-lg leading-relaxed pr-10">
                    <span className="text-indigo-500 font-bold mr-3 text-xs">[{t.p || i+1}]</span>
                    {t.contenu}
                </p>
                <button onClick={() => toggleSpeak(t.contenu, pid)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all ${currentlyReadingId === pid ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white'}`}>
                  {currentlyReadingId === pid ? <Square size={16} fill="currentColor"/> : <Volume2 size={16}/>}
                </button>
              </div>
            );
          })}
        </div>

        {/* QUIZ */}
        <div className="w-full lg:w-1/2 bg-slate-800 flex flex-col relative">
          <div className="flex-1 p-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion?.numero} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-xl bg-slate-900 p-10 rounded-[3rem] border-4 border-black relative shadow-2xl">
                <div className="absolute -top-5 -left-5 bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black border-4 border-black text-xl">{currentQuestion?.numero}</div>
                <div className="flex justify-between items-start gap-4 mb-10">
                    <h3 className="text-white font-bold text-xl leading-tight">{currentQuestion?.enonce}</h3>
                    <button onClick={() => toggleSpeak(currentQuestion?.enonce, `q-${currentQuestion?.numero}`)}
                        className={`p-3 rounded-2xl shrink-0 transition-all ${currentlyReadingId === `q-${currentQuestion?.numero}` ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white'}`}>
                        {currentlyReadingId === `q-${currentQuestion?.numero}` ? <Square size={20} fill="currentColor"/> : <Volume2 size={20}/>}
                    </button>
                </div>
                {currentQuestion?.options ? (
                    <div className="grid gap-3">
                        {currentQuestion.options.map((opt, i) => (
                            <button key={i} onClick={() => setAnswers({...answers, [currentQuestion.numero]: opt})} className={`w-full p-5 rounded-2xl text-left font-bold border-2 transition-all ${answers[currentQuestion.numero] === opt ? "bg-indigo-600 border-white text-white translate-x-2" : "bg-slate-800 border-black text-slate-400 hover:bg-slate-700"}`}>{opt}</button>
                        ))}
                    </div>
                ) : (
                    <textarea value={answers[currentQuestion?.numero] || ""} onChange={e => setAnswers({...answers, [currentQuestion.numero]: e.target.value})} className="w-full h-48 bg-black text-white p-5 rounded-3xl outline-none border-2 border-slate-800 focus:border-indigo-600" placeholder="Tape ta réponse ici..." />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-black flex items-center gap-6">
            <button disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(i => i-1)} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-2xl font-black uppercase text-xs">Retour</button>
            <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                    <circle cx="28" cy="28" r="22" stroke="#4f46e5" strokeWidth="4" fill="transparent" strokeDasharray={138} strokeDashoffset={138 - (progress/100)*138} strokeLinecap="round" className="transition-all duration-500" />
                </svg>
                <span className="absolute text-[10px] font-black text-white">{progress}%</span>
            </div>
            {currentQuestionIdx === currentQuestions.length - 1 ? (
              <button onClick={submitPart} disabled={!isPartComplete || isSubmitting} className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${isPartComplete ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                {isSubmitting ? <Loader2 className="animate-spin"/> : isPartComplete ? <><Send size={16}/> Envoyer</> : <><AlertCircle size={16}/> Incomplet</>}
              </button>
            ) : (
              <button onClick={() => setCurrentQuestionIdx(i => i+1)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Suivant</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VUE LOGIN (DYNAMIQUE) ---
function LoginView({ studentInfo, setStudentInfo, handleLogin, onBack }) {
  return (
    <div className="h-screen bg-black flex items-center justify-center p-4 border-[10px] border-slate-900 font-sans">
      <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleLogin} className="bg-slate-900 p-10 rounded-[3rem] border-4 border-black max-w-sm w-full shadow-2xl">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 border-4 border-black rotate-3 shadow-xl"><Lock size={30}/></div>
        <h1 className="text-xl font-black text-white text-center mb-8 uppercase italic tracking-tight text-indigo-400">Identification élève</h1>
        <div className="space-y-4">
          <input required placeholder="NOM ET PRÉNOM" className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold uppercase outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, nom: e.target.value.toUpperCase()})} />
          <input required type="email" placeholder="EMAIL ÉLÈVE" className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, email: e.target.value})} />
          
          <div className="relative">
            <select required className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold outline-none focus:border-blue-500 appearance-none" value={studentInfo.classe} onChange={e => setStudentInfo({...studentInfo, classe: e.target.value})}>
                <option value="3A">CLASSE 3A</option>
                <option value="6A">CLASSE 6A</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-5 text-slate-500 pointer-events-none" />
          </div>

          <input required type="password" placeholder="CODE SECRET " className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold text-center outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, code: e.target.value})} />
          
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase italic shadow-lg active:scale-95 transition-all">Accéder au test</button>
          <button type="button" onClick={onBack} className="w-full text-slate-600 font-bold text-[10px] uppercase mt-2">Annuler</button>
        </div>
      </motion.form>
    </div>
  );
}

// VUES RÉSUMÉ ET FIN
function SummaryView({ score, part, onNext, onStop, isLast }) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-center border-[10px] border-black">
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border-4 border-black max-w-sm w-full shadow-2xl">
          <ShieldCheck size={70} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-white font-black text-2xl uppercase mb-8 italic tracking-tighter">{part?.id} Validée</h2>
          <div className="bg-black p-8 rounded-[2.5rem] border-2 border-slate-800 mb-10 text-white text-6xl font-black">
            {score.score}<span className="text-xl text-slate-700">/{score.total}</span>
          </div>
          <button onClick={onNext} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase mb-4 active:scale-95 transition-all">{isLast ? "Terminer" : "Suivant"}</button>
          <button onClick={onStop} className="w-full text-slate-500 font-black text-[10px] uppercase">Retour Accueil</button>
        </div>
      </div>
    );
}

function FinishView({ nom, onHome }) {
    return (
      <div className="h-screen bg-blue-600 flex flex-col items-center justify-center p-6 text-center border-[12px] border-black text-white">
        <Trophy size={100} className="mb-8 text-white/20" />
        <div className="bg-white p-12 rounded-[4rem] border-8 border-black max-w-md w-full shadow-[25px_25px_0_rgba(0,0,0,1)] text-black">
          <h2 className="text-4xl font-black uppercase italic mb-6">Félicitations {nom} !</h2>
          <p className="font-bold text-slate-600 mb-10 italic">Tes résultats sont enregistrés et prêts pour ton enseignant.</p>
          <button onClick={onHome} className="bg-black text-white px-12 py-5 rounded-2xl font-black text-xs uppercase italic active:scale-95 transition-all">Retour à l'accueil</button>
        </div>
      </div>
    );
}