import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

const RADIUS = 12;

const wrapSx = {
  borderRadius: RADIUS,
  height: "100%",
  transition: "transform .18s ease, box-shadow .18s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(16,24,40,.08)", // hover más fino
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": { transform: "none" },
  },
};

const cardSx = {
  borderRadius: RADIUS,
  overflow: "hidden",
  position: "relative",
  bgcolor: "#fff",
  boxShadow: "0 4px 12px rgba(16,24,40,.06)", // idle más suave
  height: "100%",
  "&.MuiPaper-rounded": { borderRadius: `${RADIUS}px !important` },
  "& .MuiCardActionArea-root": { borderRadius: 0 },
  "& .MuiTouchRipple-root": { borderRadius: 0 },
};

const actionSx = {
  p: 2.5,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 1,
  justifyContent: "space-between",
  height: "100%",
  minHeight: 164, // iguala alturas
  "&:focus-visible": {
    outline: "2px solid #2f905180",
    outlineOffset: 2,
  },
};

const iconWrap = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 1.25,
};

export default function Shipping() {
  const items = [
    {
      title: "Mis direcciones",
      desc: "Gestiona tus direcciones",
      to: "/shipping/addresses",
      icon: <HomeIcon sx={{ color: "#3B82F6" }} />,
      bg: "rgba(59,130,246,.12)",
    },
    {
      title: "Cotización",
      desc: "Calcula el costo de tus envíos",
      to: "/shipping/quote",
      icon: <CalculateIcon sx={{ color: "#10B981" }} />,
      bg: "rgba(16,185,129,.12)",
    },
    {
      title: "Mis envíos",
      desc: "Consulta y gestiona tus envíos",
      to: "/shipping/shipments",
      icon: <LocalShippingIcon sx={{ color: "#FB923C" }} />,
      bg: "rgba(251,146,60,.12)",
    },
    {
      title: "Seguimiento",
      desc: "Rastrea el envío con el código de tracking",
      to: "/shipping/tracking",
      icon: <SearchIcon sx={{ color: "#6366F1" }} />,
      bg: "rgba(99,102,241,.12)",
    },
    {
      title: "Transportistas",
      desc: "Administra empresas de transporte",
      to: "/shipping/carriers",
      icon: <PeopleIcon sx={{ color: "#F43F5E" }} />,
      bg: "rgba(244,63,94,.12)",
    },
  ];

  return (
    <section className="px-4 py-8">
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={800}
          sx={{ color: "#1a1a1a", letterSpacing: "-0.2px" }}
        >
          Sistema de Envíos PulgaShop
        </Typography>
        <Typography color="text.secondary">
          Gestiona todos los aspectos de tus envíos desde un solo lugar.
        </Typography>
      </Box>

      <Box
        role="list"
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          alignItems: "stretch",
        }}
      >
        {items.map((it) => (
          <Box key={it.title} sx={wrapSx} role="listitem">
            <Card sx={cardSx} elevation={0}>
              <CardActionArea
                component={Link}
                to={it.to}
                sx={actionSx}
                aria-label={it.title}
              >
                <Box sx={{ ...iconWrap, background: it.bg }}>{it.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#111827" }}>
                  {it.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {it.desc}
                </Typography>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </section>
  );
}
