import React, { useState, useEffect, useRef,useCallback } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    LinearProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { blue, red, green, grey } from "@mui/material/colors";

// ============================
// 🔹 1️⃣ DATA MULTIPLICATION TABLES
// ============================
const tablesJSON_1_10 = Object.fromEntries(
    Array.from({ length: 20 }, (_, t) => [
        t + 1,
        Array.from({ length: 20 }, (_, i) => ({
            q: `${t + 1} × ${i + 1}`,
            a: (t + 1) * (i + 1),
        })),
    ])
);

// ============================
// 🔹 2️⃣ MAIN COMPONENT
// ============================
export default function JeuTablesMUI() {
    const [table, setTable] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState(0);
    const [errors, setErrors] = useState(0);
    const [mistakes, setMistakes] = useState([]);
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const [historique, setHistorique] = useState([]);
    const [lang, setLang] = useState("fr");
    const inputRef = useRef(null);

    // 🕒 Language dictionary
    const texts = {
        fr: {
            title: "Jeu des tables de multiplication",
            intro:
                "👋 Bonjour champion ! Entraîne-toi tous les jours à tes tables avant le grand concours ! Chaque bonne réponse t’aide à devenir un as des maths 💪",
            table: "Table de",
            correct: "Correct",
            errors: "Erreurs",
            success: "Réussite",
            time: "Temps",
            placeholder: "Ta réponse",
            verify: "Vérifier",
            restart: "Recommencer",
            finished: "🎉 Partie terminée !",
            chooseTable: "Choisir la table",
            results: "📊 Résultats des parties",
            mistakesTitle: "❌ Tes erreurs",
            yourAnswer: "Ta réponse",
            correctAnswer: "Bonne réponse",
        },
        en: {
            title: "Multiplication Tables Game",
            intro:
                "👋 Hi champion! Practice your tables every day before the big contest! Every correct answer helps you become a math star 💪",
            table: "Table of",
            correct: "Correct",
            errors: "Mistakes",
            success: "Success",
            time: "Time",
            placeholder: "Your answer",
            verify: "Check",
            restart: "Restart",
            finished: "🎉 Game finished!",
            chooseTable: "Choose a table",
            results: "📊 Game Results",
            mistakesTitle: "❌ Your Mistakes",
            yourAnswer: "Your answer",
            correctAnswer: "Correct answer",
        },
    };

    const t = texts[lang];

   
    // Timer
    useEffect(() => {
        let timer;
        if (running) timer = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, [running]);

    // Auto focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, [index, finished]);

    // ============================
    // 🔹 FUNCTIONS
    // ============================

   const resetGame = useCallback(() => {
       const allQuestions = tablesJSON_1_10[String(table)] || [];
       const shuffled = allQuestions.sort(() => Math.random() - 0.5);
       const q10 = shuffled.slice(0, 10);
       setQuestions(q10);
       setIndex(0);
       setCorrect(0);
       setErrors(0);
       setAnswer("");
       setMistakes([]);
       setTime(0);
       setRunning(false);
       setFinished(false);
     }, [table]);
   
     useEffect(() => {
       resetGame();
     }, [resetGame]);
    const handleVerify = () => {
        if (!running) setRunning(true);
        const q = questions[index];
        if (!q) return;
        const isCorrect = Number(answer) === q.a;

        if (isCorrect) {
            setCorrect((c) => c + 1);
        } else {
            setErrors((e) => e + 1);
            setMistakes((m) => [
                ...m,
                { question: q.q, your: answer, correct: q.a },
            ]);
        }

        setAnswer("");
        if (index + 1 < questions.length) {
            setIndex((i) => i + 1);
        } else {
            setRunning(false);
            setFinished(true);
            ajouterHistorique(correct + (isCorrect ? 1 : 0), errors + (isCorrect ? 0 : 1));
        }
    };

    const ajouterHistorique = (finalCorrect, finalErrors) => {
        const totalQuestions = questions.length;
        const successRate = ((finalCorrect / totalQuestions) * 100).toFixed(0);
        const newLine = {
            table,
            correct: finalCorrect,
            errors: finalErrors,
            successRate,
            time: formatTime(time),
        };
        setHistorique((prev) => [...prev, newLine]);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && answer.trim() !== "" && !finished) {
            handleVerify();
        }
    };

    const progress = ((index+1) / (questions.length || 1)) * 100;
    const successRate = (
        (correct / Math.max(1, correct + errors)) *
        100
    ).toFixed(0);

    // ============================
    // 🔹 RENDER
    // ============================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            {/* 🌍 LANGUAGE SWITCH */}
            <Button
                variant="contained"
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                sx={{
                    alignSelf: "center",
                    mb: 3,
                    background: "#ffffffaa",
                    color: "#333",
                    fontWeight: "bold",
                    "&:hover": { background: "#fff" },
                }}
            >
                {lang === "fr" ? "English" : "Français"}
            </Button>

            {/* 🔹 Introduction */}
            <Typography
                variant="h6"
                align="center"
                sx={{
                    mb: 3,
                    color: "white",
                    maxWidth: 700,
                    textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                }}
            >
                {t.intro}
            </Typography>

            {/* 🔹 Quiz Card */}
            <Card sx={{ maxWidth: 800, width: "100%", borderRadius: 4, boxShadow: 6, mb: 3 }}>
                <CardContent>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ fontWeight: "bold", color: blue[800], mb: 2 }}
                    >
                        {t.table} {table}
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 20, borderRadius: 5, mb: 3 }}
                    />

                    {/* Stats */}
                    <Grid container sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}>
                        <StatCard label={t.correct} value={correct} color="#d1ecf1" textColor="#0c5460" />
                        <StatCard label={t.errors} value={errors} color="#f8d7da" textColor="#721c24" />
                        <StatCard label={t.success} value={`${successRate}%`} color="#d4edda" textColor="#155724" />
                        <StatCard label={t.time} value={formatTime(time)} color="#e7d5ff" textColor="#5a1f99" />
                    </Grid>

                    {!finished ? (
                        questions[index] && (
                            <>
                                <Typography align="center" sx={{ fontSize: 50, fontWeight: "bold", mb: 2 }}>
                                    {questions[index].q} = ?
                                </Typography>
                                <TextField
                                    inputRef={inputRef}
                                    fullWidth
                                    variant="outlined"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder={t.placeholder}
                                    inputProps={{ style: { textAlign: "center", fontSize: 50 } }}
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleVerify}
                                    sx={{
                                        py: 1.5,
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                >
                                    {t.verify}
                                </Button>
                            </>
                        )
                    ) : (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {t.finished}
                            </Typography>

                            {/* 🎯 Mistakes List */}
                            {mistakes.length > 0 && (
                                <Box sx={{ mt: 2, width: '100%', maxWidth: 800, mx: 'auto' }}>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        {t.mistakesTitle}
                                    </Typography>
                                    <Table sx={{ fontSize: '1.2rem' }}>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: grey[200] }}>
                                                <TableCell sx={{ fontSize: '1.1rem', py: 2 }}>{t.table}</TableCell>
                                                <TableCell sx={{ fontSize: '1.1rem', py: 2 }}>{t.yourAnswer}</TableCell>
                                                <TableCell sx={{ fontSize: '1.1rem', py: 2 }}>{t.correctAnswer}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mistakes.map((m, i) => (
                                                <TableRow key={i}>
                                                    <TableCell sx={{ fontSize: '1.1rem', py: 2 }}>{m.question}</TableCell>
                                                    <TableCell sx={{ color: red[700], fontSize: '1.1rem', py: 2 }}>{m.your}</TableCell>
                                                    <TableCell sx={{ color: green[700], fontSize: '1.1rem', py: 2 }}>{m.correct}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            )}


                            <Button
                                variant="contained"
                                onClick={resetGame}
                                sx={{
                                    mt: 3,
                                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                                    "&:hover": { opacity: 0.9 },
                                }}
                            >
                                {t.restart}
                            </Button>
                        </Box>
                    )}

                    {/* Choix table */}
                    <Box sx={{ mt: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>{t.chooseTable}</InputLabel>
                            <Select
                                value={table}
                                onChange={(e) => setTable(Number(e.target.value))}
                                label={t.chooseTable}
                            >
                                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                                    <MenuItem key={n} value={n}>
                                        {t.table} {n}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            {/* Historique */}
            {historique.length > 0 && (
                <Card sx={{ maxWidth: 800, width: "100%", borderRadius: 3, boxShadow: 4 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ mb: 2, color: grey[800], fontWeight: "bold" }}
                        >
                            {t.results}
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: grey[200] }}>
                                    <TableCell align="center">
                                        <b>{t.table}</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>{t.correct}</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>{t.errors}</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>{t.success}</b>
                                    </TableCell>
                                    <TableCell align="center">
                                        <b>{t.time}</b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historique.map((h, i) => (
                                    <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? blue[50] : grey[50] }}>
                                        <TableCell align="center">{h.table}</TableCell>
                                        <TableCell align="center">{h.correct}</TableCell>
                                        <TableCell align="center">{h.errors}</TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ color: h.successRate >= 80 ? green[700] : red[700] }}
                                        >
                                            {h.successRate}%
                                        </TableCell>
                                        <TableCell align="center">{h.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

// ============================
// 🔹 Subcomponent for stats
// ============================
function StatCard({ label, value, color, textColor }) {
    return (
        <Grid item xs={3}>
            <Card
                sx={{
                    textAlign: "center",
                    padding: 2,
                    borderRadius: 3,
                    backgroundColor: color,
                    minHeight: "120px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Typography sx={{ fontSize: 32, fontWeight: "bold", color: textColor }}>
                    {value}
                </Typography>
                <Typography>{label}</Typography>
            </Card>
        </Grid>
    );
}

// ============================
// 🔹 Format Time
// ============================
function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(1, "0")}:${String(sec).padStart(2, "0")}`;
}
