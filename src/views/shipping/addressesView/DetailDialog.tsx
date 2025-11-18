import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from "@mui/material";
import type { AddressRow } from "../../../types/address";

type Props = {
  open: boolean;
  row: AddressRow | null;
  onClose: () => void;
};

export default function DetailDialog({ open, row, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle de la Dirección</DialogTitle>
      <DialogContent dividers>
        {row && (
          <Stack spacing={1.1}>
            <Typography><strong>Calle:</strong> {row.street} {row.number}</Typography>
            <Typography><strong>Comuna:</strong> {(row as any).comune ?? (row as any).communeId ?? ""}</Typography>
            <Typography><strong>Región:</strong> {(row as any).region ?? (row as any).regionId ?? ""}</Typography>
            {row.postalCode && <Typography><strong>Código Postal:</strong> {row.postalCode}</Typography>}
            {row.references && <Typography><strong>Referencias:</strong> {row.references}</Typography>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" size="small">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
