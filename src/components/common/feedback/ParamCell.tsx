// src/components/common/feedback/ParamCell.tsx
import { Box, TextField, Typography } from "@mui/material";

type Props = {
  label: string;
  unit: string;
  value: string | number;
  onChange?: (v: string) => void;
  readOnly?: boolean;
};

export default function ParamCell({ label, unit, value, onChange, readOnly }: Props) {
  return (
    <Box sx={(t) => ({ border: `1px solid ${t.palette.divider}`, borderRadius: 1, p: 0.5 })}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: "block" }}>
        {label}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", columnGap: 1 }}>
        <TextField
          size="small"
          type="number"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          inputProps={{ readOnly, min: 0, step: "0.1" }}
          sx={{
            "& .MuiInputBase-root": { height: 28 },
            "& .MuiInputBase-input": { textAlign: "center", padding: "4px 6px", fontSize: "0.875rem" },
          }}
          fullWidth
        />
        <Typography color="text.secondary" sx={{ fontSize: "0.75rem" }}>{unit}</Typography>
      </Box>
    </Box>
  );
}
