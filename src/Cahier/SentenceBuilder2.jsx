import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function SentenceBuilder({ phrases, onRetourMenu }) {
  // États pour gérer la phrase actuelle, les mots et le résultat
  const [indexPhraseCourante, setIndexPhraseCourante] = useState(0);
  const [motsDispos, setMotsDispos] = useState([]);
  const [motsPlaces, setMotsPlaces] = useState([]);
  const [resultat, setResultat] = useState(null);

  // Phrase correcte actuelle
  const phraseCorrecte = phrases[indexPhraseCourante];

  // Initialisation des mots disponibles
  useEffect(() => {
    if (!phraseCorrecte) return;
    const mots = phraseCorrecte.split(' ').map((mot, index) => ({
      id: `${mot}-${index}`,
      texte: mot,
    }));
    setMotsDispos(mots.sort(() => Math.random() - 0.5));
    setMotsPlaces([]);
    setResultat(null);
  }, [phraseCorrecte]);

  // Déplacer un mot vers la zone de construction
  const deplacerVersConstruction = (mot) => {
    setMotsDispos(motsDispos.filter((m) => m.id !== mot.id));
    setMotsPlaces([...motsPlaces, mot]);
    setResultat(null);
  };

  // Remettre un mot dans la zone de mots disponibles
  const remettreDansDispos = (mot) => {
    setMotsPlaces(motsPlaces.filter((m) => m.id !== mot.id));
    setMotsDispos([...motsDispos, mot]);
    setResultat(null);
  };

  // Vérifier la phrase construite
  const verifier = () => {
    const phraseJoueur = motsPlaces.map((m) => m.texte).join(' ');
    if (phraseJoueur === phraseCorrecte) {
      setResultat(indexPhraseCourante === phrases.length - 1 ? 'finished' : 'success');
    } else {
      setResultat('error');
    }
  };

  // Passer à la phrase suivante
  const passerALaSuite = () => setIndexPhraseCourante((prev) => prev + 1);

  // Lire une phrase à voix haute
  const lirePhrase = (texte) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texte);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Votre navigateur ne supporte pas la synthèse vocale.");
    }
  };

  // Calcul de la progression
  const progress = (indexPhraseCourante / phrases.length) * 100;

  // Style des boutons de mots
  const wordBtnStyle = {
    textTransform: 'none',
    fontSize: '1.2rem',
    boxShadow: 2,
    borderRadius: 2,
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* En-tête avec bouton retour et progression */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onRetourMenu}
          sx={{ textTransform: 'none' }}
        >
          ⬅ Retour au menu
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" align="right" gutterBottom>
            Phrase {indexPhraseCourante + 1} sur {phrases.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Box>

      {/* Zone de construction */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Zone de construction :
          </Typography>
          <IconButton
            onClick={() => lirePhrase(phraseCorrecte)}
            color="primary"
            aria-label="Lire la phrase correcte"
          >
            <VolumeUpIcon />
          </IconButton>
          <IconButton
            onClick={() => lirePhrase(motsPlaces.map((m) => m.texte).join(' '))}
            color="secondary"
            aria-label="Lire ma phrase"
            disabled={motsPlaces.length === 0}
          >
            <VolumeUpIcon />
          </IconButton>
        </Box>
        <Paper
          variant="outlined"
          sx={{
            minHeight: 80,
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            borderColor: 'success.main',
            bgcolor: '#f1f8e9',
          }}
        >
          {motsPlaces.length === 0 && (
            <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
              Placez les mots ici...
            </Typography>
          )}
          {motsPlaces.map((mot) => (
            <Button
              key={mot.id}
              variant="contained"
              color="warning"
              onClick={() => remettreDansDispos(mot)}
              disabled={resultat === 'success' || resultat === 'finished'}
              sx={wordBtnStyle}
            >
              {mot.texte}
            </Button>
          ))}
        </Paper>
      </Box>

      {/* Zone de mots disponibles */}
      {(resultat !== 'success' && resultat !== 'finished') && (
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Zone de mots :
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              minHeight: 80,
              p: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              borderColor: 'primary.main',
              bgcolor: '#e3f2fd',
            }}
          >
            {motsDispos.map((mot) => (
              <Button
                key={mot.id}
                variant="outlined"
                onClick={() => deplacerVersConstruction(mot)}
                sx={{ ...wordBtnStyle, bgcolor: 'background.paper' }}
              >
                {mot.texte}
              </Button>
            ))}
          </Paper>
        </Box>
      )}

      {/* Boutons d'action */}
      {resultat === 'success' ? (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={passerALaSuite}
          sx={{ py: 1.5, fontSize: '1.2rem', fontWeight: 'bold' }}
        >
          Passer à la phrase suivante ➡️
        </Button>
      ) : resultat === 'finished' ? (
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ fontSize: '1.2rem', justifyContent: 'center', mb: 2 }}>
            🎉 Félicitations ! Vous avez terminé ce texte.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onRetourMenu}
          >
            Choisir un autre texte
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={verifier}
          disabled={motsDispos.length > 0}
          sx={{ py: 1.5, fontSize: '1.2rem', fontWeight: 'bold' }}
        >
          Vérifier ma phrase
        </Button>
      )}

      {/* Message d'erreur */}
      {resultat === 'error' && (
        <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
          Ce n'est pas tout à fait ça, essayez encore.
        </Alert>
      )}
    </Box>
  );
}
