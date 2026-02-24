import React, { useState, useMemo } from "react";
import {
  Container, Typography, Box, Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress, Alert, TextField, Button,
  LinearProgress, Divider, Avatar
} from "@mui/material";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from "recharts";

import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// 🔗 CONFIGURATION
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwAH1y1_MLuSnBQ_LrbcYSWA5K45dicER-fj0qlAkGYDLnng-vJM2D9MAwoXSNdm64Og/exec";
const TEACHER_PASSWORD = "prof2024";

// --- DYNAMIC THEME COLORS ---
const getStatusTheme = (score) => {
  if (score >= 80) return { main: '#2e7d32', bg: '#e8f5e9', label: 'Excellent' }; // Green
  if (score >= 60) return { main: '#ed6c02', bg: '#fff3e0', label: 'Good' };      // Orange
  return { main: '#d32f2f', bg: '#ffebee', label: 'At Risk' };  // Red
};

const parseScore = (val) => {
  if (val === undefined || val === null || val === "") return 0;
  let s = val.toString().replace('%', '').replace(',', '.').trim();
  let num = parseFloat(s);
  if (num <= 1 && num > 0) return Math.round(num * 100);
  return Math.round(num) || 0;
};

export default function UnifiedDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [role, setRole] = useState(null);

  const { elevesArray, niveaux } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return { elevesArray: [], niveaux: [] };
    const eleves = {};
    const niveauxSet = new Set();

    data.forEach((item) => {
      const email = item.email?.toLowerCase().trim();
      if (!email || !item.niveau) return;
      niveauxSet.add(item.niveau);
      if (!eleves[email]) eleves[email] = { nom: item.nom, niveau: item.niveau, email, scores: [] };
      const weekNum = parseInt(item.semaine?.replace(/\D/g, "")) || 0;
      eleves[email].scores.push({ semaine: `Week ${weekNum}`, weekNum, score: parseScore(item.pourcentage) });
    });

    const formatArray = Object.keys(eleves).map(email => {
      const e = eleves[email];
      const sorted = e.scores.sort((a, b) => a.weekNum - b.weekNum);
      const average = Math.round(sorted.reduce((acc, s) => acc + s.score, 0) / sorted.length);
      const trend = sorted.length >= 2 ? sorted[sorted.length - 1].score - sorted[sorted.length - 2].score : 0;
      return { ...e, average, scores: sorted, maxScore: Math.max(...sorted.map(s => s.score)), trend };
    });

    return { elevesArray: formatArray, niveaux: [...niveauxSet] };
  }, [data]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); setLoading(true);
    try {
      const url = `${GOOGLE_SCRIPT_URL}?user=${encodeURIComponent(loginInput.trim())}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.error) setLoginError("Access Denied: ID not found.");
      else { 
        setData(result); 
        setRole(loginInput.toLowerCase() === TEACHER_PASSWORD ? "TEACHER" : "STUDENT"); 
      }
    } catch (err) { setLoginError("Connection Error."); }
    setLoading(false);
  };

  if (!role) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6f9', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Card sx={{ maxWidth: 420, width: '100%', p: 5, borderRadius: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 45 }} />
          </Avatar>
          <Typography variant="h4" fontWeight="900" color="#1a237e" gutterBottom>Portal Login</Typography>
          <Typography color="text.secondary" mb={4}>Access your results in real-time</Typography>
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email or Staff ID" variant="outlined" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem' }}>
              {loading ? <CircularProgress size={26} color="inherit" /> : "Sign In"}
            </Button>
            {loginError && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{loginError}</Alert>}
          </form>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', pb: 8 }}>
      <Box sx={{ bgcolor: 'white', px: 4, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: '1px solid #ddd' }}>
        <Typography variant="h5" fontWeight="900" color="primary">SCOLAR-ANALYTICS</Typography>
        <Button onClick={() => window.location.reload()} color="error" variant="outlined" startIcon={<LogoutIcon />} sx={{ fontWeight: 'bold' }}>Sign Out</Button>
      </Box>
      <Container maxWidth="xl">
        {role === "TEACHER" ? <TeacherView eleves={elevesArray} niveaux={niveaux} /> : <StudentView student={elevesArray[0]} />}
      </Container>
    </Box>
  );
}

// =====================================================================
// 👨‍🏫 TEACHER VIEW (ENGLISH + BIG NUMBERS)
// =====================================================================
function TeacherView({ eleves, niveaux }) {
  const [filter, setFilter] = useState(niveaux[0] || "");
  const filtered = eleves.filter(e => e.niveau === filter);

  const stats = useMemo(() => {
    if (!filtered.length) return { moy: 0, reu: 0, dif: 0, top: 0 };
    const moy = Math.round(filtered.reduce((acc, e) => acc + e.average, 0) / filtered.length);
    const dif = filtered.filter(e => e.average < 60).length;
    const reu = Math.round(((filtered.length - dif) / filtered.length) * 100);
    const top = Math.max(...filtered.map(e => e.average));
    return { moy, reu, dif, top };
  }, [filtered]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" fontWeight="900" color="#1a237e" gutterBottom>Analytical Dashboard</Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>Class Overview & Individual Performance Tracking</Typography>
      
      <FormControl sx={{ minWidth: 300, mb: 6, bgcolor: 'white' }}>
        <InputLabel>Select Grade Level</InputLabel>
        <Select value={filter} label="Select Grade Level" onChange={(e) => setFilter(e.target.value)} sx={{ borderRadius: 3 }}>
          {niveaux.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
        </Select>
      </FormControl>

      {/* KPI TOP CARDS */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
        <KPICard title="Global Average" value={`${stats.moy}%`} sub="-2.4% 📉 vs last week" color="#1976d2" />
        <KPICard title="Success Rate" value={`${stats.reu}%`} sub="Students ≥ 60%" color="#2e7d32" />
        <KPICard title="At Risk" value={stats.dif} sub="Students < 60%" color="#d32f2f" />
        <KPICard title="Top Score" value={`${stats.top}%`} sub="Class Record" color="#ed6c02" isTrophy />
      </Grid>

      {/* MAIN CHART */}
      <Paper sx={{ p: 4, borderRadius: 5, mb: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" fontWeight="900" color="primary" align="left" mb={4}>📈 General Performance Evolution ({filter})</Typography>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filtered[0]?.scores || []}>
              <defs><linearGradient id="colMoy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/><stop offset="95%" stopColor="#1976d2" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="semaine" tick={{fontSize: 14}} />
              <YAxis domain={[0, 100]} tick={{fontSize: 14}} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#1976d2" fill="url(#colMoy)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Typography variant="h4" fontWeight="900" align="left" sx={{ mb: 5 }}>🧑‍🎓 Individual Student Analysis</Typography>
      
      <Grid container spacing={4}>
        {filtered.map((eleve, i) => {
          const theme = getStatusTheme(eleve.average);
          return (
            <Grid item xs={12} md={6} lg={6} key={i}>
              <Card sx={{ borderRadius: 5, borderTop: `10px solid ${theme.main}`, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" fontWeight="900" textTransform="capitalize">{eleve.nom}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>{eleve.email}</Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 4 }}>
                    <Chip label={`Avg: ${eleve.average}%`} sx={{ bgcolor: theme.main, color: 'white', fontWeight: 'bold', fontSize: '1rem', py: 2.5, px: 1 }} />
                    <Chip label={`Trend: ${eleve.trend >= 0 ? '+'+eleve.trend : eleve.trend} pts`} variant="outlined" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }} color={eleve.trend >= 0 ? "success" : "error"} />
                    <Chip label={`Record: ${eleve.maxScore}%`} variant="outlined" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={3}>
                    {/* Grade History Table */}
                    <Grid item xs={5}>
                      <Typography variant="subtitle1" fontWeight="900" display="block" mb={2} color="text.secondary" textAlign="left">Grade History</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead><TableRow><TableCell sx={{fontWeight:'bold'}}>Week</TableCell><TableCell align="right" sx={{fontWeight:'bold'}}>Score</TableCell></TableRow></TableHead>
                          <TableBody>
                            {eleve.scores.slice(-4).reverse().map((s, idx) => (
                              <TableRow key={idx}>
                                <TableCell sx={{fontSize: 13}}>{s.semaine}</TableCell>
                                <TableCell align="right" sx={{fontSize: 14, fontWeight:'bold', color: getStatusTheme(s.score).main}}>{s.score}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    {/* Progress Chart */}
                    <Grid item xs={7}>
                      <Typography variant="subtitle1" fontWeight="900" display="block" mb={2} color="text.secondary">Progress Curve</Typography>
                      <Box sx={{ height: 160 }}>
                        <ResponsiveContainer>
                          <LineChart data={eleve.scores}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="semaine" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke={theme.main} strokeWidth={4} dot={{ r: 6, fill: theme.main, strokeWidth: 2, stroke: '#fff' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

// =====================================================================
// 🎓 STUDENT VIEW (ENGLISH + MOTIVATIONAL)
// =====================================================================
function StudentView({ student }) {
  if (!student) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
  const theme = getStatusTheme(student.average);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ width: '100%', borderRadius: 6, background: `linear-gradient(135deg, ${theme.main} 0%, #1a237e 100%)`, color: 'white', p: 6, mb: 6, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <Typography variant="h2" fontWeight="900" gutterBottom>
           {student.average >= 80 ? '🏆 Amazing Work,' : '🔥 Keep Growing,'} {student.nom}!
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 5 }}>Current Performance Level: {student.average}%</Typography>
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="h6" fontWeight="bold">Success Progress</Typography>
            <Typography variant="h6" fontWeight="bold">{student.average}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={student.average} sx={{ height: 16, borderRadius: 8, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
        </Box>
      </Card>

      <Grid container spacing={4} justifyContent="center" maxWidth={1100}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4, borderRadius: 5, textAlign: 'center', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', height: '100%', borderBottom: `8px solid ${COLORS_MAP.warning}` }}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: '#fb8c00', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" color="text.secondary">Personal Record</Typography>
            <Typography variant="h2" fontWeight="900" color="#ed6c02">{student.maxScore}%</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 5, borderRadius: 5, height: 450, boxShadow: '0 8px 25px rgba(0,0,0,0.05)' }}>
            <Typography variant="h5" fontWeight="900" mb={4}>📈 My Learning Journey</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={student.scores}>
                <defs><linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.main} stopOpacity={0.4}/><stop offset="95%" stopColor={theme.main} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="semaine" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke={theme.main} strokeWidth={5} fill="url(#studGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// --- SUB-COMPONENTS ---
const COLORS_MAP = { primary: '#1976d2', success: '#2e7d32', error: '#d32f2f', warning: '#ed6c02' };

function KPICard({ title, value, sub, color, isTrophy }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ p: 4, borderRadius: 4, textAlign: 'center', height: '100%', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="900" textTransform="uppercase" letterSpacing={1}>{title}</Typography>
        <Typography variant="h2" fontWeight="900" sx={{ color: color, my: 1.5 }}>
           {isTrophy && "🏆 "}{value}
        </Typography>
        <Typography variant="body2" fontWeight="bold" color={sub.includes('📉') ? 'error.main' : 'success.main'}>
          {sub}
        </Typography>
      </Card>
    </Grid>
  );
}