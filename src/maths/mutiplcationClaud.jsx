import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Star, EmojiEvents, FlashOn, Timer, School, BarChart } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Données pour simuler l'historique des parties
const initialHistorique = [
  { id: 1, date: "2023-10-01", score: 12, temps: 180, niveau: "Facile" },
  { id: 2, date: "2023-10-02", score: 15, temps: 150, niveau: "Moyen" },
];

export default function JeuMultiplication() {
  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("");
  const [dialogOpen, setDialogOpen] = useState(true);
  const [niveau, setNiveau] = useState(null);
  const [question, setQuestion] = useState(null);
  const [reponse, setReponse] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [serie, setSerie] = useState(0);
  const [meilleureSerie, setMeilleureSerie] = useState(0);
  const [temps, setTemps] = useState(0);
  const [partieTerminee, setPartieTerminee] = useState(false);
  const [historique, setHistorique] = useState(initialHistorique);
  const [partiesAffichees, setPartiesAffichees] = useState([]);
  const inputRef = useRef(null);

  const niveaux = [
    { nom: "Facile", min: 1, max: 5, couleur: "success.main" },
    { nom: "Moyen", min: 1, max: 10, couleur: "primary.main" },
    { nom: "Difficile", min: 1, max: 15, couleur: "secondary.main" },
  ];

  // Mise à jour du timer
  useEffect(() => {
    let interval;
    if (niveau && !partieTerminee) {
      interval = setInterval(() => {
        setTemps((prevTemps) => prevTemps + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [niveau, partieTerminee]);

  // Focus automatique sur le champ de réponse
  useEffect(() => {
    if (question && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  const genererQuestion = (niv) => {
    const questions = [];
    for (let i = 0; i < 20; i++) {
      const a = Math.floor(Math.random() * (niv.max - niv.min + 1)) + niv.min;
      const b = Math.floor(Math.random() * (niv.max - niv.min + 1)) + niv.min;
      questions.push({ a, b, resultat: a * b });
    }
    setQuestion(questions[0]);
    setTotal(1);
    setScore(0);
    setSerie(0);
  };

  const verifierReponse = () => {
    const rep = parseInt(reponse);
    if (rep === question.resultat) {
      setScore(score + 1);
      setSerie(serie + 1);
      if (serie + 1 > meilleureSerie) setMeilleureSerie(serie + 1);
      setFeedback("correct");
    } else {
      setSerie(0);
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback("");
      setReponse("");
      if (total < 20) {
        const nextQuestionIndex = total;
        setQuestion(partieQuestions[nextQuestionIndex]);
        setTotal(total + 1);
      } else {
        setPartieTerminee(true);
        const nouvellePartie = {
          id: historique.length + 1,
          date: new Date().toISOString().split("T")[0],
          score,
          temps,
          niveau: niveau.nom,
          nom,
          classe,
        };
        setHistorique([...historique, nouvellePartie]);
        setPartiesAffichees([...historique.slice(-2), nouvellePartie]);
      }
    }, feedback === "correct" ? 1000 : 2000);
  };

  const [partieQuestions, setPartieQuestions] = useState([]);

  const commencerJeu = (niv) => {
    setNiveau(niv);
    const questions = [];
    for (let i = 0; i < 20; i++) {
      const a = Math.floor(Math.random() * (niv.max - niv.min + 1)) + niv.min;
      const b = Math.floor(Math.random() * (niv.max - niv.min + 1)) + niv.min;
      questions.push({ a, b, resultat: a * b });
    }
    setPartieQuestions(questions);
    setQuestion(questions[0]);
    setTotal(1);
    setScore(0);
    setSerie(0);
    setTemps(0);
    setPartieTerminee(false);
  };

  const retourMenu = () => {
    setNiveau(null);
    setQuestion(null);
    setReponse("");
    setFeedback("");
    setDialogOpen(true);
  };

  const formatTemps = (secondes) => {
    const mins = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const pourcentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // Dialogue pour inscrire le nom et la classe
  if (dialogOpen) {
    return (
      <Dialog open={dialogOpen} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <School />
            <Typography>Inscription</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Classe"
            fullWidth
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={!nom || !classe}>
            Commencer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // MENU NIVEAUX
  if (!niveau) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
          p: 2,
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 5 }}>
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: "inline-flex",
                bgcolor: "warning.main",
                borderRadius: "50%",
                p: 2,
                mb: 2,
              }}
            >
              <FlashOn sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              Tables de Multiplication
            </Typography>
            <Typography color="text.secondary">Choisis ton niveau, {nom} !</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
            {niveaux.map((niv, idx) => (
              <Button
                key={idx}
                onClick={() => commencerJeu(niv)}
                sx={{
                  bgcolor: niv.couleur,
                  color: "white",
                  py: 2,
                  fontWeight: "bold",
                  "&:hover": { opacity: 0.9 },
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6">{niv.nom}</Typography>
                <Typography variant="caption">
                  Tables de {niv.min} à {niv.max}
                </Typography>
              </Button>
            ))}
          </Box>
          {historique.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" mb={1}>
                Dernières parties :
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Temps</TableCell>
                      <TableCell>Niveau</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historique.slice(-3).map((partie) => (
                      <TableRow key={partie.id}>
                        <TableCell>{partie.date}</TableCell>
                        <TableCell>{partie.score}/20</TableCell>
                        <TableCell>{formatTemps(partie.temps)}</TableCell>
                        <TableCell>{partie.niveau}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Box>
    );
  }

  // BILAN
  if (partieTerminee) {
    const dataScore = partiesAffichees.map((partie) => ({
      date: partie.date,
      score: partie.score,
    }));
    const dataTemps = partiesAffichees.map((partie) => ({
      date: partie.date,
      temps: partie.temps,
    }));
    const dataPourcentage = partiesAffichees.map((partie) => ({
      date: partie.date,
      pourcentage: Math.round((partie.score / 20) * 100),
    }));

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
          p: 2,
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 800, width: "100%", borderRadius: 5 }}>
          <Box textAlign="center" mb={4}>
            <EmojiEvents sx={{ fontSize: 60, color: "gold", mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              Bravo, {nom} ! 🎉
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Voici ton bilan pour cette partie :
            </Typography>
          </Box>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "info.lighter" }}>
                <Typography variant="h5" color="info.main">
                  {score}/20
                </Typography>
                <Typography variant="caption" color="info.main">
                  Score
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.lighter" }}>
                <Typography variant="h5" color="success.main">
                  {formatTemps(temps)}
                </Typography>
                <Typography variant="caption" color="success.main">
                  Temps
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.lighter" }}>
                <Typography variant="h5" color="warning.main">
                  {Math.round((score / 20) * 100)}%
                </Typography>
                <Typography variant="caption" color="warning.main">
                  Réussite
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h6" mb={2}>
            Ton évolution :
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" mb={1}>
                Score :
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataScore}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" mb={1}>
                Temps (secondes) :
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataTemps}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temps" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" mb={1}>
                Réussite (%) :
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataPourcentage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pourcentage" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={retourMenu}
            >
              Retour au menu
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => commencerJeu(niveau)}
            >
              Rejouer
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // JEU
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%", borderRadius: 5 }}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Button onClick={retourMenu} color="inherit">
            ← Menu
          </Button>
          <Chip
            label={niveau.nom}
            sx={{ bgcolor: niveau.couleur, color: "white", fontWeight: "bold" }}
          />
        </Box>

        {/* TIMER */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            bgcolor="info.lighter"
            p={1}
            borderRadius={2}
          >
            <Timer sx={{ color: "info.main" }} />
            <Typography variant="h6" color="info.main">
              {formatTemps(temps)}
            </Typography>
          </Box>
        </Box>

        {/* PROGRESSION */}
        <LinearProgress
          variant="determinate"
          value={(total / 20) * 100}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        {/* STATS */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: "center", bgcolor: "info.lighter" }}>
              <Typography variant="h6" color="info.main">
                {score}
              </Typography>
              <Typography variant="caption" color="info.main">
                Correct
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: "center", bgcolor: "success.lighter" }}>
              <Typography variant="h6" color="success.main">
                {pourcentage}%
              </Typography>
              <Typography variant="caption" color="success.main">
                Réussite
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: "center", bgcolor: "warning.lighter" }}>
              <Typography variant="h6" color="warning.main">
                {serie}
              </Typography>
              <Typography variant="caption" color="warning.main">
                Série
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* QUESTION */}
        {question && (
          <Box mb={3} textAlign="center">
            <Typography variant="h2" fontWeight="bold" mb={2}>
              {question.a} × {question.b} = ?
            </Typography>
            <TextField
              inputRef={inputRef}
              type="number"
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && reponse) {
                  verifierReponse();
                }
              }}
              placeholder="Ta réponse"
              variant="outlined"
              size="large"
              fullWidth
              disabled={feedback !== ""}
              sx={{
                mb: 2,
                fontSize: 32,
                textAlign: "center",
                "& input": { textAlign: "center", fontSize: 24 },
              }}
            />
            <Button
              onClick={verifierReponse}
              disabled={!reponse || feedback !== ""}
              variant="contained"
              fullWidth
              sx={{ py: 2, fontWeight: "bold" }}
            >
              Vérifier
            </Button>
          </Box>
        )}

        {/* FEEDBACK */}
        {feedback === "correct" && (
          <Box
            textAlign="center"
            p={2}
            bgcolor="success.lighter"
            borderRadius={2}
            mb={2}
          >
            <Star sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="success.main">
              Bravo ! 🎉
            </Typography>
          </Box>
        )}
        {feedback === "incorrect" && (
          <Box
            textAlign="center"
            p={2}
            bgcolor="error.lighter"
            borderRadius={2}
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold" color="error.main" mb={1}>
              Oups !
            </Typography>
            <Typography variant="h6" color="error.main">
              {question.a} × {question.b} = {question.resultat}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
