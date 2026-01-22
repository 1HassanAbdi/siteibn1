import React, { useState, useEffect, useRef } from "react";
import {
  Box, Button, Typography, Paper, TextField, Stack, Chip, 
  Card, CardContent, CircularProgress, Radio, 
  RadioGroup, FormControlLabel, LinearProgress, Collapse
} from "@mui/material";
import { CheckCircle, ChevronRight, BookOpen, ChevronDown, ChevronUp, Printer } from "lucide-react";

// IMPORT DU COMPOSANT D'IMPRESSION
import PrintableParentPack from "./PrintableParentPack";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1pYkg96VveNtM3fUZMKkArLb3rlTAJ3lSAPUEGE9oqJh5PvVSztahuQCHhZV4119ajA/exec";

export default function FrenchReadingQuiz({ quizJsonPath }) {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [scoresUI, setScoresUI] = useState({});
  const [student, setStudent] = useState({ name: "" });
  const [quizSent, setQuizSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showText, setShowText] = useState(true);

  // NOUVEL ÉTAT POUR L'IMPRESSION
  const [showPrintMode, setShowPrintMode] = useState(false);

  const questionZoneRef = useRef(null);

  const colors = {
    primary: "#10b981", 
    error: "#ef4444",   
    bg: "#020617",      
    card: "#1e293b",    
    text: "#f8fafc",    
    border: "#334155",
    muted: "#94a3b8"
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

  const scrollToQuestions = () => {
    setTimeout(() => {
      if (questionZoneRef.current) {
        questionZoneRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); 
  };

  const normalize = (val) => {
    if (!val) return "";
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
      alert("⚠️ Oups ! Tu as oublié de répondre à une question.");
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

  const handleFinalSubmit = async () => {
    if (isSending) return;
    setIsSending(true);

    try {
      let totalPoints = 0;
      const detailScores = {};

      // On calcule tous les scores pour l'envoi
      quizData.sections.forEach(section => {
        if (section.type !== "open") {
          let sectionScore = 0;
          section.questions.forEach((q, i) => {
            if (normalize(answers[`${section.id}-${i}`]) === normalize(q.a)) sectionScore++;
          });
          detailScores[section.id] = sectionScore; 
          totalPoints += sectionScore;
        } else {
          detailScores[section.id] = "Fait";
        }
      });

      const payload = {
        nom: student.name || "Anonyme",
        classe: quizData.level || "2e année",
        titre: quizData.title || "Quiz Lecture",
        totalScore: totalPoints,
        date: new Date().toLocaleString("fr-CA"),
        ...detailScores 
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setQuizSent(true);
      setActiveTab("summary");
    } catch (error) {
      alert("Erreur technique lors de l'envoi.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100vh", color: colors.text, p: { xs: 2, md: 4 } }}>
      
      {/* --- INTEGRATION DU MODE IMPRESSION --- */}
      {showPrintMode && quizData && (
        <PrintableParentPack 
          data={quizData} 
          type="activity" 
          onClose={() => setShowPrintMode(false)} 
        />
      )}

      {/* 1. ACCUEIL */}
      {activeTab === "form" && (
        <Paper sx={{ p: 6, bgcolor: colors.card, textAlign: "center", border: `1px solid ${colors.border}` }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: colors.primary }}>{quizData.title}</Typography>
          
          {/* BOUTON D'IMPRESSION AJOUTÉ ICI */}
          <Button 
            variant="outlined" 
            startIcon={<Printer size={18} />} 
            onClick={() => setShowPrintMode(true)}
            sx={{ 
              mb: 4, 
              borderColor: colors.muted, 
              color: colors.muted, 
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { borderColor: colors.primary, color: colors.primary, bgcolor: 'rgba(16, 185, 129, 0.05)' } 
            }}
          >
            Version Imprimable (PDF)
          </Button>

          <Stack spacing={3} sx={{ maxWidth: 400, mx: "auto" }}>
            <TextField 
              fullWidth label="Ton nom" 
              variant="outlined"
              onChange={e => setStudent({ ...student, name: e.target.value })}
              sx={{ input: { color: "white" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: colors.border } } }}
              InputLabelProps={{ style: { color: colors.muted } }}
            />
            <Button disabled={!student.name} variant="contained" onClick={() => setActiveTab(quizData.sections[0].id)} sx={{ bgcolor: colors.primary, py: 2 }}>
              COMMENCER
            </Button>
          </Stack>
        </Paper>
      )}

      {/* 2. QUIZ CONTENU */}
      {quizData.sections?.map((section) => {
        if (activeTab !== section.id) return null;
        const isSectionSubmitted = submitted[section.id];

        return (
          <Box key={section.id}>
            <Paper sx={{ bgcolor: colors.card, mb: 2, borderRadius: 6, overflow: 'hidden', borderLeft: `6px solid ${colors.primary}` }}>
              <Button 
                fullWidth 
                onClick={() => setShowText(!showText)}
                endIcon={showText ? <ChevronUp /> : <ChevronDown />}
                sx={{ justifyContent: 'space-between', p: 2, color: colors.text, fontWeight: 'bold' }}
              >
                {showText ? "MASQUER LE TEXTE" : "LIRE LE TEXTE"}
              </Button>
              <Collapse in={showText}>
                <Box sx={{ p: 3, borderTop: `1px solid ${colors.border}` }}>
                  <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.3rem", color: "#ffffff" }}>
                    {quizData.text}
                  </Typography>
                </Box>
              </Collapse>
            </Paper>

            <LinearProgress variant="determinate" value={((quizData.sections.findIndex(s => s.id === activeTab) + 1) / quizData.sections.length) * 100} sx={{ height: 10, borderRadius: 5, mb: 4 }} />

            <div ref={questionZoneRef} />

            <Stack spacing={3}>
              <Typography variant="h5" sx={{ color: colors.primary, fontWeight: 900 }}>{section.label}</Typography>
              {section.questions?.map((q, qIdx) => {
                const qKey = `${section.id}-${qIdx}`;
                const options = q.options || (section.type === "boolean" ? ["Vrai", "Faux"] : []);
                return (
                  <Card key={qIdx} sx={{ bgcolor: colors.card, border: `1px solid ${colors.border}` }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "1.2rem", color: colors.text }}>{qIdx + 1}. {q.q || q}</Typography>
                      {section.type === "open" ? (
                        <Button variant={answers[qKey] ? "contained" : "outlined"} color="warning" onClick={() => handleAnswer(section.id, qIdx, "fait")}>
                          {answers[qKey] ? "Fait ✅" : "Répondre sur feuille"}
                        </Button>
                      ) : (
                        <RadioGroup value={answers[qKey] || ""} onChange={e => handleAnswer(section.id, qIdx, e.target.value)}>
                          {options.map(opt => {
                            let textColor = colors.text;
                            if (isSectionSubmitted) {
                              if (normalize(opt) === normalize(q.a)) textColor = colors.primary;
                              else if (normalize(opt) === normalize(answers[qKey])) textColor = colors.error;
                            }
                            return <FormControlLabel key={opt} value={opt} disabled={isSectionSubmitted} control={<Radio sx={{color: colors.border, '&.Mui-checked': {color: colors.primary}}}/>} label={<span style={{ color: textColor }}>{opt}</span>} />;
                          })}
                        </RadioGroup>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            <Box sx={{ mt: 5, display: "flex", justifyContent: "center", pb: 10 }}>
              {!isSectionSubmitted ? (
                <Button variant="contained" onClick={() => handleSubmitSection(section.id, section.questions, section.type)} sx={{ bgcolor: colors.primary, px: 10, py: 2, borderRadius: 10 }}>
                  VÉRIFIER
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  endIcon={<ChevronRight />}
                  onClick={() => {
                    const nextIdx = quizData.sections.findIndex(s => s.id === section.id) + 1;
                    if (nextIdx < quizData.sections.length) {
                        setActiveTab(quizData.sections[nextIdx].id);
                        setShowText(false); 
                        scrollToQuestions();
                    } else {
                        handleFinalSubmit();
                    }
                  }} 
                  sx={{ bgcolor: "#3b82f6", px: 10, py: 2, borderRadius: 10 }}
                >
                  {quizData.sections.findIndex(s => s.id === section.id) + 1 === quizData.sections.length ? "ENVOYER" : "SUIVANT"}
                </Button>
              )}
            </Box>
          </Box>
        );
      })}

      {activeTab === "summary" && (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, color: colors.primary }}>FINI !</Typography>
          <Stack spacing={2} sx={{ mb: 6, maxWidth: 500, mx: "auto" }}>
            {quizData.sections?.map(s => (
              <Paper key={s.id} sx={{ p: 3, bgcolor: colors.card, display: "flex", justifyContent: "space-between", borderRadius: 4 }}>
                <Typography sx={{ color: colors.text }}>{s.label}</Typography>
                <Typography sx={{ fontWeight: 900, color: colors.primary }}>
                  {s.type === "open" ? "Fait" : `${scoresUI[s.id]?.score ?? 0} / ${scoresUI[s.id]?.total ?? 0}`}
                </Typography>
              </Paper>
            ))}
          </Stack>
          <Chip icon={<CheckCircle color="white" />} label="ENVOYÉ ✅" sx={{ bgcolor: colors.primary, color: "white", p: 4, fontSize: "1.2rem", fontWeight: "bold" }} />
        </Box>
      )}
    </Box>
  );
}