import React, { useState } from 'react';
import { RotateCcw, Star } from 'lucide-react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Stack,

} from '@mui/material';

// ================== Données ==================
const DEFINITIONS = [
    { id: "mammifere", name: "Mammifères", definition: "Animaux qui allaitent leurs petits et ont des poils", caracteristique: "Ont des poils et allaitent" },
    { id: "oiseau", name: "Oiseaux", definition: "Animaux qui ont des plumes et des ailes", caracteristique: "Ont des plumes et pondent des œufs" },
    { id: "amphibien", name: "Amphibiens", definition: "Animaux qui vivent dans l'eau et sur terre", caracteristique: "Peau humide, vivent dans l'eau et sur terre" },
    { id: "reptile", name: "Reptiles", definition: "Animaux qui ont des écailles et rampent", caracteristique: "Ont des écailles et sont à sang froid" }
];

const ANIMALS_DATA = [
    { id: 1, name: "Lion", category: "mammifere", emoji: "🦁" },
    { id: 2, name: "Aigle", category: "oiseau", emoji: "🦅" },
    { id: 3, name: "Grenouille", category: "amphibien", emoji: "🐸" },
    { id: 4, name: "Serpent", category: "reptile", emoji: "🐍" },
    { id: 5, name: "Éléphant", category: "mammifere", emoji: "🐘" },
    { id: 6, name: "Perroquet", category: "oiseau", emoji: "🦜" },
    { id: 7, name: "Salamandre", category: "amphibien", emoji: "🦎" },
    { id: 8, name: "Tortue", category: "reptile", emoji: "🐢" },
    { id: 9, name: "Chat", category: "mammifere", emoji: "🐱" },
    { id: 10, name: "Pingouin", category: "oiseau", emoji: "🐧" },
    { id: 11, name: "Crocodile", category: "reptile", emoji: "🐊" },
    { id: 12, name: "Chien", category: "mammifere", emoji: "🐕" },
];

const QUIZ_QUESTIONS = [
    { id: 1, question: "Le chat est un:", answer: "mammifere", options: ["mammifere", "oiseau", "reptile"] },
    { id: 2, question: "L'aigle est un:", answer: "oiseau", options: ["mammifere", "oiseau", "amphibien"] },
    { id: 3, question: "La grenouille est un:", answer: "amphibien", options: ["reptile", "amphibien", "oiseau"] },
    { id: 4, question: "Le serpent est un:", answer: "reptile", options: ["mammifere", "reptile", "amphibien"] },
    { id: 5, question: "Le chien est un:", answer: "mammifere", options: ["mammifere", "oiseau", "reptile"] },
    { id: 6, question: "La tortue est un:", answer: "reptile", options: ["amphibien", "reptile", "oiseau"] },
];

const CHARACTERISTICS_QUIZ = [
    { id: 1, question: "Qui a des plumes?", answer: "oiseau", animal: "🦅" },
    { id: 2, question: "Qui allaite ses petits?", answer: "mammifere", animal: "🐱" },
    { id: 3, question: "Qui a des écailles et rampe?", answer: "reptile", animal: "🐍" },
    { id: 4, question: "Qui vit dans l'eau ET sur terre?", answer: "amphibien", animal: "🐸" },
];

// ================== Utils ==================
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};



// ================== Composant Principal ==================
export default function AnimalClassifierMUI() {
    const [exercise, setExercise] = useState(1);
    const [scores, setScores] = useState({ ex1: null, ex2: null, ex3: null, ex4: null });

    // ========== Exercise 1 ==========
    // ================== Exercise 1 ==================
    const [shuffledDefinitions] = useState(() => shuffleArray(DEFINITIONS));
    const [quizAnswersEx1, setQuizAnswersEx1] = useState({});
    const [showResultsEx1, setShowResultsEx1] = useState(false);

    const handleQuizAnswerEx1 = (catId, defId) => {
        setQuizAnswersEx1(prev => ({ ...prev, [catId]: defId }));
    };

    const checkExercise1 = () => {
        let score = 0;
        DEFINITIONS.forEach(cat => {
            if (quizAnswersEx1[cat.id] === cat.id) score++;
        });
        setScores(prev => ({ ...prev, ex1: score }));
        setShowResultsEx1(true);
    };

    const resetExercise1 = () => {
        setQuizAnswersEx1({});
        setShowResultsEx1(false);
        setScores(prev => ({ ...prev, ex1: null }));
    };


    // ========== Exercise 2 ==========
    const [animals, setAnimals] = useState(() => shuffleArray(ANIMALS_DATA));
    const [categoryAnimals, setCategoryAnimals] = useState({ mammifere: [], oiseau: [], amphibien: [], reptile: [] });
    const [draggedAnimal, setDraggedAnimal] = useState(null);
    const [showResultsEx2, setShowResultsEx2] = useState(false);

    const handleDragStart = (animal) => setDraggedAnimal(animal);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (catId) => {
        if (draggedAnimal) {
            setCategoryAnimals(prev => ({ ...prev, [catId]: [...prev[catId], draggedAnimal] }));
            setAnimals(prev => prev.filter(a => a.id !== draggedAnimal.id));
            setDraggedAnimal(null);
        }
    };
    const removeFromCategory = (animal, catId) => {
        setCategoryAnimals(prev => ({ ...prev, [catId]: prev[catId].filter(a => a.id !== animal.id) }));
        setAnimals(prev => [...prev, animal]);
    };
    const checkExercise2 = () => {
        let correct = 0;
        Object.entries(categoryAnimals).forEach(([cat, list]) => list.forEach(a => { if (a.category === cat) correct++; }));
        setScores(prev => ({ ...prev, ex2: correct }));
        setShowResultsEx2(true);
    };
    const resetExercise2 = () => { setAnimals(shuffleArray(ANIMALS_DATA)); setCategoryAnimals({ mammifere: [], oiseau: [], amphibien: [], reptile: [] }); setShowResultsEx2(false); setScores(prev => ({ ...prev, ex2: null })); };

    // ========== Exercise 3 ==========
    const [shuffledQuestions] = useState(() => shuffleArray(QUIZ_QUESTIONS));
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResultsEx3, setShowResultsEx3] = useState(false);
    const handleQuizAnswer = (qId, ans) => setQuizAnswers(prev => ({ ...prev, [qId]: ans }));
    const checkExercise3 = () => {
        const correct = QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.answer).length;
        setScores(prev => ({ ...prev, ex3: correct }));
        setShowResultsEx3(true);
    };
    const resetExercise3 = () => { setQuizAnswers({}); setShowResultsEx3(false); setScores(prev => ({ ...prev, ex3: null })); };

    // ========== Exercise 4 ==========
    const [shuffledCharQuestions] = useState(() => shuffleArray(CHARACTERISTICS_QUIZ));
    const [charAnswers, setCharAnswers] = useState({});
    const [showResultsEx4, setShowResultsEx4] = useState(false);
    const handleCharAnswer = (qId, ans) => setCharAnswers(prev => ({ ...prev, [qId]: ans }));
    const checkExercise4 = () => {
        const correct = CHARACTERISTICS_QUIZ.filter(q => charAnswers[q.id] === q.answer).length;
        setScores(prev => ({ ...prev, ex4: correct }));
        setShowResultsEx4(true);
    };
    const resetExercise4 = () => { setCharAnswers({}); setShowResultsEx4(false); setScores(prev => ({ ...prev, ex4: null })); };

    // ========== Total Score ==========
    const getTotalScore = () => {
        const total = (scores.ex1 || 0) + (scores.ex2 || 0) + (scores.ex3 || 0) + (scores.ex4 || 0);
        return { total, max: 26 };
    };

    // ================== JSX ==================
    return (
        <Box sx={{ minHeight: '100vh', p: 4, bgcolor: '#d0f0c0' }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                {/* Header */}
                <Paper sx={{ p: 4, mb: 4, bgcolor: 'white', boxShadow: 3, textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom>🦁 Les Animaux Vertébrés 🐸</Typography>
                    <Typography variant="subtitle1" gutterBottom>Programme de 2e année</Typography>
                    {(scores.ex1 || scores.ex2 || scores.ex3 || scores.ex4) && (
                        <Paper sx={{ bgcolor: '#fff9c4', p: 2, display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                            <Star color="gold" /><Typography variant="h6">Score total: {getTotalScore().total}/{getTotalScore().max}</Typography><Star color="gold" />
                        </Paper>
                    )}
                    <Grid container spacing={2} justifyContent="center">
                        {[1, 2, 3, 4].map(num => (
                            <Grid item key={num}>
                                <Button variant={exercise === num ? 'contained' : 'outlined'} color="primary" onClick={() => setExercise(num)}>
                                    Exercice {num}{scores[`ex${num}`] !== null ? ' ✓' : ''}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* ================= Exercice 1 ================= */}
                {/* ================= Exercice 1 ================= */}
                {/* ================= Exercice 1 ================= */}
                {exercise === 1 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#a5d6a7' }}>
                        <Typography variant="h4" gutterBottom>Exercice 1: Les Définitions</Typography>
                        <Typography variant="subtitle1" gutterBottom>Associe chaque groupe d'animaux à sa définition</Typography>

                        <Stack spacing={2}>
                            {DEFINITIONS.map((cat, idx) => (
                                <Paper key={cat.id} sx={{ p: 2, bgcolor: 'white', border: '2px solid #4caf50' }}>
                                    <Typography variant="h6">{cat.name}</Typography>
                                    <RadioGroup
                                        value={quizAnswersEx1[cat.id] || ''}
                                        onChange={(e) => !showResultsEx1 && handleQuizAnswerEx1(cat.id, e.target.value)}
                                    >
                                        {shuffledDefinitions.map(def => (
                                            <FormControlLabel
                                                key={def.id}
                                                value={def.id}
                                                control={<Radio disabled={showResultsEx1} />}
                                                label={def.definition}
                                            />
                                        ))}
                                    </RadioGroup>
                                    {showResultsEx1 && (
                                        <Typography sx={{ mt: 1 }}>
                                            {quizAnswersEx1[cat.id] === cat.id ? '✅ Correct' : '❌ Incorrect'}
                                        </Typography>
                                    )}
                                </Paper>
                            ))}
                        </Stack>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                            {!showResultsEx1 ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={Object.keys(quizAnswersEx1).length !== DEFINITIONS.length}
                                    onClick={checkExercise1}
                                >
                                    Vérifier
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<RotateCcw />}
                                    onClick={resetExercise1}
                                >
                                    Recommencer
                                </Button>
                            )}
                        </Box>
                    </Paper>
                )}



                {/* ================= Exercice 2 ================= */}
                {exercise === 2 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#81c784' }}>
                        <Typography variant="h4" gutterBottom>Exercice 2: Classe les Animaux</Typography>
                        <Typography variant="subtitle1" gutterBottom>Glisse chaque animal dans la bonne catégorie</Typography>

                        <Paper sx={{ p: 2, bgcolor: 'white', mb: 2 }}>
                            <Typography variant="h6">Animaux à classer:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                {animals.map(a => (
                                    <Paper key={a.id} draggable onDragStart={() => handleDragStart(a)} sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab' }}>
                                        <Typography sx={{ fontSize: 40 }}>{a.emoji}</Typography>
                                        <Typography>{a.name}</Typography>

                                    </Paper>
                                ))}
                            </Box>
                        </Paper>

                        <Grid container spacing={2}>
                            {DEFINITIONS.map(cat => {
                                const colors = { mammifere: '#c8e6c9', oiseau: '#fff59d', amphibien: '#a5d6a7', reptile: '#ef9a9a' };
                                return (
                                    <Grid item xs={12} md={6} key={cat.id}>
                                        <Paper onDragOver={handleDragOver} onDrop={() => handleDrop(cat.id)} sx={{ p: 2, bgcolor: colors[cat.id], minHeight: 200 }}>
                                            <Typography variant="h6">{cat.name}</Typography>
                                            <Typography variant="body2">{cat.caracteristique}</Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                {categoryAnimals[cat.id].map(a => {
                                                    const isCorrect = a.category === cat.id;
                                                    return (
                                                        <Paper key={a.id} sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: `8px solid ${showResultsEx2 ? (isCorrect ? 'green' : 'red') : 'gray'}` }}
                                                            onClick={() => !showResultsEx2 && removeFromCategory(a, cat.id)}>
                                                            <Typography sx={{ fontSize: 30 }}>{a.emoji}</Typography>
                                                            <Typography sx={{ fontSize: 12 }}>{a.name}</Typography>
                                                        </Paper>
                                                    );
                                                })}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                            {!showResultsEx2 ?
                                <Button variant="contained" color="success" disabled={animals.length > 0} onClick={checkExercise2}>Vérifier</Button>
                                :
                                <Button variant="contained" color="primary" startIcon={<RotateCcw />} onClick={resetExercise2}>Recommencer</Button>
                            }
                        </Box>
                    </Paper>
                )}

                {/* ================= Exercice 3 ================= */}
                {exercise === 3 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#4db6ac' }}>
                        <Typography variant="h4" gutterBottom>Exercice 3: Quiz</Typography>
                        <Stack spacing={2}>
                            {shuffledQuestions.map((q, idx) => (
                                <Paper key={q.id} sx={{ p: 2, bgcolor: 'white' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography>{idx + 1}. {q.question}</Typography>

                                    </Box>
                                    <RadioGroup value={quizAnswers[q.id] || ''} onChange={(e) => handleQuizAnswer(q.id, e.target.value)}>
                                        {q.options.map(opt => {
                                            const name = DEFINITIONS.find(d => d.id === opt)?.name || opt;
                                            return <FormControlLabel key={opt} value={opt} control={<Radio disabled={showResultsEx3} />} label={name} />
                                        })}
                                    </RadioGroup>
                                    {showResultsEx3 && <Typography>{quizAnswers[q.id] === q.answer ? '✅ Correct' : '❌ Incorrect'}</Typography>}
                                </Paper>
                            ))}
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                            {!showResultsEx3 ?
                                <Button variant="contained" color="success" disabled={Object.keys(quizAnswers).length !== shuffledQuestions.length} onClick={checkExercise3}>Vérifier</Button>
                                :
                                <Button variant="contained" color="primary" startIcon={<RotateCcw />} onClick={resetExercise3}>Recommencer</Button>
                            }
                        </Box>
                    </Paper>
                )}

                {/* ================= Exercice 4 ================= */}
                {exercise === 4 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#aed581' }}>
                        <Typography variant="h4" gutterBottom>Exercice 4: Caractéristiques</Typography>
                        <Stack spacing={2}>
                            {shuffledCharQuestions.map((q, idx) => (
                                <Paper key={q.id} sx={{ p: 2, bgcolor: 'white' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography>{idx + 1}. {q.question} {q.animal}</Typography>

                                    </Box>
                                    <RadioGroup value={charAnswers[q.id] || ''} onChange={(e) => handleCharAnswer(q.id, e.target.value)}>
                                        {DEFINITIONS.map(d => <FormControlLabel key={d.id} value={d.id} control={<Radio disabled={showResultsEx4} />} label={d.name} />)}
                                    </RadioGroup>
                                    {showResultsEx4 && <Typography>{charAnswers[q.id] === q.answer ? '✅ Correct' : '❌ Incorrect'}</Typography>}
                                </Paper>
                            ))}
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                            {!showResultsEx4 ?
                                <Button variant="contained" color="success" disabled={Object.keys(charAnswers).length !== shuffledCharQuestions.length} onClick={checkExercise4}>Vérifier</Button>
                                :
                                <Button variant="contained" color="primary" startIcon={<RotateCcw />} onClick={resetExercise4}>Recommencer</Button>
                            }
                        </Box>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}
