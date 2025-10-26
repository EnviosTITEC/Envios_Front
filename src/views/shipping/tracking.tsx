import { Box, Card, CardContent, Typography, Button, Stack, TextField } from "@mui/material";

export default function Tracking() {
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
            Seguimiento
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Rastrea tus envíos por código de seguimiento.
          </Typography>

          <Stack direction="column" spacing={3} sx={{ mt: 4 }}>
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
              sx={{
                width: "100%",
                py: 1.4,
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(49,76,83,0.10)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(49,76,83,0.20)",
                },
              }}
            >
              Buscar Envío
            </Button>

            {/* Resultados (simulado) */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Estado del envío
              </Typography>
              <Typography color="text.secondary">
                Envío en tránsito. Estimado para entrega el 25 de octubre.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
