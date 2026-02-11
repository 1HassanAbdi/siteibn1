import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StoryPlayer = ({ storyData, audioMap, imageMap }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // 0. SÉCURITÉ : Si les données ne sont pas là, on n'affiche rien pour éviter le crash
  if (!storyData || !storyData.sections) {
    return <Typography sx={{ p: 4, textAlign: "center" }}>Chargement de l'histoire...</Typography>;
  }

  const section = storyData.sections[currentSection];

  // 1. GESTION DE L'AUDIO
  useEffect(() => {
    // A. Nettoyage de l'audio précédent
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // B. Récupération du nouveau fichier
    // On nettoie le nom (parfois le JSON a "./audio.mp3", parfois juste "audio.mp3")
    const rawAudioName = section.audio;
    if (rawAudioName) {
        // On enlève le "./" s'il existe pour matcher la clé de audioMap
        const fileName = rawAudioName.replace("./", ""); 
        const audioSrc = audioMap[fileName];

        if (audioSrc) {
            console.log(`🎵 Chargement audio : ${fileName}`); // Debug
            audioRef.current = new Audio(audioSrc);
        } else {
            console.warn(`⚠️ Audio introuvable dans la Map : ${fileName}`);
            audioRef.current = null;
        }
    } else {
        audioRef.current = null;
    }

    // C. Cleanup quand on quitte le composant
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSection, audioMap, section]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => console.log("Lecture audio démarrée"))
        .catch((err) => console.error("Erreur lecture audio :", err));
    } else {
        alert("Pas d'audio disponible pour cette page.");
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextSection = () => {
    stopAudio();
    if (currentSection < storyData.sections.length - 1) setCurrentSection(currentSection + 1);
  };

  const previousSection = () => {
    stopAudio();
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const returnToHistory = () => {
    stopAudio();
    // Si tu utilises React Router, navigate(-1) est correct.
    // Sinon, tu peux utiliser une fonction passée en props (ex: onBack)
    navigate(-1); 
  };

  return (
    <Box sx={{ padding: 1, minHeight: "80vh", fontFamily: "Arial, sans-serif" }}>
      <Button variant="contained" color="secondary" onClick={returnToHistory} sx={{ mb: 2 }}>
        🔙 Retour
      </Button>

      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {storyData.title} {storyData.grade && `- ${storyData.grade}ᵉ Année`}
      </Typography>

      <Paper
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center", // Centré verticalement
          backgroundColor: "#FFF8E1",
          borderRadius: 4,
          overflow: "hidden",
          padding: 3,
          marginTop: 3,
          gap: 4,
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          // Gestion du cas où l'image n'est pas trouvée
          src={imageMap[section.image] || "https://placehold.co/600x400?text=Image+Manquante"}
          alt="Illustration"
          sx={{
            width: { xs: "100%", md: "40%" },
            height: "auto",
            maxHeight: "500px",
            objectFit: "contain",
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "white"
          }}
        />

        {/* TEXTE */}
        <Box sx={{ width: { xs: "100%", md: "60%" } }}>
          <Typography variant="h4" color="secondary" gutterBottom sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}>
            {section.title}
          </Typography>
          
          {/* 
             CORRECTION MAJEURE : Utilisation de dangerouslySetInnerHTML 
             Cela permet aux balises <b> (couleur orange) et <i> (couleur vert) de fonctionner
             On remplace aussi les \n par des <br/> pour les sauts de ligne
          */}
          <Typography
            component="div"
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: { xs: "18px", md: "24px" }, // Taille responsive
              lineHeight: 1.8,
              color: "black",
              "& b, & strong": { color: "#FF5722", fontWeight: "bold" }, // Style pour le gras
              "& i, & em": { color: "#4CAF50", fontStyle: "italic" },    // Style pour l'italique
            }}
            dangerouslySetInnerHTML={{
               __html: section.text.replace(/\n/g, "<br />") 
            }}
          />
        </Box>
      </Paper>

      {/* BOUTONS DE NAVIGATION */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 4, flexWrap: "wrap" }}>
        <Button 
            variant="contained" 
            color="warning" 
            onClick={previousSection} 
            disabled={currentSection === 0}
            size="large"
        >
          👈 Précédent
        </Button>
        
        <Button 
            variant="contained" 
            color="info" 
            onClick={playAudio}
            size="large"
            startIcon={<span>🎵</span>}
        >
          Écouter
        </Button>
        
        <Button 
            variant="contained" 
            color="error" 
            onClick={stopAudio}
            size="large"
        >
          Arrêter
        </Button>
        
        <Button
          variant="contained"
          color="success"
          onClick={nextSection}
          disabled={currentSection === storyData.sections.length - 1}
          size="large"
        >
          Suivant 👉
        </Button>
      </Box>

      {/* INDICATEUR DE PAGE */}
      <Typography align="center" sx={{ mt: 2, color: "grey" }}>
        Page {currentSection + 1} / {storyData.sections.length}
      </Typography>
    </Box>
  );
};

export default StoryPlayer;