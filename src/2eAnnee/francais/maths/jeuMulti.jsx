import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Star, Trophy, Zap } from "lucide-react";
import questionsData from "./mult.json";

export default function JeuMultiplicationHistorique() {
  const [joueur, setJoueur] = useState({ nom: "", grade: "" });
  const [niveau, setNiveau] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [reponse, setReponse] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [serie, setSerie] = useState(0);
  const [meilleureSerie, setMeilleureSerie] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [jeuTermine, setJeuTermine] = useState(false);
  const [meilleurPourcentage, setMeilleurPourcentage] = useState(0);
  const [temps, setTemps] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [historique, setHistorique] = useState([]);

  // Timer
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTemps((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  // Commencer le jeu
  const commencerJeu = (niv) => {
    setNiveau(niv);
    setQuestions([...niv.questions]);
    setQuestionIndex(0);
    setScore(0);
    setTotal(0);
    setSerie(0);
    setFeedback("");
    setReponse("");
    setJeuTermine(false);
    setTemps(0);
    setTimerActive(true);
  };

  const verifierReponse = () => {
    const rep = parseInt(reponse);
    const currentQuestion = questions[questionIndex];
    setTotal(total + 1);

    if (rep === currentQuestion.resultat) {
      setScore(score + 1);
      setSerie(serie + 1);
      if (serie + 1 > meilleureSerie) setMeilleureSerie(serie + 1);
      setFeedback("correct");
      setTimeout(() => avancerQuestion(), 1000);
    } else {
      setSerie(0);
      setFeedback("incorrect");
      setTimeout(() => {
        setFeedback("");
        setReponse("");
      }, 1500);
    }
  };

  const avancerQuestion = () => {
    setFeedback("");
    setReponse("");
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setJeuTermine(true);
      setTimerActive(false);
      const pourcentage = total > 0 ? Math.round((score / total) * 100) : 0;
      if (pourcentage > meilleurPourcentage) setMeilleurPourcentage(pourcentage);

      // Ajouter à l'historique
      const date = new Date();
      setHistorique((prev) => [
        ...prev,
        {
          nom: joueur.nom,
          date: date.toLocaleString(),
          partie: niveau.nom,
          essais: total,
          score: pourcentage,
          meilleurScore: score,
          mauvaisScore: total - score,
          meilleurTemps: temps,
          pireTemps: temps // ici temps de cette partie
        }
      ]);
    }
  };

  const retourMenu = () => {
    setNiveau(null);
    setQuestions([]);
    setQuestionIndex(0);
    setReponse("");
    setFeedback("");
    setJeuTermine(false);
    setJoueur({ nom: "", grade: "" });
    setTemps(0);
    setTimerActive(false);
  };

  const pourcentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const currentQuestion = questions[questionIndex];

  // --- Formulaire saisie joueur ---
  if (!joueur.nom || !joueur.grade) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Zap size={60} color="#fdd835" />
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Avant de commencer
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Saisis ton nom et ta classe
          </Typography>
          <TextField
            label="Nom"
            fullWidth
            sx={{ mb: 2 }}
            value={joueur.nom}
            onChange={(e) => setJoueur({ ...joueur, nom: e.target.value })}
          />
          <TextField
            label="Classe"
            fullWidth
            sx={{ mb: 2 }}
            value={joueur.grade}
            onChange={(e) => setJoueur({ ...joueur, grade: e.target.value })}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={() => {}}
            disabled={!joueur.nom || !joueur.grade}
            sx={{ mt: 2 }}
          >
            Valider
          </Button>
        </Card>
      </Container>
    );
  }

  // --- Menu principal ---
  if (!niveau) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Card sx={{ p: 4, textAlign: "center", mb: 4 }}>
          <Zap size={60} color="#fdd835" />
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Tables de Multiplication
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Choisis ton niveau, {joueur.nom} ({joueur.grade})
          </Typography>
          <Grid container spacing={2}>
            {questionsData.niveaux.map((niv, idx) => (
              <Grid item xs={12} key={idx}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => commencerJeu(niv)}
                  sx={{
                    backgroundColor: niv.couleur,
                    py: 2,
                    "&:hover": { opacity: 0.9 }
                  }}
                >
                  <Typography variant="h6">{niv.nom}</Typography>
                  <Typography variant="body2">
                    Tables de {niv.min} à {niv.max}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* --- Historique des parties --- */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Historique des parties
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Partie</TableCell>
                  <TableCell>Essais</TableCell>
                  <TableCell>Meilleur Score</TableCell>
                  <TableCell>Mauvais Score</TableCell>
                  <TableCell>Temps (s)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historique.map((h, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{h.nom}</TableCell>
                    <TableCell>{h.date}</TableCell>
                    <TableCell>{h.partie}</TableCell>
                    <TableCell>{h.essais}</TableCell>
                    <TableCell>{h.meilleurScore}</TableCell>
                    <TableCell>{h.mauvaisScore}</TableCell>
                    <TableCell>{h.meilleurTemps}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    );
  }

  // --- Écran de jeu ---
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ p: 4 }}>
        {/* En-tête */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <IconButton onClick={retourMenu}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              backgroundColor: niveau.couleur,
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold"
            }}
          >
            {niveau.nom}
          </Box>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card sx={{ bgcolor: "#e3f2fd", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" color="#1565c0">
                  {score}
                </Typography>
                <Typography variant="body2" color="#1565c0">
                  Correct
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ bgcolor: "#e8f5e9", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" color="#2e7d32">
                  {pourcentage}%
                </Typography>
                <Typography variant="body2" color="#2e7d32">
                  Réussite
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ bgcolor: "#fffde7", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" color="#f9a825">
                  {serie}
                </Typography>
                <Typography variant="body2" color="#f9a825">
                  Série
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Question */}
        {!jeuTermine && currentQuestion && (
          <>
            <Typography
              variant="h2"
              align="center"
              sx={{ mb: 3, fontSize: "3rem" }}
            >
              {currentQuestion.a} × {currentQuestion.b} = ?
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && reponse && verifierReponse()
              }
              placeholder="Ta réponse"
              sx={{ mb: 2 }}
              inputProps={{ style: { fontSize: 24, textAlign: "center" } }}
              autoFocus
              disabled={feedback !== ""}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={verifierReponse}
              disabled={!reponse || feedback !== ""}
              sx={{
                py: 2,
                bgcolor: "#8e24aa",
                "&:hover": { bgcolor: "#6a1b9a" }
              }}
            >
              Vérifier
            </Button>
          </>
        )}

        {/* Feedback */}
        {feedback === "correct" && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "#c8e6c9",
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            <Star size={40} color="#2e7d32" />
            <Typography variant="h5" color="#2e7d32">
              Bravo ! 🎉
            </Typography>
          </Box>
        )}

        {feedback === "incorrect" && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "#ffcdd2",
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            <Typography variant="h5" color="#c62828">
              Oups !
            </Typography>
            <Typography variant="h6" color="#c62828">
              {currentQuestion.a} × {currentQuestion.b} = {currentQuestion.resultat}
            </Typography>
          </Box>
        )}

        {/* Bilan final */}
        {jeuTermine && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Partie terminée 🎯
            </Typography>
            <Typography variant="h5" gutterBottom>
              {joueur.nom} ({joueur.grade})
            </Typography>
            <Typography variant="h6" gutterBottom>
              Score : {score}/{total} ({pourcentage}%)
            </Typography>
            <Typography variant="body1" gutterBottom>
              Temps écoulé : {Math.floor(temps / 60)}m {temps % 60}s
            </Typography>
            <Typography variant="body1" gutterBottom>
              Meilleur pourcentage : {meilleurPourcentage}%
            </Typography>
            <Button variant="contained" onClick={retourMenu}>
              Rejouer
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
}
