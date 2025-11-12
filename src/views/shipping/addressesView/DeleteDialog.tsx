import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar dirección</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          ¿Seguro que deseas eliminar esta dirección? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained" size="small">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
