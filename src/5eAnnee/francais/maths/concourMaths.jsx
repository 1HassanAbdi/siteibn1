import React, { useState, useEffect } from 'react';

const CHALLENGES = {
    facile: {
        name: "Débutant (1-10)",
        color: "#10b981",
        questions: [
            { a: 4, b: 7 }, { a: 2, b: 9 }, { a: 10, b: 6 }, { a: 5, b: 8 },
            { a: 9, b: 4 }, { a: 6, b: 10 }, { a: 8, b: 3 }, { a: 1, b: 9 },
            { a: 10, b: 5 }, { a: 7, b: 4 }, { a: 3, b: 6 }, { a: 2, b: 8 },
            { a: 5, b: 7 }, { a: 9, b: 2 }, { a: 6, b: 3 }, { a: 8, b: 10 },
            { a: 1, b: 4 }, { a: 7, b: 9 }, { a: 10, b: 1 }, { a: 3, b: 5 }
        ]
    },
    moyen: {
        name: "Intermédiaire (1-12)",
        color: "#f59e0b",
        questions: [
            { a: 4, b: 7 }, { a: 8, b: 9 }, { a: 12, b: 6 }, { a: 7, b: 11 },
            { a: 5, b: 12 }, { a: 10, b: 8 }, { a: 9, b: 7 }, { a: 12, b: 5 },
            { a: 11, b: 4 }, { a: 6, b: 10 }, { a: 3, b: 8 }, { a: 2, b: 9 },
            { a: 7, b: 3 }, { a: 12, b: 1 }, { a: 5, b: 6 }, { a: 9, b: 12 },
            { a: 4, b: 11 }, { a: 8, b: 2 }, { a: 10, b: 5 }, { a: 6, b: 7 }
        ]
    },
    difficile: {
        name: "Avancé (1-15)",
        color: "#f97316",
        questions: [
            { a: 4, b: 15 }, { a: 12, b: 7 }, { a: 15, b: 9 }, { a: 8, b: 13 },
            { a: 14, b: 6 }, { a: 5, b: 11 }, { a: 9, b: 14 }, { a: 15, b: 4 },
            { a: 10, b: 12 }, { a: 13, b: 8 }, { a: 6, b: 15 }, { a: 7, b: 9 },
            { a: 2, b: 14 }, { a: 11, b: 5 }, { a: 3, b: 12 }, { a: 1, b: 10 },
            { a: 8, b: 6 }, { a: 12, b: 3 }, { a: 15, b: 2 }, { a: 4, b: 9 }
        ]
    },
    expert: {
        name: "Expert (1-20)",
        color: "#dc2626",
        questions: [
            { a: 4, b: 17 }, { a: 12, b: 5 }, { a: 19, b: 8 }, { a: 7, b: 20 },
            { a: 15, b: 4 }, { a: 9, b: 18 }, { a: 6, b: 11 }, { a: 20, b: 7 },
            { a: 14, b: 16 }, { a: 11, b: 9 }, { a: 3, b: 12 }, { a: 10, b: 5 },
            { a: 8, b: 13 }, { a: 17, b: 6 }, { a: 2, b: 19 }, { a: 5, b: 14 },
            { a: 13, b: 3 }, { a: 16, b: 8 }, { a: 1, b: 20 }, { a: 18, b: 4 }
        ]
    }
};

export default function MultiplicationChallenge() {
    const [gameState, setGameState] = useState('menu');
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0); // TOTAL time
    const [answers, setAnswers] = useState([]);
    const [bestScores, setBestScores] = useState({});
    const [timerStarted, setTimerStarted] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(null);

    // ---------------- TIMER 0:00 → X:XX ----------------
    useEffect(() => {
        if (gameState === 'playing' && timerStarted) {
            const timer = setTimeout(() => setTimeElapsed(t => t + 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, timerStarted, timeElapsed]);

    // ---------------- START GAME ----------------
    const startGame = (level) => {
        setSelectedLevel(level);
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

        const question = CHALLENGES[selectedLevel].questions[currentQuestion];
        const correctAnswer = question.a * question.b;
        const isCorrect = parseInt(userAnswer) === correctAnswer;

        const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;

        const newAnswers = [
            ...answers,
            {
                question: `${question.a} × ${question.b}`,
                userAnswer,
                correctAnswer,
                isCorrect,
                timeTaken
            }
        ];
        setAnswers(newAnswers);

        if (isCorrect) setScore(score + 10);

        setUserAnswer('');

        if (currentQuestion < CHALLENGES[selectedLevel].questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setQuestionStartTime(Date.now());
        } else {
            endGame();
        }
    };

    // ---------------- END GAME ----------------
    const endGame = () => {
        if (!bestScores[selectedLevel] || score > bestScores[selectedLevel]) {
            setBestScores({ ...bestScores, [selectedLevel]: score });
        }
        setGameState('finished');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userAnswer && gameState === 'playing') {
            checkAnswer();
        }
    };

    const resetGame = () => {
        setGameState('menu');
        setSelectedLevel(null);
    };

    // ---------------- MENU ----------------
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

                        <button
                            style={{ ...styles.startButton, backgroundColor: challenge.color }}
                        >
                            ▶️ Commencer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    // ---------------- GAME ----------------
    const renderGame = () => {
        const challenge = CHALLENGES[selectedLevel];
        const question = challenge.questions[currentQuestion];
        const progress = ((currentQuestion + 1) / challenge.questions.length) * 100;

        return (
            <div style={styles.container}>
                <div style={{ ...styles.gameHeader, backgroundColor: challenge.color }}>
                    <div style={styles.statsChip}>
                        ⏱️ {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}
                    </div>
                    <div style={styles.statsChip}>
                        Question {currentQuestion + 1}/{challenge.questions.length}
                    </div>
                    <div style={styles.statsChip}>⭐ {score} pts</div>
                </div>

                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                </div>

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
                        style={{ ...styles.validateButton, opacity: userAnswer ? 1 : 0.5 }}
                        disabled={!userAnswer}
                        onClick={checkAnswer}
                    >
                        Valider
                    </button>
                </div>
            </div>
        );
    };

    // ---------------- RESULTS ----------------
    const renderResults = () => {
        const challenge = CHALLENGES[selectedLevel];
        const correctCount = answers.filter(a => a.isCorrect).length;
        const accuracy = ((correctCount / answers.length) * 100).toFixed(1);

        return (
            <div style={styles.container}>
                <div style={{ ...styles.resultsHeader, backgroundColor: challenge.color }}>
                    <h1 style={{ color: 'white' }}>Résultats</h1>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <h2 style={styles.statValue}>{score}</h2>
                        <p>Score</p>
                    </div>

                    <div style={styles.statCard}>
                        <h2 style={styles.statValue}>{correctCount}/{answers.length}</h2>
                        <p>Correctes</p>
                    </div>

                    <div style={styles.statCard}>
                        <h2 style={styles.statValue}>{accuracy}%</h2>
                        <p>Précision</p>
                    </div>

                    <div style={styles.statCard}>
                        <h2 style={styles.statValue}>
                            {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}
                        </h2>
                        <p>⏱️ Temps total</p>
                    </div>
                </div>

                <div style={styles.answersContainer}>
                    <h3 style={styles.answersTitle}>📊 Détails</h3>

                    {answers.map((a, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.answerItem,
                                backgroundColor: a.isCorrect ? '#10b98120' : '#ef444420'
                            }}
                        >
                            <b>{a.question}</b>
                            <span>Votre réponse : {a.userAnswer}</span>
                            <span>Correct : {a.correctAnswer}</span>
                            <span>⏱️ {a.timeTaken}s</span>
                            <span>{a.isCorrect ? '✅' : '❌'}</span>
                        </div>
                    ))}
                </div>

                <div style={styles.buttonGroup}>
                    <button style={styles.retryButton} onClick={() => startGame(selectedLevel)}>
                        🔄 Rejouer
                    </button>

                    <button style={styles.menuButton} onClick={resetGame}>
                        🏠 Menu
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.app}>
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
