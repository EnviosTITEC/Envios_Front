import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import type { QuoteOption } from "../../../types/postal";
import type { AddressRow } from "../../../types/address";
import { labelOfAddress } from "../../../utils/addressHelpers";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  address: AddressRow | null;
  quote: QuoteOption | null;
  packageData: { weight: string; height: string; width: string; length: string; volume: string };
  creating: boolean;
  onConfirm: () => Promise<void> | void;
}

export default function ConfirmDialog({
  open,
  onClose,
  address,
  quote,
  packageData,
  creating,
  onConfirm,
}: ConfirmDialogProps) {
  const { weight, height, width, length, volume } = packageData;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 2 }}>Confirmar envío</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Dirección
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {address ? labelOfAddress(address) : "—"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Paquete
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {weight} kg | {height} × {width} × {length} cm ({volume || "0"} m³)
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Servicio
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {quote?.serviceName ?? "—"}
            </Typography>
          </Box>

          {quote && (
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: "rgba(25,103,210,.08)",
                mt: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ color: "primary.main", mt: 0.25 }}>
                ${quote.price.toLocaleString("es-CL")} CLP
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} size="small">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={creating}
          size="small"
        >
          {creating ? <CircularProgress size={20} /> : "Crear envío"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
