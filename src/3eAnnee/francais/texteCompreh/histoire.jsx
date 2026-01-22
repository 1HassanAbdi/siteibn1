import React from "react";
import { Box, Typography } from "@mui/material";

const HistoireSemaine = ({ videoUrl, title }) => {
  return (
    <Box sx={{ textAlign: "center", color: "white", mt: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#90caf9" }}>
        🎧 {title || "Histoire de la semaine"}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <iframe
          src={videoUrl}
          width="80%"
          height="480"
          allow="autoplay"
          style={{ borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.5)", border: "none" }}
          title="Vidéo Histoire"
        ></iframe>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        📖 Écoute attentivement l'histoire du mois !
      </Typography>
    </Box>
  );
};

export default HistoireSemaine;