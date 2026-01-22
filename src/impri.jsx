import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider
} from "@mui/material";

import data from "./impri.json";

export default function ImprimeExercice() {
  const [student, setStudent] = useState({ name: "", classe: "" });
  const [step, setStep] = useState("form"); // form | quiz | result
  const [answers, setAnswers] = useState({});

  /* =========================
     CORRECTION DES RÉPONSES
  ========================== */
  const isCorrect = (question, key) => {
    return (
      answers[`${question.id}-${key}`]?.trim().toLowerCase() ===
      question.answers[key].toLowerCase()
    );
  };

  const totalScore = () => {
    let score = 0;
    data.sections[0].questions.forEach(q => {
      ["passe_compose", "futur_simple", "imparfait"].forEach(t => {
        if (isCorrect(q, t)) score++;
      });
    });
    return score;
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📝 Exercice de conjugaison
      </Typography>

      {/* ================== ÉTAPE 1 : IDENTITÉ ================== */}
      {step === "form" && (
        <Card>
          <CardContent>
            <Typography variant="h6">Informations de l’élève</Typography>

            <TextField
              fullWidth
              label="Nom et prénom"
              value={student.name}
              onChange={e =>
                setStudent({ ...student, name: e.target.value })
              }
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Classe"
              value={student.classe}
              onChange={e =>
                setStudent({ ...student, classe: e.target.value })
              }
              sx={{ mt: 2 }}
            />

            <Button
              fullWidth
              sx={{ mt: 3 }}
              variant="contained"
              disabled={!student.name || !student.classe}
              onClick={() => setStep("quiz")}
            >
              Commencer l’exercice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ================== ÉTAPE 2 : QUESTIONS ================== */}
      {step === "quiz" && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Exercice de conjugaison
            </Typography>

            {data.sections[0].questions.map((q, i) => (
              <Box key={q.id} sx={{ mb: 3 }}>
                <Typography fontWeight="bold">
                  {i + 1}. {q.question}
                </Typography>

                {["passe_compose", "futur_simple", "imparfait"].map(time => (
                  <TextField
                    key={time}
                    label={time.replace("_", " ")}
                    fullWidth
                    margin="dense"
                    value={answers[`${q.id}-${time}`] || ""}
                    onChange={e =>
                      setAnswers({
                        ...answers,
                        [`${q.id}-${time}`]: e.target.value
                      })
                    }
                  />
                ))}
              </Box>
            ))}

            <Button
              variant="contained"
              color="success"
              onClick={() => setStep("result")}
            >
              Corriger
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ================== RÉSULTATS ================== */}
      {step === "result" && (
        <Card sx={{ mt: 4, background: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="h5">Résultat</Typography>

            <Typography sx={{ mt: 1 }}>
              Élève : <strong>{student.name}</strong> — Classe :{" "}
              <strong>{student.classe}</strong>
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Score : <strong>{totalScore()} / 15</strong>
            </Typography>

            <Divider sx={{ my: 2 }} />

            {data.sections[0].questions.map(q => (
              <Box key={q.id} sx={{ mb: 2 }}>
                <Typography fontWeight="bold">{q.question}</Typography>

                {["passe_compose", "futur_simple", "imparfait"].map(t => (
                  <Typography
                    key={t}
                    sx={{
                      color: isCorrect(q, t) ? "green" : "red"
                    }}
                  >
                    {t.replace("_", " ")} :{" "}
                    {answers[`${q.id}-${t}`] || "—"}
                  </Typography>
                ))}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
