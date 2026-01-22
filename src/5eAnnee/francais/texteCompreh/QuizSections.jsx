import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

export default function QuizSection({
  id,
  type,
  questions,
  answers,
  submitted,
  onAnswer,
  onSubmit,
  onReset,
  score,
  onNext,
}) {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
         
          color: "#00e676",
          fontWeight: "bold",
          mb: 3,
          textShadow: "0 0 10px #00e676",
        }}
      >
        {id.toUpperCase()}
      </Typography>

      <Stack spacing={3}>
        {questions.map((item, i) => (
          <Paper
            key={i}
            sx={{
              p: 3,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderLeft: "6px solid #00e676",
              borderRadius: 3,
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                backgroundColor: "rgba(255,255,255,0.12)",
              },
            }}
          >
            <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
              {i + 1}. {item.q}
            </Typography>

            {type === "boolean" && (
              <Stack direction="row" spacing={2}>
                {[true, false].map((val) => (
                  <Button
                    key={val ? "true" : "false"}
                    variant="contained"
                    onClick={() => onAnswer(id, i, val)}
                    disabled={submitted}
                    sx={{
                      flex: 1,
                      py: 2,
                      backgroundColor:
                        answers[`${id}-${i}`] === val
                          ? val
                            ? "success.main"
                            : "error.main"
                          : "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: val
                          ? "success.dark"
                          : "error.dark",
                      },
                    }}
                  >
                    {val ? "✓ Vrai" : "✗ Faux"}
                  </Button>
                ))}
              </Stack>
            )}

            {type === "multiple" && (
              <Select
                fullWidth
                value={answers[`${id}-${i}`] || ""}
                onChange={(e) => onAnswer(id, i, e.target.value)}
                disabled={submitted}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSvgIcon-root": { color: "white" },
                }}
              >
                {item.options.map((opt, j) => (
                  <MenuItem key={j} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            )}

            {submitted && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color:
                    answers[`${id}-${i}`] === item.a
                      ? "success.light"
                      : "error.light",
                }}
              >
                {answers[`${id}-${i}`] === item.a ? (
                  <CheckCircle />
                ) : (
                  <Cancel />
                )}
                <Typography variant="body1">
                  {answers[`${id}-${i}`] === item.a
                    ? "Correct!"
                    : `Wrong. Correct answer: ${item.a}`}
                </Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        {!submitted && (
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={onSubmit}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            ✅ Check Answers
          </Button>
        )}
        {submitted && (
          <>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={onReset}
            >
              🔁 Retry
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={onNext}
            >
              Next →
            </Button>
          </>
        )}
      </Stack>

      {submitted && (
        <Paper
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: "rgba(0,230,118,0.1)",
            border: "1px solid rgba(0,230,118,0.5)",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#00e676", textAlign: "center" }}
          >
            Score: {score}/{questions.length}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
