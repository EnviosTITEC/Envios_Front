// src/ui/SectionHeader.tsx
import { Box, Typography, Stack } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

/**
 * Cabecera de secciones con título, subtítulo y acciones opcionales.
 * Coherente con el tema PulgaShop (espaciado, tipografía y colores).
 */
export default function SectionHeader({ title, subtitle, actions }: Props) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 4 }}
    >
      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          sx={{ lineHeight: 1.3 }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, maxWidth: 700 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {actions}
        </Box>
      )}
    </Stack>
  );
}
