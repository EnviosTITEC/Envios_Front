import { Box, Typography } from "@mui/material";

/**
 * Vista Home - Página de bienvenida
 */
export default function Home() {
  return (
    <Box
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
