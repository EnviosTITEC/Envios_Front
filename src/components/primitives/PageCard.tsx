// src/components/primitives/PageCard.tsx
import { Card, CardContent } from "@mui/material";

type Props = { children: React.ReactNode; sx?: object };

export default function PageCard({ children, sx }: Props) {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        // Apariencia clara y definida
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        bgcolor: theme.palette.background.paper,
        // borde sutil + sombra visible
        border: `1px solid rgba(16,24,40,0.08)`,
        boxShadow: "0 8px 24px rgba(16,24,40,0.06)",

        // 🔒 sin efecto "botón"
        transition: "none !important",
        "&:hover": {
          transform: "none !important",
          boxShadow: "0 8px 24px rgba(16,24,40,0.06) !important",
          backgroundColor: theme.palette.background.paper + " !important",
        },

        "&.MuiPaper-rounded": { borderRadius: "12px !important" },
        ...sx,
      })}
    >
      <CardContent sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        {children}
      </CardContent>
    </Card>
  );
}
