import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import PageCard from "../../components/primitives/PageCard";
import SectionHeader from "../../components/primitives/SectionHeader";

export default function Tracking() {
  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <PageCard>
        <SectionHeader
          title="Seguimiento"
          subtitle="Rastrea tus envíos por código de seguimiento."
          actions={null}
        />

        <Stack direction="column" spacing={3} sx={{ mt: 4, maxWidth: 480 }}>
          <TextField
            label="Código de seguimiento"
            placeholder="Ingresa tu código de seguimiento"
            fullWidth
            variant="outlined"
            size="medium"
          />

          <Button
            variant="contained"
            color="primary"
            sx={(theme) => ({
              width: "100%",
              py: 1.4,
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(49,76,83,0.10)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(49,76,83,0.20)",
                backgroundColor: theme.palette.primary.dark,
              },
            })}
            onClick={() => {
              alert("Búsqueda de tracking en desarrollo 🛰️");
            }}
          >
            Buscar Envío
          </Button>

          {/* Bloque de resultado simulado */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Estado del envío
            </Typography>
            <Typography color="text.secondary">
              Envío en tránsito. Estimado para entrega el 25 de octubre.
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                fontStyle: "italic",
                color: "text.secondary",
              }}
            >
              Información simulada para demostración.
            </Typography>
          </Box>
        </Stack>
      </PageCard>
    </Box>
  );
}
