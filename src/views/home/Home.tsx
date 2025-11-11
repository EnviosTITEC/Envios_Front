import { Box, Typography } from "@mui/material";

/**
 * Vista placeholder de bienvenida.
 * Esta pantalla solo muestra el mensaje de inicio
 * mientras otro equipo gestiona la parte principal.
 */
export default function Home() {
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60dvh",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
        Bienvenido a PulgaShop
      </Typography>
    </Box>
  );
}
