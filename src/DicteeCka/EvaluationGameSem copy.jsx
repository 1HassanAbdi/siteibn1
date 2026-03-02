import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import {
  Volume2, Send, Trophy, ShieldCheck, Lock, AlertTriangle,
  Ban, CheckCircle, XCircle, FileText
} from 'lucide-react';

// --- IMPORTS FOR THE DASHBOARD AND DESIGN ---
import {
  Card, CardContent, Typography, Box, Grid, LinearProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip
} from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const EvaluationGame = ({ words, selectedLevel, activeWeek, onBack }) => {
  const [step, setStep] = useState('lock');
  const [secretInput, setSecretInput] = useState('');
  const [student, setStudent] = useState({ name: '', email: '' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState({ score: 0, errors: [] });
  const [report, setReport] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const hasSentCheatRef = useRef(false);

  // --- GOOGLE SCRIPTS URLs ---
  const URL_SAVE_SCORE = "https://script.google.com/macros/s/AKfycbxdB7669CjUb94iVurw26USBQQiEcaq0rtKvZmD5tIl_RhyfxQiAQGjQv2lUyyRlD8QDQ/exec";
  const URL_FETCH_DASHBOARD = "https://script.google.com/macros/s/AKfycbxdB7669CjUb94iVurw26USBQQiEcaq0rtKvZmD5tIl_RhyfxQiAQGjQv2lUyyRlD8QDQ/exec";

  // --- SECRET CODES CONFIGURATION ---
  const secretCodes = {
    "1": "1000", "2": "2000", "5": "5000",
    "6": "2024", "7": "2026eib", "8": "20ibn", "9": "cka", "10": "2030",
    "11": "ibncka", "12": "2026", "13": "20", "14": "2ibn", "15": "4cka",
    "16": "2024", "17": "2024", "18": "8888",
  };
  const SECRET_CODE = secretCodes[activeWeek.toString()] || "2026";
  const accents = [];

  // --- ANTI-CHEATING ---
  const handleCheatAndSend = async () => {
    if (hasSentCheatRef.current) return;
    hasSentCheatRef.current = true;
    setCheatingDetected(true);
    setIsSending(true);

    let finalErrorsArray = results.errors.map(e => `${e.word} (${e.typed})`);
    finalErrorsArray.push("⚠️ INTERRUPTION: WINDOW CLOSED (CHEATING)");

    const payload = {
      nom: student.name, email: student.email, niveau: selectedLevel,
      semaine: activeWeek, score: results.score, total: words.length, errorList: finalErrorsArray
    };

    try {
      await fetch(URL_SAVE_SCORE, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload), keepalive: true });
    } catch (e) { console.error(e); }
    setIsSending(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => { if (document.hidden && step === 'playing') handleCheatAndSend(); };
    const handleBlur = () => { if (step === 'playing') handleCheatAndSend(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [step, results, student]);

  // --- GAME LOGIC ---
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (secretInput === SECRET_CODE) setStep('login');
    else { alert(`Incorrect code!`); setSecretInput(''); }
  };

  // 🔊 AUDIO EXACTEMENT COMME VOUS L'AVIEZ (chemin CKA + fallback Français)
  const handleSpeak = () => {
    const text = words[currentIndex];
    if (!text) return;

    const cleanWord = text.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "")
      .replace(/\s+/g, "_");

    const audioPath = `/audio/cka/${selectedLevel}A/Semaine_${activeWeek}/${cleanWord}.mp3`;
    const audio = new Audio(audioPath);

    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || feedback) return;

    const correct = words[currentIndex].trim();
    const typed = userInput.trim();
    const isCorrect = typed.toLowerCase() === correct.toLowerCase();

    setReport(prev => [...prev, { word: correct, typed: typed, isCorrect }]);

    if (isCorrect) {
      setFeedback('correct');
      setResults(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setFeedback('incorrect');
      setResults(prev => ({ ...prev, errors: [...prev.errors, { word: correct, typed: typed }] }));
    }

    setTimeout(async () => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
        setFeedback(null);
      } else {
        await finishAndSendNormal(isCorrect, typed);
      }
    }, 800);
  };

  // --- END OF EXAM & LOAD DASHBOARD (FIXED GRAPHIC) ---
  const finishAndSendNormal = async (lastIsCorrect, lastTyped) => {
    setStep('finished');
    setIsSending(true);
    
    const finalScore = results.score + (lastIsCorrect ? 1 : 0);
    const currentPercentage = Math.round((finalScore / words.length) * 100);

    let finalErrorsArray = results.errors.map(e => `${e.word} (${e.typed})`);
    if (!lastIsCorrect && lastTyped !== "") finalErrorsArray.push(`${words[currentIndex]} (${lastTyped})`);

    const payload = {
      nom: student.name, email: student.email, niveau: selectedLevel,
      semaine: activeWeek, score: finalScore, total: words.length, errorList: finalErrorsArray
    };

    try {
      // 1. Silent Save (sans attendre la fin de l'enregistrement pour accélérer l'écran)
      fetch(URL_SAVE_SCORE, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });

      // 2. Fetch history
      setIsFetchingDashboard(true);
      const res = await fetch(`${URL_FETCH_DASHBOARD}?user=${encodeURIComponent(student.email)}`);
      const data = await res.json();

      let scoresMap = new Map();
      
      // 🚀 INJECTION IMMÉDIATE DU SCORE ACTUEL POUR QUE LE GRAPHIQUE MARCHE TOUJOURS !
      scoresMap.set(String(activeWeek), currentPercentage);

      if (!data.error && Array.isArray(data)) {
        data.forEach(row => {
          let s = parseFloat(row.pourcentage);
          if (s <= 1) s = s * 100;
          let finalS = Math.round(s) || 0;
          
          let weekNum = String(row.semaine).replace(/[^0-9]/g, ''); // Extrait juste le numéro
          if(!weekNum) return;

          if (!scoresMap.has(weekNum) || scoresMap.get(weekNum) < finalS) {
            scoresMap.set(weekNum, finalS);
          }
        });
      }

      // Convertir la Map en tableau compatible avec le Graphique ("week" au lieu de "semaine")
      let scoresArray = Array.from(scoresMap, ([wNum, score]) => ({
        week: `Week ${wNum}`,
        score: score,
        rawWeek: parseInt(wNum) || 0
      }));

      // Tri intelligent
      scoresArray.sort((a, b) => a.rawWeek - b.rawWeek);

      let total = scoresArray.length;
      let sum = scoresArray.reduce((acc, curr) => acc + curr.score, 0);
      let trend = 0;

      if (scoresArray.length >= 2) {
        trend = scoresArray[scoresArray.length - 1].score - scoresArray[scoresArray.length - 2].score;
      }

      setDashboardData({
        name: student.name,
        average: total > 0 ? Math.round(sum / total) : 0,
        trend: trend,
        maxScore: scoresArray.length > 0 ? Math.max(...scoresArray.map(s => s.score)) : 0,
        scores: scoresArray
      });

      setIsSending(false);
      setIsFetchingDashboard(false);

      // Redirection automatique vers le graphique après 2.5 secondes
      setTimeout(() => {
        setStep('dashboard');
      }, 2500);

    } catch (e) {
      console.error(e);
      setIsSending(false);
      setIsFetchingDashboard(false);
      
      // Fallback si le serveur plante : on affiche quand même le graphique avec la note actuelle
      setDashboardData({
        name: student.name, average: currentPercentage, trend: 0, maxScore: currentPercentage,
        scores: [{ week: `Week ${activeWeek}`, score: currentPercentage, rawWeek: activeWeek }]
      });
      setTimeout(() => setStep('dashboard'), 2500);
    }
  };

  // ==========================================
  // VIEWS (App Screens)
  // ==========================================

  if (cheatingDetected) {
    return (
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-lg mx-auto bg-red-600 p-12 rounded-[40px] shadow-2xl border-8 border-red-800 text-white text-center mt-10">
        <Ban size={80} className="mx-auto mb-6 text-red-950 animate-pulse" />
        <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">Exam Interrupted</h2>
        <p className="text-xl font-bold mb-8">You closed the window.<br />Your partial results were <span className="underline decoration-4 decoration-red-950">sent immediately</span>.</p>
        <button onClick={onBack} className="w-full bg-white text-red-700 py-4 rounded-2xl font-black uppercase hover:bg-gray-100 transition-all shadow-lg">Back to Menu</button>
      </motion.div>
    );
  }

  if (step === 'lock') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-slate-900 p-10 rounded-[40px] shadow-2xl border-b-8 border-amber-500 text-white text-center">
        <Lock size={50} className="mx-auto mb-6 text-amber-500" />
        <h2 className="text-2xl font-black uppercase mb-4">Access Protected</h2>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <input type="password" placeholder="CODE" value={secretInput} onChange={e => setSecretInput(e.target.value)} autoFocus className="w-full p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 outline-none focus:border-amber-500 text-center text-2xl tracking-widest font-black" />
          <button className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black uppercase hover:bg-amber-400 transition-all">Unlock</button>
          <button type="button" onClick={onBack} className="text-slate-500 text-xs font-bold uppercase mt-2">Back</button>
        </form>
      </motion.div>
    );
  }

  if (step === 'login') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-[#1e1b4b] p-10 rounded-[40px] shadow-2xl border-t-8 border-violet-500 text-white">
        <ShieldCheck size={40} className="mx-auto mb-4 text-violet-400" />
        <h2 className="text-2xl font-black mb-6 text-center uppercase tracking-widest">Official Exam</h2>
        <form onSubmit={(e) => { e.preventDefault(); setStep('playing'); }} className="space-y-4">
          <input className="w-full p-4 bg-[#312e81] rounded-2xl border-2 border-transparent focus:border-violet-400 outline-none font-bold placeholder-violet-300" placeholder="Full Name" required value={student.name} onChange={e => setStudent({...student, name: e.target.value})} />
          <input className="w-full p-4 bg-[#312e81] rounded-2xl border-2 border-transparent focus:border-violet-400 outline-none font-bold placeholder-violet-300" type="email" placeholder="School Email" required value={student.email} onChange={e => setStudent({...student, email: e.target.value.trim().toLowerCase()})} />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white py-5 rounded-2xl font-black uppercase shadow-lg transition-all">I'm Ready</button>
        </form>
      </motion.div>
    );
  }

  if (step === 'playing') {
    return (
      <div className="max-w-2xl mx-auto text-center p-4">
        <div className="mb-8 flex justify-between items-center bg-[#1e1b4b] text-white p-6 rounded-3xl shadow-2xl border-b-4 border-violet-500">
          <div className="text-left"><p className="font-black text-lg">{student.name}</p></div>
          <div className="bg-violet-600 px-6 py-2 rounded-2xl font-mono text-2xl font-black border-2 border-violet-400">{currentIndex + 1} / {words.length}</div>
        </div>
        <button onClick={handleSpeak} className="bg-white w-32 h-32 rounded-full text-violet-700 shadow-xl mb-10 hover:scale-105 transition-transform flex items-center justify-center mx-auto border-[10px] border-violet-100"><Volume2 size={56} /></button>
        <form onSubmit={handleCheck} className="space-y-8">
          <input className={`w-full text-center text-4xl font-black p-10 rounded-[45px] border-4 outline-none transition-all shadow-2xl ${feedback === 'correct' ? 'border-green-400 bg-green-50 text-green-600' : feedback === 'incorrect' ? 'border-red-400 bg-red-50 text-red-600' : 'border-violet-200 focus:border-violet-600 bg-white'}`} autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} disabled={feedback !== null} placeholder="..." />
          <div className="flex flex-wrap justify-center gap-2 bg-violet-50 p-6 rounded-[35px] border-2 border-violet-100">
            {accents.map(a => (<button key={a} type="button" onClick={() => setUserInput(userInput + a)} className="w-12 h-12 bg-white rounded-xl font-bold text-violet-700 hover:bg-violet-600 hover:text-white border border-violet-100">{a}</button>))}
          </div>
        </form>
      </div>
    );
  }

  // --- VIEW 3: IMMEDIATE SCORE AND REPORT ---
  if (step === 'finished') {
    return (
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-8 bg-white rounded-[60px] shadow-2xl border-b-[15px] border-violet-800 max-w-lg mx-auto">
        <Trophy size={60} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase">Exam Completed</h2>
        <div className="text-7xl font-black text-violet-700 mb-8 bg-violet-50 py-6 rounded-[40px] border-2 border-violet-100">
          {results.score}<span className="text-violet-300 text-3xl"> / {words.length}</span>
        </div>
        <div className="mb-6 text-left bg-slate-50 p-5 rounded-[30px] border-2 border-slate-100 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-black text-slate-400 mb-3 uppercase flex items-center gap-2"><FileText size={16}/> Correction</h3>
          <ul className="space-y-2">
            {report.map((item, idx) => (
              <li key={idx} className={`p-2 rounded-xl border flex justify-between items-center ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <span className={`font-bold ${item.isCorrect ? 'text-green-800' : 'text-slate-800'}`}>{item.word}</span>
                {item.isCorrect ? <CheckCircle size={18} className="text-green-500"/> : <span className="text-red-500 text-sm line-through decoration-2"><XCircle size={14} className="inline"/> {item.typed}</span>}
              </li>
            ))}
          </ul>
        </div>
        {isSending ? (
          <div className="bg-violet-900 text-white p-4 rounded-3xl font-black animate-pulse flex justify-center items-center gap-2"><Send size={20}/> SAVING...</div>
        ) : isFetchingDashboard ? (
          <div className="bg-blue-600 text-white p-4 rounded-3xl font-black animate-pulse flex justify-center items-center gap-2">GENERATING CHART...</div>
        ) : dashboardData ? (
          <button onClick={() => setStep('dashboard')} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase hover:bg-blue-700 shadow-xl">View My Dashboard 📊</button>
        ) : (
          <button onClick={onBack} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase hover:bg-black">Finish</button>
        )}
      </motion.div>
    );
  }

  // --- VIEW 4: THE DASHBOARD (COLORFUL CHART) ---
  if (step === 'dashboard' && dashboardData) {
    const studentInfo = dashboardData;

    const getFeedbackTheme = (score) => {
      if (score >= 80) return { gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", chartColor: "#27ae60", message: "Excellent work! You're on a great streak! 🌟", emoji: "🏆" };
      if (score >= 60) return { gradient: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)", chartColor: "#f39c12", message: "Good job! You're on the right track! 🚀", emoji: "🔥" };
      return { gradient: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)", chartColor: "#e74c3c", message: "Don't give up! Analyze your mistakes and you'll get there! 💪", emoji: "💡" };
    };

    const theme = getFeedbackTheme(studentInfo.average);
    const safeAverage = isNaN(studentInfo.average) ? 0 : studentInfo.average;

    return (
      <div className="max-w-4xl mx-auto pb-10 px-4 mt-6">
        <Card elevation={6} sx={{ borderRadius: 4, mb: 4, background: theme.gradient, color: "white" }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>{theme.emoji} Report, {studentInfo.name}!</Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>{theme.message}</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Box display="flex" justifyContent="space-between" mb={1}><Typography variant="body2" fontWeight="bold">Progress to 100%</Typography><Typography variant="body2" fontWeight="bold">{safeAverage}%</Typography></Box>
                <LinearProgress variant="determinate" value={safeAverage} sx={{ height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.3)", "& .MuiLinearProgress-bar": { backgroundColor: "white" } }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: `6px solid ${theme.chartColor}` }}>
              <SchoolIcon sx={{ fontSize: 40, color: theme.chartColor, mb: 1 }} />
              <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Overall Average</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: theme.chartColor }}>{safeAverage}%</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: `6px solid ${studentInfo.trend >= 0 ? "#27ae60" : "#e74c3c"}` }}>
              {studentInfo.trend >= 0 ? <TrendingUpIcon sx={{ fontSize: 40, color: "#27ae60", mb: 1 }} /> : <TrendingDownIcon sx={{ fontSize: 40, color: "#e74c3c", mb: 1 }} />}
              <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Trend</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: studentInfo.trend >= 0 ? "#27ae60" : "#e74c3c" }} mt={1}>{studentInfo.trend > 0 ? "+" : ""}{studentInfo.trend} pts</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={4} sx={{ borderRadius: 3, textAlign: "center", p: 3, borderBottom: "6px solid #f39c12" }}>
              <EmojiEventsIcon sx={{ fontSize: 40, color: "#f39c12", mb: 1 }} />
              <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Personal Record</Typography>
              <Typography variant="h3" fontWeight="bold" color="#f39c12">{studentInfo.maxScore || 0}%</Typography>
            </Card>
          </Grid>
        </Grid>

        <Card elevation={5} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom align="center">🚀 My Visual Progress</Typography>
            <Box sx={{ height: 350, width: "100%", mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                {/* L'ATTRIBUT DATAKEY EST BIEN "week" ICI POUR CORRESPONDRE AU TABLEAU scoresArray */}
                <AreaChart data={studentInfo.scores} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudentScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', fontWeight: 'bold' }} formatter={(value) => [`${value}%`, "Score"]} />
                  <Area type="monotone" dataKey="score" stroke={theme.chartColor} fill="url(#colorStudentScore)" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Box textAlign="center" mt={6}>
          <button onClick={onBack} className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-black shadow-lg">Exit Exam</button>
        </Box>
      </div>
    );
  }
};

export default EvaluationGame;