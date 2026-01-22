import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Chip, Grid, Typography, Box, Container } from '@mui/material'; // IconButton retiré
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown'; // Retiré

// Configuration des niveaux étendue
const LEVELS = {
  EASY: { key: 'EASY', maxFactor: 5, label: '×1-5', color: 'success' },
  NORMAL: { key: 'NORMAL', maxFactor: 10, label: '×1-10', color: 'info' },
  HARD: { key: 'HARD', maxFactor: 12, label: '×1-12', color: 'warning' },
  EXPERT: { key: 'EXPERT', maxFactor: 15, label: '×1-15', color: 'error' },
  MASTER: { key: 'MASTER', maxFactor: 20, label: '×1-20', color: 'secondary' },
};


// Utils
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function MutiplicD() {
  const INITIAL_TIME = 60;

  // States
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [level, setLevel] = useState(LEVELS.EASY.key);
  const [question, setQuestion] = useState({ factor1: 0, factor2: 0, answers: [], correctAnswer: 0 });
  const [isGameActive, setIsGameActive] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState(null); // 'correct', 'incorrect'
  
  // NOUVEAU: Stocke la réponse cliquée pour l'animation d'erreur
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const timerRef = useRef(null);
  const currentLevelConfig = LEVELS[level];

  // Generate question
  const generateQuestion = useCallback((currentLevelKey) => {
    const max = LEVELS[currentLevelKey].maxFactor;
    let factor1 = getRandomInt(1, max);
    let factor2 = getRandomInt(1, max);
    const correctAnswer = factor1 * factor2;

    const answers = new Set();
    answers.add(correctAnswer);
    while (answers.size < 4) {
      const offset = getRandomInt(-5, 5); 
      let distractor = correctAnswer + offset;
      
      if (distractor <= 0 || distractor === correctAnswer) {
        distractor = getRandomInt(1, max * max);
      }
      answers.add(distractor);
    }

    setQuestion({
      factor1,
      factor2,
      answers: shuffleArray(Array.from(answers)).slice(0, 4),
      correctAnswer,
    });
  }, []);

  // Init question
  useEffect(() => {
    generateQuestion(level);
  }, [level, generateQuestion]);

  // Timer
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsGameActive(false);
    }
    return () => clearInterval(timerRef.current);
  }, [isGameActive, timeLeft]);

  // Handle answer
  const handleAnswerClick = (answer) => {
    if (!isGameActive || isAnimating) return;

    const isCorrect = answer === question.correctAnswer;
    
    setSelectedAnswer(answer); // <-- Correction: Stocke la réponse cliquée
    setIsAnimating(true);
    setResult(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 1);
        setCurrentStreak(prev => {
          const newStreak = prev + 1;
          setBestStreak(prevBest => Math.max(prevBest, newStreak));
          return newStreak;
        });
      } else {
        setCurrentStreak(0);
      }

      setIsAnimating(false);
      setResult(null);
      setSelectedAnswer(null); // <-- Réinitialise l'état après l'animation
      generateQuestion(level);
    }, 600);
  };

  // Change level
  const handleLevelChange = (newLevel) => {
    if (isGameActive && timeLeft > 0) {
      if (!window.confirm("Commencer un nouveau niveau réinitialisera votre partie actuelle. Continuer ?")) {
        return;
      }
    }
    setLevel(newLevel);
    setScore(0);
    setCurrentStreak(0);
    // setBestStreak(0); // On garde le meilleur score global
    setTimeLeft(INITIAL_TIME);
    setIsGameActive(true);
    generateQuestion(newLevel);
  };

  // Restart
  const restartGame = () => {
    setScore(0);
    setCurrentStreak(0);
    setTimeLeft(INITIAL_TIME);
    setIsGameActive(true);
    setResult(null);
    setSelectedAnswer(null);
    generateQuestion(level);
  };

  // Time color
  const getTimeColor = (time) => {
    if (time <= 10) return 'error';
    if (time <= 20) return 'warning';
    return 'success';
  };

  const questionText = `${question.factor1} × ${question.factor2} = ?`;

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 4, bgcolor: 'grey.900', color: 'white', fontFamily: 'Inter', position: 'relative' }}>
      
      <Typography variant="h4" align="center" gutterBottom color="primary.light" sx={{ fontWeight: 'bold' }}>
        🧠 Math Challenge
      </Typography>
      
      {/* Scoreboard */}
      <Card sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        mb: 4, 
        borderRadius: 3, 
        bgcolor: 'grey.800', 
        boxShadow: 6 
      }}>
        {/* Score */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Score</Typography>
          <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>{score}</Typography>
        </Box>

        {/* Série Actuelle */}
        <Chip 
          label={`Série: ${currentStreak}`} 
          color={currentStreak > 0 ? 'secondary' : 'default'} 
          icon={currentStreak > 0 ? <ThumbUpIcon /> : null}
          sx={{ 
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            ...(currentStreak >= 5 && { animation: 'pulse 1s infinite' }),
          }} 
        />

        {/* Meilleure Série */}
        <Chip 
          label={`Max: ${bestStreak}`} 
          icon={<EmojiEventsIcon />}
          color='default'
          sx={{ fontSize: '1rem' }} 
        />

        {/* Time */}
        <Chip 
          label={timeLeft} 
          color={getTimeColor(timeLeft)} 
          icon={<AccessTimeIcon />}
          sx={{ p: 2, fontSize: '1.2rem', fontWeight: 'bold' }} 
        />
      </Card>

      {/* Question Card */}
      <Card sx={{
        p: 4,
        mb: 4,
        border: 4,
        borderColor: result === 'correct' ? 'success.main' : result === 'incorrect' ? 'error.main' : currentLevelConfig.color + '.light',
        bgcolor: 'grey.800',
        boxShadow: 10,
        transform: result === 'correct' ? 'scale(1.02)' : result === 'incorrect' ? 'scale(0.98) rotate(-1deg)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
      }}>
        {/* Affichage de la question */}
        <Box mb={3}>
          <Typography variant="h2" align="center" color="primary.main" sx={{ fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {questionText}
          </Typography>
        </Box>

        {/* Level buttons */}
        <Grid container spacing={1} justifyContent="center" mb={4}>
          {Object.values(LEVELS).map(lvl => (
            <Grid item key={lvl.key}>
              <Button
                variant={level === lvl.key ? "contained" : "outlined"}
                color={lvl.color}
                size="small"
                onClick={() => handleLevelChange(lvl.key)}
                disabled={isAnimating || !isGameActive}
              >
                {lvl.label}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Answers Grid */}
        <Grid container spacing={3}>
          {question.answers.map((ans, idx) => {
            const isCorrectAnswer = ans === question.correctAnswer;
            
            let buttonColor = 'primary';
            if (result === 'correct' && isCorrectAnswer) {
              buttonColor = 'success';
            } else if (result === 'incorrect' && isCorrectAnswer) {
              buttonColor = 'success';
            } else if (result === 'incorrect' && selectedAnswer === ans) { // <-- Correction (Ligne 269)
              buttonColor = 'error';
            }

            return (
              <Grid item xs={6} key={idx}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  color={buttonColor}
                  onClick={() => handleAnswerClick(ans)}
                  disabled={!isGameActive || isAnimating}
                  sx={{
                    fontSize: '2.5rem',
                    py: 2,
                    fontWeight: 'bold',
                    // Style spécifique si la réponse a été sélectionnée et était incorrecte (animation)
                    ...(result === 'incorrect' && selectedAnswer === ans && !isCorrectAnswer ? { // <-- Correction (Ligne 251)
                      animation: 'shake 0.4s'
                    } : {}),
                    transition: 'background-color 0.3s, transform 0.1s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                    }
                  }}
                >
                  {ans}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* End Game Screen */}
      {!isGameActive && timeLeft === 0 && (
        <Box sx={{ // Remplacement de Fade par Box pour simplifier
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          bgcolor: 'rgba(0, 0, 0, 0.85)'
        }}>
          <Card sx={{ 
            p: 4, 
            textAlign: 'center', 
            bgcolor: 'background.paper',
            borderRadius: 3, 
            boxShadow: 20,
            width: '80%',
            color: 'text.primary'
          }}>
            <Typography variant="h3" mb={2} color="error.main" sx={{ fontWeight: 'bold' }}>
              ⏰ Temps Écoulé !
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
              <Typography variant="h5" color="white">
                Votre Score Final : <span style={{ color: 'yellow', fontSize: '1.5em' }}>{score}</span>
              </Typography>
              <Typography variant="body1">
                Meilleure Série: <span style={{ fontWeight: 'bold' }}>{bestStreak}</span>
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              onClick={restartGame}
              startIcon={<AccessTimeIcon />}
            >
              Rejouer (Niveau {currentLevelConfig.label})
            </Button>
          </Card>
        </Box>
      )}

      {/* CSS Global pour les animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(102, 187, 106, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(102, 187, 106, 0); }
          100% { box-shadow: 0 0 0 0 rgba(102, 187, 106, 0); }
        }
      `}</style>
    </Container>
  );
}