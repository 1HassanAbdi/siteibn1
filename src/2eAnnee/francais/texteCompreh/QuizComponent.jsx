import React, { useState, useEffect } from "react";
import {
  Container, Typography, Box, Button,
  Accordion, AccordionSummary, AccordionDetails,
  Divider, FormControl, InputLabel, Select, MenuItem, TextField, Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3eDXPgjugiyKg3XtHhkHxrz51c70S8pJXA-vvQgClG-bntEMaDqImgdrUfL8jIo0sWg/exec";

// 🚀 VITE : Charger tous les fichiers question.json
const allQuizzes = import.meta.glob("./**/question.json", { eager: true });

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const QuizComponent = ({ quizJsonPath, quizTitle }) => {
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({}); 
  const [totalScore, setTotalScore] = useState(null); 
  const [maxScore, setMaxScore] = useState(0); 
  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("2e Année");
  const [message, setMessage] = useState("");
  const [envoiEffectue, setEnvoiEffectue] = useState(false);

  useEffect(() => {
    if (!quizJsonPath) return;

    const quizModule = allQuizzes[quizJsonPath];

    if (quizModule) {
      const quiz = quizModule.default || quizModule;
      
      // --- PARTIE AJOUTÉE : FUSION DES SECTIONS ET DU FINAL QUIZ ---
      let allSections = [...quiz.sections];
      if (quiz.finalQuiz) {
        allSections.push({
          title: quiz.finalQuiz.title,
          text: "Récapitulation finale de l'histoire.", // Texte optionnel pour le quiz final
          questions: quiz.finalQuiz.questions
        });
      }

      // Calcul du score maximum total sur toutes les questions
      let totalQuestions = 0;
      allSections.forEach(sec => totalQuestions += sec.questions.length);
      setMaxScore(totalQuestions);

      // Mélange des questions
      const shuffledSections = allSections.map((section) => ({
        ...section,
        questions: shuffleArray(
          section.questions.map((q) => ({
            ...q,
            options: shuffleArray(q.options)
          }))
        ),
      }));

      setQuizData({ ...quiz, sections: shuffledSections });
    } else {
      setMessage("❌ Impossible de charger le quiz !");
    }
  }, [quizJsonPath]);

  const handleChange = (id, value) => {
    if (envoiEffectue) return;
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  const handleSubmitQuiz = async () => {
    if (envoiEffectue) return;

    if (!nom.trim()) {
      setMessage("⚠️ N'oublie pas d'écrire ton nom !");
      return;
    }

    // Vérification si TOUTES les questions ont été répondues
    let unansweredCount = 0;
    quizData.sections.forEach(section => {
      section.questions.forEach(q => {
        if (!userAnswers[q.question]) unansweredCount++;
      });
    });

    if (unansweredCount > 0) {
      setMessage(`⚠️ Il reste ${unansweredCount} question(s) sans réponse. Tu dois répondre à tout !`);
      return;
    }

    // Calcul des scores
    let calculatedTotal = 0;
    let detailsScores = {};
    const newScoresState = {};

    quizData.sections.forEach((section) => {
      let sectionCorrect = 0;
      section.questions.forEach((q) => {
        if (userAnswers[q.question] === q.correctAnswer) sectionCorrect++;
      });
      calculatedTotal += sectionCorrect;
      detailsScores[section.title] = sectionCorrect;
      newScoresState[section.title] = sectionCorrect;
    });

    setScores(newScoresState);
    setTotalScore(calculatedTotal);

    const dataToSend = {
      action: "quiz",
      nom: nom,
      classe: classe,
      titre: quizTitle || quizData.title,
      totalScore: calculatedTotal,
      maxScore: maxScore,
      ...detailsScores 
    };

    setMessage("⏳ Envoi en cours...");
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      setMessage(`✅ Bravo ${nom} ! Ton score de ${calculatedTotal}/${maxScore} a été envoyé.`);
      setEnvoiEffectue(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      setMessage("❌ Erreur de connexion. Réessaie.");
    }
  };

  const handleReset = () => {
    if(window.confirm("Veux-tu vraiment tout effacer ?")) {
      setUserAnswers({});
      setScores({});
      setTotalScore(null);
      setEnvoiEffectue(false);
      setMessage("");
      setNom("");
    }
  };

  if (!quizData) return <Typography sx={{p:4, textAlign:"center"}}>Chargement du quiz...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: "#fff", borderRadius: 4, boxShadow: 3 }}>
      
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ color: "#0d6e52", fontWeight: "900", mb: 1 }}>
           {quizData.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
           Lisez bien les textes avant de répondre aux questions.
        </Typography>
      </Box>

      {/* NOM ET CLASSE */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField 
            label="Ton Prénom et Nom" 
            variant="outlined" 
            fullWidth 
            value={nom} 
            onChange={(e) => setNom(e.target.value)} 
            disabled={envoiEffectue}
            sx={{ flex: 2, bgcolor: "white" }}
          />
          <FormControl sx={{ flex: 1, minWidth: 120, bgcolor: "white" }}>
            <InputLabel>Classe</InputLabel>
            <Select value={classe} onChange={(e) => setClasse(e.target.value)} disabled={envoiEffectue} label="Classe">
               <MenuItem value="2e Année">2e Année</MenuItem>
               <MenuItem value="3e Année">3e Année</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* SECTIONS : TEXTE + QUESTIONS */}
      {quizData.sections.map((section, index) => (
        <Accordion key={index} defaultExpanded sx={{ mb: 2, borderRadius: "16px !important", boxShadow: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f8fafc", borderRadius: "16px" }}>
            <Typography variant="h6" sx={{ color: "#334155", fontWeight: "bold" }}>
              {section.title}
            </Typography>
            {scores[section.title] !== undefined && (
               <Box sx={{ ml: "auto", mr: 2, fontWeight: "bold", color: "#0d6e52" }}>
                 {scores[section.title]} / {section.questions.length}
               </Box>
            )}
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            
            {/* --- PARTIE AJOUTÉE : AFFICHAGE DU TEXTE DE LECTURE --- */}
            {section.text && (
              <Box sx={{ mb: 4, p: 2, bgcolor: "#fffbeb", borderRadius: 2, borderLeft: "5px solid #f59e0b" }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.6, fontStyle: 'italic' }}>
                  {section.text}
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 3 }}>Questions de compréhension</Divider>

            {section.questions.map((q, idx) => (
              <Box key={idx} mb={3} p={2} sx={{ bgcolor: idx % 2 === 0 ? "white" : "#f8fafc", borderRadius: 2 }}>
                <Typography fontSize="1.1rem" fontWeight="500" mb={1}>
                  {idx + 1}. {q.question}
                </Typography>
                
                <FormControl fullWidth>
                  <InputLabel>Ta réponse...</InputLabel>
                  <Select 
                    value={userAnswers[q.question] || ""} 
                    onChange={(e) => handleChange(q.question, e.target.value)}
                    disabled={envoiEffectue}
                    label="Ta réponse..."
                    sx={{ bgcolor: "white" }}
                  >
                    {q.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>

                {envoiEffectue && (
                   <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {userAnswers[q.question] === q.correctAnswer ? (
                        <Typography variant="caption" sx={{ color: "green", fontWeight: "bold" }}>
                          <CheckCircleIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }}/> Correct
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: "red", fontWeight: "bold" }}>
                          <CancelIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }}/> Incorrect (La bonne réponse était : {q.correctAnswer})
                        </Typography>
                      )}
                   </Box>
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* BOUTONS FINAUX */}
       <Box display="flex" flexDirection="column" gap={2} mt={4}>
        {!envoiEffectue ? (
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            onClick={handleSubmitQuiz}
            sx={{ 
              bgcolor: "#0d6e52", 
              py: 2, 
              fontSize: "1.2rem", 
              fontWeight: "bold", 
              borderRadius: 3,
              '&:hover': { bgcolor: "#047857" }
            }}
          >
            ENVOYER MES RÉPONSES 🚀
          </Button>
        ) : (
           <Paper sx={{ p: 3, bgcolor: "#dcfce7", textAlign: "center", border: "2px solid #22c55e", borderRadius: 3 }}>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                 Ton score est de {totalScore} / {maxScore}
              </Typography>
           </Paper>
        )}

        <Button fullWidth variant="text" color="error" onClick={handleReset}>
          Recommencer à zéro
        </Button>
      </Box>

      {/* MESSAGE STATUS */}
      {message && (
        <Paper 
          elevation={0}
          sx={{ 
            mt: 3, p: 2, textAlign: "center", borderRadius: 2,
            bgcolor: message.includes("✅") ? "#f0fdf4" : message.includes("⚠️") ? "#fffbeb" : "#fef2f2",
            border: `1px solid ${message.includes("✅") ? "#bbf7d0" : message.includes("⚠️") ? "#fef3c7" : "#fecaca"}`
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: message.includes("✅") ? "#166534" : message.includes("⚠️") ? "#92400e" : "#991b1b" }}>
            {message}
          </Typography>
        </Paper>
      )}

    </Container>
  );
};

export default QuizComponent;