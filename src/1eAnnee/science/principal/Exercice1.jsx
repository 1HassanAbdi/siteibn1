import React, { useState, useEffect } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import confetti from 'canvas-confetti';



// Palette de couleurs pour les flèches
const ARROW_COLORS = [
  '#FF0000', // Rouge
  
  '#22c55e', // Vert
  '#0000FF', // Bleu
  '#911EB4', // Violet
  '#F032E6', // Rose
  '#42D4F4', // Cyan
  '#f59e0b',  // Jaune/Ambre
  '#FF7F00' // Orange
];

export default function Exercise1({ data, onNext, say, student, theme }) {
  const [subStep, setSubStep] = useState(0);
  const [selectedEmojiIdx, setSelectedEmojiIdx] = useState(null);
  const [matches, setMatches] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [showResultScreen, setShowResultScreen] = useState(false);

  const itemsPerGroup = 3;
  const startIndex = subStep * itemsPerGroup;
  const currentGroup = data.slice(startIndex, startIndex + itemsPerGroup);
  const totalSubSteps = Math.ceil(data.length / itemsPerGroup);

  // --- SAUVEGARDE DE SÉCURITÉ ---
  useEffect(() => {
    const handleTabClose = () => {
      const payload = JSON.stringify({
        studentName: student?.name || "Inconnu",
        exercise: "Exercice 1 (Abandon)",
        score: matches.length,
        total: data.length
      });
      navigator.sendBeacon(GOOGLE_WEB_APP_URL, payload);
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => window.removeEventListener('beforeunload', handleTabClose);
  }, [matches, data.length, student]);

  // --- MÉLANGE DES MOTS ---
  useEffect(() => {
    const words = currentGroup.map(item => item.nom);
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
    setSelectedEmojiIdx(null);
  }, [subStep]);

  const handleEmojiClick = (idx) => {
    setSelectedEmojiIdx(idx);
    say(data[idx].nom);
  };

  const handleWordClick = (wordNom, wordId) => {
    if (selectedEmojiIdx === null) return;
    const correctNom = data[selectedEmojiIdx].nom;

    if (wordNom === correctNom) {
      const newMatch = { from: `emoji-${selectedEmojiIdx}`, to: wordId };
      const newMatches = [...matches, newMatch];
      setMatches(newMatches);
      setSelectedEmojiIdx(null);
      say("Bravo !");

      if (newMatches.length === data.length) {
        setTimeout(finishExercise, 500);
      }
    } else {
      say("Essaye encore");
      const el = document.getElementById(wordId);
      if (el) {
        el.style.borderColor = "#ef4444";
        setTimeout(() => el.style.borderColor = "#7dd3fc", 500);
      }
    }
  };

  const finishExercise = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setShowResultScreen(true);
    say("Génial " + (student?.name || "") + ", tu as fini l'exercice 1 !");
    onSendToSheet(matches.length);
  };

  const onSendToSheet = async (score) => {
    const payload = {
      subject: "Sciences",
      studentName: student?.name || "Inconnu",
      studentClass: student?.class || "",
      theme: theme,
      exercise: "Exercice 1",
      score: score,
      total: data.length
    };
    fetch(GOOGLE_WEB_APP_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
  };

  const matchesInCurrentGroup = matches.filter(m => {
    const idNum = parseInt(m.from.split('-')[1]);
    return idNum >= startIndex && idNum < startIndex + itemsPerGroup;
  }).length;

  // --- BILAN FINAL STABLE ---
  if (showResultScreen) {
    return (
      <div className="result-popup-stable">
        <div style={{ fontSize: '6rem' }}>🏆</div>
        <h1 className="title-static">EXERCICE 1 FINI !</h1>
        <div className="score-box-static">
           SCORE : {matches.length} / {data.length}
        </div>
        <p className="status-text">Ton score est envoyé au maître.</p>
        <button className="btn-final-static" onClick={() => onNext(matches.length)}>
          SUIVANT ➡️
        </button>
        <style>{`
            .result-popup-stable { padding: 40px; text-align: center; background: #f0fdf4; border-radius: 30px; border: 6px solid #22c55e; }
            .title-static { font-size: 3rem; color: #166534; margin-bottom: 20px; font-family: 'Fredoka', sans-serif; }
            .score-box-static { font-size: 3.5rem; font-weight: 900; color: #22c55e; background: white; padding: 20px; border-radius: 20px; display: inline-block; border: 4px solid #22c55e; }
            .status-text { font-size: 1.3rem; color: #166534; margin: 20px 0; }
            .btn-final-static { background: #22c55e; color: white; border: none; padding: 25px 60px; border-radius: 50px; font-size: 2rem; font-weight: 900; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ex1-container-stable">
      <h2 className="main-title">Relie l'image au bon mot</h2>
      
      <Xwrapper>
        <div className="matching-area-fixed">
          {/* Colonne des images */}
          <div className="col-fixed">
            {currentGroup.map((item, i) => {
              const globalIdx = startIndex + i;
              const isDone = matches.some(m => m.from === `emoji-${globalIdx}`);
              return (
                <button 
                  key={`img-${globalIdx}`} 
                  id={`emoji-${globalIdx}`}
                  className={`btn-emoji-static ${selectedEmojiIdx === globalIdx ? 'active-border' : ''} ${isDone ? 'done-opacity' : ''}`}
                  onClick={() => !isDone && handleEmojiClick(globalIdx)}
                >
                  {item.emoji}
                </button>
              );
            })}
          </div>

          {/* Colonne des mots */}
          <div className="col-fixed">
            {shuffledWords.map((word, i) => {
              const wordId = `word-${subStep}-${i}`;
              const isDone = matches.some(m => m.to === wordId);
              return (
                <div key={wordId} className="word-row-fixed">
                  <button 
                    id={wordId} 
                    className={`btn-word-static ${isDone ? 'done-green' : ''}`}
                    onClick={() => !isDone && handleWordClick(word, wordId)}
                  >
                    {word}
                  </button>
                  <button className="btn-audio-static" onClick={() => say(word)}>🔊</button>
                </div>
              );
            })}
          </div>

          {/* Dessin des flèches avec COULEURS DIFFÉRENTES */}
          {matches
            .filter(m => {
              const idNum = parseInt(m.from.split('-')[1]);
              return idNum >= startIndex && idNum < startIndex + itemsPerGroup;
            })
            .map((m, i) => (
              <Xarrow 
                key={`arrow-${m.from}-${m.to}`} 
                start={m.from} 
                end={m.to} 
                // i % ARROW_COLORS.length permet de changer la couleur à chaque flèche
                color={ARROW_COLORS[i % ARROW_COLORS.length]} 
                strokeWidth={7} 
                path="smooth" 
                startAnchor="right" 
                endAnchor="left" 
                headSize={6}
              />
            ))
          }
        </div>
      </Xwrapper>

      {/* Zone de navigation stable */}
      <div className="nav-area-fixed">
        {matchesInCurrentGroup === currentGroup.length && (
          <button className="btn-nav-static" onClick={() => setSubStep(subStep + 1)}>
             {subStep + 1 < totalSubSteps ? "SUIVANT ➡️" : "VOIR MON SCORE 🏆"}
          </button>
        )}
      </div>

      <style>{`
        .ex1-container-stable { width: 100%; padding: 10px; }

        .matching-area-fixed {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: white;
          border-radius: 30px;
          border: 4px solid #bae6fd;
          padding: 40px 20px;
          min-height: 450px;
          position: relative;
        }

        .col-fixed { display: flex; flex-direction: column; gap: 40px; z-index: 2; }

        .btn-emoji-static {
          font-size: 3.5rem;
          width: 100px;
          height: 100px;
          border: 4px solid #e2e8f0;
          background: white;
          border-radius: 20px;
          cursor: pointer;
        }
        .active-border { border-color: #38bdf8 !important; background: #f0f9ff; }
        .done-opacity { opacity: 0.2; pointer-events: none; }

        .btn-word-static {
          padding: 18px 30px;
          border: 4px solid #7dd3fc;
          border-radius: 50px;
          background: white;
          font-size: 1.4rem;
          font-weight: 800;
          color: #0369a1;
          cursor: pointer;
          min-width: 200px;
        }
        .done-green { background: #f8fafc !important; color: #2D3748 !important; border-color: #e2e8f0 !important; pointer-events: none; }

        .word-row-fixed { display: flex; align-items: center; gap: 15px; }
        .btn-audio-static { background: none; border: none; font-size: 2rem; cursor: pointer; }

        .nav-area-fixed {
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .btn-nav-static {
          background: #22c55e;
          color: white;
          border: none;
          padding: 20px 60px;
          border-radius: 40px;
          font-size: 1.8rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 6px 0 #16a34a;
        }
      `}</style>
    </div>
  );
}