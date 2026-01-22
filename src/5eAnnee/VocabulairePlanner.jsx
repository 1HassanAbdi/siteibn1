import React, { useState } from "react";
//import vocabData from "./vocabulaire.json";
import vocabData from "./dict.json";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const VocabulaireDictee = () => {
  const [selectedWeekId, setSelectedWeekId] = useState(1);
  const [dictationMode, setDictationMode] = useState(false);

  const selectedWeek = vocabData.weeks.find(
    (w) => w.id === Number(selectedWeekId)
  );

  // Fonction pour jouer le fichier audio (basé sur mot.mp3 dans un dossier audio)
  const playAudio = (word) => {
    const audio = new Audio(`/audio/${word}.mp3`);
    audio.play().catch((err) => console.log("Audio introuvable :", err));
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "0 auto", p: 3 }}>
      {/* Titre */}
      <Typography variant="h3" sx={{ textAlign: "center", mb: 3 }}>
        <EmojiEventsIcon sx={{ fontSize: 40 }} /> Concours de Dictée – Mai
      </Typography>

      {/* Sélection de semaine */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>
          Choisir une semaine :
        </Typography>
        <Select
          value={selectedWeekId}
          onChange={(e) => setSelectedWeekId(e.target.value)}
          sx={{ background: "white", borderRadius: "10px", boxShadow: 2 }}
        >
          {vocabData.weeks.map((week) => (
            <MenuItem key={week.id} value={week.id}>
              {week.week}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Mode dictée */}
      <FormControlLabel
        control={
          <Switch
            checked={dictationMode}
            onChange={() => setDictationMode(!dictationMode)}
          />
        }
        label="Mode Dictée"
      />

      {/* Informations */}
      {!dictationMode && (
        <Card sx={{ mb: 4, borderRadius: "12px", background: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Informations
            </Typography>
            <Typography>Semaine : {selectedWeek.week}</Typography>
            <Typography>Evaluation : {selectedWeek.evaluation}</Typography>
            <Typography>Échelon : {selectedWeek.echelon}</Typography>
            <Typography>
              Total : {selectedWeek.totalWords ?? selectedWeek.words.length} mots
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* LISTE DES MOTS — MODE RÉVISION */}
      {!dictationMode && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Mots à étudier
          </Typography>

          <Grid container spacing={2}>
            {selectedWeek.words.map((word, i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Chip
                  label={word}
                  onClick={() => playAudio(word)}
                  icon={<VolumeUpIcon />}
                  sx={{
                    width: "100%",
                    py: 2,
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: 2,
                    "&:hover": { background: "#bbdefb" },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* MODE DICTÉE — MOTS CACHÉS */}
      {dictationMode && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            ✍️ Dictée : Écoute et écris le mot
          </Typography>

          <Grid container spacing={2}>
            {selectedWeek.words.map((word, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: "12px",
                    boxShadow: 2,
                  }}
                >
                  {/* BOUTON AUDIO */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => playAudio(word)}
                    sx={{ minWidth: "50px" }}
                  >
                    <VolumeUpIcon />
                  </Button>

                  {/* CHAMP POUR ÉCRIRE LE MOT */}
                  <TextField
                    fullWidth
                    label={`Mot ${index + 1}`}
                    variant="outlined"
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default VocabulaireDictee;
