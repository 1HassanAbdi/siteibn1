import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';


export default function Exercise3({ data, onNext, say, student, theme }) {
  const [dropped, setDropped] = useState({}); 
  const [showResultScreen, setShowResultScreen] = useState(false);

  // Calcul du score
  const calculateScore = () => {
    let count = 0;
    data.zones.forEach((z, i) => {
      if (dropped[i] === z.attendu) count++;
    });
    return count;
  };

  const currentScore = calculateScore();

  // Sauvegarde automatique
  useEffect(() => {
    const handleTabClose = () => {
      navigator.sendBeacon(GOOGLE_WEB_APP_URL, JSON.stringify({
        studentName: student?.name || "Inconnu",
        exercise: "Exercice 3 (Abandon)",
        score: currentScore,
        total: data.zones.length
      }));
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => window.removeEventListener('beforeunload', handleTabClose);
  }, [currentScore, data.zones.length, student]);

  const onDragStart = (e, label) => {
    e.dataTransfer.setData("text", label);
    say(label); 
  };

  const onDrop = (e, index) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("text");
    setDropped(prev => ({ ...prev, [index]: label }));
    
    if (label === data.zones[index].attendu) {
      say("Bravo !");
    } else {
      say("Essaye encore");
    }
  };

  const finishExercise = () => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    setShowResultScreen(true);
    say("Génial " + (student?.name || "") + ", tu as fini !");
    
    const payload = {
      subject: "Sciences",
      studentName: student?.name || "Inconnu",
      studentClass: student?.class || "",
      theme: theme,
      exercise: "Exercice 3",
      score: currentScore,
      total: data.zones.length
    };
    fetch(GOOGLE_WEB_APP_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
  };

  const isAllFilled = Object.keys(dropped).length === data.zones.length;

  // --- BILAN FINAL HARMONISÉ (XXL STABLE) ---
  if (showResultScreen) {
    return (
      <div className="result-popup-stable">
        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>🖍️</div>
        <h1 className="title-static">SCHÉMA TERMINÉ !</h1>
        <div className="score-box-static">
           SCORE : {currentScore} / {data.zones.length}
        </div>
        <p className="status-text">Ton travail est enregistré !</p>
        
        <button className="btn-final-static pulse" onClick={() => onNext(currentScore)}>
          PASSER AU QUIZ ! ➡️
        </button>

        <style>{`
            .result-popup-stable { 
                padding: 60px 20px; 
                text-align: center; 
                background: #fdfcf0; 
                border-radius: 40px; 
                border: 8px solid #f59e0b;
                box-shadow: 0 20px 0 #fef9c3;
            }
            .title-static { font-size: 3.5rem; color: #b45309; margin-bottom: 20px; font-family: 'Fredoka', sans-serif; }
            .score-box-static { 
                font-size: 4rem; 
                font-weight: 900; 
                color: #f59e0b; 
                background: white; 
                padding: 20px 40px; 
                border-radius: 30px; 
                display: inline-block; 
                border: 6px solid #f59e0b;
            }
            .status-text { font-size: 1.5rem; color: #b45309; margin: 30px 0; font-weight: bold; }
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
    <div className="ex3-container-stable">
      <h2 className="main-title">Complète le dessin</h2>
      
      {/* ÉTAGÈRE D'ÉTIQUETTES STABLE */}
      <div className="labels-shelf-fixed">
        {data.etiquettes_a_glisser.map((nom, i) => {
          const isUsed = Object.values(dropped).includes(nom);
          return (
            <div
              key={i}
              draggable={!isUsed}
              onDragStart={(e) => onDragStart(e, nom)}
              className={`tag-static ${isUsed ? 'tag-hidden' : ''}`}
            >
              {nom}
            </div>
          );
        })}
      </div>

      {/* CADRE IMAGE AVEC ADAPTATION ÉCRAN */}
      <div className="schema-frame-stable">
        <div className="image-container-fixed">
          <img src={data.imageUrl} alt="Schéma" className="schema-img-static" />
          
          {data.zones.map((z, i) => {
            const userChoice = dropped[i];
            const isCorrect = userChoice === z.attendu;

            return (
              <div
                key={i}
                className={`drop-zone-fixed ${userChoice ? (isCorrect ? 'bg-green' : 'bg-red') : 'bg-empty'}`}
                style={{ top: z.top, left: z.left }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, i)}
              >
                {userChoice || "?"}
                {userChoice && <span className="check-icon">{isCorrect ? "✅" : "❌"}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ZONE DE NAVIGATION FIXE */}
      <div className="nav-area-fixed">
        {isAllFilled && (
          <button className="btn-nav-static-giant pulse" onClick={finishExercise}>
            VOIR MON SCORE ! 🏆
          </button>
        )}
      </div>

      <style>{`
        .ex3-container-stable { width: 100%; display: flex; flex-direction: column; align-items: center; }

        .labels-shelf-fixed {
          display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
          background: #f8fafc; padding: 15px; border-radius: 25px;
          border: 4px solid #e2e8f0; margin-bottom: 20px;
          min-height: 120px; width: 100%; align-content: center;
        }

        .tag-static {
          background: #38bdf8; color: white; padding: 10px 20px;
          border-radius: 15px; font-weight: 800; font-size: 1.1rem;
          cursor: grab; box-shadow: 0 5px 0 #0284c7;
        }
        .tag-hidden { visibility: hidden; pointer-events: none; }

        .schema-frame-stable {
          background: white; padding: 10px; border-radius: 30px;
          border: 8px solid #bae6fd; box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          max-width: 100%;
        }

        .image-container-fixed { position: relative; display: inline-block; }
        .schema-img-static { 
            max-height: 60vh; /* Taille réduite pour ne pas dépasser */
            width: auto; border-radius: 15px; display: block; 
        }

        .drop-zone-fixed {
          position: absolute;
          width: 120px; height: 40px; /* Cadre agrandi */
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-weight: 900; font-size: 0.9rem;
          transform: translate(-50%, -50%); z-index: 10; cursor: pointer;
        }

        /* Responsivité pour tablettes */
        @media (max-width: 768px) {
          .drop-zone-fixed { width: 90px; height: 32px; font-size: 0.75rem; }
          .schema-img-static { max-height: 40vh; }
        }

        .bg-empty { background: rgba(255, 255, 255, 0.9); border: 2.5px dashed #38bdf8; color: #0369a1; }
        .bg-green { background: #f0fdf4 !important; border: 3.5px solid #22c55e !important; color: #166534 !important; }
        .bg-red { background: #fef2f2 !important; border: 3.5px solid #ef4444 !important; color: #991b1b !important; }

        .check-icon { position: absolute; top: -12px; right: -12px; font-size: 1.4rem; }

        .nav-area-fixed { height: 120px; display: flex; justify-content: center; align-items: center; width: 100%; }

        .btn-nav-static-giant {
          background: #22c55e; color: white; border: none; padding: 25px 70px;
          border-radius: 50px; font-size: 2.2rem; font-weight: 900;
          cursor: pointer; box-shadow: 0 10px 0 #15803d;
        }
      `}</style>
    </div>
  );
}