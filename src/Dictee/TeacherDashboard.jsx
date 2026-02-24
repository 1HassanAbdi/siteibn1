import React, { useEffect, useState, useMemo } from "react";
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// 🛑 MOT DE PASSE PROFESSEUR
const MOT_DE_PASSE_PROF = "prof2024";

export default function UnifiedDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États de connexion
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [role, setRole] = useState(null); // 'TEACHER', 'STUDENT', ou null
  const [activeStudent, setActiveStudent] = useState(null);

  // 🔹 Chargement des données
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbzhq74E_WYBuHDErFxeVLdN0RVHz3dJOKz4zkbA7AZF4uNZZtM1Mo5jr9PJGHTTqH2s/exec")
      .then((res) => res.json())
      .then((result) => {
        if (!Array.isArray(result)) throw new Error("Format incorrect");
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur de chargement des données.");
        setLoading(false);
      });
  }, []);

  // 🔹 Traitement global
  const { elevesArray, niveaux } = useMemo(() => {
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

      let rawVal = item.pourcentage;
      let score = 0;
      if (typeof rawVal === "string") {
        rawVal = parseFloat(rawVal.replace("%", "").replace(",", "."));
      }
      if (rawVal > 0 && rawVal <= 1) {
        score = Math.round(rawVal * 100);
      } else {
        score = Math.round(rawVal) || 0;
      }

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
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    const input = loginInput.trim().toLowerCase();

    if (!input) {
      setLoginError("Veuillez entrer un identifiant.");
      return;
    }

    if (input === MOT_DE_PASSE_PROF.toLowerCase()) {
      setRole("TEACHER");
      return;
    }

    const student = elevesArray.find((e) => e.email === input);
    if (student) {
      setActiveStudent(student);
      setRole("STUDENT");
      return;
    }

    setLoginError("Identifiant incorrect ou email introuvable.");
  };

  const handleLogout = () => {
    setRole(null);
    setActiveStudent(null);
    setLoginInput("");
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f6f8"><CircularProgress /></Box>;
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
            <strong>Élèves :</strong> Entrez votre email.<br/>
           
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email ou Mot de passe" variant="outlined" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} error={!!loginError} helperText={loginError} sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold" }}>
              Se connecter
            </Button>
          </form>
        </Card>
      </Box>
    );
  }

  // ==========================================
  // ROUTAGE DES VUES
  // ==========================================
  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh" }}>
      {/* Barre de navigation */}
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

/// =====================================================================
// 👨‍🏫 VUE ENSEIGNANT (TOUS LES GRAPHIQUES ET TOUTES LES DONNÉES)
// =====================================================================
function TeacherDashboardView({ elevesArray, niveaux }) {
  const [niveauFilter, setNiveauFilter] = useState(niveaux.length > 0 ? niveaux[0] : "");

  const elevesDuNiveau = useMemo(() => elevesArray.filter((e) => e.niveau === niveauFilter).sort((a, b) => b.moyenne - a.moyenne), [elevesArray, niveauFilter]);

  const evolutionClasse = useMemo(() => {
    const statsSemaine = {};
    elevesDuNiveau.forEach((eleve) => {
      eleve.scores.forEach((s) => {
        if (!statsSemaine[s.semaine]) statsSemaine[s.semaine] = { semaine: s.semaine, total: 0, count: 0 };
        statsSemaine[s.semaine].total += s.score;
        statsSemaine[s.semaine].count += 1;
      });
    });
    return Object.values(statsSemaine).map((s) => ({ semaine: s.semaine, moyenneClasse: Math.round(s.total / s.count) })).sort((a, b) => a.semaine.localeCompare(b.semaine, undefined, { numeric: true }));
  }, [elevesDuNiveau]);

  const statsNiveau = useMemo(() => {
    const totalEleves = elevesDuNiveau.length;
    if (totalEleves === 0) return { moyenne: 0, reussite: 0, difficulte: 0, top: 0, tendanceClasse: 0 };
    const moyenne = Math.round(elevesDuNiveau.reduce((acc, e) => acc + e.moyenne, 0) / totalEleves);
    const difficulte = elevesDuNiveau.filter((e) => e.moyenne < 60).length;
    const reussite = Math.round(((totalEleves - difficulte) / totalEleves) * 100);
    const top = Math.max(...elevesDuNiveau.map((e) => e.moyenne));
    let tendanceClasse = 0;
    if (evolutionClasse.length >= 2) tendanceClasse = evolutionClasse[evolutionClasse.length - 1].moyenneClasse - evolutionClasse[evolutionClasse.length - 2].moyenneClasse;
    return { moyenne, reussite, difficulte, top, tendanceClasse };
  }, [elevesDuNiveau, evolutionClasse]);

  const getColor = (score) => score < 60 ? "error" : score < 80 ? "warning" : "success";

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }}>
      {/* HEADER CENTRÉ */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          📊 Tableau de Bord Analytique
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Vue globale de la classe et suivi individuel
        </Typography>

        <Box display="flex" justifyContent="center" mt={3}>
          <Paper elevation={2} sx={{ p: 2, minWidth: 300, borderRadius: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Analyser la classe</InputLabel>
              <Select value={niveauFilter} label="Analyser la classe" onChange={(e) => setNiveauFilter(e.target.value)} sx={{ textAlign: "center" }}>
                {niveaux.map((niv, index) => (<MenuItem key={index} value={niv} sx={{ justifyContent: "center" }}>{niv}</MenuItem>))}
              </Select>
            </FormControl>
          </Paper>
        </Box>
      </Box>

      {/* 🚀 INDICATEURS KPI GLOBAUX */}
      <Grid container spacing={3} sx={{ mb: 5 }} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">Moyenne Globale</Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">{statsNiveau.moyenne}%</Typography>
            <Typography variant="body2" color={statsNiveau.tendanceClasse >= 0 ? "success.main" : "error.main"}>
              {statsNiveau.tendanceClasse >= 0 ? `+${statsNiveau.tendanceClasse} 📈` : `${statsNiveau.tendanceClasse} 📉`} vs dern. semaine
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">Taux de réussite</Typography>
            <Typography variant="h4" fontWeight="bold" color={statsNiveau.reussite >= 60 ? "success.main" : "error.main"}>{statsNiveau.reussite}%</Typography>
            <Typography variant="body2" color="text.secondary">Élèves ≥ 60%</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">En difficulté</Typography>
            <Typography variant="h4" fontWeight="bold" color="error">{statsNiveau.difficulte}</Typography>
            <Typography variant="body2" color="text.secondary">Élèves &lt; 60%</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
            <Typography color="text.secondary" variant="subtitle2">Meilleure Moyenne</Typography>
            <Typography variant="h4" fontWeight="bold" color="#f39c12">🏆 {statsNiveau.top}%</Typography>
            <Typography variant="body2" color="text.secondary">Top score de la classe</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 📈 GRAPHIQUE ÉVOLUTION CLASSE */}
      <Box display="flex" justifyContent="center" mb={6}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 3 }}>
          <Typography variant="h6" align="center" gutterBottom color="primary" fontWeight="bold">
            📈 Évolution générale de la classe ({niveauFilter})
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
        🧑‍🎓 Analyse Individuelle des Élèves
      </Typography>

      {/* 🧑‍🎓 LISTE DÉTAILLÉE DES ÉLÈVES */}
      <Grid container spacing={4} justifyContent="center">
        {elevesDuNiveau.map((eleve, index) => (
          <Grid item xs={12} md={10} lg={8} key={index}>
            <Card elevation={4} sx={{ borderRadius: 3, borderTop: `6px solid ${eleve.moyenne < 60 ? "#e53935" : eleve.moyenne < 80 ? "#fb8c00" : "#43a047"}` }}>
              
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}>
                <Typography variant="h5" fontWeight="bold">{eleve.nom}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{eleve.email}</Typography>
                <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                  <Chip label={`Moyenne: ${eleve.moyenne}%`} color={getColor(eleve.moyenne)} sx={{ fontWeight: "bold", fontSize: "1rem" }} />
                  <Chip label={eleve.tendance > 0 ? `+${eleve.tendance} pts (Hausse)` : eleve.tendance < 0 ? `${eleve.tendance} pts (Baisse)` : "Stable"} color={eleve.tendance > 0 ? "success" : eleve.tendance < 0 ? "error" : "default"} variant="outlined" />
                  <Chip label={`Top: ${eleve.maxScore}%`} variant="outlined" />
                </Box>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>Historique des notes</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 250, overflowY: "auto" }}>
                      <Table size="small" stickyHeader>
                        <TableHead><TableRow><TableCell align="center">Semaine</TableCell><TableCell align="center">Score</TableCell></TableRow></TableHead>
                        <TableBody>
                          {eleve.scores.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell align="center">{item.semaine}</TableCell>
                              <TableCell align="center"><Typography fontWeight="bold" color={item.score < 60 ? "error.main" : item.score < 80 ? "warning.main" : "success.main"}>{item.score}%</Typography></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} sm={7}>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>Courbe de progression</Typography>
                    <Box sx={{ height: 250, width: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={eleve.scores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}%`, "Performance"]} />
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
  
  // Fonction pour générer un thème dynamique selon la moyenne
  const getFeedbackTheme = (score) => {
    if (score >= 80) return { 
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", // Vert éclatant
      chartColor: "#27ae60",
      message: "Excellent travail ! Tu es sur une superbe lancée, continue comme ça ! 🌟",
      emoji: "🏆"
    };
    if (score >= 60) return { 
      gradient: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)", // Orange/Or chaleureux
      chartColor: "#f39c12",
      message: "Bien joué ! Tu es sur la bonne voie. Encore un petit effort pour viser l'excellence ! 🚀",
      emoji: "🔥"
    };
    return { 
      gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)", // Rouge motivant
      chartColor: "#e74c3c",
      message: "Ne te décourage pas ! Analyse tes erreurs, pose des questions, et tu vas y arriver ! 💪",
      emoji: "💡"
    };
  };

  const theme = getFeedbackTheme(student.moyenne);
  const getColor = (score) => score < 60 ? "error" : score < 80 ? "warning" : "success";

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      
      {/* 🌟 BANNIÈRE DE BIENVENUE COLORÉE */}
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
                sx={{ height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.3)", "& .MuiLinearProgress-bar": { backgroundColor: "white" } }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 🚀 CARTES INDICATEURS VIBRANTES */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: `6px solid ${theme.chartColor}` }}>
            <SchoolIcon sx={{ fontSize: 40, color: theme.chartColor, mb: 1 }} />
            <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Ma Moyenne</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: theme.chartColor }}>
              {student.moyenne}%
            </Typography>
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
            <Typography variant="h3" fontWeight="bold" color="#f39c12">
              {student.maxScore}%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 📊 DÉTAILS ET GRAPHIQUE DYNAMIQUE */}
      <Card elevation={5} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            
            {/* TABLEAU DES NOTES */}
            <Grid item xs={12} md={5} sx={{ borderRight: { md: "1px solid #eee" }, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom align="center">📝 Mes notes par semaine</Typography>
              <TableContainer sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><strong>Semaine</strong></TableCell>
                      <TableCell align="center"><strong>Résultat</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.scores.map((item, idx) => (
                      <TableRow key={idx} hover sx={{ transition: "0.2s", "&:hover": { backgroundColor: "#f5f5f5" } }}>
                        <TableCell align="center" sx={{ fontSize: "1rem" }}>{item.semaine}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${item.score}%`} 
                            color={getColor(item.score)} 
                            sx={{ fontWeight: "bold", fontSize: "0.9rem", px: 1 }}
                            variant={item.score < 60 ? "filled" : "outlined"} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* GRAPHIQUE AREA CHART */}
            <Grid item xs={12} md={7} sx={{ p: 4, bgcolor: "#fcfcfc" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom align="center">🚀 Ma progression visuelle</Typography>
              <Box sx={{ height: 280, width: "100%", mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={student.scores} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudentScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.5} />
                        <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '10px', fontWeight: 'bold' }} 
                      formatter={(value) => [`${value}%`, "Mon Score"]} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke={theme.chartColor} 
                      fill="url(#colorStudentScore)" 
                      strokeWidth={4} 
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }} 
                    />
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