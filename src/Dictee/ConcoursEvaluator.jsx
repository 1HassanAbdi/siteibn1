import React, { useState } from 'react';
import { Trophy, ArrowLeft, Target, ShieldCheck, LayoutGrid, Zap, Star, Flame } from 'lucide-react';
import EvaluationGame from './EvaluationGame';
import ConcoursHistory from './ConcoursHistory';

const ConcoursEvaluator = ({ trainingData, onBack, selectedLevel }) => {
  const [view, setView] = useState('selection'); // 'selection', 'game', 'results'
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [difficulty, setDifficulty] = useState(20); // Nouveau: 20, 40 ou 60
  const [lastSession, setLastSession] = useState(null);

  const getRandomWords = (wordsArray, count) => {
    const shuffled = [...wordsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateBlocs = () => {
    if (!trainingData || !trainingData.weeks) return [];
    
    const blocsConfig = [
      { id: 'BLOC 1', title: 'Concours : Semaines 1-2-3', range: [1, 3] },
      { id: 'BLOC 2', title: 'Concours : Semaines 4-5-6', range: [4, 6] },
      { id: 'BLOC 3', title: 'Concours : Semaines 7-8-9', range: [7, 9] },
      { id: 'BLOC 4', title: 'Concours : Semaines 12-13-14', range: [12, 14] }
    ];

    return blocsConfig.map(bloc => {
      const weeksInRange = trainingData.weeks.filter(w => 
        w.id >= bloc.range[0] && w.id <= bloc.range[1]
      );

      // On récupère TOUS les mots disponibles dans ce bloc de semaines
      let allPoolWords = [];
      weeksInRange.forEach(currentWeek => {
        const formattedWords = currentWeek.words.map(word => ({
          text: word,
          weekId: currentWeek.id
        }));
        allPoolWords = [...allPoolWords, ...formattedWords];
      });

      return { ...bloc, pool: allPoolWords };
    }).filter(b => b.pool.length > 0);
  };

  const availableBlocs = generateBlocs();

  // Fonction pour lancer le jeu avec le bon nombre de mots
  const handleStartGame = () => {
    if (!selectedBloc) return;
    
    // On pioche X mots parmi le pool total du bloc
    const selectedWords = getRandomWords(selectedBloc.pool, difficulty);
    
    // On met à jour l'objet bloc avec seulement les mots piochés pour le jeu
    const blocWithGameWords = { ...selectedBloc, words: selectedWords };
    setSelectedBloc(blocWithGameWords);
    setView('game');
  };

  const handleFinishGame = (stats) => {
    setLastSession(stats);
    setView('results');
  };

  // VUE : JEU EN COURS
  if (view === 'game' && selectedBloc) {
    return (
      <EvaluationGame 
        words={selectedBloc.words} 
        selectedLevel={selectedLevel}
        blocTitle={`${selectedBloc.title} (${difficulty} mots)`}
        onFinish={handleFinishGame} 
        onBack={() => setView('selection')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-white font-['Poppins']">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black uppercase text-xs">
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-orange-500 uppercase italic tracking-tighter leading-none">
              {view === 'results' ? 'Résultats du Concours' : `Concours ${trainingData.niveau}`}
            </h1>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        {view === 'selection' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
                <Target size={16} /> 1. Choix du bloc
              </h2>
              {availableBlocs.map((bloc) => (
                <button
                  key={bloc.id}
                  onClick={() => setSelectedBloc(bloc)}
                  className={`w-full p-6 rounded-[30px] border-2 transition-all text-left flex justify-between items-center group ${
                    selectedBloc?.id === bloc.id 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className={`block text-[10px] font-black uppercase mb-1 ${selectedBloc?.id === bloc.id ? 'text-orange-400' : 'text-slate-500'}`}>
                      {bloc.id}
                    </span>
                    <span className="text-lg font-bold">{bloc.title}</span>
                  </div>
                  <div className={`p-2 rounded-xl ${selectedBloc?.id === bloc.id ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    <ShieldCheck size={20} />
                  </div>
                </button>
              ))}
              
              <button 
                onClick={() => setView('results')}
                className="w-full py-4 mt-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 font-bold uppercase text-xs hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <LayoutGrid size={16} /> Voir l'historique complet
              </button>
            </div>

            <div className="bg-slate-900/80 border-2 border-slate-800 rounded-[40px] p-8 flex flex-col items-center shadow-2xl">
              {selectedBloc ? (
                <>
                  <h2 className="text-sm font-black text-slate-500 uppercase mb-8 self-start flex items-center gap-2 tracking-widest">
                    <Star size={16} /> 2. Difficulté
                  </h2>
                  
                  <div className="w-full space-y-3 mb-10">
                    {[
                      { id: 20, label: 'Facile', desc: '20 mots', icon: <Zap size={18}/>, color: 'text-cyan-400' },
                      { id: 40, label: 'Intermédiaire', desc: '40 mots', icon: <Star size={18}/>, color: 'text-emerald-400' },
                      { id: 60, label: 'Expert', desc: '60 mots', icon: <Flame size={18}/>, color: 'text-orange-500' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setDifficulty(mode.id)}
                        className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                          difficulty === mode.id 
                          ? 'border-white bg-white/5' 
                          : 'border-transparent bg-slate-800/40 opacity-50'
                        }`}
                      >
                        <div className={`p-3 rounded-xl bg-slate-900 ${difficulty === mode.id ? mode.color : 'text-slate-600'}`}>
                          {mode.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-black text-sm uppercase">{mode.label}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{mode.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleStartGame}
                    className="w-full py-5 bg-orange-500 hover:bg-orange-400 rounded-2xl font-black uppercase shadow-[0_6px_0_0_#9a3412] active:translate-y-1 transition-all"
                  >
                    Lancer le concours
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-700">
                   <Trophy size={60} className="mb-4 opacity-20" />
                   <p className="font-black uppercase text-xs">Sélectionnez un bloc à gauche</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VUE RÉSULTATS + HISTORIQUE */
          <div className="space-y-12">
            {lastSession && (
              <div className="bg-emerald-500 rounded-[40px] p-1 text-[#061a14] shadow-2xl overflow-hidden">
                <div className="bg-white rounded-[38px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Trophy size={40} className="text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase italic leading-none">Terminé !</h2>
                      <p className="font-bold text-emerald-600 uppercase text-xs tracking-widest mt-1">Score: {lastSession.score}/{lastSession.total}</p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400">Temps</p>
                      <p className="text-xl font-black">{lastSession.temps}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400">Erreurs</p>
                      <p className="text-xl font-black text-rose-500">{lastSession.errors}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setView('selection')}
                    className="px-8 py-4 bg-[#061a14] text-white rounded-2xl font-black uppercase text-sm hover:scale-105 transition-transform"
                  >
                    Nouvel Examen
                  </button>
                </div>
              </div>
            )}
            
            <div className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] flex-1 bg-slate-800"></div>
                <h2 className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">Historique Récent</h2>
                <div className="h-[2px] flex-1 bg-slate-800"></div>
              </div>
              <ConcoursHistory hideHeader={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConcoursEvaluator;