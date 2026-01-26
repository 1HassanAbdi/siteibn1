import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, BookOpen, CheckCircle, Trophy, 
  History, Layout, Send, Edit3, Eye, MessageSquare 
} from 'lucide-react';

// Importation de votre JSON OQRE
// Note: Assurez-vous que le JSON suit la structure générée précédemment
import oqreData from './data/oqre_2011.json'; 

export default function PortailOQRE() {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [expandedText, setExpandedText] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState(true);

  const currentPart = oqreData.parties[currentPartIndex];

  // --- LOGIQUE DE CALCUL (Uniquement pour les Choix Multiples) ---
  const stats = useMemo(() => {
    let totalMCQ = 0;
    let correctMCQ = 0;
    
    // On ne score que les questions de type MCQ (Choix multiples)
    if (currentPart.lecture?.questions) {
      currentPart.lecture.questions.forEach(q => {
        if (q.options) {
          totalMCQ++;
          if (answers[q.numero] === q.reponse_correcte) correctMCQ++;
        }
      });
    }
    // Idem pour les sections d'écriture en choix multiples
    const mcqSection = currentPart.ecriture_choix_multiple_1 || currentPart.ecriture_choix_multiple_2;
    if (mcqSection?.questions) {
      mcqSection.questions.forEach(q => {
        totalMCQ++;
        if (answers[q.numero] === q.reponse_correcte) correctMCQ++;
      });
    }

    return {
      total: totalMCQ,
      correct: correctMCQ,
      percent: totalMCQ ? Math.round((correctMCQ / totalMCQ) * 100) : 0
    };
  }, [answers, currentPart]);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 font-sans p-2 md:p-6">
      {/* HEADER SIMPLIFIÉ POUR ENFANTS */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Trophy size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Mon Test de Français</h1>
            <p className="text-slate-500 text-sm font-bold">3e Année - OQRE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={currentPartIndex}
            onChange={(e) => { setCurrentPartIndex(parseInt(e.target.value)); setAnswers({}); }}
            className="bg-slate-100 font-bold text-slate-700 px-4 py-2 rounded-xl outline-none border-2 border-transparent focus:border-orange-400"
          >
            {oqreData.parties.map((p, idx) => (
              <option key={idx} value={idx}>{p.id} : {p.lecture?.titre || "Écriture"}</option>
            ))}
          </select>
          <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-black shadow-md transition-transform active:scale-95 flex items-center gap-2">
            <Send size={18} /> FINI !
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLONNE GAUCHE : TEXTE ET QUESTIONS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ACCORDION TEXTE DE LECTURE */}
          {currentPart.lecture && (
            <div className="bg-white rounded-[2rem] shadow-md border-b-4 border-blue-200 overflow-hidden">
              <button 
                onClick={() => setExpandedText(!expandedText)}
                className="w-full p-5 flex justify-between items-center bg-blue-500 text-white"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={24} />
                  <span className="text-lg font-black uppercase tracking-wide">1. Je lis le texte</span>
                </div>
                <motion.div animate={{ rotate: expandedText ? 180 : 0 }}><ChevronDown /></motion.div>
              </button>

              <AnimatePresence>
                {expandedText && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-10 prose prose-slate max-w-none">
                      <h2 className="text-2xl font-black text-blue-600 mb-6">{currentPart.lecture.titre}</h2>
                      {currentPart.lecture.texte_integral.map((p, idx) => (
                        <p key={idx} className="text-lg leading-relaxed mb-4 text-slate-700 font-medium">
                          <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mr-2">{p.paragraphe || "•"}</span>
                          {p.contenu}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ACCORDION QUESTIONS */}
          <div className="bg-white rounded-[2rem] shadow-md border-b-4 border-orange-200 overflow-hidden">
            <button 
              onClick={() => setExpandedQuestions(!expandedQuestions)}
              className="w-full p-5 flex justify-between items-center bg-orange-500 text-white"
            >
              <div className="flex items-center gap-3">
                <Edit3 size={24} />
                <span className="text-lg font-black uppercase tracking-wide">2. Je réponds aux questions</span>
              </div>
              <motion.div animate={{ rotate: expandedQuestions ? 180 : 0 }}><ChevronDown /></motion.div>
            </button>

            <AnimatePresence>
              {expandedQuestions && (
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden bg-orange-50/20"
                >
                  <div className="p-6 space-y-10">
                    {/* Questions de lecture */}
                    {currentPart.lecture?.questions?.map((q) => (
                      <QuestionItem 
                        key={q.numero} 
                        q={q} 
                        value={answers[q.numero]} 
                        onChange={(val) => setAnswers({...answers, [q.numero]: val})} 
                      />
                    ))}
                    {/* Questions d'écriture (Choix Multiples) */}
                    {(currentPart.ecriture_choix_multiple_1 || currentPart.ecriture_choix_multiple_2)?.questions.map((q) => (
                      <QuestionItem 
                        key={q.numero} 
                        q={q} 
                        value={answers[q.numero]} 
                        onChange={(val) => setAnswers({...answers, [q.numero]: val})} 
                      />
                    ))}
                    {/* Production écrite (Rédaction) */}
                    {currentPart.ecriture_production_1 && (
                       <div className="p-6 bg-white rounded-3xl border-2 border-dashed border-orange-300">
                          <h4 className="font-black text-orange-600 mb-4 flex items-center gap-2">
                            <MessageSquare /> RÉDACTION
                          </h4>
                          <p className="text-lg font-bold mb-4">{currentPart.ecriture_production_1.sujet}</p>
                          <textarea 
                            rows={6}
                            placeholder="Écris ton texte ici..."
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-orange-500 outline-none text-lg"
                            onChange={(e) => setAnswers({...answers, [currentPart.ecriture_production_1.numero]: e.target.value})}
                          />
                          <p className="mt-2 text-sm text-slate-400 font-bold italic">💡 Cette partie sera corrigée par ton enseignant.</p>
                       </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* COLONNE DROITE : SCORE ET PROGRÈS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-lg border-t-8 border-green-400 sticky top-6">
            <h3 className="text-slate-400 font-black uppercase text-xs tracking-widest mb-4">Ton Score (Choix Multiples)</h3>
            <div className="flex items-center gap-4 mb-4">
               <span className="text-5xl font-black text-slate-800">{stats.percent}%</span>
               <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                 <CheckCircle size={30} />
               </div>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.percent}%` }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              />
            </div>
            <p className="mt-4 text-slate-500 font-bold text-sm">
              {stats.correct} bonnes réponses sur {stats.total} questions à choix.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANT : ITEM DE QUESTION ---
function QuestionItem({ q, value, onChange }) {
  const isMCQ = !!q.options;

  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-black text-sm">
          {q.numero}
        </span>
        <p className="text-lg font-bold text-slate-800 leading-snug">{q.enonce}</p>
      </div>

      {isMCQ ? (
        <div className="grid gap-2 pl-11">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onChange(opt)}
              className={`p-4 rounded-2xl text-left border-2 transition-all font-bold text-base ${
                value === opt 
                ? "border-orange-500 bg-orange-50 text-orange-700 shadow-inner" 
                : "border-slate-50 bg-slate-50 text-slate-600 hover:border-orange-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="pl-11 space-y-2">
          <textarea 
            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-400 outline-none"
            placeholder="Écris ta réponse ici..."
            rows={3}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="text-xs font-black text-blue-500 uppercase flex items-center gap-1">
             <Eye size={14} /> Correction par l'enseignant
          </span>
        </div>
      )}
    </div>
  );
}