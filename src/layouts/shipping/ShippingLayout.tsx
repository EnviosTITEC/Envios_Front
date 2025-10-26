// ShippingLayout.tsx
import { Box, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useLocation, Outlet } from "react-router-dom";
import NavButton from "../../components/ui/NavButton";

export default function ShippingLayout() {
  const { pathname } = useLocation();
  const isIndex = pathname === "/shipping";

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
      {/* Barra superior con blur y línea sutil */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "transparent",
          borderBottom: "1px solid #5A7F78",
          backdropFilter: "saturate(120%) blur(2px)",
        }}
      >
        <Box sx={{ py: 0.25, maxWidth: 1200, mx: "auto" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              {!isIndex && (
                <NavButton component={Link} to="/shipping" startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}>
                  Volver a Envíos
                </NavButton>
              )}
            </Box>

            <NavButton component={Link} to="/" startIcon={<HomeIcon sx={{ fontSize: 15 }} />}>
              Volver a PulgaShop
            </NavButton>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
