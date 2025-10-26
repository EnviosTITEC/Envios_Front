// PageCard.tsx
import { Card, CardContent } from "@mui/material";

type Props = { children: React.ReactNode; sx?: object };

export default function PageCard({ children, sx }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 10,
        overflow: "hidden",          // recorta ripple/contenido
        position: "relative",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        bgcolor: "#fff",
        "&.MuiPaper-rounded": { borderRadius: "10px !important" },
        ...sx,
      }}
      elevation={0}
    >
      <CardContent sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        {children}
      </CardContent>
    </Card>
  );
}
