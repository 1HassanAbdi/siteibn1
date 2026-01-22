import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import MultiplicationContest2 from "./multiplicatio";
import MultiplicationContestJson4 from "./multiple";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Générer 15 questions uniques selon le niveau
function generateUniqueQuestions(level) {
  let max = 10;
  if (level === 3) max = 10;
  else if (level === 4 || level === 5) max = 12;
  else max = 15;

  const used = new Set();
  const questions = [];

  while (questions.length < 15) {
    const a = getRandomInt(1, max);
    const b = getRandomInt(1, max);
    const key = `${a}x${b}`;
    if (!used.has(key)) {
      used.add(key);
      questions.push({ id: questions.length + 1, q: `${a} × ${b}`, answer: a * b });
    }
  }
  return questions;
}

export default function MultiplicationContest() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started && !finished) {
      const id = setInterval(() => setTime((t) => t + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [started, finished]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (!name.trim() || !level) {
      setError("Veuillez entrer votre nom et sélectionner votre classe !");
      return;
    }
    setError("");
    const qs = generateUniqueQuestions(parseInt(level));
    setQuestions(qs);
    setStarted(true);
    setFinished(false);
    setTime(0);
    setAnswers([]);
    setCurrentIndex(0);
    setCurrentAnswer("");
  };

  const handleNext = () => {
    if (currentAnswer.trim() === "") {
      setError("Veuillez entrer une réponse avant de continuer !");
      return;
    }
    setError("");
    const ans = [...answers, { ...questions[currentIndex], user: parseInt(currentAnswer) }];
    setAnswers(ans);
    setCurrentAnswer("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      clearInterval(intervalId);
      setFinished(true);
      setStarted(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const score = answers.reduce(
    (acc, q) => acc + (q.user === q.answer ? 1 : 0),
    0
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Card sx={{ p: 3, boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
            🧮 Concours de multiplication
          </Typography>

          {!started && !finished && (
            <Box sx={{ mb: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Nom de l'élève"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mt: 2 }}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Classe</InputLabel>
                <Select
                  value={level}
                  label="Classe"
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <MenuItem value={3}> De 1 à 10 </MenuItem>
                  <MenuItem value={4}>De 1 à 12</MenuItem>
                  <MenuItem value={5}>De 1 à 12</MenuItem>
                  <MenuItem value={6}>De 1 à 15</MenuItem>
                  <MenuItem value={7}>De 1 à 15</MenuItem>
                  
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, width: "100%" }}
                onClick={handleStart}
              >
                Commencer
              </Button>
            </Box>
          )}

          {started && !finished && questions.length > 0 && (
            <Box textAlign="center">
              <Typography variant="h6" sx={{ mb: 2 }}>
                ⏱ Temps écoulé: {formatTime(time)}
              </Typography>
              <Typography
                variant="h3"
                sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}
              >
                {questions[currentIndex].q}
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Votre réponse"
                type="number"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                autoFocus
                sx={{ fontSize: "1.5rem" }}
              />
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2, width: "100%" }}
                onClick={handleNext}
              >
                {currentIndex + 1 === questions.length ? "Terminer" : "Suivant"}
              </Button>
              <Typography sx={{ mt: 2 }}>
                Question {currentIndex + 1} / {questions.length}
              </Typography>
            </Box>
          )}

          {finished && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                {name}, vous avez terminé !
              </Typography>
              <Typography variant="h5" gutterBottom>
                Temps: {formatTime(time)}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Score: {score} / {questions.length}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  setFinished(false);
                  setName("");
                  setLevel("");
                  setError("");
                }}
              >
                🔄 Recommencer
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <MultiplicationContest2></MultiplicationContest2>
      <MultiplicationContestJson4></MultiplicationContestJson4>
    </Container>
  );
}
