import React, { useState, useEffect } from 'react';

const SECRET_CODE = "2020";

// -------------------- CHALLENGES --------------------
const CHALLENGES = {
  super_facile: {
    name: "Super Débutant (1-5)",
    color: "#3b82f6",
    questions: [
      { a: 3, b: 1 }, { a: 4, b: 5 }, { a: 2, b: 1 }, { a: 5, b: 3 }, { a: 1, b: 4 },
      { a: 5, b: 1 }, { a: 3, b: 4 }, { a: 2, b: 5 }, { a: 1, b: 3 }, { a: 4, b: 1 },
      { a: 2, b: 3 }, { a: 4, b: 4 }, { a: 5, b: 2 }, { a: 1, b: 5 }, { a: 3, b: 3 },
      { a: 5, b: 5 }, { a: 1, b: 2 }, { a: 4, b: 3 }, { a: 3, b: 5 }, { a: 2, b: 2 },
      { a: 1, b: 1 }, { a: 5, b: 4 }, { a: 4, b: 2 }, { a: 3, b: 2 }, { a: 2, b: 4 },
      { a: 1, b: 5 }, { a: 5, b: 1 }, { a: 3, b: 4 }, { a: 4, b: 1 }, { a: 2, b: 3 },
      { a: 3, b: 1 }, { a: 4, b: 5 }, { a: 2, b: 1 }, { a: 5, b: 3 }, { a: 1, b: 4 },
      { a: 5, b: 2 }, { a: 3, b: 3 }, { a: 4, b: 4 }, { a: 1, b: 2 }, { a: 3, b: 5 },
      { a: 2, b: 5 }, { a: 5, b: 5 }, { a: 1, b: 1 }, { a: 4, b: 2 }, { a: 3, b: 2 },
      { a: 2, b: 4 }, { a: 5, b: 4 }, { a: 4, b: 3 }, { a: 1, b: 3 }, { a: 5, b: 5 }
    ]
  },
  facile: {
    name: "Débutant (1-10)",
    color: "#10b981",
    questions: [
      { a: 7, b: 7 }, { a: 4, b: 8 }, { a: 3, b: 9 }, { a: 5, b: 3 }, { a: 9, b: 2 },
      { a: 6, b: 7 }, { a: 8, b: 9 }, { a: 6, b: 4 }, { a: 4, b: 9 }, { a: 9, b: 8 },
      { a: 2, b: 8 }, { a: 5, b: 7 }, { a: 8, b: 6 }, { a: 6, b: 2 }, { a: 7, b: 5 },
      { a: 3, b: 6 }, { a: 2, b: 5 }, { a: 8, b: 5 }, { a: 9, b: 7 }, { a: 5, b: 8 },
      { a: 4, b: 3 }, { a: 7, b: 4 }, { a: 6, b: 5 }, { a: 3, b: 8 }, { a: 2, b: 4 },
      { a: 7, b: 2 }, { a: 9, b: 5 }, { a: 8, b: 7 }, { a: 3, b: 4 }, { a: 4, b: 6 },
      { a: 6, b: 9 }, { a: 2, b: 3 }, { a: 5, b: 9 }, { a: 9, b: 6 }, { a: 8, b: 2 },
      { a: 7, b: 8 }, { a: 3, b: 2 }, { a: 4, b: 7 }, { a: 6, b: 3 }, { a: 2, b: 7 },
      { a: 5, b: 6 }, { a: 9, b: 3 }, { a: 8, b: 4 }, { a: 3, b: 7 }, { a: 4, b: 5 },
      { a: 6, b: 8 }, { a: 2, b: 6 }, { a: 5, b: 4 }, { a: 9, b: 4 }, { a: 8, b: 3 },
      { a: 7, b: 9 }, { a: 3, b: 5 }, { a: 4, b: 2 }, { a: 6, b: 6 }, { a: 2, b: 9 },
      { a: 5, b: 2 }, { a: 9, b: 9 }, { a: 8, b: 8 }, { a: 7, b: 3 }, { a: 7, b: 10 }
    ]
  },
  // ... (idem pour moyen, difficile, expert)
};

// -------------------- UTIL --------------------
const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// -------------------- MAIN COMPONENT --------------------
export default function MultiplicationChallengeOK() {
  const [gameState, setGameState] = useState('login');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [bestScores, setBestScores] = useState({});
  const [timerStarted, setTimerStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // ---- Historique (lazy initializer pour persistance) ----
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("historyMultiplication");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erreur lecture localStorage:", e);
      return [];
    }
  });

  // ---- Sauvegarder historique à chaque changement ----
  useEffect(() => {
    try {
      localStorage.setItem("historyMultiplication", JSON.stringify(history));
    } catch (e) {
      console.error("Erreur écriture localStorage:", e);
    }
  }, [history]);

  // ---------------- TIMER GLOBAL ----------------
  useEffect(() => {
    if (gameState === 'playing' && timerStarted) {
      const t = setTimeout(() => setTimeElapsed(x => x + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [gameState, timerStarted, timeElapsed]);

  // ---------------- START GAME ----------------
  const startGame = (level) => {
    const shuffled = shuffleArray(CHALLENGES[level].questions);
    setSelectedLevel(level);
    setQuestions(shuffled);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setAnswers([]);
    setTimeElapsed(0);
    setTimerStarted(true);
    setQuestionStartTime(Date.now());
  };

  // ---------------- CHECK ANSWER ----------------
  const checkAnswer = () => {
    if (!questions || questions.length === 0) return;

    const q = questions[currentQuestion];
    const correct = q.a * q.b;
    const numericAnswer = Number(userAnswer);
    const isCorrect = numericAnswer === correct;
    const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;

    const newAnswers = [...answers, {
      question: `${q.a} × ${q.b}`,
      userAnswer: userAnswer,
      correctAnswer: correct,
      isCorrect,
      timeTaken
    }];

    setAnswers(newAnswers);
    if (isCorrect) setScore(prev => prev + 10);
    setUserAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      endGame(newAnswers);
    }
  };

  // ---------------- END GAME ----------------
  const endGame = (finalAnswers) => {
    setTimerStarted(false);

    const correctCount = finalAnswers.filter(a => a.isCorrect).length;

    const newHistoryEntry = {
      date: new Date().toLocaleString(),
      level: selectedLevel,
      levelName: CHALLENGES[selectedLevel]?.name || selectedLevel,
      score,
      totalQuestions: finalAnswers.length,
      correctAnswers: correctCount,
      timeElapsed,
      answers: finalAnswers
    };

    setHistory(prev => [newHistoryEntry, ...prev]);

    setBestScores(prev => {
      const prevBest = prev[selectedLevel] ?? 0;
      if (score > prevBest) {
        return { ...prev, [selectedLevel]: score };
      }
      return prev;
    });

    setGameState('finished');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer !== '') {
      checkAnswer();
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedLevel(null);
  };

  // ---------------- RENDERS ----------------
  const renderLogin = () => (
    <div style={styles.container}>
      <h1 style={styles.title}>Identification</h1>
      <p style={styles.subtitle}>Veuillez entrer le code d’accès :</p>
      <input
        type="number"
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
        placeholder="Code secret"
        style={styles.input}
      />
      <button
        style={{ ...styles.validateButton, opacity: codeInput === SECRET_CODE ? 1 : 0.5 }}
        disabled={codeInput !== SECRET_CODE}
        onClick={() => setGameState('menu')}
      >
        Continuer
      </button>
      {codeInput && codeInput !== SECRET_CODE && (
        <p style={{ color: 'red', textAlign: 'center' }}>❌ Code incorrect</p>
      )}
    </div>
  );

  const renderMenu = () => (
    <div style={styles.container}>
      <h1 style={styles.title}>Concours de Multiplication</h1>
      <p style={styles.subtitle}>Choisissez votre niveau</p>
      <div style={styles.levelGrid}>
        {Object.entries(CHALLENGES).map(([key, challenge]) => (
          <div
            key={key}
            style={{ ...styles.levelCard, borderColor: challenge.color }}
            onClick={() => startGame(key)}
          >
            {bestScores[key] && (
              <div style={{ ...styles.badge, backgroundColor: challenge.color }}>
                ⭐ Meilleur: {bestScores[key]}
              </div>
            )}
            <h2 style={{ ...styles.levelName, color: challenge.color }}>
              {challenge.name}
            </h2>
            <p style={styles.questionCount}>📝 {challenge.questions.length} questions</p>
            <button style={{ ...styles.startButton, backgroundColor: challenge.color }}>
              ▶️ Commencer
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>📜 Historique des parties</h2>
        {history.length === 0 && <p>Aucune partie jouée</p>}
        {history.map((h, i) => (
          <div key={i} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '5px', borderRadius: '8px' }}>
            <b>{h.date}</b> - {h.levelName} - Score: {h.score} - Correct: {h.correctAnswers}/{h.totalQuestions} - ⏱️ {Math.floor(h.timeElapsed / 60)}:{String(h.timeElapsed % 60).padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    if (!questions || questions.length === 0) {
      return <div style={styles.container}><p>Chargement des questions...</p></div>;
    }
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const challengeColor = CHALLENGES[selectedLevel].color;

    return (
      <div style={styles.container}>
        <div style={{ ...styles.gameHeader, backgroundColor: challengeColor }}>
          <div style={styles.statsChip}>⏱️ {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</div>
          <div style={styles.statsChip}>Question {currentQuestion + 1}/{questions.length}</div>
          <div style={styles.statsChip}>⭐ {score} pts</div>
        </div>

        <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${progress}%` }} /></div>

        <div style={styles.questionCard}>
          <h1 style={styles.question}>{question.a} × {question.b}</h1>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
            autoFocus
          />
          <button
            style={{ ...styles.validateButton, opacity: userAnswer !== '' ? 1 : 0.5 }}
            disabled={userAnswer === ''}
            onClick={checkAnswer}
          >
            Valider
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const accuracy = answers.length ? ((correctCount / answers.length) * 100).toFixed(1) : '0.0';
    const challengeColor = CHALLENGES[selectedLevel].color;

    return (
      <div style={styles.container}>
        <div style={{ ...styles.resultsHeader, backgroundColor: challengeColor }}>
          <h1 style={{ color: 'white' }}>Résultats</h1>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}><h2 style={styles.statValue}>{score}</h2><p>Score</p></div>
          <div style={styles.statCard}><h2 style={styles.statValue}>{correctCount}/{answers.length}</h2><p>Correctes</p></div>
          <div style={styles.statCard}><h2 style={styles.statValue}>{accuracy}%</h2><p>Précision</p></div>
          <div style={styles.statCard}><h2 style={styles.statValue}>{Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</h2><p>⏱️ Temps total</p></div>
        </div>

        <div style={styles.answersContainer}>
          <h3 style={styles.answersTitle}>📊 Détails</h3>
          {answers.map((a, i) => (
            <div key={i} style={{ ...styles.answerItem, backgroundColor: a.isCorrect ? '#10b98120' : '#ef444420' }}>
              <b>{a.question}</b>
              <span>Votre réponse: {a.userAnswer}</span>
              <span>Correct: {a.correctAnswer}</span>
              <span>⏱️ {a.timeTaken}s</span>
              <span>{a.isCorrect ? '✅' : '❌'}</span>
            </div>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.retryButton} onClick={() => startGame(selectedLevel)}>🔄 Rejouer</button>
          <button style={styles.menuButton} onClick={resetGame}>🏠 Menu</button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      {gameState === 'login' && renderLogin()}
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'finished' && renderResults()}
    </div>
  );
}

// -------------------- STYLES --------------------
const styles = {
  app: { minHeight: '100vh', background: '#f3f4f6', padding: '20px' },
  container: { maxWidth: '900px', margin: '0 auto' },

  title: { fontSize: '3rem', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '25px' },

  input: { width: '100%', padding: '12px', fontSize: '1.2rem', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' },
  validateButton: { width: '100%', padding: '12px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: 'white', cursor: 'pointer' },

  levelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  levelCard: { padding: '15px', border: '2px solid', borderRadius: '12px', cursor: 'pointer', position: 'relative', textAlign: 'center', backgroundColor: 'white' },
  levelName: { fontSize: '1.2rem', margin: '10px 0' },
  questionCount: { color: '#6b7280' },
  startButton: { marginTop: '10px', padding: '8px 12px', fontSize: '1rem', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' },
  badge: { position: 'absolute', top: '-10px', right: '-10px', padding: '5px 10px', borderRadius: '50%', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' },

  gameHeader: { display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', marginBottom: '15px', color: 'white' },
  statsChip: { padding: '5px 10px', borderRadius: '20px', backgroundColor: '#ffffff50' },
  progressBar: { width: '100%', height: '10px', backgroundColor: '#d1d5db', borderRadius: '5px', marginBottom: '15px' },
  progressFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: '5px' },
  questionCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  question: { fontSize: '2rem', marginBottom: '15px' },

  resultsHeader: { padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' },
  statsGrid: { display: 'flex', justifyContent: 'space-around', marginBottom: '20px' },
  statCard: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', minWidth: '100px' },
  statValue: { fontSize: '1.5rem', fontWeight: 'bold' },

  answersContainer: { marginBottom: '20px' },
  answersTitle: { fontSize: '1.2rem', marginBottom: '10px' },
  answerItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderRadius: '8px', marginBottom: '5px', fontSize: '0.9rem' },

  buttonGroup: { display: 'flex', justifyContent: 'space-around', marginTop: '20px' },
  retryButton: { padding: '10px 20px', fontSize: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer' },
  menuButton: { padding: '10px 20px', fontSize: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: 'white', cursor: 'pointer' },
};
