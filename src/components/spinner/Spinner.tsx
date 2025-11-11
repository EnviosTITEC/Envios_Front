// src/components/spinner/Spinner.tsx
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

type SpinnerProps = {
  fullPage?: boolean;
  message?: string;
  size?: number;
};

export default function Spinner({ fullPage = false, message, size = 48 }: SpinnerProps) {
  if (fullPage) {
    return (
      <Backdrop open sx={{ color: "primary.main", zIndex: (t) => t.zIndex.modal + 1 }}>
        <Box sx={{ display: "grid", placeItems: "center", gap: 1.5 }}>
          <CircularProgress size={size} />
          {message && <Typography variant="body2">{message}</Typography>}
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box sx={{ minHeight: 120, display: "grid", placeItems: "center", p: 2 }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
