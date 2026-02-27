import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  School,
  Person,
  Groups,
  Business,
  CheckCircle,
  AutoAwesome,
} from "@mui/icons-material";

const ECOSYSTEM = {
  student: {
    title: "STUDENT (AT THE CENTER)",
    icon: <Person />,
    color: "#111827",
    items: [
      "Participate actively in class",
      "Complete homework and review lessons",
      "Ask questions when needed",
      "Follow school rules",
      "Give your best effort every day",
    ],
  },
  teacher: {
    title: "TEACHER",
    icon: <School />,
    color: "#1976d2",
    items: [
      "Design structured and engaging lessons",
      "Use differentiated instruction strategies",
      "Provide clear explanations",
      "Monitor student progress regularly",
      "Communicate with parents",
    ],
  },
  parents: {
    title: "PARENTS",
    icon: <Groups />,
    color: "#9c27b0",
    items: [
      "Encourage and support the child",
      "Monitor homework",
      "Provide a quiet study environment",
      "Communicate with the school",
      "Value effort and progress",
    ],
  },
  admin: {
    title: "ADMINISTRATION",
    icon: <Business />,
    color: "#ef6c00",
    items: [
      "Provide educational resources",
      "Support teachers",
      "Ensure a safe school climate",
      "Implement academic policies",
      "Monitor academic results",
    ],
  },
};

export default function App() {
  const [selected, setSelected] = useState("student");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <AutoAwesome sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            EduSphere 2026
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          The Learning Responsibility Ecosystem
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Student success is a shared responsibility between administration,
          teachers, parents, and the student at the center.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {Object.entries(ECOSYSTEM).map(([key, value]) => (
              <Button
                key={key}
                fullWidth
                variant={selected === key ? "contained" : "outlined"}
                sx={{ mb: 2 }}
                onClick={() => setSelected(key)}
                startIcon={value.icon}
              >
                {value.title}
              </Button>
            ))}
          </Grid>

          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: ECOSYSTEM[selected].color }}>
                    {ECOSYSTEM[selected].icon}
                  </Avatar>
                  <Typography variant="h6">
                    {ECOSYSTEM[selected].title}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List>
                  {ECOSYSTEM[selected].items.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle
                          sx={{ color: ECOSYSTEM[selected].color }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}