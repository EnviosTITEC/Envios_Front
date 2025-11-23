import { Box, Card, CardActionArea, Typography, Dialog, DialogContent, CircularProgress, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

const RADIUS = 12;

export default function Shipping() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const tiles = [
    { title: "Mis direcciones", desc: "Gestiona tus direcciones", path: "/shipping/addresses", Icon: HomeIcon, swatch: "info", clickable: true },
    { title: "Cotización", desc: "Calcula el costo de tus envíos", path: "/shipping/quote", Icon: CalculateIcon, swatch: "success", clickable: true },
    { title: "Mis envíos", desc: "Consulta y gestiona tus envíos", path: "/shipping/shipments", Icon: LocalShippingIcon, swatch: "warning", clickable: true },
    { title: "Seguimiento", desc: "Rastrea el envío con el código de tracking", path: "/shipping/tracking", Icon: SearchIcon, swatch: "secondary", clickable: true },
  ] as const;

  const handleCardClick = (tile: typeof tiles[number]) => {
    if (tile.clickable) {
      navigate(tile.path);
    } else {
      setOpenDialog(true);
    }
  };

  return (
    <Container maxWidth="lg" component="section" sx={{ py: { xs: 3, md: 5 }, minHeight: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          Sistema de Envíos PulgaShop
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          Gestiona todos los aspectos de tus envíos desde un solo lugar.
        </Typography>
      </Box>

      <Box
        role="list"
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          alignItems: "stretch",
          pb: 3,
        }}
      >
        {tiles.map((tile) => (
          <Card
            key={tile.title}
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
              onClick={() => handleCardClick(tile)}
              sx={(t) => ({
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
                height: "100%",
                minHeight: 176,
                borderRadius: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                "&:focus-visible": {
                  outline: `2px solid ${alpha(t.palette.primary.main, 0.45)}`,
                  outlineOffset: 2,
                },
              })}
              aria-label={tile.title}
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
                  background: alpha((t.palette as any)[tile.swatch].main, 0.14),
                })}
              >
                <tile.Icon sx={(t) => ({ color: (t.palette as any)[tile.swatch].main })} />
              </Box>

              <Typography variant="subtitle1" fontWeight={700}>{tile.title}</Typography>
              <Typography variant="body2" color="text.secondary">{tile.desc}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Dialog: En proceso */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            py: 4,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" fontWeight={600}>
            En proceso...
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Esta funcionalidad estará disponible próximamente.
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
