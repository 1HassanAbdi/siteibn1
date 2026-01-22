
import React, { useState, useEffect } from 'react';


const SECRET_CODE = "9987654321";

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

           
  { a : 2, b : 3 }, { a : 2, b : 4 }, { a : 2, b : 5 }, { a : 2, b : 6 }, { a : 2, b : 7 }, { a : 2, b : 8 },
  { a : 3, b : 2 }, { a : 3, b : 4 }, { a : 3, b : 5 }, { a : 3, b : 6 }, { a : 3, b : 7 }, { a : 3, b : 8 },
  { a : 4, b : 2 }, { a : 4, b : 3 }, { a : 4, b : 5 }, { a : 4, b : 6 }, { a : 4, b : 7 }, { a : 4, b : 8 },
  { a : 5, b : 2 }, { a : 5, b : 3 }, { a : 5, b : 4 }, { a : 5, b : 6 }, { a : 5, b : 7 }, { a : 5, b : 8 },
  { a : 6, b : 2 }, { a : 6, b : 3 }, { a : 6, b : 4 }, { a : 6, b : 5 }, { a : 6, b : 7 }, { a : 6, b : 8 },
  { a : 7, b : 2 }, { a : 7, b : 3 }, { a : 7, b : 4 }, { a : 7, b : 5 }, { a : 7, b : 6 }, { a : 7, b : 8 },
  { a : 8, b : 2 }, { a : 8, b : 3 }, { a : 8, b : 4 }, { a : 8, b : 5 }, { a : 8, b : 6 }, { a : 8, b : 7 },
  { a : 9, b : 2 }, { a : 9, b : 3 }, { a : 9, b : 4 }, { a : 9, b : 5 }, { a : 9, b : 6 }, { a : 9, b : 7 },
  { a : 2, b : 9 }, { a : 3, b : 9 }, { a : 4, b : 9 }, { a : 5, b : 9 }, { a : 6, b : 9 }, { a : 7, b : 9 },
  { a : 8, b : 8 }, { a : 9, b : 8 }, { a : 6, b : 6 }, { a : 7, b : 7 }, { a : 5, b : 5 }, { a : 4, b : 4 }


        ]


    },

    moyen: {
        name: "Intermédiaire (1-12)",
        color: "#f59e0b",
        questions: [
            
 { a : 7, b : 12 }, { a : 8, b : 12 }, 
/* Table de 3 (Les plus hautes) */
 { a : 3, b : 7 }, { a : 3, b : 8 }, { a : 3, b : 9 }, { a : 3, b : 11 }, { a : 3, b : 12 },

/* Table de 4 (Les plus hautes) */
{ a : 4, b : 6 }, { a : 4, b : 7 }, { a : 4, b : 8 }, { a : 4, b : 9 }, { a : 4, b : 11 }, { a : 4, b : 12 },

/* Table de 5 (Les plus hautes) */
{ a : 5, b : 6 }, { a : 5, b : 7 }, { a : 5, b : 8 }, { a : 5, b : 9 }, { a : 5, b : 11 }, { a : 5, b : 12 },

/* Table de 6 (Complète sauf x2) */
{ a : 6, b : 3 }, { a : 6, b : 4 }, { a : 6, b : 6 }, { a : 6, b : 7 }, { a : 6, b : 8 }, { a : 6, b : 9 }, { a : 6, b : 11 }, { a : 6, b : 12 },

/* Table de 7 (Difficiles) */
{ a : 7, b : 3 }, { a : 7, b : 4 }, { a : 7, b : 5 }, { a : 7, b : 6 }, { a : 7, b : 7 }, { a : 7, b : 8 }, { a : 7, b : 9 }, { a : 7, b : 11 },

/* Table de 8 (Difficiles) */
{ a : 8, b : 3 }, { a : 8, b : 4 }, { a : 8, b : 5 }, { a : 8, b : 6 }, { a : 8, b : 7 }, { a : 8, b : 8 }, { a : 8, b : 9 }, { a : 8, b : 11 },

/* Table de 9 (Complète sauf x2) */
{ a : 9, b : 3 }, { a : 9, b : 4 }, { a : 9, b : 5 }, { a : 9, b : 6 }, { a : 9, b : 7 }, { a : 9, b : 8 }, { a : 9, b : 9 }, { a : 9, b : 11 }, { a : 9, b : 12 },

/* Table de 11 (Mélangées) */
{ a : 11, b : 3 }, { a : 11, b : 4 }, { a : 11, b : 5 }, { a : 11, b : 6 }, { a : 11, b : 7 }, { a : 11, b : 8 }, { a : 11, b : 9 }, { a : 11, b : 12 }




        ]

    },

    difficile: {
        name: "Avancé (1-15)",
        color: "#f97316",
        questions: [

            // Table de 7 (Hautes)
{ a: 7, b: 12 },
// Table de 3 (Hautes)
{ a: 3, b: 7 }, { a: 3, b: 8 }, { a: 3, b: 9 }, { a: 3, b: 11 },
// Table de 4 (Hautes)
{ a: 4, b: 6 }, { a: 4, b: 7 }, { a: 4, b: 8 }, { a: 4, b: 9 },
// Table de 5 (Hautes)

// Table de 6 (Complète sauf x2)
  { a: 6, b: 6 }, { a: 6, b: 7 }, { a: 6, b: 8 }, { a: 6, b: 9 }, { a: 6, b: 11 }, { a: 6, b: 12 },
// Table de 7 (Difficiles)
 { a: 7, b: 4 }, { a: 7, b: 5 }, { a: 7, b: 6 }, { a: 7, b: 8 },
// Table de 8 (Difficiles)
{ a: 8, b: 2 }, { a: 8, b: 3 }, { a: 8, b: 4 },  { a: 8, b: 6 }, { a: 8, b: 7 }, { a: 8, b: 8 },
// Table de 9 (Difficiles)
{ a: 9, b: 2 }, { a: 9, b: 3 }, { a: 9, b: 4 },  { a: 9, b: 6 }, { a: 9, b: 7 }, { a: 9, b: 8 }, { a: 9, b: 9 }, { a: 9, b: 11 }, { a: 9, b: 12 },
// Table de 13
{ a: 13, b: 2 }, { a: 13, b: 3 }, { a: 13, b: 4 }, { a: 13, b: 5 }, { a: 13, b: 6 }, { a: 13, b: 7 }, { a: 13, b: 8 }, { a: 13, b: 9 }, { a: 13, b: 11 }, { a: 13, b: 12 },
// Table de 14
{ a: 14, b: 2 }, { a: 14, b: 3 }, { a: 14, b: 4 }, { a: 14, b: 5 }, { a: 14, b: 6 }, { a: 14, b: 7 }, { a: 14, b: 8 }, { a: 14, b: 9 }, { a: 14, b: 11 }, { a: 14, b: 12 },
// Table de 15
{ a: 15, b: 2 }, { a: 15, b: 3 }, { a: 15, b: 4 }, { a: 15, b: 5 }, { a: 15, b: 6 }, { a: 15, b: 7 }



        ]

    },

    expert: {
        name: "Expert (1-20)",
        color: "#dc2626",
        questions: [

            { a: 19, b: 11 }, { a: 15, b: 18 }, { a: 12, b: 20 }, { a: 18, b: 16 },
            { a: 20, b: 16 }, { a: 17, b: 12 }, { a: 14, b: 13 }, { a: 18, b: 12 },
            { a: 12, b: 11 }, { a: 19, b: 12 }, { a: 6, b: 16 }, { a: 14, b: 18 },
            { a: 12, b: 19 }, { a: 20, b: 17 }, { a: 13, b: 20 }, { a: 18, b: 19 },
            { a: 15, b: 20 }, { a: 17, b: 15 }, { a: 14, b: 16 }, { a: 11, b: 18 },
            { a: 9, b: 14 }, { a: 19, b: 16 }, { a: 13, b: 11 }, { a: 14, b: 20 },
            { a: 2, b: 17 }, { a: 11, b: 16 }, { a: 12, b: 15 }, { a: 20, b: 18 },
            { a: 15, b: 16 }, { a: 12, b: 14 }, { a: 13, b: 15 }, { a: 14, b: 15 },
            { a: 11, b: 20 }, { a: 7, b: 17 }, { a: 17, b: 19 }, { a: 13, b: 14 },
            { a: 14, b: 11 }, { a: 18, b: 11 }, { a: 20, b: 13 }, { a: 8, b: 19 },
            { a: 19, b: 13 }, { a: 12, b: 14 }, { a: 13, b: 19 }, { a: 16, b: 13 },
            { a: 15, b: 13 }, { a: 11, b: 17 }, { a: 4, b: 12 }, { a: 16, b: 11 },
            { a: 14, b: 16 }, { a: 20, b: 15 }, { a: 17, b: 20 }, { a: 12, b: 11 },
            { a: 12, b: 19 }, { a: 15, b: 11 }, { a: 13, b: 18 }, { a: 16, b: 19 },
            { a: 18, b: 14 }, { a: 19, b: 14 }, { a: 20, b: 16 }, { a: 17, b: 12 }


        ]

    }
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


// -------------------- UTILITY --------------------
// -------------------- MAIN COMPONENT --------------------
export default function MultiplicationChallengeokokok() {
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
    const [history, setHistory] = useState([]);

    // ---------------- LOCALSTORAGE HISTORIQUE ----------------
    useEffect(() => {
        const saved = localStorage.getItem('multiplicationHistory');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('multiplicationHistory', JSON.stringify(history));
    }, [history]);

    // ---------------- TIMER ----------------
    useEffect(() => {
        if (gameState === 'playing' && timerStarted) {
            const t = setTimeout(() => setTimeElapsed(x => x + 1), 1000);
            return () => clearTimeout(t);
        }
    }, [gameState, timerStarted, timeElapsed]);

    // ---------------- START GAME ----------------
    const startGame = (level) => {
        setSelectedLevel(level);
        setQuestions(shuffleArray(CHALLENGES[level].questions)); // mélange des questions
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswer('');
        setAnswers([]);
        setTimeElapsed(0);
        setTimerStarted(false);
        setQuestionStartTime(null);
    };

    // ---------------- CHECK ANSWER ----------------
    const checkAnswer = () => {
        if (!timerStarted) {
            setTimerStarted(true);
            setQuestionStartTime(Date.now());
        }

        const q = questions[currentQuestion];
        const correct = q.a * q.b;
        const isCorrect = parseInt(userAnswer) === correct;
        const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;

        const newAnswers = [
            ...answers,
            { question: `${q.a} × ${q.b}`, userAnswer, correctAnswer: correct, isCorrect, timeTaken }
        ];
        setAnswers(newAnswers);
        if (isCorrect) setScore(score + 10);

        setUserAnswer('');

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setQuestionStartTime(Date.now());
        } else {
            endGame(newAnswers);
        }
    };

    // ---------------- END GAME ----------------
    const endGame = (finalAnswers) => {
        if (!bestScores[selectedLevel] || score > bestScores[selectedLevel]) {
            setBestScores({ ...bestScores, [selectedLevel]: score });
        }

        const newHistoryEntry = {
            date: new Date().toLocaleString(),
            level: selectedLevel,
            score,
            totalQuestions: finalAnswers.length,
            correct: finalAnswers.filter(a => a.isCorrect).length,
            timeElapsed,
            answers: finalAnswers
        };

        setHistory([newHistoryEntry, ...history]); // ajoute en début d'historique
        setGameState('finished');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userAnswer) {
            checkAnswer();
        }
    };

    const resetGame = () => {
        setGameState('menu');
        setSelectedLevel(null);
    };

    // ---------------- LOGIN ----------------
    const renderLogin = () => (
        <div style={styles.container}>
            <h1 style={styles.title}>Identification</h1>
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
            >Continuer</button>
            {codeInput && codeInput !== SECRET_CODE && <p style={{ color: 'red' }}>❌ Code incorrect</p>}
        </div>
    );

    // ---------------- MENU ----------------
    const renderMenu = () => (
        <div style={styles.container}>
            <h1 style={styles.title}>Concours de Multiplication</h1>
            <div style={styles.levelGrid}>
                {Object.entries(CHALLENGES).map(([key, challenge]) => (
                    <div key={key} style={{ ...styles.levelCard, borderColor: challenge.color }} onClick={() => startGame(key)}>
                        {bestScores[key] && <div style={{ ...styles.badge, backgroundColor: challenge.color }}>⭐ Meilleur: {bestScores[key]}</div>}
                        <h2 style={{ ...styles.levelName, color: challenge.color }}>{challenge.name}</h2>
                        <p>📝 {challenge.questions.length} questions</p>
                        <button style={{ ...styles.startButton, backgroundColor: challenge.color }}>▶️ Commencer</button>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#f9f9f9', // Fond clair pour le bloc historique
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Légère ombre
            }}>
                <h2 style={{
                    textAlign: 'center',
                    color: '#333', // Couleur de titre plus foncée
                    marginBottom: '20px',
                    borderBottom: '2px solid #007bff', // Soulignement de couleur
                    paddingBottom: '10px'
                }}>
                    📜 Historique des Parties 🏆
                </h2>

                {history.length === 0 && (
                    <p style={{
                        textAlign: 'center',
                        color: '#6c757d',
                        fontStyle: 'italic'
                    }}>
                        Aucune partie jouée pour le moment. Lancez-vous ! 🚀
                    </p>
                )}

                {history.map((h, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px',
                            border: '1px solid #e0e0e0',
                            margin: '10px 0',
                            borderRadius: '10px',
                            backgroundColor: '#fff', // Fond blanc pour chaque entrée
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                        }}
                        // Effet hover pour rendre ça plus interactif
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        {/* Colonne 1 : Date et Niveau */}
                        <div style={{ flex: 2, minWidth: '150px' }}>
                            <div style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '4px' }}>
                                📅 {h.date}
                            </div>
                            <div style={{ color: '#555', fontSize: '0.9em' }}>
                                ✨ Niveau: **{CHALLENGES[h.level].name}**
                            </div>
                        </div>

                        {/* Colonne 2 : Score et Précision */}
                        <div style={{ flex: 1, textAlign: 'center', minWidth: '100px' }}>
                            <div style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1em' }}>
                                💯 Score: {h.score}
                            </div>
                            <div style={{ color: '#555', fontSize: '0.9em' }}>
                                ✅ Précision: {h.correct}/{h.totalQuestions}
                            </div>
                        </div>

                        {/* Colonne 3 : Temps */}
                        <div style={{ flex: 1, textAlign: 'right', minWidth: '80px' }}>
                            <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                ⏱️ {Math.floor(h.timeElapsed / 60)}:{String(h.timeElapsed % 60).padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ---------------- GAME ----------------
    const renderGame = () => {
        const question = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;

        return (
            <div style={styles.container}>
                <div style={{ ...styles.gameHeader, backgroundColor: CHALLENGES[selectedLevel].color }}>
                    <div style={styles.statsChip}>⏱️ {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</div>
                    <div style={styles.statsChip}>Question {currentQuestion + 1}/{questions.length}</div>
                    <div style={styles.statsChip}>⭐ {score} pts</div>
                </div>

                <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${progress}%` }} /></div>

                <div style={styles.questionCard}>
                    <h1 style={styles.question}>{question.a} × {question.b}</h1>
                    <input type="number" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} onKeyPress={handleKeyPress} style={styles.input} autoFocus />
                    <button style={{ ...styles.validateButton, opacity: userAnswer ? 1 : 0.5 }} disabled={!userAnswer} onClick={checkAnswer}>Valider</button>
                </div>
            </div>
        );
    };

    // ---------------- RESULTS ----------------
    const renderResults = () => {
        const correctCount = answers.filter(a => a.isCorrect).length;
        const accuracy = ((correctCount / answers.length) * 100).toFixed(1);

        return (
            <div style={styles.container}>
                <div style={{ ...styles.resultsHeader, backgroundColor: CHALLENGES[selectedLevel].color }}>
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

    // ---------------- MAIN ----------------
    return (
        <div style={styles.app}>
            {gameState === 'login' && renderLogin()}
            {gameState === 'menu' && renderMenu()}
            {gameState === 'playing' && renderGame()}
            {gameState === 'finished' && renderResults()}
            
        </div>
    );
}

// -------------------- STYLES (IDENTIQUES À TON DESIGN) --------------------
const styles = {
    app: { minHeight: '100vh', background: '#f3f4f6', padding: '20px' },
    container: { maxWidth: '900px', margin: '0 auto' },

    title: { fontSize: '3rem', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' },
    subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '25px' },

    levelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    levelCard: { background: '#fff', padding: '20px', borderRadius: '16px', border: '3px solid', cursor: 'pointer', position: 'relative' },
    badge: { position: 'absolute', top: '-12px', right: '15px', padding: '4px 12px', borderRadius: '12px', color: '#fff' },
    levelName: { fontSize: '1.4rem', fontWeight: 'bold' },
    questionCount: { color: '#6b7280', margin: '5px 0 15px' },
    startButton: { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem' },

    gameHeader: { padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', color: '#fff' },
    statsChip: { background: 'white', color: '#333', padding: '10px 15px', borderRadius: '12px', fontWeight: 'bold' },

    progressBar: { background: '#e5e7eb', height: '10px', borderRadius: '10px', overflow: 'hidden', marginBottom: '30px' },
    progressFill: { height: '100%', background: '#6366f1' },

    questionCard: { background: '#fff', padding: '60px 30px', textAlign: 'center', borderRadius: '16px' },
    question: { fontSize: '4rem', color: '#6366f1' },
    input: { width: '100%', padding: '20px', fontSize: '2rem', margin: '20px 0', borderRadius: '12px', border: '2px solid #ddd', textAlign: 'center' },
    validateButton: { width: '100%', padding: '18px', background: '#6366f1', color: '#fff', fontSize: '1.3rem', borderRadius: '12px', border: 'none' },

    resultsHeader: { padding: '30px', borderRadius: '16px', textAlign: 'center', marginBottom: '30px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' },
    statCard: { background: '#fff', padding: '20px', borderRadius: '14px', textAlign: 'center' },
    statValue: { fontSize: '2.5rem', margin: '0' },

    answersContainer: { background: '#fff', padding: '25px', borderRadius: '16px', marginBottom: '20px' },
    answersTitle: { fontSize: '1.2rem', marginBottom: '15px' },
    answerItem: { padding: '12px', borderRadius: '8px', margin: '8px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', alignItems: 'center' },

    buttonGroup: { display: 'flex', gap: '15px' },
    retryButton: { flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid #6366f1', background: 'white', color: '#6366f1' },
    menuButton: { flex: 1, padding: '15px', borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none' }
};
