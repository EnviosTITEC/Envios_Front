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
                p: 0,
                mr: 0.5,
                bgcolor: "transparent",
                border: "none",
                borderRadius: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 25,
                  color: (t: any) => t.palette.text.secondary,
                  transition: "color 0.2s ease",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: (t: any) => t.palette.primary.main,
                },
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "transparent",
                },
              },
            },
            clearIndicator: {
              sx: {
                p: 0,
                mr: 0.5,
                bgcolor: "transparent",
                border: "none",
                borderRadius: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                  transition: "color 0.2s ease",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: (t: any) => t.palette.primary.main,
                },
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "transparent",
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
