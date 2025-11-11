import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import PageCard from "../../components/ui/layout/PageCard";
import SectionHeader from "../../components/ui/layout/SectionHeader";

export default function Quote() {
  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <PageCard>
        <SectionHeader
          title="Cotización"
          subtitle="Calcula el costo estimado de tus envíos."
          actions={null}
        />

        <Typography
          variant="body2"
          sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
        >
          Esta simulación es referencial. El cálculo real de tarifas está en
          desarrollo.
        </Typography>

        <Stack spacing={2.5} sx={{ mt: 4, maxWidth: 480 }}>
          <TextField
            label="Origen"
            placeholder="Ej: Santiago"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Destino"
            placeholder="Ej: Valparaíso"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Peso (kg)"
            type="number"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Volumen (m³)"
            type="number"
            fullWidth
            variant="outlined"
          />

          <Button
            variant="contained"
            color="primary"
            sx={(theme) => ({
              mt: 2,
              py: 1.4,
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(49,76,83,0.10)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(49,76,83,0.20)",
                backgroundColor: theme.palette.primary.dark,
              },
            })}
            onClick={() => {
              alert("Calculadora de tarifas en desarrollo 🤓");
            }}
          >
            Calcular
          </Button>
        </Stack>
      </PageCard>
    </Box>
  );
}
