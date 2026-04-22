import React, { useState } from 'react';
import Xarrow from 'react-xarrows';

// ================== Données ==================
const BODY_PARTS = [
  { id: "tete", name: "la tête", emoji: "👦" },
  { id: "main", name: "la main", emoji: "✋" },
  { id: "pied", name: "le pied", emoji: "🦶" },
  { id: "oreille", name: "l'oreille", emoji: "👂" },
  { id: "oeil", name: "l'œil", emoji: "👁️" },
  { id: "nez", name: "le nez", emoji: "👃" },
  { id: "bouche", name: "la bouche", emoji: "👄" },
  { id: "bras", name: "le bras", emoji: "💪" },
  { id: "jambe", name: "la jambe", emoji: "🦵" },
  { id: "cheveux", name: "les cheveux", emoji: "💇" },
  { id: "cou", name: "le cou", emoji: "" },
  { id: "doigt", name: "les doigts", emoji: "" },

];

const MATCHING_ITEMS = [
  { id: "img1", emoji: "✋", correctMatch: "main" },
  { id: "img2", emoji: "🦶", correctMatch: "pied" },
  { id: "img3", emoji: "👂", correctMatch: "oreille" },
  { id: "img4", emoji: "👁️", correctMatch: "oeil" },
  { id: "img5", emoji: "👄", correctMatch: "bouche" },
  { id: "img6", emoji: "👃", correctMatch: "nez" },
];

const MULTIPLE_CHOICE_QUESTIONS = [
  {
    id: "q1",
    emoji: "✋",
    question: "Quelle est cette partie du corps ?",
    options: ["la main", "le pied", "la jambe"],
    answer: "la main",
  },
  {
    id: "q2",
    emoji: "👁️",
    question: "Quelle est cette partie du corps ?",
    options: ["le nez", "la bouche", "l'œil"],
    answer: "l'œil",
  },
];

// Positions pour l'image
const DROP_ZONES_IMAGE = [
  { id: "zone-cheveux", top: "4%", left: "7%", expected: "cheveux" },
  { id: "zone-oreille", top: "30%", left: "2%", expected: "oreille" },
  { id: "zone-bouche", top: "47%", left: "2%", expected: "bouche" },
  { id: "zone-bras", top: "57%", left: "2%", expected: "bras" },
  { id: "zone-main", top: "73%", left: "4%", expected: "main" },
  { id: "zone-jambe", top: "87%", left: "11%", expected: "jambe" },
  { id: "zone-tete", top: "4%", left: "59%", expected: "tete" },
  { id: "zone-oeil", top: "24%", left: "74%", expected: "oeil" },
  { id: "zone-nez", top: "45%", left: "64%", expected: "nez" },
  { id: "zone-cou", top: "55%", left: "60%", expected: "cou" },
  { id: "zone-doigt", top: "75%", left: "70%", expected: "doigt" },
  { id: "zone-pied", top: "87%", left: "59%", expected: "pied" },
];

export default function ExercicesCorpsHumain() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]); 
  const [droppedEx2, setDroppedEx2] = useState({});     
  const [droppedImage, setDroppedImage] = useState({}); 
  const [mcqAnswers, setMcqAnswers] = useState({});     
  const [isValidated, setIsValidated] = useState(false);
  const [scoreFinal, setScoreFinal] = useState(null);

  // --- Fonctions Partagées ---
  const handleDragStart = (e, item) => {
    if (isValidated) return;
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const allowDrop = (e) => e.preventDefault();

  // --- Exercice 1 : Flèches ---
  const handleEmojiClick = (id) => { if (!isValidated) setSelectedEmoji(id); };
  const handleWordClick = (wordId) => {
    if (!isValidated && selectedEmoji) {
      const newPairs = matchedPairs.filter(p => p.imgId !== selectedEmoji);
      setMatchedPairs([...newPairs, { imgId: selectedEmoji, wordId: wordId }]);
      setSelectedEmoji(null);
    }
  };

  // --- Exercice 2 : Drag & Drop Cases ---
  const handleDropEx2 = (e, targetId) => {
    e.preventDefault();
    if (isValidated) return;
    const item = JSON.parse(e.dataTransfer.getData("item"));
    setDroppedEx2(prev => ({ ...prev, [targetId]: item }));
  };

  // --- Exercice 3 : Image (corps.png) ---
  const handleDropImage = (e, zoneId) => {
    e.preventDefault();
    if (isValidated) return;
    const item = JSON.parse(e.dataTransfer.getData("item"));
    setDroppedImage(prev => ({ ...prev, [zoneId]: item }));
  };

  // --- Validation ---
  const calculerScore = () => {
    let pts = 0;
    matchedPairs.forEach(p => {
        if (MATCHING_ITEMS.find(m => m.id === p.imgId).correctMatch === p.wordId) pts++;
    });
    BODY_PARTS.slice(0, 4).forEach(item => {
        if (droppedEx2[item.id]?.id === item.id) pts++;
    });
    DROP_ZONES_IMAGE.forEach(z => {
        if (droppedImage[z.id]?.id === z.expected) pts++;
    });
    MULTIPLE_CHOICE_QUESTIONS.forEach(q => {
        if (mcqAnswers[q.id] === q.answer) pts++;
    });

    setScoreFinal(pts);
    setIsValidated(true);
  };

  return (
    <div style={mainContainerStyle}>
      <h1 style={mainTitleStyle}>🎨 Mon Cahier d'Exercices 🎨</h1>

      {/* EXERCICE 1 : FLECHES */}
      <section style={{...sectionStyle, backgroundColor: '#FFE3E3'}}>
        <h2 style={sectionTitleStyle}>1️⃣ Relie avec des flèches</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', position: 'relative', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {MATCHING_ITEMS.map(m => (
              <button key={m.id} id={`emoji-${m.id}`} onClick={() => handleEmojiClick(m.id)} 
                style={{...bubblyBtnStyle, fontSize: '2.5rem', backgroundColor: selectedEmoji === m.id ? '#FDE767' : '#FFF'}}>
                {m.emoji}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {MATCHING_ITEMS.map(m => (
              <button key={m.id} id={`word-${m.correctMatch}`} onClick={() => handleWordClick(m.correctMatch)} 
                style={{...bubblyBtnStyle, minWidth: '140px', fontSize: '1.2rem'}}>
                {BODY_PARTS.find(b => b.id === m.correctMatch).name}
              </button>
            ))}
          </div>
          {matchedPairs.map((p, i) => {
            const isCorrect = MATCHING_ITEMS.find(m => m.id === p.imgId).correctMatch === p.wordId;
            return <Xarrow key={i} start={`emoji-${p.imgId}`} end={`word-${p.wordId}`} 
              color={isValidated ? (isCorrect ? '#65B741' : '#FF6B6B') : '#4A90E2'} strokeWidth={6} path="smooth" />;
          })}
        </div>
      </section>

      {/* EXERCICE 2 : DRAG & DROP SIMPLE */}
      <section style={{...sectionStyle, backgroundColor: '#E3F4F4'}}>
        <h2 style={sectionTitleStyle}>2️⃣ Glisse les étiquettes jaunes</h2>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
          {BODY_PARTS.slice(0, 4).map(item => (
            <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} style={{...dragItemStyle, backgroundColor: '#FFD93D', color: '#333'}}>{item.name}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {BODY_PARTS.slice(0, 4).map(item => (
            <div key={item.id} onDrop={(e) => handleDropEx2(e, item.id)} onDragOver={allowDrop} 
              style={{...dropZoneStyle, backgroundColor: isValidated ? (droppedEx2[item.id]?.id === item.id ? '#C1F2B0' : '#FFB5B5') : '#FFF'}}>
              <span style={{fontSize: '3rem'}}>{item.emoji}</span>
              <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{droppedEx2[item.id]?.name || "?"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXERCICE 3 : IMAGE PRINCIPALE (corps.png) */}
      <section style={{...sectionStyle, backgroundColor: '#FFF3E0'}}>
        <h2 style={sectionTitleStyle}>3️⃣ Complète le grand dessin</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
          {BODY_PARTS.map(item => (
            <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} style={{...dragItemStyle, backgroundColor: '#FF9B9B', color: 'white'}}>{item.name}</div>
          ))}
        </div>
        <div style={schemaContainerStyle}>
          <img src="/corps.png" alt="corps" style={{ width: '100%', borderRadius: '20px', pointerEvents: 'none' }} />
          {DROP_ZONES_IMAGE.map(z => (
            <div key={z.id} onDrop={(e) => handleDropImage(e, z.id)} onDragOver={allowDrop} 
              style={{ ...schemaDropZone, top: z.top, left: z.left, 
              backgroundColor: isValidated ? (droppedImage[z.id]?.id === z.expected ? '#C1F2B0' : '#FFB5B5') : 'rgba(255, 255, 255, 0.8)',
              borderColor: isValidated ? (droppedImage[z.id]?.id === z.expected ? '#65B741' : '#FF6B6B') : '#4A90E2'}}>
              {droppedImage[z.id]?.name || ""}
            </div>
          ))}
        </div>
      </section>

      {/* EXERCICE 4 : QCM */}
      <section style={{...sectionStyle, backgroundColor: '#E5D9F2'}}>
        <h2 style={sectionTitleStyle}>4️⃣ Choisis la bonne réponse</h2>
        {MULTIPLE_CHOICE_QUESTIONS.map(q => (
          <div key={q.id} style={mcqCardStyle}>
            <div style={{fontSize: '3.5rem'}}>{q.emoji}</div>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px', flexWrap: 'wrap'}}>
              {q.options.map(opt => {
                let btnColor = '#FFF';
                if (isValidated) {
                  if (opt === q.answer) btnColor = '#C1F2B0'; 
                  else if (mcqAnswers[q.id] === opt) btnColor = '#FFB5B5'; 
                } else if (mcqAnswers[q.id] === opt) {
                  btnColor = '#FDE767'; 
                }
                return (
                  <button key={opt} onClick={() => !isValidated && setMcqAnswers({...mcqAnswers, [q.id]: opt})}
                    style={{...bubblyBtnStyle, backgroundColor: btnColor, fontSize: '1.2rem', padding: '12px 20px'}}>{opt}</button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* RESULTATS */}
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {!isValidated ? (
          <button onClick={calculerScore} style={validateBtnStyle}>🚀 VOIR MA NOTE 🚀</button>
        ) : (
          <div style={scoreBoxStyle}>
            <h2 style={{fontSize: '3rem', margin: '0 0 15px 0'}}>Ton Score : {scoreFinal} / 24</h2>
            <button onClick={() => window.location.reload()} style={{...validateBtnStyle, backgroundColor: '#FFB534', border: '4px solid #E59800', boxShadow: '0 5px 0 #E59800'}}>Recommencer 🔄</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ================== Styles ==================
const mainContainerStyle = { padding: '20px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', maxWidth: '850px', margin: 'auto', backgroundColor: '#F9F9F9', borderRadius: '20px' };
const mainTitleStyle = { textAlign: 'center', fontSize: '2.8rem', color: '#FF6B6B', textShadow: '2px 2px 0px #FFE66D' };
const sectionStyle = { marginBottom: '35px', padding: '25px', borderRadius: '25px', border: '3px solid #DDD', boxShadow: '0 6px 0px rgba(0,0,0,0.1)' };
const sectionTitleStyle = { margin: '0 0 20px 0', fontSize: '1.8rem', color: '#333' };
const bubblyBtnStyle = { padding: '10px 15px', border: '3px solid #555', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.1s' };

// --- AGARANDISSEMENTS POUR L'EXERCICE 3 ---

// 1. Les mots à glisser sont plus gros et ronds
const dragItemStyle = { 
  padding: '12px 20px', // Plus grand
  borderRadius: '15px', 
  cursor: 'grab', 
  fontWeight: 'bold', 
  fontSize: '1.2rem', // Texte plus gros
  border: '3px solid rgba(0,0,0,0.15)',
  boxShadow: '0 4px 0px rgba(0,0,0,0.1)'
};

// 2. Les cases sur le dessin sont beaucoup plus larges et hautes
const schemaDropZone = { 
  position: 'absolute', 
  width: '26%', // C'était 20%, maintenant c'est bien plus large
  height: '10%', // C'était 5%, maintenant c'est plus haut
  minHeight: '35px', // S'assure que ce n'est jamais trop petit
  border: '3px dashed', 
  borderRadius: '8px', 
  fontSize: '1.1rem', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontWeight: 'bold',
  color: '#333'
};
// ------------------------------------------

const dropZoneStyle = { width: '130px', height: '140px', border: '4px dashed #888', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const schemaContainerStyle = { position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' };
const mcqCardStyle = { backgroundColor: '#FFF', padding: '20px', borderRadius: '20px', marginBottom: '15px', textAlign: 'center', border: '3px solid #D4C5F9' };
const validateBtnStyle = { padding: '20px 40px', fontSize: '1.8rem', backgroundColor: '#4CAF50', color: 'white', borderRadius: '25px', border: '4px solid #2E7D32', cursor: 'pointer', boxShadow: '0 6px 0 #2E7D32', textTransform: 'uppercase' };
const scoreBoxStyle = { padding: '30px', backgroundColor: '#FFF', borderRadius: '25px', border: '5px solid #4CAF50', animation: 'popIn 0.5s ease-out' };