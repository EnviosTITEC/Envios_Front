// src/views/shipping/Quote/QuoteList.tsx
import { Box, FormControlLabel, Radio, RadioGroup, Stack, Typography, Divider, Button } from "@mui/material";
import type { QuoteOption } from "../../../types/postal";

export default function QuoteList(props: {
  quotes: QuoteOption[];
  selected: QuoteOption | null;
  onSelect: (q: QuoteOption | null) => void;
  onConfirm: () => void;
  disabledConfirm?: boolean;
}) {
  const { quotes, selected, onSelect, onConfirm, disabledConfirm } = props;

  if (!quotes.length) {
    return (
      <Box sx={(t) => ({ p: 2.8, textAlign: "center", borderRadius: 2, border: `1px solid ${t.palette.divider}`, bgcolor: "action.hover" })}>
        <Typography variant="body2" color="text.secondary">Completa el formulario y calcula una cotización.</Typography>
      </Box>
    );
  }

  return (
    <>
      <RadioGroup
        value={selected?.serviceCode ?? ""}
        onChange={(_, v) => {
          const found = quotes.find((q) => q.serviceCode === v);
          if (found) onSelect(found);
          else onSelect(null);
        }}
      >
        {quotes.map((q) => (
          <Box
            key={q.serviceCode}
            sx={(t) => ({
              display: "flex", alignItems: "center", justifyContent: "space-between",
              p: 1.1, mb: 1, borderRadius: 2,
              border: `1.5px solid ${selected?.serviceCode === q.serviceCode ? t.palette.primary.main : t.palette.divider}`,
              bgcolor: selected?.serviceCode === q.serviceCode ? "rgba(25,103,210,.06)" : "background.paper",
              cursor: "pointer"
            })}
            onClick={() => onSelect(q)}
          >
            <FormControlLabel
              value={q.serviceCode}
              control={<Radio />}
              label={
                <Stack spacing={0.25}>
                  <Typography fontWeight={700}>{q.serviceName}</Typography>
                  <Typography variant="body2" color="text.secondary">{q.etaDescription ?? "Tiempo de entrega según carrier"}</Typography>
                </Stack>
              }
              sx={{ m: 0 }}
            />
            <Typography fontWeight={800}>{q.currency} {q.price.toLocaleString("es-CL")}</Typography>
          </Box>
        ))}
      </RadioGroup>

      <Divider sx={{ my: 1.25 }} />
      <Button variant="contained" fullWidth onClick={onConfirm} disabled={disabledConfirm}>Confirmar</Button>
    </>
  );
}
