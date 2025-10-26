// addresses.tsx
import {
  Box,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Autocomplete,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { alpha, styled } from "@mui/material/styles";
import {
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import SectionHeader from "../../components/SectionHeader";
import PageCard from "../../components/PageCard";
import {
  getRegionsWithCommunes,
  PostalRegion,
  PostalCommune,
} from "../../db/config/postal.service.ts";

/* Tipos */
export interface AddressRow {
  id: number;
  street: string;
  number: string;
  communeId: string;
  regionId: string;
  postalCode?: string;
  references?: string;
}
type NewAddress = Omit<AddressRow, "id">;

/* Botón “soft” para acciones */
function SoftIconButton({
  color = "#111827",
  hoverColor,
  onClick,
  "aria-label": ariaLabel,
  children,
}: {
  color?: string;
  hoverColor?: string;
  onClick?: () => void;
  "aria-label"?: string;
  children: ReactNode;
}) {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={onClick}
      sx={(theme) => ({
        width: 36,
        height: 36,
        borderRadius: 2,
        bgcolor: "#ffffff",
        color,
        boxShadow: "0 2px 6px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.5)",
        border: `1px solid ${alpha("#000", 0.06)}`,
        transition: "transform .15s ease, box-shadow .15s ease, color .15s",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 6px 12px rgba(0,0,0,.12)",
          color: hoverColor ?? color,
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
        },
        "&:active": { transform: "none" },
      })}
    >
      {children}
    </IconButton>
  );
}

/* Paper externo: controla borde/sombra y hace que el radio calce */
const TableOuter = styled(Paper)(() => ({
  borderRadius: 10,
  border: "0.5px solid rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));
/* Contenedor con scroll horizontal. Si no hay overflow, ocultamos el scrollbar */
const ScrollX = styled("div")(() => ({
  overflowX: "auto",
  overflowY: "hidden",
  paddingBottom: 10,
  WebkitOverflowScrolling: "touch",
  "&::-webkit-scrollbar": { height: 8 },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
    borderRadius: 9999,
    margin: "0 6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(90,127,120,0.35)",
    borderRadius: 100,
  },
  /* cuando no hay overflow, no mostramos barra (ni línea) */
  "&.no-scroll::-webkit-scrollbar": { height: "0 !important" },
}));

export default function Addresses() {
  const [loading] = useState(false);
  const [rows, setRows] = useState<AddressRow[]>([]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState<NewAddress>({
    street: "",
    number: "",
    communeId: "",
    regionId: "",
    postalCode: "",
    references: "",
  });

  const [postalLoading, setPostalLoading] = useState(false);
  const [regions, setRegions] = useState<PostalRegion[]>([]);
  const [communes, setCommunes] = useState<PostalCommune[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPostalLoading(true);
        const data = await getRegionsWithCommunes();
        if (mounted) setRegions(data);
      } finally {
        if (mounted) setPostalLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const resetForm = () =>
    setForm({
      street: "",
      number: "",
      communeId: "",
      regionId: "",
      postalCode: "",
      references: "",
    });

  const requiredOk = useMemo(
    () =>
      form.regionId.trim() &&
      form.communeId.trim() &&
      form.street.trim() &&
      form.number.trim(),
    [form]
  );

  const handleSelectRegion = (_: any, value: PostalRegion | null) => {
    const regionName = value?.name ?? "";
    setForm((prev) => ({
      ...prev,
      regionId: regionName,
      communeId: "",
    }));
    setCommunes(value?.communes ?? []);
  };

  const handleSelectCommune = (_: any, value: PostalCommune | null) => {
    setForm((prev) => ({
      ...prev,
      communeId: value?.name ?? "",
    }));
  };

  const handleOpenCreate = () => {
    setMode("create");
    setEditingId(null);
    resetForm();
    setCommunes([]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!requiredOk) return;
    try {
      if (mode === "create") {
        const created: AddressRow = { id: Date.now(), ...form };
        setRows((prev) => [created, ...prev]);
      } else if (mode === "edit" && editingId != null) {
        setRows((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
        );
      }
      resetForm();
      setOpen(false);
      setEditingId(null);
    } catch {
      setOpen(false);
    }
  };

  const handleOpenEdit = (row: AddressRow) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      street: row.street,
      number: row.number,
      communeId: row.communeId,
      regionId: row.regionId,
      postalCode: row.postalCode ?? "",
      references: row.references ?? "",
    });
    const region = regions.find((r) => r.name === row.regionId) || null;
    setCommunes(region?.communes ?? []);
    setOpen(true);
  };

  const handleAskDelete = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleConfirmDelete = async () => {
    if (deleteId == null) return;
    setRows((prev) => prev.filter((r) => r.id !== deleteId));
    setOpenDelete(false);
    setDeleteId(null);
  };

  // ------------ esconder barra si no hay overflow ------------
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);
  // -----------------------------------------------------------

  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <PageCard>
        <SectionHeader
          title="Mis direcciones"
          subtitle="Aquí podrás añadir y gestionar tus direcciones."
          actions={
            <Button
              onClick={handleOpenCreate}
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              size="small"
            >
              Nueva dirección
            </Button>
          }
        />

        <Box sx={{ mt: 2 }}>
          <TableOuter elevation={0}>
            <ScrollX
              ref={scrollRef}
              className={hasOverflow ? undefined : "no-scroll"}
            >
              <Table
                stickyHeader
                sx={{
                  minWidth: 900,
                  tableLayout: "auto",
                  "& th, & td": { whiteSpace: "nowrap", borderBottom: "none" },
                  "& .MuiTableCell-stickyHeader": {
                    backgroundColor: "#5A7F78",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "none",
                    borderBottom: "none",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Comuna</TableCell>
                    <TableCell>Región</TableCell>
                    <TableCell sx={{ width: 180 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ py: 6, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Cargando...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center", py: 6 }}>
                        <Typography variant="body1" color="text.secondary">
                          No hay direcciones aún
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    rows.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell>
                          {r.street} {r.number}
                        </TableCell>
                        <TableCell>{r.communeId}</TableCell>
                        <TableCell>{r.regionId}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.2}>
                            <Tooltip title="Editar">
                              <span>
                                <SoftIconButton
                                  aria-label="Editar"
                                  onClick={() => handleOpenEdit(r)}
                                  color="#111827"
                                  hoverColor="#111827"
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </SoftIconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <span>
                                <SoftIconButton
                                  aria-label="Eliminar"
                                  onClick={() => handleAskDelete(r.id)}
                                  color="#DC2626"
                                  hoverColor="#B91C1C"
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </SoftIconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollX>
          </TableOuter>
        </Box>
      </PageCard>

      {/* Diálogo crear/editar */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Box>
            <Typography variant="h6">
              {mode === "create" ? "Nueva Dirección" : "Editar Dirección"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Los campos marcados con * son obligatorios
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={regions}
              loading={postalLoading}
              autoHighlight
              getOptionLabel={(opt) => opt.name}
              value={regions.find((r) => r.name === form.regionId) ?? null}
              onChange={handleSelectRegion}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Región *"
                  placeholder="Selecciona región"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              options={communes}
              autoHighlight
              disabled={!form.regionId}
              getOptionLabel={(opt) => opt.name}
              value={communes.find((c) => c.name === form.communeId) ?? null}
              onChange={handleSelectCommune}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Comuna *"
                  placeholder="Selecciona comuna"
                  fullWidth
                />
              )}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Calle *"
                placeholder="Ej: Av. Providencia"
                value={form.street}
                onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Número *"
                placeholder="Ej: 123"
                value={form.number}
                onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
                sx={{ width: 160 }}
              />
            </Stack>
            <TextField
              label="Código Postal (Opcional)"
              placeholder="Ej: 750000"
              value={form.postalCode}
              onChange={(e) =>
                setForm((p) => ({ ...p, postalCode: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Referencias (Opcional)"
              placeholder="Ej: Edificio azul, departamento 205"
              value={form.references}
              onChange={(e) =>
                setForm((p) => ({ ...p, references: e.target.value }))
              }
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="success"
            disabled={!requiredOk}
          >
            {mode === "create" ? "Guardar" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de eliminación */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar dirección</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Seguro que deseas eliminar esta dirección? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
