// SectionHeader.tsx
import { Box, Typography } from "@mui/material";

type Props = { title: string; subtitle?: string; actions?: React.ReactNode };

export default function SectionHeader({ title, subtitle, actions }: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>{actions}</Box>}
    </Box>
  );
}
