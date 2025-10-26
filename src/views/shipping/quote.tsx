import { Box, Card, CardContent, Typography, Button, Stack, TextField } from "@mui/material";

export default function Quote() {
  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          bgcolor: "background.paper",
        }}
      >
        <CardContent sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="h5" fontWeight={600}>
            Cotización
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Calcula el costo estimado de tus envíos.
          </Typography>

          <Stack spacing={2.5} sx={{ mt: 4 }}>
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
              sx={{
                mt: 2,
                py: 1.4,
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(49,76,83,0.10)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(49,76,83,0.20)",
                },
              }}
            >
              Calcular
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
