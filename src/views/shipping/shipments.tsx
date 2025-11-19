import {
  Box,
  Stack,
  Card,
  CardActionArea,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import PageCard from "../../components/primitives/PageCard";
import SectionHeader from "../../components/primitives/SectionHeader";
import NavigationButtons from "../../components/common/NavigationButtons";

export default function Shipments() {
  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <NavigationButtons />
      <PageCard>
        <SectionHeader
          title="Mis Envíos"
          subtitle="Consulta el estado de tus envíos y revisa su historial."
          actions={null}
        />

        <Typography
          variant="body2"
          sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
        >
          El historial detallado de envíos se encuentra en desarrollo.
        </Typography>

        <Stack spacing={2} sx={{ mt: 4, maxWidth: 480 }}>
          <Card
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              transition: "transform .25s ease, box-shadow .25s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardActionArea
              component={Link}
              to="/shipping/tracking"
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                minHeight: 140,
                px: 3,
                py: 2.5,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                textAlign: "center",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              })}
            >
              <Typography variant="h6" fontWeight={700} color="inherit">
                Ver estado de envíos
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "inherit",
                  opacity: 0.85,
                  textAlign: "center",
                }}
              >
                Revisa el historial y el estado de tus envíos actuales.
              </Typography>

              <Typography
                variant="caption"
                sx={{ opacity: 0.8, fontStyle: "italic", color: "inherit" }}
              >
                Seguimiento disponible
              </Typography>
            </CardActionArea>
          </Card>
        </Stack>
      </PageCard>
    </Box>
  );
}
