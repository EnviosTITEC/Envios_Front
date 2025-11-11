// src/layouts/BlankLayout.tsx
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

/**
 * Layout básico sin navegación ni cabecera.
 * Ideal para vistas de login, error o páginas independientes.
 * Adaptado al tema PulgaShop.
 */
export default function BlankLayout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: (t) => t.palette.background.default,
        color: (t) => t.palette.text.primary,
      }}
    >
      <Outlet />
    </Box>
  );
}
