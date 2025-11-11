import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import { alpha } from "@mui/material/styles";

const RADIUS = 12;

export default function Shipping() {
  const tiles = [
    { title: "Mis direcciones", desc: "Gestiona tus direcciones", to: "/shipping/addresses", Icon: HomeIcon, swatch: "info" },
    { title: "Cotización", desc: "Calcula el costo de tus envíos", to: "/shipping/quote", Icon: CalculateIcon, swatch: "success" },
    { title: "Mis envíos", desc: "Consulta y gestiona tus envíos", to: "/shipping/shipments", Icon: LocalShippingIcon, swatch: "warning" },
    { title: "Seguimiento", desc: "Rastrea el envío con el código de tracking", to: "/shipping/tracking", Icon: SearchIcon, swatch: "secondary" },
    { title: "Transportistas", desc: "Administra empresas de transporte", to: "/shipping/carriers", Icon: PeopleIcon, swatch: "error" },
  ] as const;

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>Sistema de Envíos PulgaShop</Typography>
        <Typography color="text.secondary">Gestiona todos los aspectos de tus envíos desde un solo lugar.</Typography>
      </Box>

      <Box
        role="list"
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "grid",
          gap: 3,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          alignItems: "stretch",
        }}
      >
        {tiles.map(({ title, desc, to, Icon, swatch }) => (
          <Card
            key={title}
            role="listitem"
            elevation={0}
            sx={(t) => ({
              borderRadius: `${RADIUS}px !important`,
              overflow: "hidden",
              bgcolor: t.palette.background.paper,
              border: `1px solid ${alpha(t.palette.primary.main, 0.08)}`,
              boxShadow: "0 2px 8px rgba(0,0,0,.05)",
              transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 14px rgba(0,0,0,.08)",
                borderColor: alpha(t.palette.primary.main, 0.14),
              },
              "&.MuiPaper-rounded": { borderRadius: `${RADIUS}px !important` },
            })}
          >
            <CardActionArea
              component={Link}
              to={to}
              sx={(t) => ({
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
                minHeight: 176,
                borderRadius: 0, // evita heredar redondeo “pill”
                "&:focus-visible": {
                  outline: `2px solid ${alpha(t.palette.primary.main, 0.45)}`,
                  outlineOffset: 2,
                },
              })}
              aria-label={title}
            >
              <Box
                sx={(t) => ({
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.25,
                  background: alpha((t.palette as any)[swatch].main, 0.14),
                })}
              >
                <Icon sx={(t) => ({ color: (t.palette as any)[swatch].main })} />
              </Box>

              <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
              <Typography variant="body2" color="text.secondary">{desc}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
