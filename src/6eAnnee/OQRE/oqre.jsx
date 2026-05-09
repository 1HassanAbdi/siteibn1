import React, { useState } from 'react';
import { 
  Container, Box, Typography, Paper, Radio, RadioGroup, 
  FormControlLabel, FormControl, Divider, TextField, 
  Button, AppBar, Toolbar, Card, CardContent 
} from '@mui/material';
import oqreData from './data.json';

const OQREApp = () => {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', pb: 10 }}>
      {/* Barre d'entête officielle style OQRE */}
      <AppBar position="sticky" sx={{ bgcolor: '#0056b3' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            OQRE | 2015 — Français (6e année)
          </Typography>
          <Typography variant="body2">Livret de test officiel</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 5 }}>
        {/* Titre de l'examen */}
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 5, color: '#1a1a1a' }}>
          {oqreData.examen}
        </Typography>

        {oqreData.sections?.map((section) => (
          <Box key={section.id} sx={{ mb: 8 }}>
            
            {/* Étiquette bleue "Partie" */}
            <Paper elevation={0} sx={{ display: 'inline-block', bgcolor: '#0056b3', color: 'white', px: 3, py: 1, mb: 0, borderRadius: '4px 4px 0 0' }}>
              <Typography variant="button" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Partie {section.id}
              </Typography>
            </Paper>

            <Card elevation={3} sx={{ borderRadius: '0 8px 8px 8px', borderTop: '4px solid #0056b3' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ textDecoration: 'underline', mb: 4 }}>
                  {section.titre}
                </Typography>

                {/* TEXTE DE LECTURE (S'affiche seulement s'il existe) */}
                {section.contenu && section.contenu.length > 0 && (
                  <Box sx={{ 
                    mb: 5, 
                    p: 3, 
                    bgcolor: '#fafafa', 
                    borderLeft: '6px solid #0056b3',
                    borderRadius: 1
                  }}>
                    {section.contenu.map((paragraphe, idx) => (
                      <Typography key={idx} variant="body1" sx={{ 
                        mb: 2, 
                        fontSize: '1.15rem', 
                        lineHeight: 1.8, 
                        fontFamily: 'serif',
                        textAlign: 'justify'
                      }}>
                        {paragraphe}
                      </Typography>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

                {/* QUESTIONS */}
                {section.questions?.map((q) => (
                  <Box key={q.id} sx={{ mb: 6, p: 2, '&:hover': { bgcolor: '#fcfcfc' }, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex' }}>
                      <Box component="span" sx={{ mr: 2, color: '#0056b3' }}>{q.id}.</Box> 
                      {q.enonce}
                    </Typography>

                    {/* Contexte spécial pour l'écriture (si présent) */}
                    {q.contexte && (
                      <Typography variant="body2" sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', fontStyle: 'italic', borderRadius: 1 }}>
                        {q.contexte}
                      </Typography>
                    )}

                    {/* Type Choix Multiple */}
                    {(q.type === 'choix_multiple' || q.type === 'choix_multiple_ecriture') ? (
                      <FormControl component="fieldset" sx={{ width: '100%', ml: 4 }}>
                        <RadioGroup onChange={(e) => handleChange(q.id, e.target.value)}>
                          {q.options?.map((option, idx) => (
                            <FormControlLabel 
                              key={idx} 
                              value={option} 
                              control={<Radio sx={{ color: '#0056b3' }} />} 
                              label={<Typography sx={{ fontSize: '1.05rem' }}>{option}</Typography>}
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    ) : (
                      /* Type Réponse Construite / Écriture */
                      <Box sx={{ mt: 2, ml: 4 }}>
                        <Typography variant="caption" sx={{ color: 'grey.600', mb: 1, display: 'block', fontWeight: 'bold' }}>
                          DIRECTIVE : {q.directives}
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={q.espace_lignes || 6}
                          variant="outlined"
                          placeholder="Écris ton texte ici..."
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          sx={{ 
                            bgcolor: 'white',
                            '& .MuiOutlinedInput-root': {
                              fontFamily: 'cursive',
                              lineHeight: '1.5'
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Bouton de fin */}
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => {
              console.log("RÉPONSES ÉLÈVE :", answers);
              alert("Test terminé ! Tes réponses ont été enregistrées dans la console.");
            }}
            sx={{ 
              bgcolor: '#000', 
              px: 8, 
              py: 2, 
              fontSize: '1.2rem',
              '&:hover': { bgcolor: '#333' } 
            }}
          >
            Terminer et Soumettre
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default OQREApp;