import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Divider, TextField, Button, Grid, Card } from "@mui/material";
import { ChevronLeft, Play, Volume2, BookOpen, Puzzle, CheckCircle2 } from "lucide-react";

// Indexation dynamique des fichiers
const dictationFiles = import.meta.glob("./**/*.json", { eager: true });
const audioFiles = import.meta.glob("./**/*.mp3", { eager: true });

const DicteeComponent = ({ configPath }) => {
  // --- ÉTATS ---
  const [dictationData, setDictationData] = useState(null);
  const [emojiData, setEmojiData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [dictationStarted, setDictationStarted] = useState(false);
  const [dictationFinished, setDictationFinished] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [playingWord, setPlayingWord] = useState(null);

  // --- ÉTATS JEU ASSOCIATION (SIMPLIFIÉ) ---
  const [shuffledEmojiList, setShuffledEmojiList] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Le mot que l'enfant vient de cliquer
  const [matchingAnswers, setMatchingAnswers] = useState({}); // Les paires formées { emoji: mot }
  const [showMatchingResults, setShowMatchingResults] = useState(false);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const dData = dictationFiles[configPath]?.default || dictationFiles[configPath];
    if (dData) setDictationData(dData);

    const emojiPath = configPath.replace("dictée.json", "mot_emoji.json");
    const eData = dictationFiles[emojiPath]?.default || dictationFiles[emojiPath];
    if (eData) setEmojiData(eData);
  }, [configPath]);

  // Mélange les emojis quand une semaine est choisie
  useEffect(() => {
    if (selectedWeek && emojiData) {
      const weekEmoji = emojiData.weeks.find(w => w.id === selectedWeek.id);
      if (weekEmoji) {
        setShuffledEmojiList([...weekEmoji.words].sort(() => Math.random() - 0.5));
      }
    }
    resetGameState();
  }, [selectedWeek, emojiData]);

  // --- LOGIQUE ---
  const playAudio = (weekId, word, index) => {
    setPlayingWord(word);
    const basePath = configPath.replace("dictée.json", "");
    const filename = `${index + 1}_${word}.mp3`;
    const fullAudioPath = `${basePath}dictée_audio/${weekId}/${filename}`;

    const audioModule = audioFiles[fullAudioPath];
    if (!audioModule) return;

    const audio = new Audio(audioModule.default || audioModule);
    audio.play();
    audio.onended = () => setPlayingWord(null);
  };

  const handleMatch = (emoji) => {
    if (selectedWord) {
      setMatchingAnswers({ ...matchingAnswers, [emoji]: selectedWord });
      setSelectedWord(null); // Reset la sélection après avoir lié
    }
  };

  const resetGameState = () => {
    setMatchingAnswers({});
    setShowMatchingResults(false);
    setSelectedWord(null);
  };

  if (!dictationData) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ color: "white", py: 2 }}>
      
      {/* HEADER */}
      <Typography variant="h4" sx={{ fontWeight: '900', color: "#64b5f6", mb: 3 }}>
        ✍️ {dictationData.title}
      </Typography>
      <Divider sx={{ bgcolor: "rgba(100,181,246,0.2)", mb: 4 }} />

      {/* ÉTAPE 0 : CHOIX DE LA SEMAINE */}
      {!selectedWeek && (
        <Grid container spacing={3}>
          {dictationData.weeks.map((week) => (
            <Grid item xs={12} sm={6} key={week.id}>
              <Box
                onClick={() => setSelectedWeek(week)}
                sx={{
                  p: 4, borderRadius: 4, bgcolor: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.1)",
                  cursor: "pointer", transition: "0.3s", "&:hover": { bgcolor: "rgba(100,181,246,0.1)", borderColor: "#64b5f6" }
                }}
              >
                <BookOpen size={32} color="#64b5f6" style={{ marginBottom: 10 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{week.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>{week.words.length} mots</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedWeek && (
        <>
          <Button startIcon={<ChevronLeft />} onClick={() => setSelectedWeek(null)} sx={{ color: '#64b5f6', mb: 2 }}>Changer</Button>

          {/* ÉTAPE 1 : APPRENTISSAGE */}
          {!dictationStarted && !dictationFinished && (
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>👀 Regarde et écoute</Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mb: 6 }}>
                {selectedWeek.words.map((word, index) => (
                  <Chip
                    key={index} label={word} onClick={() => playAudio(selectedWeek.id, word, index)}
                    sx={{
                      fontSize: "1.3rem", fontWeight: "900", p: 3, cursor: "pointer",
                      bgcolor: playingWord === word ? "#10b981" : "white",
                      "&:hover": { transform: "scale(1.1)", bgcolor: "#64b5f6" }
                    }}
                  />
                ))}
              </Box>
              <Button variant="contained" size="large" startIcon={<Play />} onClick={() => setDictationStarted(true)} sx={{ bgcolor: '#10b981', fontWeight: 'bold' }}>
                Commencer la dictée
              </Button>
            </Box>
          )}

          {/* ÉTAPE 2 : LA DICTÉE */}
          {dictationStarted && !dictationFinished && (
            <Box sx={{ bgcolor: 'white', color: '#1e293b', p: 4, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: '900' }}>Écris les mots :</Typography>
              <Grid container spacing={3}>
                {selectedWeek.words.map((word, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip label={<Volume2 size={20} />} onClick={() => playAudio(selectedWeek.id, word, index)} sx={{ bgcolor: playingWord === word ? "#10b981" : "#1e293b", color: 'white' }} />
                      <TextField fullWidth label={`Mot ${index + 1}`} onChange={(e) => setStudentAnswers({...studentAnswers, [word]: e.target.value})} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button fullWidth variant="contained" onClick={() => setDictationFinished(true)} sx={{ mt: 4, py: 2, bgcolor: '#1e293b' }}>Terminer</Button>
            </Box>
          )}

          {/* ÉTAPE 3 : RÉSULTATS + JEU SIMPLIFIÉ */}
          {dictationFinished && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* RÉSULTATS DICTÉE */}
              <Box sx={{ bgcolor: 'white', color: '#1e293b', p: 4, borderRadius: 6 }}>
                <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: '900' }}>📊 Tes résultats</Typography>
                <Grid container spacing={1}>
                  {selectedWeek.words.map((word, index) => {
                    const isCorrect = (studentAnswers[word] || "").trim().toLowerCase() === word.toLowerCase();
                    return (
                      <Grid item xs={12} key={index} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', py: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{word}</Typography>
                        <Typography sx={{ color: isCorrect ? 'green' : 'red', fontWeight: 'bold' }}>
                          {isCorrect ? "✅ " : "❌ "}{studentAnswers[word] || "---"}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* JEU D'ASSOCIATION SIMPLIFIÉ (CLIC SUR MOT PUIS IMAGE) */}
              {shuffledEmojiList.length > 0 && (
                <Box sx={{ p: 4, borderRadius: 6, border: '3px dashed #64b5f6', bgcolor: 'rgba(100, 181, 246, 0.05)' }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#64b5f6', textAlign: 'center' }}>
                    🧩 Jeu : Relie les mots et les images
                  </Typography>

                  {/* 1. Étiquettes à cliquer */}
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>1. Clique sur un mot :</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
                    {selectedWeek.words.map((w, i) => (
                      <Chip
                        key={i} label={w}
                        onClick={() => setSelectedWord(w)}
                        sx={{
                          fontSize: '1.1rem', p: 2, cursor: 'pointer',
                          bgcolor: selectedWord === w ? '#64b5f6' : 'white',
                          color: selectedWord === w ? 'white' : 'black',
                          border: selectedWord === w ? '2px solid white' : 'none'
                        }}
                      />
                    ))}
                  </Box>

                  {/* 2. Emojis à cliquer */}
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>2. Clique sur l'image :</Typography>
                  <Grid container spacing={2} justifyContent="center">
                    {shuffledEmojiList.map((item, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Card 
                          onClick={() => handleMatch(item.emoji)}
                          sx={{ 
                            p: 2, textAlign: 'center', borderRadius: 4, cursor: 'pointer',
                            border: matchingAnswers[item.emoji] ? '3px solid #64b5f6' : '1px solid #ddd'
                          }}
                        >
                          <Typography sx={{ fontSize: '3.5rem' }}>{item.emoji}</Typography>
                          <Typography sx={{ fontWeight: 'bold', minHeight: '24px', color: showMatchingResults ? (matchingAnswers[item.emoji] === item.word ? 'green' : 'red') : '#333' }}>
                            {matchingAnswers[item.emoji] || "???"}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    {!showMatchingResults ? (
                      <Button variant="contained" color="success" size="large" onClick={() => setShowMatchingResults(true)}>Vérifier le jeu</Button>
                    ) : (
                      <Button variant="outlined" color="inherit" onClick={resetGameState}>Rejouer au jeu</Button>
                    )}
                  </Box>
                </Box>
              )}

              <Button fullWidth variant="contained" onClick={() => { setDictationStarted(false); setDictationFinished(false); }} sx={{ bgcolor: '#64b5f6' }}>Refaire la dictée</Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DicteeComponent;