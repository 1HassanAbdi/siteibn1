import React, { useState, useEffect, useRef } from "react";
import {
  Container, Typography, Box, Button, TextField, 
  FormControl, InputLabel, Select, MenuItem, Paper, LinearProgress, Zoom, Fade
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw22HOAUsxV7vBkpi_X8gl-69Xlnvbuc1WIYTPHWPRRDEFC7EQ_-rdlPoQHG-XTuT3wLQ/exec";
const allQuizzes = import.meta.glob("./**/question.json", { eager: true });
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const QuizComponent = ({ quizJsonPath, quizTitle }) => {
  const [quizData, setQuizData] = useState(null);
  const [step, setStep] = useState(0); 
  const [userAnswers, setUserAnswers] = useState({});
  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("2e Année");
  const [totalScore, setTotalScore] = useState(null);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Référence pour le positionnement de l'écran
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (!quizJsonPath) return;
    const quizModule = allQuizzes[quizJsonPath];
    if (quizModule) {
      const quiz = quizModule.default || quizModule;
      let allSections = [...quiz.sections];
      if (quiz.finalQuiz) {
        allSections.push({
          title: quiz.finalQuiz.title,
          text: "Récapitulation finale",
          questions: quiz.finalQuiz.questions
        });
      }
      
      let count = 0;
      allSections.forEach(s => count += s.questions.length);
      setMaxScore(count);
      setQuizData({ ...quiz, sections: allSections });
    }
  }, [quizJsonPath]);

  // Fonction pour scroller juste sous la barre de progression
  const scrollToContent = () => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStart = () => {
    if (!nom.trim()) {
      setError("⚠️ Écris ton nom !");
      return;
    }
    setError("");
    setStep(1);
    setTimeout(scrollToContent, 100);
  };

  const handleNext = () => {
    const currentSection = quizData.sections[step - 1];
    const isComplete = currentSection.questions.every(q => userAnswers[q.question]);

    if (!isComplete) {
      setError("⚠️ Réponds à toutes les questions !");
      return;
    }

    setError("");
    if (step < quizData.sections.length) {
      setStep(step + 1);
      setTimeout(scrollToContent, 100);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setLoading(true);
    let score = 0;
    let details = {};

    quizData.sections.forEach(section => {
      let secScore = 0;
      section.questions.forEach(q => {
        if (userAnswers[q.question] === q.correctAnswer) secScore++;
      });
      score += secScore;
      details[section.title] = secScore;
    });

    setTotalScore(score);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "quiz", nom, classe, titre: quizTitle || quizData.title,
          totalScore: score, maxScore, ...details
        }),
      });
      setStep(-1); // Écran final
    } catch (e) {
      setError("Erreur d'envoi, mais ton score est calculé !");
      setStep(-1);
    }
    setLoading(false);
  }

  if (!quizData) return null;

  const progress = step > 0 ? (step / quizData.sections.length) * 100 : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      
      {/* BARRE DE PROGRESSION FIXE EN HAUT */}
      {step > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#0d6e52' }}>
            PROGRESSION : {step} / {quizData.sections.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 12, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#0d6e52' } }} 
          />
        </Box>
      )}

      {/* ANCRE DE SCROLL : l'écran s'arrêtera ici */}
      <div ref={scrollAnchorRef} style={{ height: "10px" }} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 5 }}>
              <Typography variant="h4" fontWeight="900" color="#0d6e52" gutterBottom>Prêt pour le quiz ?</Typography>
              <TextField fullWidth label="Prénom et Nom" value={nom} onChange={(e) => setNom(e.target.value)} sx={{ my: 3 }} />
              <Button fullWidth variant="contained" size="large" onClick={handleStart} sx={{ bgcolor: '#0d6e52', py: 2, borderRadius: 3 }}>
                COMMENCER
              </Button>
            </Paper>
          </motion.div>
        )}

        {step > 0 && (
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <Paper sx={{ p: 4, mb: 4, bgcolor: '#fffbeb', borderLeft: '10px solid #f59e0b', borderRadius: 4 }}>
              <Typography variant="h5" fontWeight="black" color="#92400e" gutterBottom>
                {quizData.sections[step-1].title}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line', fontSize: '1.3rem', lineHeight: 1.7 }}>
                {quizData.sections[step-1].text}
              </Typography>
            </Paper>

            {quizData.sections[step-1].questions.map((q, i) => (
              <Paper key={i} sx={{ p: 4, mb: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>{i+1}. {q.question}</Typography>
                <FormControl fullWidth>
                  <InputLabel>Choisis ta réponse</InputLabel>
                  <Select 
                    value={userAnswers[q.question] || ""} 
                    label="Choisis ta réponse"
                    onChange={(e) => setUserAnswers({...userAnswers, [q.question]: e.target.value})}
                    sx={{ borderRadius: 3 }}
                  >
                    {q.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Paper>
            ))}

            <Box sx={{ display: 'flex', gap: 2, mt: 4, pb: 10 }}>
              <Button startIcon={<ArrowBackIcon />} onClick={() => setStep(step - 1)} disabled={loading}>Retour</Button>
              <Button 
                fullWidth variant="contained" 
                endIcon={step === quizData.sections.length ? <SendIcon /> : <ArrowForwardIcon />}
                onClick={handleNext}
                disabled={loading}
                sx={{ bgcolor: '#0d6e52', py: 2, borderRadius: 4, fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                {step === quizData.sections.length ? "VALIDER TOUT LE QUIZ" : "SECTION SUIVANTE"}
              </Button>
            </Box>
          </motion.div>
        )}

        {step === -1 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Paper elevation={10} sx={{ p: 8, textAlign: 'center', borderRadius: 10, bgcolor: '#f0fdf4' }}>
              <Typography variant="h2" sx={{ mb: 2 }}>🏆</Typography>
              <Typography variant="h3" fontWeight="900" color="#166534">Bravo {nom} !</Typography>
              <Typography variant="h5" sx={{ mt: 2, mb: 5 }}>Tes réponses ont été envoyées.</Typography>
              
              <Box sx={{ 
                width: 180, height: 180, borderRadius: '50%', border: '12px solid #22c55e',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 5, bgcolor: 'white'
              }}>
                <Typography variant="h3" fontWeight="900" color="#166534">
                  {totalScore}/{maxScore}
                </Typography>
              </Box>

              <Button variant="contained" fullWidth onClick={() => window.location.reload()} sx={{ bgcolor: '#166534', py: 2, borderRadius: 4 }}>
                RETOUR À L'ACCUEIL
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <Paper sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', px: 4, py: 2, bgcolor: '#ef4444', color: 'white', borderRadius: 5, zIndex: 1000 }}>
          <Typography fontWeight="bold">{error}</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default QuizComponent;