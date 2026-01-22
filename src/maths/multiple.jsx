import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Box,
  Alert
} from '@mui/material';
import { green } from '@mui/material/colors';
import Confetti from 'react-confetti';
import { keyframes, styled } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import questionBank from './question.json';
import ResultTable from './ResultTable';


// URL de l'App Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzhRIUyeDq3RdVC7XP-aZR4638hfYsM8tC5MYRbeDSf-seXowx0kEZxoK7INBfbBpB/exec";

// Styles
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;
const StyledCard = styled(Card)(() => ({
  marginTop: '2rem',
  padding: '2rem',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #C8E6C9 0%, #81C784 100%)',
  borderRadius: '20px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  border: '3px solid #4CAF50',
}));
const StyledButton = styled(Button)(() => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  padding: '10px 20px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  },
}));
const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'white',
    fontSize: '1.5rem',
    height: '60px',
    textAlign: 'center',
  },
}));
const QuestionTypography = styled(Typography)(() => ({
  fontSize: '4rem',
  fontWeight: 'bold',
  color: green[800],
  animation: `${pulse} 1.5s infinite`,
  fontFamily: "'Comic Sans MS', cursive, sans-serif",
  margin: '1.5rem 0',
}));


const MultiplicationContest = () => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('10');
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentResults, setStudentResults] = useState([]);
  const [sendStatus, setSendStatus] = useState(null); // confirmation d'envoi
  const answerInputRef = useRef(null);

  // Timer
  useEffect(() => {
    let timer;
    if (started && !quizFinished) {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, quizFinished]);

  // Focus automatique sur le champ réponse
  useEffect(() => {
    if (started && !quizFinished && answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [currentQuestionIndex, started, quizFinished]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Démarrer le quiz
  const handleStart = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    const selectedQuestions = questionBank[difficulty];
    if (!selectedQuestions || selectedQuestions.length === 0) {
      alert('Aucune question trouvée pour ce niveau !');
      return;
    }
    setNameError(false);
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeElapsed(0);
    setQuizFinished(false);
    setStarted(true);
  };

  // Envoi au Google Sheet
  const sendToGoogleSheet = async (resultData) => {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode:  "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });
      console.log('✅ envoyé au Sheet');
      setSendStatus('success');
      setTimeout(() => setSendStatus(null), 3000);
    } catch (err) {
      console.error('❌ erreur envoi Sheet', err);
      setSendStatus('error');
      setTimeout(() => setSendStatus(null), 3000);
    }
  };

  // Soumettre une réponse
  const handleAnswerSubmit = () => {
    if (!userAnswer.trim() || isProcessing) return;
    setIsProcessing(true);

    const current = questions[currentQuestionIndex];
    const isCorrect = parseInt(userAnswer, 10) === current.answer;
    if (isCorrect) setScore(prev => prev + 1);
    setFeedback(isCorrect);

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      setIsProcessing(false);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setQuizFinished(true);
       setShowConfetti(true); // déclenche les confettis

        const resultPayload = {
          name,
          difficulty,
          score: finalScore,
          timeElapsed,
          date: new Date().toLocaleString(),
        };
        setStudentResults(prev => [...prev, resultPayload]);

        sendToGoogleSheet(resultPayload);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setStarted(false);
    setQuizFinished(false);
    setDifficulty('10');
    setNameError(false);
   
  };

  const handleQuit = () => {
    setStarted(false);
    setName('');
    setDifficulty('10');
    setNameError(false);
    setStudentResults([]);

  };
  

  // Page d'accueil
  if (!started) {
    
    return (
      <Container maxWidth="lg">
        <StyledCard>
          <CardContent>
           <Typography variant="h3" sx={{ color: green[800], mb: 2 }}>
          🧮 Entraîne-toi avant le concours !
        </Typography>
        <Box
          sx={{
            border: '2px solid #4CAF50',
            borderRadius: '10px',
            overflow: 'hidden',
            height: '800px',
            mb: 3,
          }}
        >
          <iframe
            src="/Mutip.html"
            width="100%"
            height="100%"
            title="Tables d'entraînement"
            style={{ border: 'none' }}
          />
        </Box>
            <Typography variant="h3" sx={{ color: green[800] }}>
              🏆 Concours de Multiplication 🏆
            </Typography>
            <StyledTextField
              label="Ton prénom"
              variant="outlined"
              fullWidth
              value={name}
              onChange={e => { setName(e.target.value); setNameError(false); }}
              error={nameError}
              helperText={nameError ? 'Entre ton prénom !' : ''}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Niveau de difficulté</InputLabel>
              <Select
                value={difficulty}
                label="Niveau de difficulté"
                onChange={e => setDifficulty(e.target.value)}
              >
                <MenuItem value="5">Facile (1-5)</MenuItem>
                <MenuItem value="10">Moyen (1-10)</MenuItem>
                <MenuItem value="15">Difficile (1-15)</MenuItem>
              </Select>
            </FormControl>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleStart}
              sx={{ background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)', color: 'white' }}
            >
              COMMENCER
            </StyledButton>
          </CardContent>
        </StyledCard>

        {/* Affichage du ResultTable */}
        <Box sx={{ mt: 2 }}>
          <ResultTable
            name={name}
            studentResults={studentResults}
            questionBank={questionBank}
            formatTime={formatTime}
            handleQuit={handleQuit}
          />
        </Box>
      </Container>
    );
  }

  // Quiz terminé
  if (quizFinished) {
    return (
      <Container maxWidth="lg">
        {showConfetti && <Confetti numberOfPieces={300} />}
        <StyledCard>
          <CardContent>
            <Typography variant="h3" sx={{ color: green[800] }}>
              Bravo {name} 🎉
            </Typography>
            <Typography variant="h5" sx={{ color: green[700], my: 1 }}>
              Niveau : {difficulty === '5' ? 'Facile' : difficulty === '10' ? 'Moyen' : 'Difficile'}
            </Typography>
            <Typography variant="h4" sx={{ color: green[900], my: 1 }}>
              Score : {score}/{questions.length}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <TimerIcon sx={{ color: green[600], mr: 1 }} />
              <Typography variant="h5" sx={{ color: green[700] }}>
                Temps : {formatTime(timeElapsed)}
              </Typography>
            </Box>

            {sendStatus === 'success' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ Résultat envoyé au Google Sheet !
              </Alert>
            )}
            {sendStatus === 'error' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                ❌ Impossible d'envoyer le résultat.
              </Alert>
            )}

            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleRestart}
              sx={{ mt: 3, background: 'linear-gradient(45deg, #388E3C 30%, #81C784 90%)', color: 'white' }}
            >
              REJOUER
            </StyledButton>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleQuit}
              sx={{ mt: 2, background: 'linear-gradient(45deg, #D32F2F 30%, #F44336 90%)', color: 'white' }}
            >
              QUITTER
            </StyledButton>
          </CardContent>
        </StyledCard>
      </Container>
    );
  }

  // Quiz en cours
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <>
    
    <Container maxWidth="lg">
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: green[800] }}>
              ⏱ {formatTime(timeElapsed)}
            </Typography>
            <Typography variant="h6" sx={{ color: green[700] }}>
              {currentQuestionIndex + 1} / {questions.length}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 3,
              backgroundColor: '#C8E6C9',
              '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #66BB6A, #388E3C)' },
            }}
          />
          <QuestionTypography>
            {currentQuestion.a} × {currentQuestion.b}
          </QuestionTypography>
          <StyledTextField
            inputRef={answerInputRef}
            label="Ta réponse"
            variant="outlined"
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAnswerSubmit()}
            fullWidth
            sx={{ mb: 1 }}
            disabled={isProcessing}
          />
          {feedback !== null && (
            <Alert
              icon={feedback ? <CheckIcon /> : <CloseIcon />}
              severity={feedback ? "success" : "error"}
              sx={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                mt: 1,
              }}
            >
              {feedback ? 'Bravo ! ✅' : 'Oups ! ❌'}
            </Alert>
          )}
          <StyledButton
            variant="contained"
            fullWidth
            onClick={handleAnswerSubmit}
            disabled={userAnswer.trim() === '' || isProcessing}
            sx={{ mt: 1, background: 'linear-gradient(45deg, #66BB6A 30%, #43A047 90%)', color: 'white' }}
          >
            VALIDER
          </StyledButton>
        </CardContent>
      </StyledCard>

      {/* Résultats cumulés */}
      <Box sx={{ mt: 2 }}>
        <ResultTable
          name={name}
          studentResults={studentResults}
          questionBank={questionBank}
          formatTime={formatTime}
          handleQuit={handleQuit}
        />
      </Box>
     
      
    </Container>
    

    </>
    
    
  );
};

export default MultiplicationContest;
