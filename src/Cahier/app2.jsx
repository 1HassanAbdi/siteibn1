import { useState } from 'react';
import data from './data1.json';
import SentenceBuilder from './SentenceBuilder2';
import {
  Container, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Paper, createTheme, ThemeProvider, CssBaseline, Button
} from '@mui/material';
import { School, CheckCircle, PlayArrow, ArrowBack, Star, EmojiEvents } from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: '"Comic Sans MS", "Comic Neue", cursive, sans-serif',
    h3: {
      fontWeight: 800,
      color: '#FF5722',
      textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
      fontSize: '2.8rem',
      letterSpacing: '1px'
    },
    h5: {
      fontWeight: 700,
      color: '#E91E63',
      fontSize: '1.8rem'
    },
    h6: {
      fontWeight: 700,
      color: '#4CAF50',
      fontSize: '1.4rem'
    },
    body1: {
      fontSize: '1.2rem',
      lineHeight: 1.7
    }
  },
  palette: {
    background: {
      default: 'linear-gradient(135deg, #FFEBEE 0%, #E1F5FE 50%, #E8F5E9 100%)'
    },
    primary: {
      main: '#FF5722'
    },
    secondary: {
      main: '#9C27B0'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          fontWeight: 'bold',
          boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '3px solid #FFD54F',
          overflow: 'hidden'
        }
      }
    }
  }
});

export default function App() {
  const [selectedId, setSelectedId] = useState(data[0].id);
  const [exerciceEnCours, setExerciceEnCours] = useState(false);

  const currentData = data.find(d => d.id === selectedId);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={10} sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EmojiEvents sx={{ fontSize: 80, color: '#FFD700', mb: 1 }} />
            <Typography variant="h3" align="center" gutterBottom>
              Jeu des Phrases Magiques !
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              {[...Array(3)].map((_, i) => (
                <Star key={i} sx={{ fontSize: 40, color: '#FFD700' }} />
              ))}
            </Box>
          </Box>

          {!exerciceEnCours ? (
            <Box>
              <Box sx={{
                my: 4,
                bgcolor: '#FFFFFF',
                p: 3,
                borderRadius: 4,
                border: '2px dashed #FF5722',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <PlayArrow color="primary" sx={{ fontSize: 30 }} /> Comment jouer ?
                </Typography>
                <Typography component="ol" sx={{ fontSize: '1.3rem', lineHeight: 2, textAlign: 'left', pl: 3 }}>
                  <li>Choisis un texte dans le menu <School sx={{ verticalAlign: 'middle', color: '#4CAF50' }} />.</li>
                  <li>Glisse les mots pour faire des phrases.</li>
                  <li>Clique sur <CheckCircle sx={{ verticalAlign: 'middle', color: '#4CAF50' }} /> pour vérifier.</li>
                  <li>Gagne des étoiles ⭐ si tu réussis !</li>
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 4, bgcolor: '#FFF9C4', borderRadius: 3 }}>
                <InputLabel id="select-text-label" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  📚 Choisis une histoire
                </InputLabel>
                <Select
                  labelId="select-text-label"
                  value={selectedId}
                  label="Choisir un texte"
                  onChange={(e) => setSelectedId(e.target.value)}
                  sx={{
                    height: '60px',
                    fontSize: '1.3rem',
                    '.MuiSelect-select': { padding: '16.5px 14px' }
                  }}
                >
                  {data.map((item) => (
                    <MenuItem key={item.id} value={item.id} sx={{ fontSize: '1.3rem', py: 2 }}>
                      {item.titre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => setExerciceEnCours(true)}
                startIcon={<PlayArrow sx={{ fontSize: 30 }} />}
                sx={{
                  py: 2.5,
                  fontSize: '1.5rem',
                  bgcolor: '#FF5722',
                  '&:hover': { bgcolor: '#E64A19' }
                }}
              >
                COMMENCER À JOUER !
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ArrowBack sx={{ fontSize: 24 }} />}
                onClick={() => setExerciceEnCours(false)}
                sx={{
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.2rem',
                  border: '2px solid #9C27B0'
                }}
              >
                Retour au menu
              </Button>

              <Typography variant="h5" align="center" sx={{ mb: 4, color: '#9C27B0' }}>
                {currentData.titre}
              </Typography>

              <SentenceBuilder
                phrases={currentData.phrases}
                onRetourMenu={() => setExerciceEnCours(false)}
              />
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
