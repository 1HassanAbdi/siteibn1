import React, { useState } from 'react';
import { RotateCcw, Star, Trophy } from 'lucide-react';
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
    Chip
} from '@mui/material';

// ================== DONNÉES (UNIVERS SOCIAL) ==================

const DEFINITIONS = [
    { id: "continent", name: "Continent", definition: "Une immense étendue de terre (ex: Amérique, Afrique)", caracteristique: "Grande terre" },
    { id: "ocean", name: "Océan", definition: "Une immense étendue d'eau salée", caracteristique: "Grande eau salée" },
    { id: "pays", name: "Pays", definition: "Un territoire délimité par des frontières (ex: Canada)", caracteristique: "Frontières et lois" },
    { id: "ville", name: "Ville", definition: "Un endroit où vivent beaucoup de gens (ex: Montréal)", caracteristique: "Maisons et rues" }
];

const ITEMS_DATA = [
    { id: 1, name: "Iglou", category: "froid", emoji: "🏠❄️" },
    { id: 2, name: "Chameau", category: "chaud", emoji: "🐫" },
    { id: 3, name: "Gratte-ciel", category: "ville", emoji: "🏙️" },
    { id: 4, name: "Ours Polaire", category: "froid", emoji: "🐻‍❄️" },
    { id: 5, name: "Cactus", category: "chaud", emoji: "🌵" },
    { id: 6, name: "Autobus", category: "ville", emoji: "🚌" },
    { id: 7, name: "Sapin", category: "nature", emoji: "🌲" },
    { id: 8, name: "Cerf", category: "nature", emoji: "🦌" },
    { id: 9, name: "Neige", category: "froid", emoji: "☃️" },
    { id: 10, name: "Pyramide", category: "chaud", emoji: "🔺" },
    { id: 11, name: "Feu de circulation", category: "ville", emoji: "🚦" },
    { id: 12, name: "Rivière", category: "nature", emoji: "🏞️" },
];

const CATEGORIES_EX2 = [
    { id: "froid", name: "Pays Froid ❄️", desc: "Glace et Neige", color: "#e3f2fd" },
    { id: "chaud", name: "Pays Chaud ☀️", desc: "Soleil et Désert", color: "#fff3e0" },
    { id: "ville", name: "La Ville 🏙️", desc: "Routes et Immeubles", color: "#eceff1" },
    { id: "nature", name: "La Nature 🌲", desc: "Forêt et Animaux", color: "#e8f5e9" }
];

const QUIZ_QUESTIONS = [
    { id: 1, question: "Le Canada se trouve sur quel continent ?", answer: "Amerique", options: ["Europe", "Amerique", "Asie"] },
    { id: 2, question: "Quelle fête utilise une citrouille ?", answer: "Halloween", options: ["Noel", "Paques", "Halloween"] },
    { id: 3, question: "La couleur bleue sur une carte représente...", answer: "Eau", options: ["Foret", "Eau", "Montagne"] },
    { id: 4, question: "Le Père Noël habite au...", answer: "Nord", options: ["Sud", "Nord", "Desert"] },
    { id: 5, question: "Le drapeau du Canada a une feuille...", answer: "Erable", options: ["Chene", "Palmier", "Erable"] },
    { id: 6, question: "Une personne qui dirige une ville est un...", answer: "Maire", options: ["Roi", "Maire", "Policier"] },
];

const CHARACTERISTICS_QUIZ = [
    { id: 1, question: "Je suis le plus grand océan.", answer: "ocean", animal: "🌊" },
    { id: 2, question: "Je contiens beaucoup de pays (ex: Canada, USA).", answer: "continent", animal: "🌎" },
    { id: 3, question: "J'ai des feux de circulation et des magasins.", answer: "ville", animal: "🚦" },
    { id: 4, question: "J'ai mon propre drapeau et mon hymne national.", answer: "pays", animal: "🇨🇦" },
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
export default function SocialStudiesWorld() {
    const [exercise, setExercise] = useState(1);
    const [scores, setScores] = useState({ ex1: null, ex2: null, ex3: null, ex4: null });

    // ========== Exercise 1 (Définitions) ==========
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

    // ========== Exercise 2 (Drag & Drop) ==========
    const [items, setItems] = useState(() => shuffleArray(ITEMS_DATA));
    const [categoryItems, setCategoryItems] = useState({ froid: [], chaud: [], ville: [], nature: [] });
    const [draggedItem, setDraggedItem] = useState(null);
    const [showResultsEx2, setShowResultsEx2] = useState(false);

    const handleDragStart = (item) => setDraggedItem(item);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (catId) => {
        if (draggedItem) {
            setCategoryItems(prev => ({ ...prev, [catId]: [...prev[catId], draggedItem] }));
            setItems(prev => prev.filter(a => a.id !== draggedItem.id));
            setDraggedItem(null);
        }
    };
    const removeFromCategory = (item, catId) => {
        if (!showResultsEx2) {
            setCategoryItems(prev => ({ ...prev, [catId]: prev[catId].filter(a => a.id !== item.id) }));
            setItems(prev => [...prev, item]);
        }
    };
    const checkExercise2 = () => {
        let correct = 0;
        Object.entries(categoryItems).forEach(([cat, list]) => list.forEach(a => { if (a.category === cat) correct++; }));
        setScores(prev => ({ ...prev, ex2: correct }));
        setShowResultsEx2(true);
    };
    const resetExercise2 = () => { 
        setItems(shuffleArray(ITEMS_DATA)); 
        setCategoryItems({ froid: [], chaud: [], ville: [], nature: [] }); 
        setShowResultsEx2(false); 
        setScores(prev => ({ ...prev, ex2: null })); 
    };

    // ========== Exercise 3 (Quiz) ==========
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

    // ========== Exercise 4 (Caractéristiques) ==========
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
        return { total, max: DEFINITIONS.length + ITEMS_DATA.length + QUIZ_QUESTIONS.length + CHARACTERISTICS_QUIZ.length };
    };

    // ================== JSX ==================
    return (
        <Box sx={{ minHeight: '100vh', p: 4, bgcolor: '#fff3e0' }}> {/* Fond Orange Pastel */}
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                
                {/* Header */}
                <Paper sx={{ p: 4, mb: 4, bgcolor: 'white', boxShadow: 3, textAlign: 'center', borderRadius: 4 }}>
                    <Typography variant="h3" gutterBottom sx={{ color: '#e65100', fontWeight: 'bold' }}>
                        🌍 Le Monde et Nous
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>Univers Social - 2e Année</Typography>
                    
                    {/* AFFICHAGE DU SCORE TOTAL */}
                    {(scores.ex1 !== null || scores.ex2 !== null || scores.ex3 !== null || scores.ex4 !== null) && (
                        <Paper sx={{ bgcolor: '#fff9c4', p: 2, mt: 2, display: 'inline-flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
                            <Trophy size={32} color="#fbc02d" />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f57f17' }}>
                                Score Total: {getTotalScore().total} / {getTotalScore().max}
                            </Typography>
                        </Paper>
                    )}

                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        {[1, 2, 3, 4].map(num => (
                            <Grid item key={num}>
                                <Button 
                                    variant={exercise === num ? 'contained' : 'outlined'} 
                                    color="warning" 
                                    onClick={() => setExercise(num)}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Exercice {num} {scores[`ex${num}`] !== null ? '✅' : ''}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* ================= Exercice 1 (Définitions) ================= */}
                {exercise === 1 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#ffe0b2', borderRadius: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#e65100' }}>Exercice 1: Les Mots de Géographie</Typography>
                        <Typography variant="subtitle1" gutterBottom>Associe chaque mot à sa bonne définition.</Typography>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {DEFINITIONS.map((cat) => (
                                <Paper key={cat.id} sx={{ p: 2, bgcolor: 'white', border: '2px solid #ff9800', borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{cat.name}</Typography>
                                    <RadioGroup
                                        value={quizAnswersEx1[cat.id] || ''}
                                        onChange={(e) => !showResultsEx1 && handleQuizAnswerEx1(cat.id, e.target.value)}
                                    >
                                        {shuffledDefinitions.map(def => (
                                            <FormControlLabel
                                                key={def.id}
                                                value={def.id}
                                                control={<Radio disabled={showResultsEx1} color="warning" />}
                                                label={def.definition}
                                            />
                                        ))}
                                    </RadioGroup>
                                    {showResultsEx1 && (
                                        <Typography sx={{ mt: 1, fontWeight: 'bold', color: quizAnswersEx1[cat.id] === cat.id ? 'green' : 'red' }}>
                                            {quizAnswersEx1[cat.id] === cat.id ? '✅ Correct' : '❌ Incorrect'}
                                        </Typography>
                                    )}
                                </Paper>
                            ))}
                        </Stack>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, alignItems: 'center' }}>
                            {!showResultsEx1 ? (
                                <Button variant="contained" color="success" size="large" onClick={checkExercise1} disabled={Object.keys(quizAnswersEx1).length !== DEFINITIONS.length}>
                                    Vérifier
                                </Button>
                            ) : (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e65100' }}>Score: {scores.ex1} / {DEFINITIONS.length}</Typography>
                                    <Button variant="contained" color="warning" startIcon={<RotateCcw />} onClick={resetExercise1}>
                                        Recommencer
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Paper>
                )}

                {/* ================= Exercice 2 (Drag & Drop) ================= */}
                {exercise === 2 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#ffcc80', borderRadius: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#e65100' }}>Exercice 2: Où ça va ?</Typography>
                        <Typography variant="subtitle1" gutterBottom>Glisse l'image dans la bonne zone (Chaud, Froid, Ville, Nature).</Typography>

                        <Paper sx={{ p: 2, bgcolor: 'white', mb: 2, borderRadius: 2 }}>
                            <Typography variant="h6">Images à classer :</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, minHeight: 60 }}>
                                {items.map(a => (
                                    <Paper 
                                        key={a.id} 
                                        draggable 
                                        onDragStart={() => handleDragStart(a)} 
                                        sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'grab', bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}
                                    >
                                        <Typography sx={{ fontSize: 30 }}>{a.emoji}</Typography>
                                        <Typography fontWeight="bold">{a.name}</Typography>
                                    </Paper>
                                ))}
                                {items.length === 0 && <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>Tout est classé !</Typography>}
                            </Box>
                        </Paper>

                        <Grid container spacing={2}>
                            {CATEGORIES_EX2.map(cat => {
                                return (
                                    <Grid item xs={12} md={6} key={cat.id}>
                                        <Paper 
                                            onDragOver={handleDragOver} 
                                            onDrop={() => handleDrop(cat.id)} 
                                            sx={{ p: 2, bgcolor: cat.color, minHeight: 200, border: '2px dashed #ff9800', borderRadius: 2 }}
                                        >
                                            <Typography variant="h6" align="center" fontWeight="bold">{cat.name}</Typography>
                                            <Typography variant="body2" align="center">{cat.desc}</Typography>
                                            
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, justifyContent: 'center' }}>
                                                {categoryItems[cat.id].map(a => {
                                                    const isCorrect = a.category === cat.id;
                                                    return (
                                                        <Paper 
                                                            key={a.id} 
                                                            sx={{ 
                                                                p: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', 
                                                                border: `3px solid ${showResultsEx2 ? (isCorrect ? 'green' : 'red') : 'transparent'}` 
                                                            }}
                                                            onClick={() => removeFromCategory(a, cat.id)}
                                                        >
                                                            <Typography sx={{ fontSize: 24 }}>{a.emoji}</Typography>
                                                            <Typography variant="body2" fontWeight="bold">{a.name}</Typography>
                                                        </Paper>
                                                    );
                                                })}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, alignItems: 'center' }}>
                            {!showResultsEx2 ? (
                                <Button variant="contained" color="success" size="large" onClick={checkExercise2} disabled={items.length > 0}>
                                    Vérifier
                                </Button>
                            ) : (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e65100' }}>Score: {scores.ex2} / {ITEMS_DATA.length}</Typography>
                                    <Button variant="contained" color="warning" startIcon={<RotateCcw />} onClick={resetExercise2}>
                                        Recommencer
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Paper>
                )}

                {/* ================= Exercice 3 (Quiz) ================= */}
                {exercise === 3 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#ffccbc', borderRadius: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#d84315' }}>Exercice 3: Quiz Rapide</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {shuffledQuestions.map((q, idx) => (
                                <Paper key={q.id} sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500' }}>{idx + 1}. {q.question}</Typography>
                                    </Box>
                                    <RadioGroup value={quizAnswers[q.id] || ''} onChange={(e) => handleQuizAnswer(q.id, e.target.value)}>
                                        {q.options.map(opt => (
                                            <FormControlLabel key={opt} value={opt} control={<Radio disabled={showResultsEx3} color="warning" />} label={opt} />
                                        ))}
                                    </RadioGroup>
                                    {showResultsEx3 && (
                                        <Typography sx={{ mt: 1, fontWeight: 'bold', color: quizAnswers[q.id] === q.answer ? 'green' : 'red' }}>
                                            {quizAnswers[q.id] === q.answer ? '✅ Correct' : `❌ Incorrect (Réponse : ${q.answer})`}
                                        </Typography>
                                    )}
                                </Paper>
                            ))}
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, alignItems: 'center' }}>
                            {!showResultsEx3 ? (
                                <Button variant="contained" color="success" size="large" onClick={checkExercise3} disabled={Object.keys(quizAnswers).length !== shuffledQuestions.length}>
                                    Vérifier
                                </Button>
                            ) : (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d84315' }}>Score: {scores.ex3} / {QUIZ_QUESTIONS.length}</Typography>
                                    <Button variant="contained" color="warning" startIcon={<RotateCcw />} onClick={resetExercise3}>
                                        Recommencer
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Paper>
                )}

                {/* ================= Exercice 4 (Caractéristiques) ================= */}
                {exercise === 4 && (
                    <Paper sx={{ p: 4, mb: 4, bgcolor: '#d7ccc8', borderRadius: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#5d4037' }}>Exercice 4: Qui suis-je ?</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {shuffledCharQuestions.map((q, idx) => (
                                <Paper key={q.id} sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Typography variant="h3">{q.animal}</Typography>
                                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{idx + 1}. {q.question}</Typography>
                                    </Box>
                                    <RadioGroup row value={charAnswers[q.id] || ''} onChange={(e) => handleCharAnswer(q.id, e.target.value)}>
                                        {DEFINITIONS.map(d => (
                                            <FormControlLabel key={d.id} value={d.id} control={<Radio disabled={showResultsEx4} color="warning" />} label={d.name} />
                                        ))}
                                    </RadioGroup>
                                    {showResultsEx4 && (
                                        <Typography sx={{ mt: 1, fontWeight: 'bold', color: charAnswers[q.id] === q.answer ? 'green' : 'red' }}>
                                            {charAnswers[q.id] === q.answer ? '✅ Correct' : '❌ Incorrect'}
                                        </Typography>
                                    )}
                                </Paper>
                            ))}
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, alignItems: 'center' }}>
                            {!showResultsEx4 ? (
                                <Button variant="contained" color="success" size="large" onClick={checkExercise4} disabled={Object.keys(charAnswers).length !== shuffledCharQuestions.length}>
                                    Vérifier
                                </Button>
                            ) : (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Score: {scores.ex4} / {CHARACTERISTICS_QUIZ.length}</Typography>
                                    <Button variant="contained" color="warning" startIcon={<RotateCcw />} onClick={resetExercise4}>
                                        Recommencer
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}