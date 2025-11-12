// src/views/shipping/Quote/AddressPicker.tsx
import { Stack, Autocomplete, TextField, Button, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AddressPicker(props: {
  options: { label: string; value: any }[];
  selected: any | null;
  onChange: (addr: any | null) => void;
  onOpenNew: () => void;
  originCode: string;
  destLabel: string;
}) {
  const { options, selected, onChange, onOpenNew, originCode, destLabel } = props;

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={(o) => o.label}
          value={selected}
          onChange={(_, v) => onChange(v?.value || null)}
          slotProps={{
            popupIndicator: {
              sx: {
                p: "6px 8px",
                mr: 0.75,
                bgcolor: "transparent",
                border: `1px solid`,
                borderColor: (t: any) => t.palette.divider,
                borderRadius: 0,
                boxShadow: "0 6px 6px rgba(15,23,42,.08)",
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                },
                "&:hover": {
                  bgcolor: (t: any) => t.palette.action.hover,
                  borderColor: (t: any) => t.palette.primary.main,
                  boxShadow: "0 8px 10px rgba(15,23,42,.14)",
                },
              },
            },
            clearIndicator: {
              sx: {
                p: "6px 8px",
                mr: 0.25,
                bgcolor: "transparent",
                border: `1px solid`,
                borderColor: (t: any) => t.palette.divider,
                borderRadius: 0,
                boxShadow: "0 6px 6px rgba(15,23,42,.08)",
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                },
                "&:hover": {
                  bgcolor: (t: any) => t.palette.action.hover,
                  borderColor: (t: any) => t.palette.primary.main,
                  boxShadow: "0 8px 10px rgba(15,23,42,.14)",
                },
              },
            },
          }}
          renderInput={(p) => <TextField {...p} size="small" placeholder="Selecciona una dirección" />}
        />
        <Button
          onClick={onOpenNew}
          startIcon={<AddIcon />}
          variant="contained"
          size="small"
          sx={{ borderRadius: 1, textTransform: "none", fontWeight: 600 }}
        >
          Agregar
        </Button>
      </Stack>

      <Stack direction="row" spacing={1.2} sx={{ mt: 1 }}>
        <Chip size="small" label={`Origen: ${originCode}`} />
        <Chip size="small" label={`Destino: ${destLabel}`} />
      </Stack>
    </>
  );
}
