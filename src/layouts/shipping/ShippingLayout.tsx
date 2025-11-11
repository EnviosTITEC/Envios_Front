// src/layouts/shipping/ShippingLayout.tsx
import { Box, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useLocation, Outlet } from "react-router-dom";
import NavButton from "../../components/ui/navigation/NavButton";

export default function ShippingLayout() {
  const { pathname } = useLocation();
  const isIndex = pathname === "/shipping";

  return (
    <Box
      sx={{
        width: "100%",
        // contenedor fluido que se centra y limita en desktop
        maxWidth: { xs: "100%", lg: 1280 },
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        // mejora reflujo con zoom y evita desbordes raros
        contain: "inline-size",
      }}
    >
      {/* Barra superior (transparente) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "transparent",
          borderBottom: (t) => `1px solid ${t.palette.primary.main}33`,
          backdropFilter: "saturate(120%) blur(2px)",
          // asegura que la barra respete el mismo padding del contenedor
          px: { xs: 0, sm: 0, md: 0 },
        }}
      >
        <Box sx={{ py: 0.25, maxWidth: { xs: "100%", lg: 1280 }, mx: "auto" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ minHeight: 48 }}
          >
            <Box>
              {!isIndex && (
                <NavButton
                  component={Link}
                  to="/shipping"
                  startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
                >
                  Volver a Envíos
                </NavButton>
              )}
            </Box>

            <NavButton
              component={Link}
              to="/"
              startIcon={<HomeIcon sx={{ fontSize: 15 }} />}
            >
              Volver a PulgaShop
            </NavButton>
          </Stack>
        </Box>
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          py: { xs: 2, md: 3 },
          // clave: si algo interno (p.ej. tabla) es más ancho, scrollea sólo el contenido
          overflowX: "auto",
          // que los hijos no estiren el layout en zoom
          maxWidth: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
