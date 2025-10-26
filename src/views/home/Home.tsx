import { Box, Typography } from "@mui/material";


export default function Home() {
  return (
    <section className="p-6">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Bienvenido a PulgaShop
        </Typography>
      </Box>
    </section>
  );

}