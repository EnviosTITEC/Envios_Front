import { Box, Card, CardContent, Typography, Stack, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

export default function Shipments() {
  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ borderRadius: 2, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="h5" fontWeight={600}>
            Mis Envíos
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Consulta el estado de tus envíos y revisa su historial.
          </Typography>

          <Stack spacing={2} sx={{ mt: 4 }}>
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
                  bgcolor: "primary.main",
                  color: theme.palette.primary.contrastText,
                })}
              >
                <Typography variant="h6" fontWeight={700}>
                  Ver estado de envíos
                </Typography>
                <Typography
                  variant="body2"
                  sx={(theme) => ({ color: theme.palette.common.white, opacity: 0.85 })}
                >
                  Revisa el historial y el estado de tus envíos actuales.
                </Typography>
              </CardActionArea>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
