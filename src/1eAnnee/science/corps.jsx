import React, { useState, useEffect } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import data from './data.json';

export default function Exercices() {
  // États pour la gestion des étapes et des scores
  const [currentStep, setCurrentStep] = useState(0); // 0 = choix du thème, 1-4 = exercices
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [stepResultVisible, setStepResultVisible] = useState(false);
  const [currentStepScore, setCurrentStepScore] = useState(0);
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [showFeedback, setShowFeedback] = useState(false);

  // États pour le login et l'envoi des résultats
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  // URL de ton Google Apps Script
  const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx9frw7CkCLz-TQ5hEFBlZ0XC676_-KpC1kpgdfEkyZ471ywi3uZ5f7jjfaxy1Jm43w4w/exec";

  // États pour chaque exercice
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedEmojiIdx, setSelectedEmojiIdx] = useState(null);
  const [droppedEx2, setDroppedEx2] = useState({});
  const [droppedImage, setDroppedImage] = useState({});
  const [mcqAnswers, setMcqAnswers] = useState({});

  // États pour mélanger les mots (Ex 1 et 2)
  const [shuffledMotsEx1, setShuffledMotsEx1] = useState([]);
  const [shuffledMotsEx2, setShuffledMotsEx2] = useState([]);

  // Récupère les données du thème sélectionné
  const currentThemeData = selectedTheme ? data.themes.find(t => t.theme === selectedTheme) : null;

  // Fonction pour mélanger un tableau
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialise les mots mélangés pour les exercices 1 et 2
  useEffect(() => {
    if (currentThemeData) {
      setShuffledMotsEx1(shuffleArray(currentThemeData.exercice1_appariement.map(d => d.nom)));
      setShuffledMotsEx2(shuffleArray(currentThemeData.exercice2_glisser_deposer.map(d => d.nom)));
    }
  }, [currentThemeData]);

  // Fonction pour lire un texte à voix haute
  const playAudio = (texte) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance();
      msg.text = texte;
      msg.lang = 'fr-FR';
      window.speechSynthesis.speak(msg);
    } else {
      alert("Désolé, ton navigateur ne supporte pas la lecture audio.");
    }
  };

  // Gestion du glisser-déposer
  const handleDragStart = (e, texte) => {
    if (showFeedback) return;
    e.dataTransfer.setData("text/plain", texte);
  };

  const allowDrop = (e) => e.preventDefault();

  // Calcule le score maximal pour un exercice donné
  const getMaxScoreForStep = (step) => {
    if (!currentThemeData) return 0;
    if (step === 1) return currentThemeData.exercice1_appariement.length;
    if (step === 2) return currentThemeData.exercice2_glisser_deposer.length;
    if (step === 3) return currentThemeData.exercice3_schema.zones.length;
    if (step === 4) return currentThemeData.exercice4_qcm.length;
    return 0;
  };

  // Valide les réponses de l'exercice en cours
  const handleValidate = () => {
    if (!currentThemeData) return;
    let stepScore = 0;

    if (currentStep === 1) {
      matchedPairs.forEach(p => {
        if (currentThemeData.exercice1_appariement[p.imgIdx].nom === p.wordNom) stepScore++;
      });
    } else if (currentStep === 2) {
      currentThemeData.exercice2_glisser_deposer.forEach((item, idx) => {
        if (droppedEx2[idx] === item.nom) stepScore++;
      });
    } else if (currentStep === 3) {
      currentThemeData.exercice3_schema.zones.forEach((z, idx) => {
        if (droppedImage[idx] === z.attendu) stepScore++;
      });
    } else if (currentStep === 4) {
      currentThemeData.exercice4_qcm.forEach((q, idx) => {
        if (mcqAnswers[idx] === q.reponse) stepScore++;
      });
    }

    setCurrentStepScore(stepScore);
    setShowFeedback(true);
    setStepResultVisible(true);
  };

  // Recommence l'exercice en cours
  const handleRetry = () => {
    setShowFeedback(false);
    setStepResultVisible(false);

    if (currentStep === 1) {
      setMatchedPairs([]);
      setSelectedEmojiIdx(null);
      if (currentThemeData) {
        setShuffledMotsEx1(shuffleArray(currentThemeData.exercice1_appariement.map(d => d.nom)));
      }
    } else if (currentStep === 2) {
      setDroppedEx2({});
      if (currentThemeData) {
        setShuffledMotsEx2(shuffleArray(currentThemeData.exercice2_glisser_deposer.map(d => d.nom)));
      }
    } else if (currentStep === 3) {
      setDroppedImage({});
    } else if (currentStep === 4) {
      setMcqAnswers({});
    }
  };

  // Passe à l'exercice suivant
  const handleNextStep = () => {
    setScores(prev => ({ ...prev, [currentStep]: currentStepScore }));
    window.speechSynthesis.cancel();
    setShowFeedback(false);
    setStepResultVisible(false);
    setCurrentStep(prev => prev + 1);
  };

  // Démarre les exercices après le choix du thème
  const handleStartExercices = (theme) => {
    setSelectedTheme(theme);
    setCurrentStep(1);
  };

  // Fonction pour revenir à l'étape précédente
  const handleBack = () => {
    if (currentStep > 0) {
      if (currentStep <= 4) {
        // Retour au choix du thème
        setCurrentStep(0);
        setSelectedTheme(null);
        // Réinitialise les états des exercices
        setMatchedPairs([]);
        setSelectedEmojiIdx(null);
        setDroppedEx2({});
        setDroppedImage({});
        setMcqAnswers({});
        setShowFeedback(false);
        setStepResultVisible(false);
      }
    } else if (currentStep === 0) {
      // Retour au login
      setIsLoggedIn(false);
    }
  };

  // Rendu du formulaire de login
  const renderLogin = () => (
    <div className="exercice-container pop-in" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>👋</div>
      <h2>Bienvenue !</h2>
      <p className="subtitle">Identifie-toi avant de commencer les exercices de Sciences.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Ton prénom et nom"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{ padding: '15px', borderRadius: '10px', border: '2px solid #CBD5E0', fontSize: '1.1rem' }}
        />
        <input
          type="text"
          placeholder="Ta classe (ex: CP, CE1...)"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          style={{ padding: '15px', borderRadius: '10px', border: '2px solid #CBD5E0', fontSize: '1.1rem' }}
        />
        <button
          onClick={() => {
            if (studentName.trim() !== "" && studentClass.trim() !== "") {
              setIsLoggedIn(true);
            } else {
              alert("Merci de remplir ton nom et ta classe !");
            }
          }}
          className="primary-btn"
        >
          C'est parti ! 🚀
        </button>
      </div>
    </div>
  );

  // Rendu du choix du thème
  const renderThemeChoice = () => (
    <div className="exercice-container pop-in" style={{ textAlign: 'center' }}>
      {/* Bouton Retour vers le login */}
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <button
          onClick={handleBack}
          style={{
            background: '#FFF',
            border: '2px solid #CBD5E0',
            borderRadius: '10px',
            padding: '8px 15px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginLeft: '20px'
          }}
        >
          ⬅️ Changer de nom
        </button>
      </div>

      <h2>🎯 Choisis un thème</h2>
      <p className="subtitle">Quel sujet veux-tu étudier aujourd'hui ?</p>

      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
        {data.themes.map((theme, index) => (
          <div
            key={`theme-${index}`}
            onClick={() => handleStartExercices(theme.theme)}
            className="theme-card"
            style={{
              background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
              borderRadius: '20px',
              padding: '30px',
              width: '250px',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              border: '3px solid #E2E8F0'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = '#A0C4FF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
           <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
  {theme.emoji}
</div>
            <h3 style={{ color: '#667EEA', fontSize: '1.5rem', margin: 0 }}>{theme.theme}</h3>
          </div>
        ))}
      </div>
    </div>
  );

  // Rendu de l'exercice 1 (appariement)
  const renderExercice1 = () => {
    if (!currentThemeData) return null;
    const couleursArcEnCiel = ['#FF3B30', '#007AFF', '#4CD964', '#FF9500', '#5856D6', '#FF2D55', '#5AC8FA', '#FFCC00'];

    return (
      <div className="exercice-container pop-in">
        {/* Bouton Retour */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              background: '#FFF',
              border: '2px solid #CBD5E0',
              borderRadius: '10px',
              padding: '8px 15px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '20px'
            }}
          >
            ⬅️ Retour au thème
          </button>
        </div>

        <h2>🎯 Exercice 1 : Relie l'image au bon mot</h2>
        <p className="subtitle">Clique sur un dessin, puis sur le mot qui correspond.</p>

        <Xwrapper>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '20px 60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
              {currentThemeData.exercice1_appariement.map((m, idx) => (
                <button
                  key={`emoji-${idx}`}
                  id={`emoji-${idx}`}
                  className="game-btn emoji-btn"
                  onClick={() => !showFeedback && setSelectedEmojiIdx(idx)}
                  style={{
                    borderColor: selectedEmojiIdx === idx ? '#FF9A9E' : '#E2E8F0',
                    backgroundColor: selectedEmojiIdx === idx ? '#FFF0F2' : '#FFF',
                    transform: selectedEmojiIdx === idx ? 'scale(1.1)' : 'none',
                    boxShadow: selectedEmojiIdx === idx ? '0 0 15px rgba(255, 154, 158, 0.6)' : '0 4px 0 #CBD5E0',
                    zIndex: 10
                  }}>
                  {m.emoji}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
              {shuffledMotsEx1.map((mot, idx) => (
                <button
                  key={`word-${idx}`}
                  id={`word-${idx}`}
                  className="game-btn word-btn"
                  onClick={() => {
                    if (!showFeedback && selectedEmojiIdx !== null) {
                      const newPairs = matchedPairs.filter(p => p.imgIdx !== selectedEmojiIdx);
                      setMatchedPairs([...newPairs, { imgIdx: selectedEmojiIdx, wordNom: mot, wordId: `word-${idx}` }]);
                      setSelectedEmojiIdx(null);
                    }
                  }}
                  style={{ zIndex: 10 }}>
                  {mot}
                </button>
              ))}
            </div>

            {matchedPairs.map((p, i) => {
              const isCorrect = currentThemeData.exercice1_appariement[p.imgIdx].nom === p.wordNom;
              const lineColor = showFeedback ? (isCorrect ? '#48BB78' : '#F56565') : couleursArcEnCiel[i % couleursArcEnCiel.length];

              return (
                <Xarrow
                  key={i}
                  start={`emoji-${p.imgIdx}`}
                  end={p.wordId}
                  color={lineColor}
                  strokeWidth={6}
                  path="straight"
                  showHead={true}
                  headSize={6}
                  startAnchor="right"
                  endAnchor="left"
                  passProps={{ style: { zIndex: 1, opacity: 0.8 } }}
                />
              );
            })}
          </div>
        </Xwrapper>
      </div>
    );
  };

  // Rendu de l'exercice 2 (glisser-déposer)
  const renderExercice2 = () => {
    if (!currentThemeData) return null;
    const motsDejaPlaces = Object.values(droppedEx2);

    return (
      <div className="exercice-container pop-in">
        {/* Bouton Retour */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              background: '#FFF',
              border: '2px solid #CBD5E0',
              borderRadius: '10px',
              padding: '8px 15px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '20px'
            }}
          >
            ⬅️ Retour au thème
          </button>
        </div>

        <h2>🧩 Exercice 2 : Glisse les mots</h2>
        <p className="subtitle">Prends l'étiquette et pose-la dans la bonne case.</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {shuffledMotsEx2.map((mot, idx) => {
            const estUtilise = motsDejaPlaces.includes(mot);

            return (
              <div
                key={`drag-ex2-${idx}`}
                draggable={!estUtilise}
                onDragStart={(e) => !estUtilise && handleDragStart(e, mot)}
                className={`drag-item ${estUtilise ? 'used-item' : ''}`}
              >
                {mot} {estUtilise && "✔️"}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {currentThemeData.exercice2_glisser_deposer.map((item, idx) => {
            let bgColor = '#F8FAFC';
            let borderColor = '#CBD5E0';
            if (showFeedback) {
              const isCorrect = droppedEx2[idx] === item.nom;
              bgColor = isCorrect ? '#F0FFF4' : '#FFF5F5';
              borderColor = isCorrect ? '#48BB78' : '#F56565';
            }

            return (
              <div
                key={`drop-ex2-${idx}`}
                onDrop={(e) => {
                  e.preventDefault();
                  if(!showFeedback) {
                    const droppedText = e.dataTransfer.getData("text/plain");
                    setDroppedEx2(prev => ({ ...prev, [idx]: droppedText }));
                  }
                }}
                onDragOver={allowDrop}
                className="drop-zone"
                style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                <span style={{fontSize: '3rem', filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))'}}>{item.emoji}</span>
                <div className="dropped-text">{droppedEx2[idx] || "Déposer ici"}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Rendu de l'exercice 3 (schéma à compléter)
  const renderExercice3 = () => {
    if (!currentThemeData) return null;
    const motsDejaPlaces = Object.values(droppedImage);

    return (
      <div className="exercice-container pop-in">
        {/* Bouton Retour */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              background: '#FFF',
              border: '2px solid #CBD5E0',
              borderRadius: '10px',
              padding: '8px 15px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '20px'
            }}
          >
            ⬅️ Retour au thème
          </button>
        </div>

        <h2>🖍️ Exercice 3 : Complète le schéma</h2>
        <p className="subtitle">Glisse les mots pour identifier toutes les parties.</p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0px' }}>
          {currentThemeData.exercice3_schema.etiquettes_a_glisser.map((nom, idx) => {
            const estUtilise = motsDejaPlaces.includes(nom);

            return (
              <div
                key={`drag-ex3-${idx}`}
                draggable={!estUtilise}
                onDragStart={(e) => !estUtilise && handleDragStart(e, nom)}
                className={`drag-item ${estUtilise ? 'used-item' : ''}`}
              >
                {nom} {estUtilise && "✔️"}
              </div>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
          <img
            src={currentThemeData.exercice3_schema.imageUrl}
            alt={currentThemeData.exercice3_schema.altText}
            style={{ width: '100%', borderRadius: '20px', border: '4px solid #FFF' }}
          />

          {currentThemeData.exercice3_schema.zones.map((z, idx) => {
            let borderColor = '#90CDF4';
            let bgColor = 'rgba(255, 255, 255, 0.95)';
            if (showFeedback) {
              const isCorrect = droppedImage[idx] === z.attendu;
              borderColor = isCorrect ? '#48BB78' : '#F56565';
              bgColor = isCorrect ? '#F0FFF4' : '#FFF5F5';
            }

            return (
              <div
                key={`drop-ex3-${idx}`}
                onDrop={(e) => {
                  e.preventDefault();
                  if(!showFeedback) {
                    const droppedText = e.dataTransfer.getData("text/plain");
                    setDroppedImage(prev => ({ ...prev, [idx]: droppedText }));
                  }
                }}
                onDragOver={allowDrop}
                className="schema-drop-zone"
                style={{ top: z.top, left: z.left, backgroundColor: bgColor, borderColor: borderColor }}>
                {droppedImage[idx] || "..."}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Rendu de l'exercice 4 (QCM)
  const renderExercice4 = () => {
    if (!currentThemeData) return null;

    return (
      <div className="exercice-container pop-in">
        {/* Bouton Retour */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              background: '#FFF',
              border: '2px solid #CBD5E0',
              borderRadius: '10px',
              padding: '8px 15px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '20px'
            }}
          >
            ⬅️ Retour au thème
          </button>
        </div>

        <h2>🤔 Exercice 4 : À quoi ça sert ?</h2>
        <p className="subtitle">Écoute la question et choisis la bonne réponse.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {currentThemeData.exercice4_qcm.map((q, idx) => (
            <div key={`qcm-${idx}`} className="mcq-card">
              <div className="mcq-emoji">{q.emoji}</div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '15px 0' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#2D3748', margin: 0 }}>{q.question}</h3>
                <button
                  onClick={() => playAudio(q.question)}
                  className="audio-btn"
                  title="Écouter la question">
                  🔊
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {q.options.map((opt, optIdx) => {
                  let btnClass = "mcq-btn";
                  const isSelected = mcqAnswers[idx] === opt;

                  if (showFeedback) {
                    if (opt === q.reponse) { btnClass += " mcq-correct"; }
                    else if (isSelected) { btnClass += " mcq-wrong"; }
                  } else if (isSelected) {
                    btnClass += " mcq-selected";
                  }

                  return (
                    <button
                      key={`opt-${idx}-${optIdx}`}
                      onClick={() => !showFeedback && setMcqAnswers({ ...mcqAnswers, [idx]: opt })}
                      className={btnClass}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Envoie les résultats à Google Apps Script
  const sendResultsToGoogle = async (totalScoreFinal, maxScore) => {
    if (hasSent || !currentThemeData) return;
    setIsSending(true);

    const payload = {
      subject: "Sciences",
      story: currentThemeData.theme,
      studentName: studentName,
      studentClass: studentClass,
      score: totalScoreFinal,
      total: maxScore,
      scoresDetails: scores
    };

    try {
      await fetch(GOOGLE_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("✅ Tes résultats ont été envoyés au professeur avec succès !");
      setHasSent(true);
    } catch (error) {
      alert("❌ Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSending(false);
    }
  };

  // Affiche les résultats finaux
  const renderResultats = () => {
    if (!currentThemeData) return null;
    const totalScoreFinal = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = getMaxScoreForStep(1) + getMaxScoreForStep(2) + getMaxScoreForStep(3) + getMaxScoreForStep(4);
    const percentage = (totalScoreFinal / maxScore) * 100;

    let message = "Bien joué ! 👍";
    let emoji = "👏";
    if (percentage === 100) { message = "INCROYABLE !"; emoji = "🏆✨"; }
    else if (percentage >= 70) { message = "Super travail !"; emoji = "🌟"; }

    return (
      <div className="exercice-container pop-in" style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
        <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>{emoji}</div>
        <h2 style={{ fontSize: '3rem', color: '#FF416C', textTransform: 'uppercase' }}>Bilan final</h2>
        <h3 style={{ fontSize: '1.5rem', color: '#4A5568' }}>{message}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
           <p>Exercice 1 : <strong>{scores[1]} / {getMaxScoreForStep(1)}</strong></p>
           <p>Exercice 2 : <strong>{scores[2]} / {getMaxScoreForStep(2)}</strong></p>
           <p>Exercice 3 : <strong>{scores[3]} / {getMaxScoreForStep(3)}</strong></p>
           <p>Exercice 4 : <strong>{scores[4]} / {getMaxScoreForStep(4)}</strong></p>
        </div>

        <div className="score-display">
          Score Total : <span style={{color: '#4A90E2'}}>{totalScoreFinal}</span> / {maxScore}
        </div>
        <br/>

        <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap'}}>
          <button
            onClick={() => sendResultsToGoogle(totalScoreFinal, maxScore)}
            className={`primary-btn ${!hasSent ? "pulse-btn" : ""}`}
            disabled={isSending || hasSent}
            style={{
              backgroundColor: hasSent ? '#A0AEC0' : '#48BB78',
              cursor: hasSent ? 'not-allowed' : 'pointer'
            }}
          >
            {isSending ? "Envoi en cours..." : hasSent ? "✅ Score envoyé" : "📤 Envoyer mon score"}
          </button>

          <button onClick={() => window.location.reload()} className="secondary-btn">
            🔄 Recommencer
          </button>

          {/* Bouton Retour vers le choix du thème */}
          <button
            onClick={handleBack}
            className="secondary-btn"
            style={{ backgroundColor: '#FFF', color: '#4A5568' }}
          >
            ⬅️ Changer de thème
          </button>
        </div>
      </div>
    );
  };

  // Rendu principal
  return (
    <div className="app-main-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');

        .app-main-container {
          font-family: 'Nunito', sans-serif;
          max-width: 950px;
          margin: 40px auto;
          padding: 30px;
          background: linear-gradient(135deg, #291b48 0%, #fbc2eb 100%);
          border-radius: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          min-height: 80vh;
        }

        h2 { font-family: 'Fredoka One', cursive; color: #667EEA; letter-spacing: 1px; font-size: 2.2rem; margin-bottom: 5px; text-shadow: 2px 2px 0px #FFF; text-align: center; }
        .subtitle { color: #4A5568; font-size: 1.2rem; font-weight: 700; text-align: center; margin-bottom: 30px; }

        .progress-container { background: rgba(255, 255, 255, 0.6); padding: 15px 25px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); backdrop-filter: blur(5px); }
        .progress-bg { width: 75%; height: 16px; background: #FFF; border-radius: 20px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); border: 2px solid #E2E8F0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); border-radius: 20px; transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        .exercice-container { background: #FFFFFF; padding: 40px; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 4px solid #FFF; margin-bottom: 30px; }

        .game-btn { font-family: inherit; font-size: 1.2rem; font-weight: 800; border-radius: 16px; cursor: pointer; transition: all 0.2s; background: #FFF; border: 3px solid #E2E8F0; color: #2D3748; box-shadow: 0 4px 0 #CBD5E0; }
        .game-btn:hover { transform: translateY(-3px); box-shadow: 0 7px 0 #CBD5E0; }
        .game-btn:active { transform: translateY(2px); box-shadow: 0 0px 0 #CBD5E0; }
        .emoji-btn { padding: 15px 25px; font-size: 2.5rem; }
        .word-btn { padding: 15px 20px; min-width: 180px; }

        .drag-item { padding: 12px 20px; background: linear-gradient(to bottom, #FFF, #F7FAFC); color: #4A90E2; border: 3px solid #90CDF4; border-radius: 15px; cursor: grab; font-weight: 800; font-size: 1.1rem; box-shadow: 0 4px 0 #90CDF4; transition: transform 0.2s; user-select: none; }
        .drag-item:hover { transform: scale(1.08) rotate(-3deg); }
        .drag-item:active { cursor: grabbing; transform: scale(0.95); box-shadow: 0 0 0 #90CDF4; }

        .used-item { opacity: 0.5; cursor: default !important; background: #EDF2F7 !important; border-color: #CBD5E0 !important; color: #718096 !important; transform: none !important; box-shadow: none !important; }

        .drop-zone { width: 130px; height: 130px; border: 4px dashed; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.3s; position: relative; overflow: hidden; }
        .dropped-text { font-size: 1rem; font-weight: 800; color: #2D3748; margin-top: 5px; padding: 4px 10px; background: rgba(255,255,255,0.85); border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

        .schema-drop-zone { position: absolute; width: 26%; height: 10%; min-height: 42px; border: 3px solid; border-radius: 12px; font-size: 0.95rem; font-weight: 800; color: #2D3748; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: all 0.3s; background-color: rgba(255, 255, 255, 0.95); }

        .mcq-card { background: #FFF; border: 3px solid #EDF2F7; padding: 25px; border-radius: 20px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s; }
        .mcq-card:hover { transform: translateY(-5px); border-color: #A0C4FF; }
        .mcq-emoji { font-size: 3.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); animation: float 3s ease-in-out infinite; }

        .mcq-btn { font-family: inherit; font-weight: 700; padding: 12px 20px; border-radius: 12px; font-size: 1.1rem; cursor: pointer; border: 2px solid #E2E8F0; background: #F7FAFC; color: #4A5568; transition: all 0.2s; }
        .mcq-btn:hover { background: #EBF8FF; border-color: #63B3ED; transform: scale(1.05); }
        .mcq-selected { background: #EBF8FF; border-color: #4A90E2; color: #2B6CB0; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3); }
        .mcq-correct { background: #F0FFF4 !important; border-color: #48BB78 !important; color: #22543D !important; animation: pulseGreen 0.5s; }
        .mcq-wrong { background: #FFF5F5 !important; border-color: #F56565 !important; color: #742A2A !important; animation: shake 0.4s; }

        .audio-btn { background: #EBF8FF; border: 2px solid #90CDF4; border-radius: 50%; width: 45px; height: 45px; font-size: 1.2rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .audio-btn:hover { transform: scale(1.1) rotate(-10deg); background: #BEE3F8; border-color: #63B3ED; }
        .audio-btn:active { transform: scale(0.95); }

        .primary-btn { padding: 18px 40px; font-size: 1.3rem; font-family: inherit; background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: #FFF; border: none; border-radius: 50px; cursor: pointer; font-weight: 900; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px; }
        .primary-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5); }
        .primary-btn:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3); }
        .primary-btn:disabled { background: #CBD5E0; cursor: not-allowed; box-shadow: none; transform: none; }

        .secondary-btn { padding: 18px 30px; font-size: 1.1rem; font-family: inherit; background: #FFF; color: #4A5568; border: 3px solid #CBD5E0; border-radius: 50px; cursor: pointer; font-weight: 800; transition: all 0.2s; text-transform: uppercase; }
        .secondary-btn:hover { border-color: #A0C4FF; color: #4A90E2; background: #F7FAFC; transform: translateY(-2px); }

        .step-result-panel { background: #FFF; border: 4px dashed #48BB78; border-radius: 20px; padding: 30px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-top: 20px; }
        .step-score-text { font-size: 1.8rem; color: #2D3748; font-weight: 900; margin-bottom: 25px; }

        .score-display { font-size: 2.5rem; font-weight: 900; color: #2D3748; background: #FFF; border: 4px dashed #667EEA; padding: 20px 40px; border-radius: 25px; display: inline-block; margin: 20px 0; }

        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .pop-in { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-20px); } 60% { transform: translateY(-10px); } }
        @keyframes pulseGreen { 0% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 0 15px #48BB78; } 100% { transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .pulse-btn { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(102, 126, 234, 0); } 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); } }
      `}</style>

      {!isLoggedIn ? (
        renderLogin()
      ) : currentStep === 0 ? (
        renderThemeChoice()
      ) : currentThemeData ? (
        <>
          {currentStep <= 4 && (
            <div className="progress-container pop-in" style={{animationDelay: '0.1s'}}>
              <div style={{ fontWeight: '800', color: '#4A5568', fontSize: '1.2rem' }}>Étape {currentStep} / 4</div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
              </div>
            </div>
          )}

          {currentStep === 1 && renderExercice1()}
          {currentStep === 2 && renderExercice2()}
          {currentStep === 3 && renderExercice3()}
          {currentStep === 4 && renderExercice4()}
          {currentStep > 4 && renderResultats()}

          {currentStep <= 4 && (
            <div className="pop-in" style={{animationDelay: '0.2s', textAlign: 'center'}}>
              {!stepResultVisible ? (
                <button onClick={handleValidate} className="primary-btn">
                  Valider l'exercice ✨
                </button>
              ) : (
                <div className="step-result-panel pop-in">
                  <div className="step-score-text">
                    Score de cet exercice : <span style={{color: '#48BB78'}}>{currentStepScore}</span> / {getMaxScoreForStep(currentStep)}
                  </div>
                  <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
                    <button onClick={handleRetry} className="secondary-btn">
                      🔄 Recommencer
                    </button>
                    <button onClick={handleNextStep} className="primary-btn">
                      ➡️ Exercice suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}