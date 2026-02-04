import React, { useState, useMemo } from 'react';
import {
  BookOpen, Puzzle, ImageIcon, CheckCircle2,
  HelpCircle, Hammer, Volume2, ChevronRight,
  Award, BarChart3, Check, X, Star, Cloud,
  Trophy, UserCircle2, ArrowLeft 
} from 'lucide-react';

const STORY_AUDIOS = [
  "phrase_01_remi_va_a_lecole.mp3", "phrase_02_il_lit.mp3", "phrase_03_il_aime_lire.mp3",
  "phrase_04_il_parle_avec_des_amis.mp3", "phrase_05_il_a_un_pupitre.mp3",
  "phrase_06_il_redige_des_phrases.mp3", "phrase_07_il_joue_avec_des_jeux.mp3",
  "phrase_08_il_dîne_a_lecole.mp3", "phrase_09_remi_aime_aller_a_lecole.mp3"
];

const GAME_DATA = {
  theme: "Rémi à l'école",
  steps: [
    { id: "reading", label: "Lecture", icon: BookOpen },
    { id: "syllables", label: "Syllabes", icon: Puzzle },
    { id: "imageSearch", label: "Mots-Images", icon: ImageIcon },
    { id: "vraiFaux", label: "Vrai ou Faux", icon: CheckCircle2 },
    { id: "qcm", label: "Questions", icon: HelpCircle },
    { id: "reconstruct", label: "Phrases", icon: Hammer }
  ],
  content: {
    reading: [
      { text: "Rémi va à l'école.", emoji: "🏫" },
      { text: "Il lit.", emoji: "📖" },
      { text: "Il aime lire.", emoji: "❤️" },
      { text: "Il parle avec des amis.", emoji: "👫" },
      { text: "Il a un pupitre.", emoji: "🪑" },
      { text: "Il rédige des phrases.", emoji: "✍️" },
      { text: "Il joue avec des jeux.", emoji: "🧩" },
      { text: "Il dîne à l'école.", emoji: "🍎" },
      { text: "Rémi aime aller à l'école.", emoji: "✨" }
    ],
    syllables: [
      { word: "ÉCOLE", emoji: "🏫", parts: ["É", "CO", "LE"] },
      { word: "PUPITRE", emoji: "🪑", parts: ["PU", "PI", "TRE"] },
      { word: "AMIS", emoji: "👫", parts: ["A", "MIS"] },
      { word: "PHRASES", emoji: "✍️", parts: ["PHRA", "SES"] }
    ],
    imageSearch: [
      { img: "🏫", options: ["MAISON", "ÉCOLE", "PARC"], a: "ÉCOLE" },
      { img: "📖", options: ["LIVRE", "CAHIER", "JEU"], a: "LIVRE" },
      { img: "🪑", options: ["TABLE", "CHAISE", "PUPITRE"], a: "PUPITRE" }
    ],
    vraiFaux: [
      { q: "Rémi est à la plage.", a: "Faux" },
      { q: "Rémi a un pupitre.", a: "Vrai" }
    ],
    qcm: [
      { q: "Que fait Rémi ?", options: ["Il dort", "Il lit", "Il court"], a: "Il lit" },
      { q: "Où dîne Rémi ?", options: ["À la maison", "À l'école", "Au restaurant"], a: "À l'école" }
    ],
    reconstruct: [
      { words: ["va", "Rémi", "l'école.", "à"], correct: "Rémi va à l'école." },
      { words: ["aime", "lire.", "Il"], correct: "Il aime lire." }
    ]
  }
};

const WordGame = () => {
  const [gameState, setGameState] = useState('login');
  const [userName, setUserName] = useState('');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [reconstructedSyllables, setReconstructedSyllables] = useState([]);
  const [phraseOrder, setPhraseOrder] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    stepScores: {},
    startTime: null
  });

  const currentStep = GAME_DATA.steps[currentStepIdx];
  const stepContent = GAME_DATA.content[currentStep.id] || [];
  const currentTask = stepContent[taskIdx];

  // --- LOGIQUE BARRE JUSTE / ERREUR ---
  const totalAnswers = stats.correctAnswers + stats.wrongAnswers;
  const correctPct = totalAnswers > 0 ? (stats.correctAnswers / totalAnswers) * 100 : 0;
  const wrongPct = totalAnswers > 0 ? (stats.wrongAnswers / totalAnswers) * 100 : 0;

  // --- FONCTION LECTURE AUDIO (DOSSIER PUBLIC) ---
  const playAudioFile = (fileName) => {
    const audio = new Audio(`/1A/audio/${fileName}`);
    audio.play().catch(() => console.log("Fichier audio non trouvé"));
  };

  // --- SYNTHÈSE VOCALE (POUR LES PHRASES CONSTITUÉES) ---
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const triggerFeedback = (isCorrect) => {
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect && currentStep.id === 'reconstruct') {
        speakText(currentTask.correct);
    }

    setStats(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
      stepScores: {
        ...prev.stepScores,
        [currentStep.id]: {
          correct: (prev.stepScores[currentStep.id]?.correct || 0) + (isCorrect ? 1 : 0),
          total: (prev.stepScores[currentStep.id]?.total || 0) + 1
        }
      }
    }));

    if (isCorrect) {
      // Temps de retour augmenté pour voir le mot complet
      setTimeout(() => {
        setFeedback(null);
        if (taskIdx < stepContent.length - 1) {
          setTaskIdx(taskIdx + 1);
        } else {
          nextStep();
        }
        setReconstructedSyllables([]);
        setPhraseOrder([]);
      }, 2000);
    } else {
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const handleSyllableClick = (syll) => {
    if (feedback) return;
    const nextParts = [...reconstructedSyllables, syll];
    if (syll === currentTask.parts[reconstructedSyllables.length]) {
      setReconstructedSyllables(nextParts);
      if (nextParts.length === currentTask.parts.length) triggerFeedback(true);
    } else {
      triggerFeedback(false);
      setReconstructedSyllables([]);
    }
  };

  const nextStep = () => {
    if (currentStepIdx < GAME_DATA.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      setTaskIdx(0);
    } else {
      setGameState('finished');
    }
  };

  const shuffledOptions = useMemo(() => {
    if (!currentTask) return [];
    const options = currentTask.options || currentTask.parts || currentTask.words || ["Vrai", "Faux"];
    return [...options].sort(() => Math.random() - 0.5);
  }, [currentStepIdx, taskIdx, currentTask]);

  if (gameState === 'login') {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border-4 border-blue-200 text-center">
          <UserCircle2 size={60} className="mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-black text-blue-900 mb-6">LABO DE LECTURE</h1>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ton prénom"
            className="w-full px-5 py-4 bg-blue-50 border-4 border-blue-100 rounded-2xl mb-6 text-xl font-bold outline-none"
          />
          <button
            disabled={!userName.trim()}
            onClick={() => setGameState('playing')}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg disabled:opacity-50"
          >
            COMMENCER
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-lg w-full">
           <Trophy size={80} className="mx-auto text-yellow-500 mb-4" />
           <h1 className="text-4xl font-black text-blue-900 uppercase">Bravo {userName} !</h1>
           <p className="text-xl text-gray-600 my-4">Tu as fini toutes les activités.</p>
           <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xl">REJOUER</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <header className="bg-blue-600 text-white px-6 py-4 flex flex-col shadow-lg">
        <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-3">
                <currentStep.icon size={24} />
                <h2 className="text-xl font-black uppercase tracking-tighter">{currentStep.label}</h2>
            </div>
            <div className="font-bold bg-white/20 px-4 py-1 rounded-full">{userName}</div>
        </div>
        
        {/* BARRE JUSTE / ERREUR */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                <span className="text-green-200">Juste: {stats.correctAnswers}</span>
                <span className="text-red-200">Erreurs: {stats.wrongAnswers}</span>
            </div>
            <div className="w-full h-3 bg-blue-900/30 rounded-full overflow-hidden flex border border-blue-400">
                <div style={{ width: `${correctPct}%` }} className="bg-green-400 h-full transition-all duration-500" />
                <div style={{ width: `${wrongPct}%` }} className="bg-red-400 h-full transition-all duration-500" />
            </div>
        </div>
      </header>

      {/* CADRE CENTRÉ */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl min-h-[600px] rounded-[40px] shadow-2xl border-8 border-white p-8 overflow-y-auto relative">
            
            {/* AFFICHAGE DU MOT / PHRASE COMPLETE LORS DU SUCCÈS */}
            {feedback === 'correct' && (
                <div className="absolute top-4 left-0 w-full px-8 z-20 animate-bounce">
                    <div className="bg-green-500 text-white p-4 rounded-2xl shadow-xl text-center border-4 border-white">
                        <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Excellent !</p>
                        <h2 className="text-3xl font-black tracking-wider uppercase">
                            {currentStep.id === 'syllables' ? currentTask.word : 
                             currentStep.id === 'reconstruct' ? currentTask.correct : 
                             currentTask.a || currentTask.correct}
                        </h2>
                    </div>
                </div>
            )}

            {currentStep.id === 'reading' ? (
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-blue-900 mb-6 border-b-4 border-blue-100 pb-2 flex items-center gap-2">
                <Star className="text-yellow-400" /> Lis bien l'histoire :
                </h3>
                {GAME_DATA.content.reading.map((line, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                    <button onClick={() => playAudioFile(STORY_AUDIOS[i])} className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                    <Volume2 size={24} />
                    </button>
                    <p className="text-2xl font-bold text-blue-900">{line.text} {line.emoji}</p>
                </div>
                ))}
                <button onClick={nextStep} className="w-full mt-8 bg-green-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3">
                J'AI TOUT LU ! <ChevronRight size={30} />
                </button>
            </div>
            ) : (
            <div className="space-y-8 text-center py-10">
                {/* UI SYLLABES */}
                {currentStep.id === 'syllables' && (
                <>
                    <div className="text-9xl mb-4">{currentTask.emoji}</div>
                    <div className="flex justify-center gap-3 min-h-[80px]">
                    {currentTask.parts.map((p, i) => (
                        <div key={i} className={`w-20 h-20 rounded-2xl border-4 flex items-center justify-center text-3xl font-black ${reconstructedSyllables[i] ? 'bg-yellow-400 text-white border-yellow-500' : 'bg-gray-50 border-gray-100 text-transparent'}`}>
                        {reconstructedSyllables[i] || "?"}
                        </div>
                    ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                    {shuffledOptions.map((opt, i) => (
                        <button key={i} onClick={() => handleSyllableClick(opt)} className="bg-white border-4 border-blue-100 hover:border-blue-400 p-6 rounded-2xl text-3xl font-black text-blue-600 shadow-md transition-all active:scale-90">
                        {opt}
                        </button>
                    ))}
                    </div>
                </>
                )}

                {/* UI QCM / IMAGES */}
                {(currentStep.id === 'imageSearch' || currentStep.id === 'vraiFaux' || currentStep.id === 'qcm') && (
                <>
                    <div className="bg-blue-50 p-10 rounded-[40px] border-4 border-blue-100 inline-block mb-10 text-9xl">
                    {currentTask.img || "❓"}
                    </div>
                    {currentTask.q && <p className="text-3xl font-black text-blue-900 mb-6">{currentTask.q}</p>}
                    <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                    {shuffledOptions.map((opt, i) => (
                        <button key={i} onClick={() => triggerFeedback(opt === currentTask.a)} className="bg-white border-4 border-blue-100 hover:border-blue-500 p-6 rounded-2xl text-2xl font-black text-blue-900 shadow-lg">
                        {opt}
                        </button>
                    ))}
                    </div>
                </>
                )}

                {/* UI PHRASES RECONSTRUCTION */}
                {currentStep.id === 'reconstruct' && (
                <>
                    <div className="bg-gray-50 border-4 border-dashed border-gray-200 p-8 rounded-3xl min-h-[120px] flex flex-wrap gap-3 justify-center items-center">
                    {phraseOrder.map((w, i) => (
                        <button key={i} onClick={() => setPhraseOrder(phraseOrder.filter((_, idx) => idx !== i))} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-2xl font-bold">
                        {w}
                        </button>
                    ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                    {shuffledOptions.map((word, i) => (
                        <button key={i} disabled={phraseOrder.includes(word)} onClick={() => setPhraseOrder([...phraseOrder, word])} className="bg-white border-2 border-gray-200 p-4 rounded-xl text-xl font-bold disabled:opacity-30 shadow-sm hover:bg-blue-50 transition-colors">
                        {word}
                        </button>
                    ))}
                    </div>
                    <button onClick={() => triggerFeedback(phraseOrder.join(" ") === currentTask.correct)} disabled={phraseOrder.length === 0} className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-colors">
                        VÉRIFIER LA PHRASE
                    </button>
                </>
                )}
            </div>
            )}
        </div>
      </main>

      {/* OVERLAY DE RÉPONSE */}
      {feedback && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 animate-in zoom-in duration-300 ${feedback === 'correct' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
          <div className="bg-white p-10 rounded-[50px] shadow-2xl text-center border-8 border-white/20">
            {feedback === 'correct' ? <Check size={100} className="text-green-500 mx-auto" strokeWidth={3} /> : <X size={100} className="text-red-500 mx-auto" strokeWidth={3} />}
            <p className="text-3xl font-black mt-4 uppercase italic tracking-widest text-gray-800">
              {feedback === 'correct' ? 'Bravo !' : 'Essaie encore !'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordGame;