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
      <Container maxWidth="xl">
        <Box
          sx={{
            py: { xs: 2, md: 3 },
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
