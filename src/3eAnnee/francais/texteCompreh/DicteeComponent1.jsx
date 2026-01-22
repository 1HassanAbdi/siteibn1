import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Divider, TextField, Button, Grid } from "@mui/material";
import { ChevronLeft, Play, CheckCircle, Volume2, BookOpen } from "lucide-react";

// Indexation des fichiers JSON et Audio dans le dossier src
const dictationFiles = import.meta.glob("./**/*.json", { eager: true });
const audioFiles = import.meta.glob("./**/*.mp3", { eager: true });

const DicteeComponent = ({ configPath }) => {
  // --- ÉTATS ---
  const [dictationData, setDictationData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [dictationStarted, setDictationStarted] = useState(false);
  const [dictationFinished, setDictationFinished] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [playingWord, setPlayingWord] = useState(null);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const data = dictationFiles[configPath]?.default || dictationFiles[configPath];
    if (data) {
      setDictationData(data);
    }
  }, [configPath]);

  // --- LOGIQUE AUDIO ---
  const playAudio = (weekId, word, index) => {
    setPlayingWord(word);
    const basePath = configPath.replace("dictée.json", "");
    const filename = `${index + 1}_${word}.mp3`;
    const fullAudioPath = `${basePath}dictée_audio/${weekId}/${filename}`;

    const audioModule = audioFiles[fullAudioPath];
    if (!audioModule) {
      console.error("Audio non trouvé:", fullAudioPath);
      return;
    }

    const audio = new Audio(audioModule.default || audioModule);
    audio.play();
    audio.onended = () => setPlayingWord(null);
  };

  // --- ACTIONS ---
  const resetDictation = () => {
    setDictationStarted(false);
    setDictationFinished(false);
    setStudentAnswers({});
  };

  if (!dictationData) return <Typography>Chargement des dictées...</Typography>;

  return (
    <Box sx={{ color: "white", py: 2 }}>
      
      {/* --- HEADER --- */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: '900', color: "#64b5f6" }}>
          ✍️ {dictationData.title}
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: "rgba(100, 181, 246, 0.2)", mb: 4 }} />

      {/* --- ÉTAPE 0 : CHOISIR SA DICTÉE --- */}
      {!selectedWeek && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Sélectionne la dictée que tu souhaites réaliser :
          </Typography>
          <Grid container spacing={3}>
            {dictationData.weeks.map((week) => (
              <Grid item xs={12} sm={6} key={week.id}>
                <Box
                  onClick={() => setSelectedWeek(week)}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "2px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { 
                      bgcolor: "rgba(100, 181, 246, 0.1)", 
                      borderColor: "#64b5f6",
                      transform: "translateY(-5px)"
                    }
                  }}
                >
                  <BookOpen size={32} className="text-blue-400 mb-2" />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{week.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.6 }}>{week.words.length} mots à apprendre</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {selectedWeek && (
        <>
          {/* Bouton Retour à la sélection (seulement si pas commencé) */}
          {!dictationStarted && !dictationFinished && (
            <Button 
              startIcon={<ChevronLeft />} 
              onClick={() => setSelectedWeek(null)}
              sx={{ color: '#64b5f6', mb: 2 }}
            >
              Changer de dictée
            </Button>
          )}

          {/* --- ÉTAPE 1 : VISUALISATION --- */}
          {!dictationStarted && !dictationFinished && (
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
                👀 Prépare-toi : regarde et écoute les mots
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mb: 6 }}>
                {selectedWeek.words.map((word, index) => (
                  <Chip
                    key={index}
                    label={word}
                    onClick={() => playAudio(selectedWeek.id, word, index)}
                    sx={{
                      fontSize: "1.3rem", fontWeight: "900", p: 3, cursor: "pointer",
                      bgcolor: playingWord === word ? "#10b981" : "white",
                      color: playingWord === word ? "white" : "#1e293b",
                      "&:hover": { transform: "scale(1.1)", bgcolor: "#64b5f6", color: 'white' }
                    }}
                  />
                ))}
              </Box>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<Play />}
                onClick={() => setDictationStarted(true)}
                sx={{ bgcolor: '#10b981', px: 6, py: 2, borderRadius: 3, fontWeight: 'bold', "&:hover": {bgcolor: '#059669'} }}
              >
                Commencer la dictée
              </Button>
            </Box>
          )}

          {/* --- ÉTAPE 2 : DICTÉE --- */}
          {dictationStarted && !dictationFinished && (
            <Box sx={{ bgcolor: 'white', color: '#1e293b', p: 4, borderRadius: 6, boxShadow: 10 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: '900', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Volume2 size={24} /> Écris ce que tu entends :
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {selectedWeek.words.map((word, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip 
                      label={<Volume2 size={20} />} 
                      onClick={() => playAudio(selectedWeek.id, word, index)}
                      sx={{ bgcolor: playingWord === word ? "#10b981" : "#1e293b", color: 'white', cursor: 'pointer' }}
                    />
                    <TextField 
                      fullWidth 
                      variant="outlined"
                      label={`Mot ${index + 1}`}
                      placeholder="Tape le mot ici..."
                      onChange={(e) => setStudentAnswers({...studentAnswers, [word]: e.target.value})}
                    />
                  </Box>
                ))}
              </Box>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => setDictationFinished(true)}
                sx={{ mt: 4, py: 2, bgcolor: '#1e293b', fontWeight: 'bold' }}
              >
                Valider ma dictée
              </Button>
            </Box>
          )}

          {/* --- ÉTAPE 3 : RÉSULTATS --- */}
          {dictationFinished && (
            <Box sx={{ bgcolor: 'white', color: '#1e293b', p: 4, borderRadius: 6 }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: '900', textAlign: 'center' }}>
                📊 Ton Bilan - {selectedWeek.title}
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sx={{ fontWeight: 'bold', color: '#64748b' }}>Mot attendu</Grid>
                <Grid item xs={6} sx={{ fontWeight: 'bold', color: '#64748b' }}>Ta réponse</Grid>
                {selectedWeek.words.map((word, index) => {
                  const isCorrect = (studentAnswers[word] || "").trim().toLowerCase() === word.toLowerCase();
                  return (
                    <React.Fragment key={index}>
                      <Grid item xs={6} sx={{ py: 1, borderBottom: '1px solid #f1f5f9', fontWeight: 'bold' }}>{word}</Grid>
                      <Grid item xs={6} sx={{ py: 1, borderBottom: '1px solid #f1f5f9', color: isCorrect ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
                        {isCorrect ? "✅ " : "❌ "}{studentAnswers[word] || "---"}
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={resetDictation}
                sx={{ color: '#1e293b', borderColor: '#1e293b' }}
              >
                Refaire cette dictée
              </Button>
              <Button 
                fullWidth 
                onClick={() => { setSelectedWeek(null); resetDictation(); }}
                sx={{ mt: 1, color: '#64748b' }}
              >
                Choisir une autre semaine
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DicteeComponent;