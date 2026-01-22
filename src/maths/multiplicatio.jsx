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
  Alert,
  LinearProgress,
  Box,
} from '@mui/material';
import { green, red, blue, pink, purple } from '@mui/material/colors';
import Confetti from 'react-confetti';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
//import WarningIcon from '@mui/icons-material/Warning';

// Animation pour les questions
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Style personnalisé pour la carte
const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: '2rem',
  padding: '2rem',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #FFE0B2 0%, #E1BEE7 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  border: '3px solid #FFD54F',
}));

// Style pour les boutons
const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.1rem',
  padding: '10px 20px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  },
}));

// Style pour le champ de réponse
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'white',
    fontSize: '1.5rem',
    height: '60px',
  },
}));

// Style pour la question
const QuestionTypography = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#D32F2F',
  animation: `${pulse} 1.5s infinite`,
  fontFamily: "'Comic Sans MS', cursive, sans-serif",
  margin: '1rem 0',
}));

// Style pour le feedback
const FeedbackAlert = styled(Alert)(({ theme, iscorrect }) => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  backgroundColor: iscorrect === 'true' ? green[500] : red[500],
  color: 'white',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  margin: '1rem 0',
}));

const MultiplicationContest2 = () => {
  const [name, setName] = useState('');
  const [tableRange, setTableRange] = useState(10);
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

  // Référence pour le champ de réponse
  const answerInputRef = useRef(null);

  useEffect(() => {
    let timer;
    if (started && !quizFinished) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, quizFinished]);

  const generateQuestions = () => {
    const min = 2;
    const max = tableRange;
    const newQuestions = [];
    for (let i = 0; i < 15; i++) {
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      const b = Math.floor(Math.random() * (max - min + 1)) + min;
      newQuestions.push({ a, b, answer: a * b });
    }
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeElapsed(0);
    setQuizFinished(false);
  };

  const handleStart = () => {
    if (name.trim() === '') {
      setNameError(true);
      return;
    }
    setNameError(false);
    generateQuestions();
    setStarted(true);
  };

  const handleAnswerSubmit = () => {
    if (userAnswer.trim() === '' || isProcessing) {
      return;
    }

    setIsProcessing(true);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = parseInt(userAnswer, 10) === currentQuestion.answer;
    setFeedback(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      setIsProcessing(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setStarted(false);
    setName('');
    setTableRange(10);
    setNameError(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Remettre le focus sur le champ de réponse après chaque changement de question
  useEffect(() => {
    if (started && !quizFinished && answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [currentQuestionIndex, started, quizFinished]);

  if (!started) {
    return (
      <Container maxWidth="sm">
        <StyledCard>
          <CardContent>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: blue[700], fontFamily: "'Comic Sans MS', cursive, sans-serif", mb: 3 }}
            >
              🏆 Concours de Multiplication 🏆
            </Typography>
            <StyledTextField
              label="Ton prénom"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
              error={nameError}
              helperText={nameError ? "Il faut entrer ton prénom !" : ""}
              sx={{ mb: 2 }}
              InputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Table de multiplication</InputLabel>
              <Select
                value={tableRange}
                label="Table de multiplication"
                onChange={(e) => setTableRange(e.target.value)}
                sx={{ borderRadius: '12px', backgroundColor: 'white', fontSize: '1.1rem' }}
              >
                {[10, 12, 13, 14, 15].map((range) => (
                  <MenuItem key={range} value={range} sx={{ fontSize: '1.1rem' }}>
                    2 à {range}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledButton
              variant="contained"
              onClick={handleStart}
              fullWidth
              sx={{ background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', color: 'white', py: 1.5 }}
            >
              COMMENCER LE JEU !
            </StyledButton>
          </CardContent>
        </StyledCard>
      </Container>
    );
  }

  if (quizFinished) {
    return (
      <Container maxWidth="sm">
        {showConfetti && <Confetti numberOfPieces={300} />}
        <StyledCard>
          <CardContent>
            <EmojiEventsIcon sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: purple[500], fontFamily: "'Comic Sans MS', cursive, sans-serif", mb: 2 }}
            >
              Bravo {name} ! 🎉
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: pink[600], fontFamily: "'Comic Sans MS', cursive, sans-serif", mb: 1 }}
            >
              Table choisie : <strong>2 à {tableRange}</strong>
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: pink[500], fontFamily: "'Comic Sans MS', cursive, sans-serif", mb: 1 }}
            >
              Ton score : {score} / {questions.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <TimerIcon sx={{ color: blue[500], fontSize: 30 }} />
              <Typography variant="h5" sx={{ color: blue[700] }}>
                Temps : {formatTime(timeElapsed)}
              </Typography>
            </Box>
            <StyledButton
              variant="contained"
              onClick={handleRestart}
              fullWidth
              sx={{ background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)', color: 'white', py: 1.5 }}
            >
              REJOUER
            </StyledButton>
          </CardContent>
        </StyledCard>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container maxWidth="sm">
      {showConfetti && <Confetti numberOfPieces={200} />}
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: blue[700] }}>
              ⏱ {formatTime(timeElapsed)}
            </Typography>
            <Typography variant="h6" sx={{ color: pink[500] }}>
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
              backgroundColor: '#E0E0E0',
              '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #FF7043, #FFC107)' },
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
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && userAnswer.trim() !== '' && !isProcessing) {
                handleAnswerSubmit();
              }
            }}
            fullWidth
            sx={{ mb: 1 }}
            InputProps={{ style: { textAlign: 'center' } }}
            disabled={isProcessing}
          />
          {feedback !== null && (
            <FeedbackAlert iscorrect={feedback.toString()} icon={feedback ? <CheckIcon /> : <CloseIcon />}>
              {feedback ? 'Super ! ✅' : 'Presque ! ❌'}
            </FeedbackAlert>
          )}
          <StyledButton
            variant="contained"
            onClick={handleAnswerSubmit}
            disabled={userAnswer.trim() === '' || isProcessing}
            fullWidth
            sx={{ mt: 1, background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)', color: 'white', py: 1.5 }}
          >
            VALIDER
          </StyledButton>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default MultiplicationContest2;
