import React, { useState, useEffect } from "react";
import {
  Box, Button, Typography, Paper, TextField, Stack, Chip, 
  Card, CardContent, Collapse, CircularProgress, Radio, 
  RadioGroup, FormControlLabel
} from "@mui/material";
import { BookOpen, Eye, EyeOff, Edit3, Send, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR5GIePHpVTRRVsdKj3lDEpRsludxnmj5XOFP7RGui3EUl_bLhS9dEu_uC8JAPjF45fg/exec";

export default function FrenchReadingQuiz({ quizJsonPath }) {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [scoresUI, setScoresUI] = useState({});
  const [student, setStudent] = useState({ name: "" });
  const [quizSent, setQuizSent] = useState(false);
  const [showText, setShowText] = useState(true);
  const [isSending, setIsSending] = useState(false); // État pour le chargement
  
  const colors = {
    primary: "#10b981", 
    error: "#ef4444",   
    paper: "#f59e0b",   
    bg: "#020617",      
    card: "#1e293b",    
    text: "#f8fafc",    
    border: "#334155"
  };

  const allQuizFiles = import.meta.glob("./**/*.json", { eager: true });

  useEffect(() => {
    if (!quizJsonPath) return;
    const cleanPath = quizJsonPath.replace("./", "");
    const entry = Object.entries(allQuizFiles).find(([path]) => path.includes(cleanPath));
    if (entry) {
      setQuizData(entry[1].default || entry[1]);
      setLoading(false);
    }
  }, [quizJsonPath]);

  const normalize = (val) => {
    if (val === undefined || val === null) return "";
    const s = String(val).toLowerCase().trim();
    if (s === "vrai" || s === "true") return "vrai";
    if (s === "faux" || s === "false") return "faux";
    return s;
  };

  const handleAnswer = (sectionId, index, value) => {
    setAnswers(prev => ({ ...prev, [`${sectionId}-${index}`]: value }));
  };

  const handleSubmitSection = (sectionId, questions, type) => {
    const unanswered = questions.some((_, i) => !answers[`${sectionId}-${i}`]);
    if (unanswered) {
      alert("⚠️ Complète toutes les questions avant de valider.");
      return;
    }

    if (type !== "open") {
      let correctCount = 0;
      questions.forEach((q, i) => {
        if (normalize(answers[`${sectionId}-${i}`]) === normalize(q.a)) correctCount++;
      });
      setScoresUI(prev => ({ ...prev, [sectionId]: { score: correctCount, total: questions.length } }));
    }
    setSubmitted(prev => ({ ...prev, [sectionId]: true }));
  };

  // --- FONCTION D'ENVOI REECRITE ET SOLIDE ---
  const handleFinalSubmit = async () => {
    if (isSending) return; // Empêche le double-clic
    
    setIsSending(true); // Lance l'animation de chargement sur le bouton

    try {
      const scoresCalcules = {};
      let totalPoints = 0;

      // Calcul manuel des scores pour le Google Sheet
      quizData.sections.forEach(section => {
        if (section.type !== "open") {
          let scorePartie = 0;
          section.questions.forEach((q, i) => {
            if (normalize(answers[`${section.id}-${i}`]) === normalize(q.a)) {
              scorePartie++;
            }
          });
          scoresCalcules[section.id] = scorePartie;
          totalPoints += scorePartie;
        }
      });

      const payload = {
        nom: student.name || "Anonyme",
        classe: quizData.level || "6e",
        titre: quizData.title || "Quiz Lecture",
        totalScore: totalPoints,
        vraiFaux: scoresCalcules["vraiFaux"] || 0,
        qcm: scoresCalcules["qcm"] || 0,
        vocabulaire: scoresCalcules["vocabulaire"] || 0,
        conjugaison: scoresCalcules["conjugaison"] || 0,
        grammaire: scoresCalcules["grammaire"] || 0,
        date: new Date().toLocaleString("fr-CA")
      };

      // Exécution de l'envoi
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Si on arrive ici, c'est réussi (ou envoyé en no-cors)
      setQuizSent(true);
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Erreur technique lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSending(false); // Arrête le chargement
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress sx={{ color: colors.primary }} /></Box>;
  
  return (
    <Box sx={{ color: colors.text, maxWidth: 900, mx: "auto", p: { xs: 1, md: 3 } }}>
      
      {activeTab === "form" && (
        <Paper sx={{ p: 6, bgcolor: colors.card, borderRadius: 10, border: `1px solid ${colors.border}`, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: colors.primary }}>{quizData.title}</Typography>
          <Stack spacing={3} sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <TextField 
              fullWidth label="Ton Nom complet" variant="filled" 
              onChange={e => setStudent({ ...student, name: e.target.value })}
              sx={{ bgcolor: colors.bg, borderRadius: 3, input: { color: "white" } }}
            />
            <Button 
              disabled={!student.name} variant="contained" 
              onClick={() => setActiveTab(quizData.sections[0].id)}
              sx={{ bgcolor: colors.primary, py: 2, borderRadius: 5, fontWeight: "900" }}
            >
              COMMENCER LE QUIZ
            </Button>
          </Stack>
        </Paper>
      )}

      {quizData.sections?.map((section) => {
        if (activeTab !== section.id) return null;
        const isSectionSubmitted = submitted[section.id];
        return (
          <Box key={section.id}>
            <Collapse in={showText}>
                <Paper sx={{ p: 4, bgcolor: colors.bg, mb: 4, borderRadius: 6, border: `1px solid ${colors.border}` }}>
                  <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.1rem" }}>{quizData.text}</Typography>
                </Paper>
            </Collapse>

            <Stack spacing={3}>
              <Typography variant="h5" sx={{ color: colors.primary, fontWeight: 900 }}>{section.label}</Typography>
              {section.questions?.map((q, qIdx) => {
                const qKey = `${section.id}-${qIdx}`;
                const options = q.options || (section.type === "boolean" ? ["Vrai", "Faux"] : []);
                return (
                  <Card key={qIdx} sx={{ bgcolor: colors.card, borderRadius: 6, border: `1px solid ${colors.border}` }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography sx={{ fontWeight: 800, mb: 2 }}>{qIdx + 1}. {q.q || q}</Typography>
                      {section.type === "open" ? (
                        <Button variant={answers[qKey] ? "contained" : "outlined"} color="warning" onClick={() => handleAnswer(section.id, qIdx, "fait")}>
                            {answers[qKey] ? "Fait ✅" : "Répondre sur feuille"}
                        </Button>
                      ) : (
                        <RadioGroup value={answers[qKey] || ""} onChange={e => handleAnswer(section.id, qIdx, e.target.value)}>
                          {options.map(opt => {
                            let c = "white";
                            if (isSectionSubmitted) {
                                if (normalize(opt) === normalize(q.a)) c = colors.primary;
                                else if (normalize(opt) === normalize(answers[qKey])) c = colors.error;
                            }
                            return <FormControlLabel key={opt} value={opt} disabled={isSectionSubmitted} control={<Radio sx={{color: "#475569", '&.Mui-checked': {color: c === colors.error ? colors.error : colors.primary}}}/>} label={<span style={{ color: c }}>{opt}</span>} />;
                          })}
                        </RadioGroup>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
              {!isSectionSubmitted ? (
                <Button variant="contained" onClick={() => handleSubmitSection(section.id, section.questions, section.type)} sx={{ bgcolor: colors.primary, px: 6, py: 2, borderRadius: 5 }}>VÉRIFIER</Button>
              ) : (
                <Button variant="contained" onClick={() => {
                    const nextIdx = quizData.sections.findIndex(s => s.id === section.id) + 1;
                    setActiveTab(quizData.sections[nextIdx]?.id || "summary");
                    window.scrollTo(0,0);
                }} sx={{ bgcolor: colors.primary, px: 6, py: 2, borderRadius: 5 }}>SUIVANT</Button>
              )}
            </Box>
          </Box>
        );
      })}

      {activeTab === "summary" && (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 4 }}>BILAN DE {student.name.toUpperCase()}</Typography>
          <Stack spacing={2} sx={{ mb: 6, maxWidth: 600, mx: "auto" }}>
            {quizData.sections?.map(s => (
              <Paper key={s.id} sx={{ p: 3, bgcolor: colors.card, display: "flex", justifyContent: "space-between", borderRadius: 4, border: `1px solid ${colors.border}` }}>
                <Typography sx={{ fontWeight: "bold" }}>{s.label}</Typography>
                <Typography sx={{ fontWeight: 900, color: colors.primary }}>
                  {s.type === "open" ? "FEUILLE" : `${scoresUI[s.id]?.score || 0} / ${scoresUI[s.id]?.total || 0}`}
                </Typography>
              </Paper>
            ))}
          </Stack>
          
          {!quizSent ? (
            <Button 
                variant="contained" 
                onClick={handleFinalSubmit} 
                disabled={isSending}
                sx={{ bgcolor: colors.primary, px: 8, py: 3, borderRadius: 6, fontWeight: 900, minWidth: 250 }}
            >
              {isSending ? <CircularProgress size={24} sx={{ color: "white" }} /> : "ENVOYER AU PROFESSEUR"}
            </Button>
          ) : (
            <Chip 
              icon={<CheckCircle size={20} color="white" />} 
              label="RÉSULTATS TRANSMIS AVEC SUCCÈS ✅" 
              sx={{ bgcolor: colors.primary, color: "white", p: 4, borderRadius: 5, fontWeight: 900, fontSize: "1rem" }} 
            />
          )}
        </Box>
      )}
    </Box>
  );
}