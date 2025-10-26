import { Box, Card, CardContent, Typography, Stack, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

export default function Carriers() {
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
            Transportistas
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Gestiona las empresas de transporte con las que trabajas.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
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
                to="/shipping/carriers/"
                sx={(theme) => ({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  py: 4,
                  px: 2,
                  bgcolor: theme.palette.primary.main,        // <- usa #5A7F78
                  color: theme.palette.primary.contrastText,  // <- blanco
                  transition: "transform .25s ease, box-shadow .25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.15)",
                    bgcolor: theme.palette.primary.dark,      // <- #314C53 al hacer hover
                  },
                })}
              >
                <Typography variant="h6" fontWeight={700} color="inherit">
                  Añadir Transportista
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9 }}
                  color="inherit"
                >
                  Agrega una nueva empresa de transporte para gestionar.
                </Typography>
              </CardActionArea>

            </Card>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
