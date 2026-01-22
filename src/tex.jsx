import React, { useState, useEffect, useMemo, useRef } from 'react';
import gameData from './data.json';

const AppLectureDuo = () => {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const audioRef = useRef(null);

  // Regroupement des morceaux du JSON en phrases pour l'audio
  const sentences = useMemo(() => {
    const fullText = gameData.story.map(p => p.s).join("");
    // On sépare par les points, points d'interrogation ou d'exclamation
    const rawLines = fullText.split(/(?<=[.!?])\s+/);
    
    // On associe chaque phrase à son fichier audio correspondant
    return rawLines.map((text, index) => ({
      text: text,
      audio: `sentence-${index + 1}.mp3`
    }));
  }, []);

  const playAudio = (fileName) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${fileName}`);
    audioRef.current = audio;
    audio.play().catch(e => console.log("Fichier audio manquant :", fileName));
  };

  const currentSection = gameData.sections[currentSectionIdx];
  const currentQuestion = currentSection?.questions[currentQuestionIdx];

  const handleAnswer = (ans) => {
    if (locked) return;
    setLocked(true);
    setResponses(prev => ({ ...prev, [currentQuestion.id]: ans }));

    setTimeout(() => {
      if (currentQuestionIdx < currentSection.questions.length - 1) {
        setCurrentQuestionIdx(i => i + 1);
      } else if (currentSectionIdx < gameData.sections.length - 1) {
        setCurrentSectionIdx(i => i + 1);
        setCurrentQuestionIdx(0);
      } else {
        setFinished(true);
      }
      setLocked(false);
    }, 500);
  };

  if (finished) {
    return (
      <div style={styles.container}>
        <div style={styles.mainCard}>
          <h1 style={{fontSize: '3rem', color: '#6B8E23'}}>Mission Accomplie ! 🧺</h1>
          <div style={styles.bigScore}>{Object.values(responses).filter((r, i) => r === gameData.sections.flatMap(s=>s.questions)[i]?.a).length} / 20</div>
          <button onClick={() => window.location.reload()} style={styles.restartBtn}>Rejouer l'aventure</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>{gameData.title}</h2>
          <div style={styles.progressionBar}>
            <div style={{ ...styles.fill, width: `${(Object.keys(responses).length / 20) * 100}%` }} />
          </div>
        </div>

        <div style={styles.layout}>
          {/* GAUCHE : HISTOIRE AVEC SYLLABES ET AUDIO */}
          <div style={styles.textColumn}>
            <div style={styles.instruction}>Clique sur le 🎙️ pour écouter</div>
            <div style={styles.storyContainer}>
              {/* Affichage du texte avec les couleurs du JSON */}
              <div style={styles.coloredFullText}>
                <button style={styles.microBtn}>🎙️</button>
                {gameData.story.map((part, i) => (
                  <span key={i} style={{ color: part.c || 'black', fontWeight: part.c ? 'bold' : 'normal' }}>
                    {part.s}
                  </span>
                ))}
              </div>
              
              <hr style={styles.divider} />

             
            </div>
          </div>

          {/* DROITE : QUESTIONS */}
          <div style={{ ...styles.questionColumn, borderColor: currentSection?.color }}>
            <div style={{ ...styles.tag, backgroundColor: currentSection?.color }}>
              {currentSection?.name}
            </div>

            <div style={styles.qBox}>
              <h3 style={styles.questionText}>{currentQuestion?.q}</h3>
            </div>

            <div style={styles.buttonGrid}>
              {(currentQuestion?.options || ["Vrai", "Faux"]).map((opt, i) => (
                <button
                  key={i}
                  disabled={locked}
                  onClick={() => handleAnswer(opt)}
                  style={{ ...styles.answerBtn, backgroundColor: currentSection?.color }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', width: '100vw', backgroundColor: '#DCD7C9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Verdana, sans-serif', overflow: 'hidden' },
  mainCard: { width: '96%', maxWidth: '1100px', height: '92vh', backgroundColor: '#FAF9F6', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  header: { marginBottom: '10px' },
  title: { fontSize: '1.4rem', color: '#2D3748', textAlign: 'center', margin: '0 0 10px 0' },
  progressionBar: { height: '10px', backgroundColor: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#8FBC8F', transition: 'width 0.4s ease' },
  layout: { display: 'flex', flex: 1, gap: '15px', minHeight: 0 },

  textColumn: { flex: 1.2, backgroundColor: '#F5F5DC', borderRadius: '20px', padding: '15px', border: '2px solid #E9E4D4', display: 'flex', flexDirection: 'column' },
  instruction: { fontSize: '0.8rem', color: '#718096', marginBottom: '10px', textAlign: 'center' },
  storyContainer: { overflowY: 'auto', paddingRight: '10px' },
  coloredFullText: { fontSize: '1.5rem', lineHeight: '2', backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #E2E8F0' },
  divider: { border: '0', height: '1px', backgroundColor: '#E9E4D4', margin: '15px 0' },
  audioRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer', padding: '5px', borderRadius: '10px', transition: 'background 0.2s' },
  microBtn: { border: 'none', background: 'white', fontSize: '1.2rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  audioLabel: { fontSize: '1rem', color: '#4A5568', fontWeight: 'bold' },

  questionColumn: { flex: 1, padding: '20px', borderRadius: '25px', border: '6px solid', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' },
  tag: { color: '#fff', padding: '6px 20px', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.9rem' },
  questionText: { fontSize: '1.8rem', color: '#2D3748', textAlign: 'center', fontWeight: 'bold' },
  buttonGrid: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' },
  answerBtn: { minHeight: '60px', fontSize: '1.4rem', borderRadius: '18px', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.15)' },

  bigScore: { fontSize: '5rem', fontWeight: 'bold', margin: '20px 0', textAlign: 'center' },
  restartBtn: { padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px', border: 'none', backgroundColor: '#4682B4', color: '#fff', cursor: 'pointer', alignSelf: 'center' }
};

export default AppLectureDuo;