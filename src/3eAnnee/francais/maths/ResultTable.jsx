import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { green, lightGreen } from "@mui/material/colors";

export default function ResultTable({ name, studentResults, questionBank, formatTime, handleQuit }) {
  if (!name || studentResults.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{
          color: green[800],
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        📊 Bilan de {name}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: green[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: green[900] }}>Niveau</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: green[900] }}>Score</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: green[900] }}>Temps</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: green[900] }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentResults.map((result, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? green[50] : lightGreen[50],
                  "&:hover": { backgroundColor: lightGreen[100] },
                  transition: "0.3s",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>
                  {result.difficulty === "5"
                    ? "Facile"
                    : result.difficulty === "10"
                    ? "Moyen"
                    : "Difficile"}
                </TableCell>
                <TableCell>
                  {result.score}/{questionBank[result.difficulty].length}
                </TableCell>
                <TableCell>{formatTime(result.timeElapsed)}</TableCell>
                <TableCell>{result.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        fullWidth
        onClick={handleQuit}
        sx={{
          mt: 3,
          background: "linear-gradient(45deg, #43A047 30%, #81C784 90%)",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            background: "linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)",
          },
        }}
      >
        QUITTER
      </Button>
    </Box>
  );
}
