import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// URL pour la sauvegarde (à remplacer par ton lien Google Apps Script réel)

export default function Exercise4({ data, onNext, say, student, theme }) {
  const [currentIdx, setCurrentIdx] = useState(0); 
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const q = data[currentIdx];

  // --- SAUVEGARDE DE SÉCURITÉ SI FERMETURE ---
  useEffect(() => {
    const handleTabClose = () => {
      const payload = JSON.stringify({
        studentName: student?.name || "Inconnu",
        exercise: "Exercice 4 (Abandon)",
        score: score,
        total: data.length
      });
      navigator.sendBeacon(GOOGLE_WEB_APP_URL, payload);
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => window.removeEventListener('beforeunload', handleTabClose);
  }, [score, data.length, student]);

  // Gestion du choix
  const handleChoice = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);

    if (opt === q.reponse) {
      setScore(prev => prev + 1);
      say("Bravo !");
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
      say("Mince, c'était " + q.reponse);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < data.length) {
      setCurrentIdx(currentIdx + 1);
      setShowFeedback(false);
      setSelectedOpt(null);
    } else {
      finishExercise();
    }
  };

  const finishExercise = () => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    setIsFinished(true);
    say("Génial " + (student?.name || "") + ", tu as fini tous les exercices !");
    
    // Sauvegarde finale
    const payload = {
      subject: "Sciences",
      studentName: student?.name || "Inconnu",
      studentClass: student?.class || "",
      theme: theme,
      exercise: "Exercice 4",
      score: score,
      total: data.length
    };
    fetch(GOOGLE_WEB_APP_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
  };

  // --- ÉCRAN DE BILAN HARMONISÉ (XXL) ---
  if (isFinished) {
    return (
      <div className="result-popup-stable">
        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>🏆</div>
        <h1 className="title-static">QUIZ TERMINÉ !</h1>
        <div className="score-box-static">
           SCORE : {score} / {data.length}
        </div>
        <p className="status-text">Félicitations, tu as fini ta mission !</p>
        
        <button className="btn-final-static pulse" onClick={() => onNext(score)}>
          VOIR MON BILAN FINAL ! ➡️
        </button>

        <style>{`
            .result-popup-stable { 
                padding: 60px 20px; 
                text-align: center; 
                background: #f0fdf4; 
                border-radius: 40px; 
                border: 8px solid #22c55e;
                box-shadow: 0 20px 0 #dcfce7;
            }
            .title-static { font-size: 3.5rem; color: #166534; margin-bottom: 20px; font-family: 'Fredoka', sans-serif; }
            .score-box-static { 
                font-size: 4rem; 
                font-weight: 900; 
                color: #22c55e; 
                background: white; 
                padding: 20px 40px; 
                border-radius: 30px; 
                display: inline-block; 
                border: 6px solid #22c55e;
            }
            .status-text { font-size: 1.5rem; color: #166534; margin: 30px 0; font-weight: bold; }
            .btn-final-static {
                background: #22c55e;
                color: white;
                border: none;
                padding: 30px 80px;
                border-radius: 60px;
                font-size: 2.5rem;
                font-weight: 900;
                cursor: pointer;
                box-shadow: 0 10px 0 #15803d;
            }
            .pulse { animation: pulse-animation 1.5s infinite; }
            @keyframes pulse-animation { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ex4-container-fixed">
      <div className="quiz-header-fixed">
        <span>Question {currentIdx + 1} / {data.length}</span>
      </div>

      <div className="quiz-card-fixed">
        <div className="q-emoji-fixed">{q.emoji}</div>
        
        <button className="btn-audio-giant" onClick={() => say(q.question)}>
          🔊 ÉCOUTER LA QUESTION
        </button>
        
        <h2 className="question-text-fixed">{q.question}</h2>

        <div className="options-grid-fixed">
          {q.options.map((opt, i) => {
            let stateClass = "";
            if (showFeedback) {
              if (opt === q.reponse) stateClass = "is-correct";
              else if (opt === selectedOpt) stateClass = "is-wrong";
              else stateClass = "is-disabled";
            }

            return (
              <button
                key={i}
                className={`opt-btn-static ${stateClass} ${selectedOpt === opt ? 'is-selected' : ''}`}
                onClick={() => handleChoice(opt)}
                disabled={showFeedback}
              >
                {opt}
                {showFeedback && opt === q.reponse && <span className="icon-feedback">✅</span>}
                {showFeedback && opt === selectedOpt && opt !== q.reponse && <span className="icon-feedback">❌</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ZONE DE NAVIGATION STABLE */}
      <div className="nav-area-fixed">
        {showFeedback && (
          <button className="btn-nav-giant pulse" onClick={handleNextQuestion}>
            {currentIdx + 1 < data.length ? "QUESTION SUIVANTE ➡️" : "TERMINER LE QUIZ ! 🏆"}
          </button>
        )}
      </div>

      <style>{`
        .ex4-container-fixed { width: 90%; max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        
        .quiz-header-fixed { font-weight: 900; color: #64748b; font-size: 1.2rem; margin-bottom: 10px; }

        .quiz-card-fixed {
          background: white;
          width: 100%;
          padding: 10px;
          border-radius: 40px;
          border: 5px solid #bae6fd;
          text-align: center;
          min-height: 500px; /* GARDE L'ÉCRAN FIXE */
        }

        .q-emoji-fixed { font-size: 5rem; margin-bottom: 20px; }

        .btn-audio-giant {
          background: #f0f9ff;
          border: 3px solid #38bdf8;
          color: #0369a1;
          padding: 12px 30px;
          border-radius: 20px;
          font-size: 1.2rem;
          font-weight: 900;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .question-text-fixed { font-size: 1.8rem; color: #1e293b; margin-bottom: 30px; line-height: 1.3; }

        .options-grid-fixed { display: flex; flex-direction: column; gap: 10px; }

        .opt-btn-static {
          padding: 20px;
          border: 4px solid #e2e8f0;
          border-radius: 25px;
          font-size: 1.5rem;
          font-weight: 800;
          background: white;
          color: #334155;
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s;
        }

        .is-selected { border-color: #38bdf8; background: #f0f9ff; }
        .is-correct { background: #dcfce7 !important; border-color: #22c55e !important; color: #166534 !important; }
        .is-wrong { background: #fee2e2 !important; border-color: #ef4444 !important; color: #991b1b !important; }
        .is-disabled { opacity: 0.5; }

        .icon-feedback { position: absolute; right: 25px; font-size: 2rem; }

        .nav-area-fixed { height: 120px; display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 20px; }

        .btn-nav-giant {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 20px 40px;
          border-radius: 50px;
          font-size: 2rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 0 #1d4ed8;
        }
      `}</style>
    </div>
  );
}