import { memo } from "react";
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Typography, Stack, Tooltip, IconButton
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { alpha, styled } from "@mui/material/styles";
import type { AddressRow } from "../../../types/address";

const TableOuter = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.divider, .6)}`,
  overflow: "hidden",
}));

type Props = {
  rows: AddressRow[];
  loading?: boolean;
  onView: (row: AddressRow) => void;
  onEdit: (row: AddressRow) => void;
  onDelete: (id: string | number) => void;
};

function AddressTable({ rows, loading, onView, onEdit, onDelete }: Props) {
  return (
    <TableOuter variant="outlined">
      <Box sx={{ overflowX: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>Dirección</TableCell>
              <TableCell>Comuna</TableCell>
              <TableCell>Región</TableCell>
              <TableCell width={200}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={22} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Cargando…
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay direcciones aún
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.map((r) => {
              const rid = (r as any)._id ?? (r as any).id;
              return (
                <TableRow key={rid} hover>
                  <TableCell>{r.street} {r.number}</TableCell>
                  <TableCell>{(r as any).communeId ?? (r as any).comune ?? ""}</TableCell>
                  <TableCell>{(r as any).regionId ?? (r as any).region ?? ""}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Detalle">
                        <span>
                          <IconButton size="small" onClick={() => onView(r)}>
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <span>
                          <IconButton size="small" onClick={() => onEdit(r)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton size="small" sx={{ color: "error.main" }}
                                      onClick={() => onDelete(rid)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </TableOuter>
  );
}

export default memo(AddressTable);
