import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AddressForm from "../../../components/forms/AddressForm";
import type { AddressFormValue, Region, Commune } from "../../../components/forms/AddressForm";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  value: AddressFormValue;
  onChange: (v: AddressFormValue) => void;
  regions: Region[];
  communes: Commune[];
  onSelectRegion: (region: Region | null) => void;
  onSelectCommune: (commune: Commune | null) => void;
}

export default function AddressModal({
  open,
  onClose,
  onSave,
  value,
  onChange,
  regions,
  communes,
  onSelectRegion,
  onSelectCommune,
}: AddressModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 2 }}>Agregar dirección</DialogTitle>
      <DialogContent sx={{ pt: 1.5, pb: 2 }}>
        <AddressForm
          value={value}
          onChange={onChange}
          regions={regions}
          communes={communes}
          onSelectRegion={(_, v) => onSelectRegion(v)}
          onSelectCommune={(_, v) => onSelectCommune(v)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <Button onClick={onClose} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          size="small"
          disabled={!value.street || !value.number || !value.communeId}
          sx={{ borderRadius: 2 }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
