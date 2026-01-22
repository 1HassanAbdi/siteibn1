import React, { useState } from "react";
import { Box, Typography, Chip, Divider, TextField } from "@mui/material";
import dictationData from "./dictée.json";

const DicteeComponent = () => {
  const [selectedWeek, setSelectedWeek] = useState(dictationData.weeks[0]);
  const [dictationStarted, setDictationStarted] = useState(false);
  const [dictationFinished, setDictationFinished] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [playingWord, setPlayingWord] = useState(null);

  // Charge tous les fichiers audio automatiquement
const audioFiles = import.meta.glob("./dictée_audio/**/*", {
  eager: true
});

const playAudio = (weekId, word, index) => {
  const filename = `${index + 1}_${word}.mp3`;
  const pathKey = `./dictée_audio/${weekId}/${filename}`;

  const audioPath = audioFiles[pathKey]?.default;

  if (!audioPath) {
    alert(`⚠️ Audio introuvable : ${filename}`);
    return;
  }

  const audio = new Audio(audioPath);
  audio.play().catch(() => {
    alert("Erreur de lecture audio.");
  });
};

  const handleInputChange = (word, value) => {
    setStudentAnswers(prev => ({ ...prev, [word]: value }));
  };

  const handleFinishDictation = () => {
    setDictationFinished(true);
  };

  return (
    <Box sx={{ color: "white", px: { xs: 2, md: 4 }, py: 2 }}>
      <Typography variant="h4" gutterBottom color="#64b5f6">
        ✍️ Dictée - {selectedWeek.title}
      </Typography>
      <Divider sx={{ bgcolor: "#64b5f6", my: 2 }} />

      {/* Sélection de la semaine */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3, justifyContent: "center" }}>
        {dictationData.weeks.map((week) => (
          <Chip
            key={week.id}
            label={week.title}
            color={selectedWeek.id === week.id ? "primary" : "secondary"}
            onClick={() => {
              setSelectedWeek(week);
              setDictationStarted(false);
              setDictationFinished(false);
              setStudentAnswers({});
            }}
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              px: 2,
              py: 1,
              cursor: "pointer",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
        ))}
      </Box>

      {/* Avant dictée → mots visibles */}
      {!dictationStarted && !dictationFinished && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            🎧 Mots de la semaine (clique pour écouter) :
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {selectedWeek.words.map((word, index) => (
              <Chip
                key={index}
                label={word}
                color={playingWord === word ? "success" : "secondary"}
                onClick={() => playAudio(selectedWeek.id, word, index)}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.1)", backgroundColor: "#64b5f6" },
                }}
              />
            ))}
          </Box>
          <Chip
            label="▶️ Commencer la dictée"
            color="primary"
            onClick={() => setDictationStarted(true)}
            sx={{ mt: 2, fontWeight: "bold", px: 3, cursor: "pointer" }}
          />
        </Box>
      )}

     {dictationStarted && !dictationFinished && (
  <Box
    sx={{
      mt: 3,
      p: 3,
      borderRadius: 4,
      backgroundColor: "white",
      color: "black",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
      ✍️ Écris les mots de la dictée ici :
    </Typography>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {selectedWeek.words.map((word, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Bouton audio à côté */}
          <Chip
            label="🎧"
            color={playingWord === word ? "success" : "primary"}
            onClick={() => playAudio(selectedWeek.id, word, index)}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              "&:hover": { transform: "scale(1.1)", backgroundColor: "#64b5f6" },
            }}
          />
          {/* Champ texte */}
          <TextField
            fullWidth
            label={`Mot ${index + 1}`}
            variant="outlined"
            value={studentAnswers[word] || ""}
            onChange={(e) => handleInputChange(word, e.target.value)}
          />
        </Box>
      ))}
    </Box>

    <Chip
      label="✅ Terminer la dictée"
      color="primary"
      onClick={handleFinishDictation}
      sx={{ mt: 3, fontWeight: "bold", px: 4, cursor: "pointer" }}
    />
  </Box>
)}


      {/* Bilan final */}
      {dictationFinished && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 4,
            backgroundColor: "white",
            color: "black",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            📊 Bilan de la dictée :
          </Typography>
          {selectedWeek.words.map((word, index) => {
            const answer = (studentAnswers[word] || "").trim().toLowerCase();
            const correct = word.toLowerCase();
            return (
              <Typography
                key={index}
                sx={{ color: answer === correct ? "green" : "red", fontWeight: "bold" }}
              >
                {index + 1}. {word} → {studentAnswers[word] || "❌"}
              </Typography>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default DicteeComponent;

