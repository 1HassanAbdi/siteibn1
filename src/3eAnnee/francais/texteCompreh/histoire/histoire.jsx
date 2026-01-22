import React from "react";
import { Box, Typography } from "@mui/material";

const HistoireSemaine = () => {
  return (
    <Box sx={{ textAlign: "center", color: "white", mt: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#90caf9" }}>
        🎧 Histoire de la semaine
      </Typography>

      {/* ✅ Vidéo intégrée via iframe Google Drive */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <iframe
          src="https://drive.google.com/file/d/1140LTNptqx0ZOyWfeuAoj_W7sQCIm7yK/preview"
          width="80%"
          height="480"
          allow="autoplay"
          style={{ borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.5)" }}
          title="Vidéo Histoire"
        ></iframe>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        📖 Écoute attentivement cette histoire, puis raconte-la à ton camarade !
      </Typography>
    </Box>
  );
};

export default HistoireSemaine;
