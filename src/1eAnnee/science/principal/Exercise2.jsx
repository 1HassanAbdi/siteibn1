import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';


export default function Exercise2({ data, onNext, say, student, theme }) {
  const [subStep, setSubStep] = useState(0); 
  const [dropped, setDropped] = useState({}); 
  const [shuffledLabels, setShuffledLabels] = useState([]);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const itemsPerGroup = 5;
  const startIndex = subStep * itemsPerGroup;
  const currentGroup = data.slice(startIndex, startIndex + itemsPerGroup);
  const totalSubSteps = Math.ceil(data.length / itemsPerGroup);

  useEffect(() => {
    const labels = currentGroup.map(item => item.nom);
    setShuffledLabels([...labels].sort(() => Math.random() - 0.5));
  }, [subStep]);

  const onDragStart = (e, label) => {
    e.dataTransfer.setData("text", label);
    say(label); 
  };

  const onDrop = (e, index) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("text");
    const globalIndex = startIndex + index;
    const correctLabel = data[globalIndex].nom;
    const previousLabel = dropped[globalIndex];

    // Si c'est exactement le même mot qu'avant, on ne fait rien
    if (previousLabel === label) return; 

    // 1. Ajustement du score avant de remplacer le mot
    setCorrectCount(prev => {
      let newCount = prev;
      // S'il enlève une bonne réponse pour mettre une fausse, on retire 1 point
      if (previousLabel === correctLabel && label !== correctLabel) {
        newCount -= 1;
      } 
      // S'il remplace une fausse réponse (ou une case vide) par la bonne, on ajoute 1 point
      else if (previousLabel !== correctLabel && label === correctLabel) {
        newCount += 1;
      }
      return newCount;
    });

    // 2. On met à jour la case avec le nouveau mot
    setDropped(prev => ({ ...prev, [globalIndex]: label }));

    // 3. Retour vocal
    if (label === correctLabel) {
      say("Bravo !");
    } else {
      say("Zut !");
    }
  };

  const finishExercise = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setShowResultScreen(true);
    say("Génial " + (student?.name || "") + ", tu as fini l'exercice 2 !");
    
    const payload = {
      subject: "Sciences",
      studentName: student?.name || "Inconnu",
      studentClass: student?.class || "",
      theme: theme,
      exercise: "Exercice 2",
      score: correctCount,
      total: data.length
    };
    fetch(GOOGLE_WEB_APP_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
  };

  const countInCurrentGroup = Object.keys(dropped).filter(key => 
    key >= startIndex && key < startIndex + itemsPerGroup
  ).length;

  if (showResultScreen) {
    return (
      <div className="result-popup-stable">
        <div style={{ fontSize: '6rem' }}>🌟</div>
        <h1 className="title-static">EXERCICE 2 FINI !</h1>
        <div className="score-box-static">
           SCORE : {correctCount} / {data.length}
        </div>
        <p className="status-text">Ton score est enregistré.</p>
        
        <button className="btn-final-static" onClick={() => onNext(correctCount)}>
          CONTINUER ➡️
        </button>

        <style>{`
            .result-popup-stable { 
                padding: 40px; 
                text-align: center; 
                background: #f0f9ff; 
                border-radius: 30px; 
                border: 6px solid #38bdf8;
            }
            .title-static { font-size: 3rem; color: #0369a1; margin-bottom: 20px; }
            .score-box-static { 
                font-size: 3.5rem; 
                font-weight: 900; 
                color: #0ea5e9; 
                background: white; 
                padding: 20px; 
                border-radius: 20px; 
                display: inline-block; 
                border: 4px solid #38bdf8;
            }
            .status-text { font-size: 1.3rem; color: #0369a1; margin: 20px 0; }
            .btn-final-static {
                background: #22c55e;
                color: white;
                border: none;
                padding: 25px 60px;
                border-radius: 50px;
                font-size: 2rem;
                font-weight: 900;
                cursor: pointer;
            }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ex2-container-stable">
      <h2 className="main-title">Glisse les mots sous les images</h2>
      
      {/* ZONE FIXE (Ne bouge pas quand on utilise un mot) */}
      <div className="labels-shelf-stable">
        {shuffledLabels.map((label, i) => {
          const isUsed = Object.values(dropped).includes(label);
          return (
            <div
              key={i}
              draggable={!isUsed}
              onDragStart={(e) => onDragStart(e, label)}
              className={`tag-stable ${isUsed ? 'tag-invisible' : ''}`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* GRILLE D'IMAGES STABLE */}
      <div className="grid-stable">
        {currentGroup.map((item, i) => {
          const globalIdx = startIndex + i;
          const userChoice = dropped[globalIdx];
          const isCorrect = userChoice === item.nom;

          return (
            <div 
              key={globalIdx} 
              className={`card-stable ${userChoice ? (isCorrect ? 'border-green' : 'border-red') : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, i)}
            >
              <div className="emoji-static">{item.emoji}</div>
              <div className="target-static">
                {userChoice ? userChoice : "???"}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOUTON SUIVANT FIXE */}
      <div className="nav-area-stable">
        {countInCurrentGroup === itemsPerGroup && (
          <button 
            className="btn-nav-stable" 
            onClick={() => subStep + 1 < totalSubSteps ? setSubStep(subStep + 1) : finishExercise()}
          >
            {subStep + 1 < totalSubSteps ? "SUIVANT ➡️" : "VOIR MON SCORE 🏆"}
          </button>
        )}
      </div>

      <style>{`
        .ex2-container-stable { padding: 10px; width: 100%; }

        /* Étagère à mots : Hauteur fixe pour éviter les sauts de page */
        .labels-shelf-stable {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          background: #f8fafc;
          padding: 20px;
          border-radius: 20px;
          margin-bottom: 20px;
          border: 2px solid #cbd5e1;
          min-height: 120px; /* GARDE LA ZONE OUVERTE */
          align-content: center;
        }

        .tag-stable {
          background: white;
          padding: 12px 20px;
          border-radius: 15px;
          border: 3px solid #7dd3fc;
          font-weight: 800;
          font-size: 1.2rem;
          cursor: grab;
          color: #0369a1;
        }

        /* Quand le mot est utilisé, il devient invisible mais garde sa place ou disparaît sans bouger le reste */
        .tag-invisible { visibility: hidden; pointer-events: none; }

        .grid-stable {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* 5 colonnes fixes */
          gap: 15px;
          margin-bottom: 20px;
        }

        .card-stable {
          background: white;
          border: 3px solid #e2e8f0;
          border-radius: 20px;
          padding: 15px;
          text-align: center;
        }

        .emoji-static { font-size: 3rem; margin-bottom: 10px; }

        .target-static {
          background: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          padding: 8px;
          font-weight: 800;
          font-size: 1rem;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Changements de bordure sans bouger la taille */
        .border-green { border: 4px solid #22c55e !important; background: #f0fdf4; }
        .border-red { border: 4px solid #ef4444 !important; background: #fef2f2; }

        .nav-area-stable { height: 80px; display: flex; justify-content: center; align-items: center; }

        .btn-nav-stable {
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