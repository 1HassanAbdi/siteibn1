import React, { useState, useEffect } from 'react';
import { 
  Calendar, BookOpen, Trophy, Check, X, 
  RefreshCw, Mail, Lightbulb, PieChart, Info, AlertCircle, Clock, ExternalLink
} from 'lucide-react';

// Données importées
import parentData from './info.json'; 
import exercisesData from './ex.json';

const OQREDashboard = () => {
  const [activeTab, setActiveTab] = useState('parent');
  const [currentWeek, setCurrentWeek] = useState(null);
  
  // États pour le Quiz
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Extraction des données
  const { test_info, letter, guides, schedule } = parentData || {};

  useEffect(() => {
    const today = new Date();
    if (schedule && schedule.length > 0) {
      // Trouve la semaine active (celle de mercredi prochain ou aujourd'hui)
      const activeWeek = schedule.find(w => new Date(w.date) >= today) || schedule[0];
      setCurrentWeek(activeWeek);

      // Charger le quiz
      if (exercisesData) {
        const quiz = exercisesData.find(e => e.weekId === activeWeek.id);
        setCurrentQuiz(quiz);
      }
    }
  }, [schedule]);

  // Logique pour trouver le guide spécifique au domaine de la semaine
  const getActiveGuide = () => {
    if (!currentWeek) return null;
    // On cherche le guide dont l'ID (A, B, C...) est présent dans le titre du thème
    return guides.find(g => currentWeek.theme.includes(`Domaine ${g.id}`));
  };

  const currentGuide = getActiveGuide();

  const handleOptionClick = (questionId, option) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const calculateScore = () => {
    if (!currentQuiz) return;
    let correctCount = 0;
    currentQuiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const finalScore = Math.round((correctCount / currentQuiz.questions.length) * 20);
    setScore(finalScore);
    setShowResult(true);
  };

  if (!currentWeek) return <div className="p-10 text-center font-bold">Chargement de la mission...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      
      {/* --- HEADER --- */}
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-20 -mt-20 blur-3xl opacity-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-bold mb-3 border border-indigo-500/30">
              <Clock size={12} className="text-indigo-400" />
              MISSION DE LA SEMAINE : {currentWeek.date}
            </div>
            <h1 className="text-3xl font-black mb-1">Objectif OQRE 2026 🚀</h1>
            <p className="text-slate-400 text-sm italic">Révision ciblée pour l'évaluation de mercredi</p>
          </div>
          
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('parent')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'parent' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Info Parents
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'student' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Défis Élève
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* --- VUE PARENT : SEMAINE EN COURS UNIQUEMENT --- */}
        {activeTab === 'parent' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. Alerte Evaluation */}
            <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
                <AlertCircle className="text-amber-500 mt-1 flex-shrink-0" size={24} />
                <div>
                    <h3 className="font-black text-amber-900 text-sm uppercase tracking-wider">Aide-mémoire : Évaluation ce mercredi</h3>
                    <p className="text-amber-800 text-sm mt-1 opacity-90">
                        Cette semaine, nous nous concentrons sur : <strong className="underline">{currentWeek.theme}</strong>. 
                        Assurez-vous que votre enfant complète les exercices IXL listés ci-dessous avant l'évaluation.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* 2. Mission IXL de la semaine */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                        <Check className="text-green-500" />
                        Objectifs IXL (Semaine {currentWeek.id})
                    </h2>
                    <div className="space-y-3">
                        {currentWeek.ixl_details.map((ixl, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-indigo-300 transition-colors">
                                <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {ixl.code}
                                </span>
                                <span className="text-sm font-bold text-slate-600">
                                    {ixl.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-xs font-black text-indigo-700 uppercase mb-1">Résumé de l'apprentissage :</p>
                        <p className="text-sm text-indigo-900/70">{currentWeek.description}</p>
                    </div>
                </section>

                {/* 3. Conseil Pédagogique du Domaine */}
                <section className="flex flex-col gap-6">
                    {currentGuide && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-t-4 border-t-indigo-600 flex-grow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center font-black">
                                    {currentGuide.id}
                                </div>
                                <h3 className="font-black text-slate-800 leading-tight">{currentGuide.title}</h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-6">{currentGuide.what}</p>
                            
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <p className="text-[10px] font-black text-amber-600 uppercase mb-1 flex items-center gap-1">
                                    <Lightbulb size={14} /> Astuce pour les devoirs
                                </p>
                                <p className="text-sm text-amber-900 italic font-medium">"{currentGuide.tip}"</p>
                            </div>
                        </div>
                    )}

                    {/* Rappel Pondération OQRE */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Poids dans l'examen final</h4>
                        <div className="flex items-center justify-between">
                            {test_info.weighting.map((w, i) => (
                                <div key={i} className={`flex flex-col items-center ${currentWeek.theme.includes(w.domain.split('.')[0]) ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`}>
                                    <div className={`w-2 h-2 rounded-full mb-1 ${currentWeek.theme.includes(w.domain.split('.')[0]) ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                    <span className="text-[10px] font-black">{w.percentage}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Lettre Signature */}
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white text-center relative overflow-hidden">
                <Mail className="absolute -left-4 -bottom-4 opacity-10 w-24 h-24 rotate-12" />
                <p className="text-indigo-100 text-sm leading-relaxed max-w-lg mx-auto mb-4">
                    {letter.introduction}
                </p>
                <div className="h-px bg-white/20 w-16 mx-auto mb-4"></div>
                <p className="font-black text-xs uppercase tracking-[0.2em]">— {letter.signature} —</p>
            </div>

          </div>
        )}

        {/* --- ÉLÈVE (Quiz Interactif) --- */}
        {activeTab === 'student' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-slideUp">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <BookOpen className="text-indigo-400" /> {currentWeek.theme}
                </h2>
                <p className="text-slate-400 text-sm mt-1">Évaluation formative hebdomadaire</p>
              </div>
              {!showResult && (
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">{Object.keys(answers).length} / {currentQuiz?.questions.length}</div>
                </div>
              )}
            </div>

            <div className="p-8">
              {currentQuiz ? (
                <div className="space-y-10">
                  {currentQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="relative pl-12">
                      <span className="absolute left-0 top-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</span>
                      <h3 className="text-lg font-bold text-slate-800 mb-6">{q.text}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((option) => {
                          const isSelected = answers[q.id] === option;
                          const isCorrect = q.correctAnswer === option;
                          let btnStyle = "border-slate-100 hover:border-indigo-300";
                          if (isSelected) btnStyle = "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100";
                          if (showResult) {
                            if (isCorrect) btnStyle = "border-green-500 bg-green-50 text-green-700";
                            else if (isSelected) btnStyle = "border-red-500 bg-red-50 text-red-700 opacity-50";
                            else btnStyle = "opacity-30 border-slate-50";
                          }
                          return (
                            <button
                              key={option}
                              onClick={() => handleOptionClick(q.id, option)}
                              disabled={showResult}
                              className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center ${btnStyle}`}
                            >
                              {option}
                              {showResult && isCorrect && <Check size={20} className="text-green-600" />}
                              {showResult && isSelected && !isCorrect && <X size={20} className="text-red-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-300">Pas de défi quiz cette semaine.</div>
              )}

              <div className="mt-12 flex flex-col items-center border-t border-slate-100 pt-10">
                {!showResult ? (
                  <button
                    onClick={calculateScore}
                    disabled={!currentQuiz || Object.keys(answers).length < currentQuiz.questions.length}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black py-4 px-16 rounded-2xl shadow-xl transition-all disabled:opacity-30"
                  >
                    Valider mes réponses
                  </button>
                ) : (
                  <div className="text-center w-full max-w-md animate-bounceIn">
                    <div className={`p-8 rounded-[40px] border-4 mb-8 ${score >= 15 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                      <Trophy size={60} className={`mx-auto mb-4 ${score >= 15 ? 'text-green-500' : 'text-amber-500'}`} />
                      <div className="text-7xl font-black text-slate-800 mb-2">{score}<span className="text-3xl text-slate-400">/20</span></div>
                      <p className="text-slate-600 font-bold">{score >= 14 ? "Excellent ! Prêt pour mercredi ! 🥈" : "Révisons encore un peu ! 💪"}</p>
                    </div>
                    <button onClick={() => { setAnswers({}); setShowResult(false); setScore(null); }} className="text-indigo-600 font-black flex items-center gap-2 mx-auto hover:underline">
                      <RefreshCw size={20} /> Recommencer le défi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OQREDashboard;