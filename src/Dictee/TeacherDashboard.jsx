import React, { useState, useMemo } from "react";
import {
  Container, Typography, Box, Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress, Alert, TextField, Button,
  LinearProgress
} from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// 🔗 URL de l'API Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxbbrh6ILbLyxSMmsDGw9tduNZmN_czXXwBdYbBf9KPX8IzuRuNbzXUyWauJDvDfLGr/exec";

// 🛠️ Fonction 100% fiable : Calcule le score à partir de la fraction (ex: "8 / 10")
const getScoreSafely = (noteStr, pourcentageRaw) => {
  if (typeof noteStr === "string" && noteStr.includes("/")) {
    const parts = noteStr.split("/");
    const score = parseFloat(parts[0].trim());
    const total = parseFloat(parts[1].trim());
    
    if (!isNaN(score) && !isNaN(total) && total > 0) {
      return Math.round((score / total) * 100);
    }
  }

  if (pourcentageRaw === undefined || pourcentageRaw === null || pourcentageRaw === "") return 0;
  
  if (typeof pourcentageRaw === "number") {
    if (pourcentageRaw > 0 && pourcentageRaw <= 1) return Math.round(pourcentageRaw * 100);
    return Math.round(pourcentageRaw);
  }

  const strVal = String(pourcentageRaw).trim();
  if (strVal.includes("%")) {
    return Math.round(parseFloat(strVal.replace("%", "").replace(",", ".")) || 0);
  }

  const numVal = parseFloat(strVal);
  if (!isNaN(numVal)) {
    if (numVal > 0 && numVal <= 1) return Math.round(numVal * 100);
    return Math.round(numVal);
  }

  return 0;
};

export default function UnifiedDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // États de connexion
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [role, setRole] = useState(null); // 'TEACHER', 'STUDENT', ou null
  const [activeStudent, setActiveStudent] = useState(null);

  // 🔹 Traitement global des données pour l'enseignant
  const { elevesArray, niveaux } = useMemo(() => {
    if (!data || data.length === 0) return { elevesArray: [], niveaux: [] };

    const eleves = {};
    const niveauxSet = new Set();

    data.forEach((item) => {
      if (!item.email) return;
      if (item.niveau) niveauxSet.add(item.niveau);

      if (!eleves[item.email]) {
        eleves[item.email] = {
          nom: item.nom || "Inconnu",
          niveau: item.niveau || "",
          scores: [],
          total: 0,
          somme: 0,
        };
      }

      const score = getScoreSafely(item.note, item.pourcentage);

      eleves[item.email].scores.push({
        semaine: item.semaine || "-",
        note: item.note || "-",
        score,
      });

      eleves[item.email].total++;
      eleves[item.email].somme += score;
    });

    const formatArray = Object.keys(eleves).map((email) => {
      const scoresTries = eleves[email].scores.sort((a, b) =>
        a.semaine.localeCompare(b.semaine, undefined, { numeric: true })
      );

      let tendance = 0;
      if (scoresTries.length >= 2) {
        tendance = scoresTries[scoresTries.length - 1].score - scoresTries[scoresTries.length - 2].score;
      }

      return {
        email: email.toLowerCase().trim(),
        nom: eleves[email].nom,
        niveau: eleves[email].niveau,
        moyenne: eleves[email].total > 0 ? Math.round(eleves[email].somme / eleves[email].total) : 0,
        scores: scoresTries,
        tendance,
        maxScore: Math.max(...scoresTries.map((s) => s.score)),
      };
    });

    return { elevesArray: formatArray, niveaux: [...niveauxSet].filter(Boolean) };
  }, [data]);

  // 🔹 Gestion de la Connexion
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginInput.trim()) {
      setLoginError("Veuillez entrer votre email ou mot de passe.");
      return;
    }

    setLoginError("");
    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}?user=${encodeURIComponent(loginInput)}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error("Impossible de joindre le serveur.");

      const textResponse = await res.text();
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Réponse invalide du serveur.");
      }

      if (result && result.error) {
        setLoginError("Accès refusé ou utilisateur introuvable.");
        setLoading(false);
        return;
      }

      if (!Array.isArray(result) || result.length === 0) {
        setLoginError("Utilisateur introuvable. Vérifiez votre email.");
        setLoading(false);
        return;
      }

      // 🚨 SÉCURITÉ : On vérifie dynamiquement si l'entrée est l'email d'un élève.
      // Le mot de passe du prof n'est plus écrit nulle part dans ce fichier !
      const isStudentEmail = result.some(
        (r) => r.email && r.email.toLowerCase().trim() === loginInput.toLowerCase().trim()
      );

      // 👨‍🏫 PROFESSEUR (Si ce n'est pas un email d'élève, c'est que Google a validé le mot de passe prof)
      if (!isStudentEmail) {
        setData(result);
        setRole("TEACHER");
        setLoading(false);
        return;
      }

      // 🎓 ÉLÈVE
      const scores = result.map((r) => ({
        semaine: r.semaine,
        score: getScoreSafely(r.note, r.pourcentage), 
      }));

      const moyenne = scores.length > 0 
        ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length) 
        : 0;

      const tendance = scores.length >= 2
        ? scores[scores.length - 1].score - scores[scores.length - 2].score
        : 0;

      const maxScore = scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : 0;

      setActiveStudent({
        nom: result[0].nom || "Élève",
        email: result[0].email,
        moyenne,
        scores,
        tendance,
        maxScore,
      });

      setRole("STUDENT");
    } catch (err) {
      console.error(err);
      setLoginError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setRole(null);
    setActiveStudent(null);
    setData([]);
    setLoginInput("");
  };

  if (error) return <Container sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Container>;

  // ==========================================
  // 🔓 ÉCRAN DE CONNEXION
  // ==========================================
  if (!role) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8" p={2}>
        <Card elevation={6} sx={{ maxWidth: 400, width: "100%", p: 4, borderRadius: 4, textAlign: "center" }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Box bgcolor="#e3f2fd" p={2} borderRadius="50%">
              <SchoolIcon color="primary" fontSize="large" />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Portail Scolaire</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            <strong>Élèves :</strong> Entrez votre adresse email.<br/>
           
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField 
              fullWidth 
              label="Email" 
              variant="outlined" 
              value={loginInput} 
              onChange={(e) => setLoginInput(e.target.value)} 
              error={!!loginError} 
              helperText={loginError} 
              sx={{ mb: 3 }} 
              disabled={loading}
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
            </Button>
          </form>
        </Card>
      </Box>
    );
  }

  // ==========================================
  // ROUTAGE DES VUES (CONNECTÉ)
  // ==========================================
  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh" }}>
      <Box bgcolor="white" px={4} py={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #e0e0e0" mb={4}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {role === "TEACHER" ? "👨‍🏫 Espace Enseignant" : "🎓 Mon Espace Scolaire"}
        </Typography>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout} size="small" sx={{ borderRadius: 2 }}>
          Déconnexion
        </Button>
      </Box>

      {role === "TEACHER" ? (
        <TeacherDashboardView elevesArray={elevesArray} niveaux={niveaux} />
      ) : (
        <StudentDashboardView student={activeStudent} />
      )}
    </Box>
  );
}

// =====================================================================
// 👨‍🏫 VUE ENSEIGNANT (TOUS LES GRAPHIQUES ET TOUTES LES DONNÉES)
// =====================================================================
function TeacherDashboardView({ elevesArray, niveaux }) {
  const [niveauFilter, setNiveauFilter] = useState(niveaux.length > 0 ? niveaux[0] : "");

  const elevesDuNiveau = useMemo(() => 
    elevesArray.filter((e) => e.niveau === niveauFilter).sort((a, b) => b.moyenne - a.moyenne), 
  [elevesArray, niveauFilter]);

  const evolutionClasse = useMemo(() => {
    const statsSemaine = {};
    elevesDuNiveau.forEach((eleve) => {
      eleve.scores.forEach((s) => {
        if (!statsSemaine[s.semaine]) statsSemaine[s.semaine] = { semaine: s.semaine, total: 0, count: 0 };
        statsSemaine[s.semaine].total += s.score;
        statsSemaine[s.semaine].count += 1;
      });
    });
    return Object.values(statsSemaine)
      .map((s) => ({ semaine: s.semaine, moyenneClasse: Math.round(s.total / s.count) }))
      .sort((a, b) => a.semaine.localeCompare(b.semaine, undefined, { numeric: true }));
  }, [elevesDuNiveau]);

  const statsNiveau = useMemo(() => {
    const totalEleves = elevesDuNiveau.length;
    if (totalEleves === 0) return { moyenne: 0, reussite: 0, difficulte: 0, top: 0, tendanceClasse: 0 };
    
    const moyenne = Math.round(elevesDuNiveau.reduce((acc, e) => acc + e.moyenne, 0) / totalEleves);
    const difficulte = elevesDuNiveau.filter((e) => e.moyenne < 60).length;
    const reussite = Math.round(((totalEleves - difficulte) / totalEleves) * 100);
    const top = Math.max(...elevesDuNiveau.map((e) => e.moyenne));
    
    let tendanceClasse = 0;
    if (evolutionClasse.length >= 2) {
      tendanceClasse = evolutionClasse[evolutionClasse.length - 1].moyenneClasse - evolutionClasse[evolutionClasse.length - 2].moyenneClasse;
    }
    
    return { moyenne, reussite, difficulte, top, tendanceClasse };
  }, [elevesDuNiveau, evolutionClasse]);

  const getColor = (score) => score < 60 ? "error" : score < 80 ? "warning" : "success";

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          📊 Tableau de Bord Global
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Aperçu de la classe et suivi de la progression individuelle
        </Typography>

        <Box display="flex" justifyContent="center" mt={3}>
          <Paper elevation={2} sx={{ p: 2, minWidth: 300, borderRadius: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Analyser la classe</InputLabel>
              <Select value={niveauFilter} label="Analyser la classe" onChange={(e) => setNiveauFilter(e.target.value)} sx={{ textAlign: "center" }}>
                {niveaux.map((niv, index) => (<MenuItem key={index} value={niv}>{niv}</MenuItem>))}
              </Select>
            </FormControl>
          </Paper>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">Moyenne Générale</Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">{statsNiveau.moyenne}%</Typography>
            <Typography variant="body2" color={statsNiveau.tendanceClasse >= 0 ? "success.main" : "error.main"}>
              {statsNiveau.tendanceClasse >= 0 ? `+${statsNiveau.tendanceClasse} 📈` : `${statsNiveau.tendanceClasse} 📉`} vs dern. semaine
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">Taux de Réussite</Typography>
            <Typography variant="h4" fontWeight="bold" color={statsNiveau.reussite >= 60 ? "success.main" : "error.main"}>
              {statsNiveau.reussite}%
            </Typography>
            <Typography variant="body2" color="text.secondary">Élèves ≥ 60%</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">En Difficulté</Typography>
            <Typography variant="h4" fontWeight="bold" color="error">{statsNiveau.difficulte}</Typography>
            <Typography variant="body2" color="text.secondary">Élèves &lt; 60%</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">Meilleure Moyenne</Typography>
            <Typography variant="h4" fontWeight="bold" color="#f39c12">🏆 {statsNiveau.top}%</Typography>
            <Typography variant="body2" color="text.secondary">Meilleur score de la classe</Typography>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center" mb={6}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 3 }}>
          <Typography variant="h6" align="center" gutterBottom color="primary" fontWeight="bold">
            📈 Progression Globale ({niveauFilter})
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionClasse} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoyenne" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Moyenne Classe"]} />
                <Area type="monotone" dataKey="moyenneClasse" stroke="#1976d2" fill="url(#colorMoyenne)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#333" }}>
        🧑‍🎓 Analyse Individuelle
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {elevesDuNiveau.map((eleve, index) => (
          <Grid item xs={12} md={10} lg={8} key={index}>
            <Card elevation={4} sx={{ borderRadius: 3, borderTop: `6px solid ${eleve.moyenne < 60 ? "#e53935" : eleve.moyenne < 80 ? "#fb8c00" : "#43a047"}` }}>
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}>
                <Typography variant="h5" fontWeight="bold">{eleve.nom}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{eleve.email}</Typography>
                
                <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                  <Chip label={`Moyenne : ${eleve.moyenne}%`} color={getColor(eleve.moyenne)} sx={{ fontWeight: "bold", fontSize: "1rem" }} />
                  <Chip label={eleve.tendance > 0 ? `+${eleve.tendance} pts (Hausse)` : eleve.tendance < 0 ? `${eleve.tendance} pts (Baisse)` : "Stable"} color={eleve.tendance > 0 ? "success" : eleve.tendance < 0 ? "error" : "default"} variant="outlined" />
                  <Chip label={`Meilleur Score : ${eleve.maxScore}%`} variant="outlined" />
                </Box>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                      Historique des Scores
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 250, overflowY: "auto" }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Semaine</TableCell>
                            <TableCell align="center">Score</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {eleve.scores.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell align="center">{item.semaine}</TableCell>
                              <TableCell align="center">
                                <Typography fontWeight="bold" color={item.score < 60 ? "error.main" : item.score < 80 ? "warning.main" : "success.main"}>
                                  {item.score}%
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} sm={7}>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                      Graphique de Progression
                    </Typography>
                    <Box sx={{ height: 250, width: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={eleve.scores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                          <Line type="monotone" dataKey="score" stroke={eleve.moyenne < 60 ? "#e53935" : eleve.moyenne < 80 ? "#fb8c00" : "#43a047"} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// =====================================================================
// 🎓 VUE ÉLÈVE (ATTRACTIVE ET COLORÉE 🎨)
// =====================================================================
function StudentDashboardView({ student }) {

  const getFeedbackTheme = (score) => {
    if (score >= 80) return { 
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      chartColor: "#27ae60",
      message: "Excellent travail ! Continue sur cette belle lancée ! 🌟",
      emoji: "🏆"
    };
    if (score >= 60) return { 
      gradient: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
      chartColor: "#f39c12",
      message: "Bon travail ! Encore un petit effort pour atteindre l'excellence ! 🚀",
      emoji: "🔥"
    };
    return { 
      gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      chartColor: "#e74c3c",
      message: "Ne te décourage pas ! Révise tes erreurs et tu vas y arriver ! 💪",
      emoji: "💡"
    };
  };

  const theme = getFeedbackTheme(student.moyenne);
  const getColor = (score) => score < 60 ? "error" : score < 80 ? "warning" : "success";

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      <Card elevation={6} sx={{ borderRadius: 4, mb: 4, background: theme.gradient, color: "white" }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {theme.emoji} Bonjour, {student.nom} !
          </Typography>

          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            {theme.message}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight="bold">Progression vers 100%</Typography>
                <Typography variant="body2" fontWeight="bold">{student.moyenne}%</Typography>
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={student.moyenne} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5, 
                  backgroundColor: "rgba(255,255,255,0.3)", 
                  "& .MuiLinearProgress-bar": { backgroundColor: "white" } 
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: `6px solid ${theme.chartColor}` }}>
            <SchoolIcon sx={{ fontSize: 40, color: theme.chartColor, mb: 1 }} />
            <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Ma Moyenne</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: theme.chartColor }}>{student.moyenne}%</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: `6px solid ${student.tendance >= 0 ? "#27ae60" : "#e74c3c"}` }}>
            {student.tendance >= 0 ? 
              <TrendingUpIcon sx={{ fontSize: 40, color: "#27ae60", mb: 1 }} /> : 
              <TrendingDownIcon sx={{ fontSize: 40, color: "#e74c3c", mb: 1 }} />
            }
            <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Tendance</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: student.tendance >= 0 ? "#27ae60" : "#e74c3c" }} mt={1}>
              {student.tendance > 0 ? "+" : ""}{student.tendance} pts
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: "6px solid #f39c12" }}>
            <EmojiEventsIcon sx={{ fontSize: 40, color: "#f39c12", mb: 1 }} />
            <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Record Personnel</Typography>
            <Typography variant="h3" fontWeight="bold" color="#f39c12">{student.maxScore}%</Typography>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={5} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            <Grid item xs={12} md={5} sx={{ borderRight: { md: "1px solid #eee" }, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                📝 Tous Mes Scores Hebdomadaires
              </Typography>

              <TableContainer sx={{ maxHeight: 350, overflowY: "auto", mt: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ bgcolor: "#f4f6f8" }}><strong>Semaine</strong></TableCell>
                      <TableCell align="center" sx={{ bgcolor: "#f4f6f8" }}><strong>Résultat</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.scores && student.scores.length > 0 ? (
                      student.scores.map((item, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell align="center" sx={{ fontWeight: '500' }}>
                            {item.semaine}
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${item.score}%`} 
                              color={getColor(item.score)} 
                              sx={{ fontWeight: "bold", fontSize: "0.9rem", px: 1 }}
                              variant={item.score < 60 ? "filled" : "outlined"} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4, color: "text.secondary" }}>
                          Aucun score enregistré pour le moment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={7} sx={{ p: 4, bgcolor: "#fcfcfc", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                🚀 Ma Progression Visuelle
              </Typography>

              <Box sx={{ flexGrow: 1, minHeight: 300, width: "100%", mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={student.scores} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudentScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.5} />
                        <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '10px', fontWeight: 'bold' }} formatter={(value) => [`${value}%`, "Score"]} />
                    <Area type="monotone" dataKey="score" stroke={theme.chartColor} fill="url(#colorStudentScore)" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}