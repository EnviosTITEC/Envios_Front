// src/layouts/shipping/ShippingLayout.tsx
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

/**
 * Layout para módulo de Shipping
 * Mantiene la estructura convencional con Navbar y Footer
 */
export default function ShippingLayout() {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* Contenido */}
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            py: { xs: 1, md: 2 },
            px: { xs: 0.5, md: 2 },
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}
