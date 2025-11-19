// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Layout principal PulgaShop - Convencional y Profesional
 * - Navbar en la parte superior
 * - Contenido en el medio
 * - Footer en la parte inferior
 */
export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
