import React, { useState, useEffect, useRef } from 'react';
import data from './data.json';
import App from './app2.jsx';

const SentenceMaster = () => {
  const { config_globale } = data;
  const [selectedExo, setSelectedExo] = useState(null);
  const [selections, setSelections] = useState({ sujet: '', verbe: '', complement: '' });
  const [corrects, setCorrects] = useState([]);
  const [shuffledLists, setShuffledLists] = useState({ sujets: [], verbes: [], complements: [] });
  const [isReading, setIsReading] = useState(false);
  const [msg, setMsg] = useState("");

  // NOUVEAUX ÉTATS POUR LE JEU
  const [timer, setTimer] = useState(0);
  const [erreursCount, setErreursCount] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const intervalRef = useRef(null);

  // Gérer le Chronomètre
  useEffect(() => {
    if (isGameActive) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isGameActive]);

  const startExo = (exo) => {
    setSelectedExo(exo);
    setShuffledLists({
      sujets: [...exo.sujets].sort(() => Math.random() - 0.5),
      verbes: [...exo.verbes].sort(() => Math.random() - 0.5),
      complements: [...exo.complements].sort(() => Math.random() - 0.5)
    });
    setCorrects([]);
    setTimer(0);
    setErreursCount(0);
    setIsGameActive(true);
    setSelections({ sujet: '', verbe: '', complement: '' });
  };

  const checkSentence = () => {
    const sentence = `${selections.sujet} ${selections.verbe} ${selections.complement}`;
    if (selectedExo.solutions.includes(sentence)) {
      if (!corrects.includes(sentence)) {
        setIsReading(true);
        const newCorrects = [...corrects, sentence];
        setCorrects(newCorrects);
        
        // Synthèse vocale
        const prononciation = new SpeechSynthesisUtterance(sentence);
        prononciation.lang = config_globale.langue_lecture;
        window.speechSynthesis.speak(prononciation);

        if (newCorrects.length === selectedExo.solutions.length) {
          setIsGameActive(false); // Fin du jeu
          setMsg("🏆 EXERCICE TERMINÉ !");
        }

        setTimeout(() => {
          setIsReading(false);
          setSelections({ sujet: '', verbe: '', complement: '' });
        }, 2500);
      }
    } else {
      setErreursCount(e => e + 1);
      setMsg(`${config_globale.emoji_erreur} Erreur ! (+1 essai)`);
      setTimeout(() => setMsg(""), 1500);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!selectedExo) {
    return (
      <div style={menuStyle}>
        <h1>{config_globale.emoji_bravo} Défis de Français</h1>
        <div style={gridStyle}>
          {data.exercices.map(exo => (
            <button key={exo.id} onClick={() => startExo(exo)} style={exoCard}>
              <h3>{exo.titre}</h3>
              <p>Prêt pour le chrono ?</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={gameLayout}>
      {/* BARRE DE STATS JEU */}
      <App></App>
      <div style={statsBar}>
        <div style={statItem}>⏱ Temps : {formatTime(timer)}</div>
        <div style={statItem}>❌ Erreurs : {erreursCount}</div>
        <button onClick={() => setSelectedExo(null)} style={backBtn}>Quitter</button>
      </div>

      <div style={header}>
        <h2>{selectedExo.titre}</h2>
        <progress value={corrects.length} max={selectedExo.solutions.length} style={{width: '100%'}}></progress>
      </div>

      <div style={{...previewBox, animation: isReading ? 'pulse 1s infinite' : 'none'}}>
        <span style={{ color: config_globale.couleur_sujet }}>{selections.sujet || "..."}</span>{' '}
        <span style={{ color: config_globale.couleur_verbe }}>{selections.verbe || "..."}</span>{' '}
        <span style={{ color: config_globale.couleur_complement }}>{selections.complement || "..."}</span>
      </div>

      {/* Colonnes de mots */}
      <div style={columns}>
        {['sujet', 'verbe', 'complement'].map((type) => (
          <div key={type} style={colStyle}>
            <h4 style={{color: config_globale[`couleur_${type}`]}}>{config_globale.labels[type]}</h4>
            {shuffledLists[`${type}s`].map(item => {
              const isUsed = corrects.some(p => p.includes(item));
              return (
                <button 
                  key={item} 
                  disabled={isUsed || isReading}
                  onClick={() => setSelections({...selections, [type]: item})}
                  style={{
                    ...itemBtn, 
                    borderColor: selections[type] === item ? config_globale[`couleur_${type}`] : '#ddd',
                    opacity: isUsed ? 0.3 : 1,
                    textDecoration: isUsed ? 'line-through' : 'none'
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{textAlign: 'center', marginTop: '30px'}}>
        <p style={{color: 'red', fontWeight: 'bold'}}>{msg}</p>
        {!isGameActive && corrects.length === selectedExo.solutions.length ? (
           <div style={finalCard}>
              <h2>BRAVO ! 🎉</h2>
              <p>Temps total : {formatTime(timer)}</p>
              <p>Nombre d'erreurs : {erreursCount}</p>
              <button onClick={() => setSelectedExo(null)} style={checkBtn}>Retour au menu</button>
           </div>
        ) : (
          <button onClick={checkSentence} disabled={!selections.sujet || !selections.verbe || !selections.complement || isReading} style={checkBtn}>
            VALIDER LA PHRASE
          </button>
        )}
      </div>
      
    </div>
  );
};

// --- STYLES ---
const statsBar = { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#2d3436', color: '#fab1a0', borderRadius: '10px', marginBottom: '15px', fontWeight: 'bold' };
const statItem = { padding: '5px 15px' };
const finalCard = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', border: '3px solid #2ecc71', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
// ... (garder les styles précédents)
const gameLayout = { maxWidth: '1000px', margin: 'auto', padding: '20px', fontFamily: 'Arial' };
const menuStyle = { padding: '40px', textAlign: 'center' };
const gridStyle = { display: 'flex', gap: '20px', justifyContent: 'center' };
const exoCard = { padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer' };
const header = { textAlign: 'center', marginBottom: '20px' };
const previewBox = { backgroundColor: '#1e272e', color: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', fontSize: '1.6rem', marginBottom: '20px' };
const columns = { display: 'flex', flexWrap: 'wrap', gap: '15px' };
const colStyle = { flex: '1 1 300px', backgroundColor: '#fff', padding: '15px', borderRadius: '15px', border: '1px solid #eee' };
const itemBtn = { width: '100%', padding: '12px', margin: '5px 0', border: '2px solid', borderRadius: '10px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' };
const checkBtn = { padding: '15px 40px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', cursor: 'pointer' };
const backBtn = { background: '#ff7675', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' };

export default SentenceMaster;