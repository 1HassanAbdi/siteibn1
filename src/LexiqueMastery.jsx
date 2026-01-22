import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Type, MessageCircle, Grid2X2, Mic, CheckCircle, XCircle,
  ArrowRight, Trophy, RefreshCw, Volume2, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

const EXERCISES = [
  { id: '1', title: "Observer", icon: <Eye size={18}/>, color: "bg-blue-500", light: "bg-blue-50", border: "border-blue-500" },
  { id: '2', title: "Articles", icon: <Grid2X2 size={18}/>, color: "bg-orange-500", light: "bg-orange-50", border: "border-orange-500" },
  { id: '3', title: "Phrases", icon: <MessageCircle size={18}/>, color: "bg-purple-500", light: "bg-purple-50", border: "border-purple-500" },
  { id: '4', title: "Catégories", icon: <Star size={18}/>, color: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-500" },
  { id: '5', title: "Dictée", icon: <Mic size={18}/>, color: "bg-pink-600", light: "bg-pink-50", border: "border-pink-600" },
];

export default function LexiqueMastery({ weekData, weekTitle }) {
  const [activeEx, setActiveEx] = useState('1');
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
  const [userInput, setUserInput] = useState('');

  const config = EXERCISES.find(e => e.id === activeEx);
  const currentWord = weekData[index];

  const handleNext = () => {
    if (index < weekData.length - 1) {
      setIndex(index + 1);
      setUserInput('');
      setFeedback(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#15a278', '#FFD700', '#ffffff'] });
    }
  };

  const validate = (val, correct) => {
    if (val.toLowerCase().trim() === correct.toLowerCase().trim()) {
      setFeedback('correct');
      setTimeout(handleNext, 800);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'fr-FR';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-6">
      {/* MENU DES EXERCICES STYLE "DASHBOARD" */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => { setActiveEx(ex.id); setIndex(0); setIsFinished(false); }}
            className={`p-4 rounded-[30px] flex flex-col items-center gap-2 transition-all border-2 shadow-sm ${
              activeEx === ex.id ? `bg-white ${ex.border} scale-105 shadow-md` : 'bg-white/50 border-transparent text-slate-400 opacity-60'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeEx === ex.id ? ex.color + ' text-white' : 'bg-slate-100 text-slate-400'}`}>
              {ex.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeEx === ex.id ? 'text-slate-800' : ''}`}>
              {ex.title}
            </span>
          </button>
        ))}
      </div>

      {/* CARTE DE JEU STYLE "DICTÉE APP" */}
      <div className="bg-[#fdfcf0] rounded-[50px] md:rounded-[60px] shadow-2xl border-4 border-white min-h-[500px] flex flex-col relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div 
              key={`${activeEx}-${index}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 p-8 md:p-12 flex flex-col items-center"
            >
              {/* HEADER DE LA CARTE */}
              <div className="w-full flex justify-between items-center mb-12">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-sm ${config.color}`}>
                  {weekTitle}
                </span>
                <div className="flex gap-1">
                  {weekData.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 ' + config.color : 'w-2 bg-slate-200'}`} />
                  ))}
                </div>
              </div>

              {/* CONTENU SELON EXERCICE */}
              <div className="flex-1 w-full flex flex-col items-center justify-center">
                
                {/* 1. OBSERVATION */}
                {activeEx === '1' && (
                  <>
                    <div className="text-8xl mb-6">{currentWord.emoji}</div>
                    <h2 className="text-5xl font-black text-slate-800 mb-2 uppercase tracking-tighter">{currentWord.word}</h2>
                    <p className="text-slate-400 font-bold mb-8 italic text-sm">Observe bien puis recopie le mot :</p>
                    <input 
                      autoFocus className="w-full max-w-md bg-white border-4 border-slate-100 rounded-[30px] p-5 text-3xl text-center font-black text-[#0d6e52] focus:border-blue-400 outline-none transition-all"
                      value={userInput} onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && validate(userInput, currentWord.word)}
                    />
                  </>
                )}

                {/* 2. ARTICLES */}
                {activeEx === '2' && (
                  <>
                    <div className="text-9xl mb-8">{currentWord.emoji}</div>
                    <div className="flex flex-wrap justify-center gap-4">
                      {["un", "une", "le", "la", "des"].map(art => (
                        <button key={art} onClick={() => validate(art, currentWord.article)}
                          className="bg-white px-8 py-4 rounded-[25px] border-b-4 border-slate-200 text-2xl font-black text-orange-600 hover:border-orange-500 hover:-translate-y-1 transition-all">
                          {art}
                        </button>
                      ))}
                    </div>
                    <p className="mt-8 text-3xl font-black text-slate-800 uppercase tracking-widest underline decoration-orange-300 underline-offset-8">
                      ... {currentWord.word}
                    </p>
                  </>
                )}

                {/* 3. PHRASES */}
                {activeEx === '3' && (
                  <div className="max-w-2xl text-center">
                    <div className="text-6xl mb-6">{currentWord.emoji}</div>
                    <div className="bg-white p-8 rounded-[40px] shadow-inner border-2 border-purple-50 mb-8">
                       <p className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-700">
                         {currentWord.sentence.split('___')[0]}
                         <span className="text-purple-600 font-black px-2 border-b-4 border-dashed border-purple-200">? ? ?</span>
                         {currentWord.sentence.split('___')[1]}
                       </p>
                    </div>
                    <input 
                      autoFocus placeholder="Écris le mot manquant"
                      className="w-full max-w-md bg-white border-4 border-slate-100 rounded-[30px] p-5 text-2xl text-center font-black text-purple-600 focus:border-purple-400 outline-none transition-all"
                      value={userInput} onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && validate(userInput, currentWord.word)}
                    />
                  </div>
                )}

                {/* 4. CATÉGORIES */}
                {activeEx === '4' && (
                  <>
                    <div className="text-8xl mb-4">{currentWord.emoji}</div>
                    <h3 className="text-3xl font-black text-slate-800 mb-10 uppercase">{currentWord.article} {currentWord.word}</h3>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                      {["animal", "objet", "nature", "nourriture", "famille", "vêtement"].map(cat => (
                        <button key={cat} onClick={() => validate(cat, currentWord.category)}
                          className="bg-white p-5 rounded-[25px] border-2 border-slate-100 font-black text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 transition-all uppercase text-sm">
                          {cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* 5. DICTÉE */}
                {activeEx === '5' && (
                  <>
                    <button onClick={() => speak(currentWord.word)}
                      className="w-32 h-32 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:scale-110 transition-transform shadow-xl mb-8 group">
                      <Volume2 size={50} className="group-active:scale-90" />
                    </button>
                    <p className="text-slate-400 font-black mb-10 uppercase text-xs tracking-widest">Écoute et écris le mot</p>
                    <input 
                      autoFocus className="w-full max-w-md bg-white border-4 border-slate-100 rounded-[30px] p-6 text-4xl text-center font-black text-pink-600 focus:border-pink-500 outline-none transition-all uppercase"
                      value={userInput} onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && validate(userInput, currentWord.word)}
                    />
                  </>
                )}
              </div>

              {/* FEEDBACK OVERLAY (Style Dictée) */}
              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className={`absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm`}>
                    <div className={`${feedback === 'correct' ? 'bg-emerald-500' : 'bg-red-500'} p-12 rounded-[60px] shadow-2xl text-white flex flex-col items-center`}>
                       {feedback === 'correct' ? <CheckCircle size={80} /> : <XCircle size={80} />}
                       <span className="text-3xl font-black mt-4 uppercase">{feedback === 'correct' ? 'Génial !' : 'Oups !'}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ) : (
            /* --- ÉCRAN DE FIN --- */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <Trophy size={120} className="text-yellow-400 animate-bounce" />
                <Star className="absolute -top-4 -right-4 text-orange-400 animate-pulse" size={40} />
              </div>
              <h2 className="text-5xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Félicitations !</h2>
              <p className="text-xl text-slate-500 mb-10 font-medium">Tu as terminé l'exercice {config.title} avec succès.</p>
              
              <div className="flex gap-4">
                <button onClick={() => { setIndex(0); setIsFinished(false); }} className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase text-sm shadow-xl hover:scale-105 transition-all">
                  <RefreshCw size={18}/> Recommencer
                </button>
                {parseInt(activeEx) < 5 && (
                  <button 
                    onClick={() => { setActiveEx(String(parseInt(activeEx) + 1)); setIndex(0); setIsFinished(false); }}
                    className="flex items-center gap-2 px-10 py-4 bg-[#15a278] text-white rounded-full font-black uppercase text-sm shadow-xl hover:scale-105 transition-all"
                  >
                    Suivant <ArrowRight size={18}/>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}