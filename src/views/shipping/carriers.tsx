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

export default function Carriers() {
  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <PageCard>
        <SectionHeader
          title="Transportistas"
          subtitle="Gestiona las empresas de transporte con las que trabajas."
          actions={null}
        />

        <Typography
          variant="body2"
          sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
        >
          Algunas funciones de esta sección están en desarrollo.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Card
            sx={{
              flex: 1,
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              overflow: "hidden",
              transition: "transform .25s ease, box-shadow .25s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardActionArea
              component={Link}
              to="/shipping/carriers"
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                py: 4,
                px: 2,
                bgcolor: theme.palette.primary.main, // tu verde (#5A7F78 si lo seteaste en theme)
                color: theme.palette.primary.contrastText,
                textAlign: "center",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark, // verde más oscuro (#314C53 si lo seteaste)
                },
              })}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="inherit"
              >
                Añadir Transportista
              </Typography>
              <Typography
                variant="body2"
                color="inherit"
                sx={{ opacity: 0.9 }}
              >
                Agrega una nueva empresa de transporte para gestionar.
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  opacity: 0.8,
                  fontStyle: "italic",
                  color: "inherit",
                }}
              >
                (Funcionalidad en desarrollo)
              </Typography>
            </CardActionArea>
          </Card>
        </Stack>
      </PageCard>
    </Box>
  );
}
