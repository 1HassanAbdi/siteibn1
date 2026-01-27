import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Send, ChevronRight, ChevronLeft, Layout, 
  Trophy, Loader2, CheckCircle2, ArrowRight, 
  RefreshCcw, LogOut, ShieldCheck, Mail, BookOpen, 
  Edit3, Info, CheckSquare, GraduationCap, ChevronDown, AlertCircle
} from 'lucide-react';

// --- CONFIGURATION ---
import data2011 from './data/oqre_2011.json';
import data2012 from './data/oqre_2012.json';

const TEACHER_CODE = "FRANCE2011"; 
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxb7PcOf63u6jPthy0yF6C42femUYNIzyfjvGJgMrpuNCg5S9uQAtDzsdRZlmKq-D83/exec"; 

export default function PortailOQRE() {
  const [view, setView] = useState('home'); 
  const [selectedSession, setSelectedSession] = useState(null);
  const [activePartIdx, setActivePartIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0); 
  const [studentInfo, setStudentInfo] = useState({ nom: '', classe: '', email: '', code: '' });
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastPartScore, setLastPartScore] = useState({ score: 0, total: 0 });

  const currentPart = selectedSession?.parties[activePartIdx];
  const currentQuestions = useMemo(() => currentPart?.sections.flatMap(s => s.questions) || [], [activePartIdx, selectedSession]);
  const currentQuestion = currentQuestions[currentQuestionIdx];
  const activeSection = useMemo(() => {
    if (!currentPart || !currentQuestion) return null;
    return currentPart.sections.find(s => s.questions.some(q => q.numero === currentQuestion.numero));
  }, [activePartIdx, currentQuestion, selectedSession]);

  // --- NOUVELLE CONDITION : TOUTES LES QUESTIONS RÉPONDUES ---
  const isPartComplete = useMemo(() => {
    if (currentQuestions.length === 0) return false;
    return currentQuestions.every(q => {
      const answer = answers[q.numero];
      if (q.options) {
        // Pour les QCM : l'entrée doit exister
        return !!answer;
      } else {
        // Pour les textes : doit être une chaîne non vide (sans compter les espaces)
        return typeof answer === 'string' && answer.trim().length > 0;
      }
    });
  }, [currentQuestions, answers]);

  const partProgress = Math.round(((currentQuestionIdx + 1) / (currentQuestions.length || 1)) * 100);

  // --- ACTIONS ---

  const handleSelectTest = (data) => {
    setSelectedSession(data);
    setView(studentInfo.nom ? 'quiz' : 'login');
    setActivePartIdx(0);
    setCurrentQuestionIdx(0);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (studentInfo.code === TEACHER_CODE && studentInfo.nom.trim().length >= 3) setView('quiz');
    else alert("Erreur : Nom trop court ou Code Secret incorrect.");
  };

  const submitPart = async () => {
    if (!isPartComplete) {
      alert("Attention : Tu dois répondre à toutes les questions avant d'envoyer !");
      return;
    }
    setIsSubmitting(true);
    let score = 0;
    let totalQcm = 0;
    const openAnswers = {};

    currentQuestions.forEach(q => {
      if (q.options) {
        totalQcm++;
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
      sheetTarget: "OQRE3A",
      totalScore: score,
      maxQcm: totalQcm,
      openAnswers: openAnswers
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      setTimeout(() => {
        setLastPartScore({ score, total: totalQcm });
        setView('part-summary');
        setIsSubmitting(false);
      }, 1500);
    } catch (e) {
      alert("Erreur réseau");
      setIsSubmitting(false);
    }
  };

  // --- RENDU (Moteur de Quiz Modifié) ---

  if (view === 'home') return <HomeView onSelect={handleSelectTest} studentInfo={studentInfo} setView={setView} />;
  if (view === 'login') return <LoginView studentInfo={studentInfo} setStudentInfo={setStudentInfo} handleLogin={handleLogin} onBack={() => setView('home')} />;
  if (view === 'part-summary') return <PartTransitionView partId={currentPart.id} score={lastPartScore.score} total={lastPartScore.total} isLast={activePartIdx === selectedSession.parties.length - 1} onNext={() => { if(activePartIdx < selectedSession.parties.length - 1) { setActivePartIdx(activePartIdx + 1); setCurrentQuestionIdx(0); setView('quiz'); } else setView('finished'); }} onRefaire={() => { setView('quiz'); setCurrentQuestionIdx(0); }} onStop={() => setView('home')} />;
  if (view === 'finished') return <FinishView nom={studentInfo.nom} onHome={() => setView('home')} />;

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden border-[6px] md:border-[10px] border-black">
      <header className="h-12 bg-black flex items-center justify-between px-6 border-b border-slate-900">
        <div className="flex flex-col">
          <span className="text-white font-black text-[10px] uppercase leading-none">{studentInfo.nom}</span>
          <span className="text-slate-500 text-[8px] uppercase">{studentInfo.email}</span>
        </div>
        <div className="bg-blue-600 px-3 py-1 rounded text-white font-black text-[10px] italic">{currentPart.id}</div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* TEXTE INTEGRAL */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-6 overflow-y-auto custom-scrollbar border-r border-black">
          {activeSection?.texte_integral ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-blue-400 font-black text-xl mb-6 uppercase italic border-b border-slate-800 pb-2">{activeSection.titre}</h2>
              {activeSection.texte_integral.map((t, i) => (
                <p key={i} className="text-slate-300 mb-4 text-sm md:text-lg leading-relaxed">
                  <span className="text-blue-600 font-black mr-2 bg-black px-1 rounded">{t.p || t.section || "•"}</span>{t.contenu}
                </p>
              ))}
            </motion.div>
          ) : <div className="text-slate-800 font-black text-center mt-20 text-4xl opacity-10 uppercase -rotate-12 italic">Travaillez sur la question</div>}
        </div>

        {/* QUIZ PANEL */}
        <div className="w-full lg:w-1/2 bg-slate-800 flex flex-col relative">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-center p-6">
              <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
              <p className="text-white font-black uppercase italic animate-pulse">Transmission des résultats à l'enseignant...</p>
            </div>
          )}

          <div className="flex-1 p-4 md:p-8 overflow-y-auto flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion.numero} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl">
                <div className="bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border-4 border-black shadow-2xl relative">
                  <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black border-4 border-black">{currentQuestion.numero}</div>
                  <h3 className="text-white font-bold text-lg mb-8 leading-tight">{currentQuestion.enonce}</h3>

                  {currentQuestion.options ? (
                    <div className="grid gap-3">
                      {currentQuestion.options.map((opt, i) => (
                        <button key={i} onClick={() => setAnswers({...answers, [currentQuestion.numero]: opt})}
                          className={`w-full p-4 rounded-xl text-left font-bold border-2 transition-all ${answers[currentQuestion.numero] === opt ? "bg-blue-600 border-white text-white translate-x-1" : "bg-slate-800 border-black text-slate-400 hover:bg-slate-700"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea value={answers[currentQuestion.numero] || ""} onChange={(e) => setAnswers({...answers, [currentQuestion.numero]: e.target.value})}
                      placeholder="Écris ta réponse ici..." className="w-full h-44 bg-black text-white p-5 rounded-2xl border-2 border-slate-800 outline-none focus:border-blue-500 font-medium" />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BARRE DE NAVIGATION MODIFIÉE */}
          <div className="p-4 bg-black flex items-center gap-4">
            <button onClick={() => setCurrentQuestionIdx(i => Math.max(0, i-1))} disabled={currentQuestionIdx === 0} 
              className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-xl font-black text-xs disabled:opacity-0">RETOUR</button>
            
            {/* CERCLE DE PROGRESSION */}
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                    <circle cx="24" cy="24" r="18" stroke="#3b82f6" strokeWidth="4" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (partProgress/100)*113} strokeLinecap="round" className="transition-all duration-500" />
                </svg>
                <span className="absolute text-[9px] font-black text-white">{partProgress}%</span>
            </div>

            {currentQuestionIdx === currentQuestions.length - 1 ? (
              <button 
                onClick={submitPart} 
                disabled={!isPartComplete || isSubmitting}
                className={`flex-[2] py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    isPartComplete 
                    ? "bg-green-600 text-white shadow-lg shadow-green-900/40" 
                    : "bg-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                {!isPartComplete ? (
                    <><AlertCircle size={16}/> INCOMPLET</>
                ) : (
                    <><Send size={16}/> ENVOYER LA {currentPart.id}</>
                )}
              </button>
            ) : (
              <button onClick={() => setCurrentQuestionIdx(i => i + 1)} className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-black text-xs">
                SUIVANT <ChevronRight size={16} className="inline ml-1"/>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VUES ACCESSOIRES (Home, Login, etc. restent identiques à la version précédente) ---
function HomeView({ onSelect, studentInfo, setView }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans border-[10px] border-black overflow-x-hidden">
          <nav className="h-20 bg-black border-b-4 border-slate-900 flex items-center justify-between px-8 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg rotate-3 shadow-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <span className="text-xl font-black italic tracking-tighter">OQRE PORTAL</span>
            </div>
            <button onClick={() => setView('login')} className="bg-white text-black px-6 py-2 rounded-full font-black text-xs hover:scale-105 transition-transform">
              {studentInfo.nom ? studentInfo.nom : "S'IDENTIFIER"}
            </button>
          </nav>
    
          <section className="py-20 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-black mb-6 italic leading-none">VÉRIFIE TES COMPÉTENCES.</h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                Accède aux exercices officiels des sessions OQRE passées pour te préparer au mieux.
              </p>
            </div>
    
            <div className="grid md:grid-cols-2 gap-10">
                <div onClick={() => onSelect(data2011)} className="cursor-pointer group bg-slate-900 p-10 rounded-[3rem] border-4 border-black hover:border-blue-600 transition-all shadow-xl">
                    <h3 className="text-3xl font-black italic mb-2 uppercase text-blue-500">Session 2011</h3>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Lecture & Écriture • Primaire</p>
                    <div className="mt-8 bg-black w-fit px-4 py-2 rounded-full text-[10px] font-black group-hover:bg-blue-600 transition-colors">COMMENCER</div>
                </div>
                <div onClick={() => onSelect(data2012)} className="cursor-pointer group bg-slate-900 p-10 rounded-[3rem] border-4 border-black hover:border-blue-600 transition-all shadow-xl">
                    <h3 className="text-3xl font-black italic mb-2 uppercase text-orange-500">Session 2012</h3>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Lecture & Écriture • Moyen</p>
                    <div className="mt-8 bg-black w-fit px-4 py-2 rounded-full text-[10px] font-black group-hover:bg-orange-500 transition-colors">COMMENCER</div>
                </div>
            </div>
          </section>
        </div>
      );
}

// Les composants LoginView, PartTransitionView, FinishView sont les mêmes que précédemment...

function LoginView({ studentInfo, setStudentInfo, handleLogin, onBack }) {
  const [nameError, setNameError] = useState(false);

  const preSubmit = (e) => {
    e.preventDefault();
    if (studentInfo.nom.trim().length < 3) setNameError(true);
    else handleLogin(e);
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-4 border-[10px] border-slate-900">
      <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onSubmit={preSubmit} className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-black max-w-sm w-full shadow-2xl">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 border-4 border-black rotate-3 shadow-xl"><Lock size={30}/></div>
        <h1 className="text-xl font-black text-white text-center mb-8 uppercase italic">OQRE — Identification</h1>
        <div className="space-y-4">
          <div className="relative">
            <input required placeholder="NOM ET PRÉNOM" className={`w-full p-4 bg-black border-2 rounded-xl text-white font-bold uppercase outline-none focus:border-blue-500 ${nameError ? "border-red-500" : "border-slate-800"}`} onChange={e => {setStudentInfo({...studentInfo, nom: e.target.value.toUpperCase()}); setNameError(false);}} />
            {nameError && <p className="text-red-500 text-[9px] font-black mt-1 ml-1">⚠️ ÉCRIT BIEN TON NOM (MIN. 3 LETTRES)</p>}
          </div>
          
          <div className="relative">
            <select required className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold outline-none focus:border-blue-500 appearance-none" value={studentInfo.classe} onChange={e => setStudentInfo({...studentInfo, classe: e.target.value})}>
              <option value="" disabled>CHOISIR TA CLASSE</option>
              <option value="3A">CLASSE 3A</option>
              <option value="6A">CLASSE 6A</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-5 text-slate-500" />
          </div>

          <input required type="email" placeholder="TON EMAIL ÉLÈVE" className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, email: e.target.value})} />
          <input required type="password" placeholder="CODE SECRET" className="w-full p-4 bg-black border-2 border-slate-800 rounded-xl text-white font-bold text-center tracking-widest outline-none focus:border-blue-500" onChange={e => setStudentInfo({...studentInfo, code: e.target.value})} />
          
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase italic shadow-lg border-b-4 border-blue-900 active:border-b-0 transition-all">ENTRER DANS L'ESPACE</button>
          <button type="button" onClick={onBack} className="w-full text-slate-500 font-black text-[10px] uppercase mt-2">Retour à l'accueil</button>
        </div>
      </motion.form>
    </div>
  );
}

function PartTransitionView({ partId, score, total, onNext, onRefaire, onStop, isLast }) {
  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-center border-[10px] border-black">
      <div className="bg-slate-900 p-10 rounded-[3rem] border-4 border-black max-w-sm w-full shadow-2xl">
        <ShieldCheck size={60} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-white font-black text-2xl uppercase mb-6 italic">{partId} Validée</h2>
        <div className="bg-black p-8 rounded-3xl border-2 border-slate-800 mb-8">
          <p className="text-5xl font-black text-white">{score} <span className="text-xl text-slate-700">/ {total}</span></p>
          <p className="text-[10px] text-slate-500 uppercase mt-2 font-black tracking-widest">Score QCM Automatique</p>
        </div>
        <button onClick={onNext} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg mb-4 shadow-lg">{isLast ? "TERMINER LE TEST" : "PARTIE SUIVANTE"}</button>
        <div className="flex gap-2">
          <button onClick={onRefaire} className="flex-1 bg-slate-800 text-slate-400 py-3 rounded-xl font-black text-xs hover:text-white">REFAIRE</button>
          <button onClick={onStop} className="flex-1 bg-red-900/20 text-red-500 py-3 rounded-xl font-black text-xs border border-red-900/50">QUITTER</button>
        </div>
      </div>
    </div>
  );
}

function FinishView({ nom, onHome }) {
  return (
    <div className="h-screen bg-blue-600 flex items-center justify-center p-6 text-center border-[12px] border-black">
      <div className="bg-white p-12 rounded-[3.5rem] border-8 border-black max-w-sm w-full shadow-[20px_20px_0_rgba(0,0,0,1)]">
        <Trophy size={60} className="text-orange-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-black uppercase italic">Félicitations !</h2>
        <p className="font-bold text-slate-600 mt-4 leading-relaxed italic">Bravo {nom}. Tes réponses ont été transmises avec succès. Ton enseignant pourra consulter tes résultats.</p>
        <button onClick={onHome} className="mt-8 bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase italic">Retour à l'accueil</button>
      </div>
    </div>
  );
}