import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import AddressForm, { AddressFormValue, Region, Commune } from "../../../components/forms/AddressForm";

type Props = {
  open: boolean;
  title: string;
  value: AddressFormValue;
  onChange: (v: AddressFormValue) => void;
  onClose: () => void;
  onSave: () => void;
  disabledSave?: boolean;

  regions: Region[];
  communes: Commune[];
  onSelectRegion: (e: any, v: Region | null) => void;
  onSelectCommune: (e: any, v: Commune | null) => void;
};

export default function AddressModal(props: Props) {
  const {
    open, title, value, onChange, onClose, onSave, disabledSave,
    regions, communes,
    onSelectRegion, onSelectCommune,
  } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: 1.5 }}>
        <AddressForm
          value={value}
          onChange={onChange}
          regions={regions}
          communes={communes}
          onSelectRegion={onSelectRegion}
          onSelectCommune={onSelectCommune}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">Cancelar</Button>
        <Button onClick={onSave} variant="contained" size="small" disabled={disabledSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
