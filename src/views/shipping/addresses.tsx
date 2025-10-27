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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { alpha, styled } from "@mui/material/styles";
import {
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react";

import SectionHeader from "../../components/ui/layout/SectionHeader.tsx";
import PageCard from "../../components/ui/layout/PageCard.tsx";

import {
  getRegionsWithProvincesAndCommunes,
  PostalRegion,
  PostalProvince,
  PostalCommune,
} from "../../db/config/postal.service.ts";

import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../db/config/address.service.ts";

import type { AddressRow, NewAddress } from "../../types/address";

// --------------------------------------
// Botón suave reutilizable (editar/borrar)
// --------------------------------------
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
        boxShadow:
          "0 2px 6px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.5)",
        border: `1px solid ${alpha("#000", 0.06)}`,
        transition:
          "transform .15s ease, box-shadow .15s ease, color .15s",
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

// --------------------------------------
// Estilos tabla contenedora y scroll
// --------------------------------------
const TableOuter = styled(Paper)(() => ({
  borderRadius: 10,
  border: "0.5px solid rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

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
  "&.no-scroll::-webkit-scrollbar": { height: "0 !important" },
}));

export default function Addresses() {
  // 🔐 Usuario temporal hasta que tengamos auth real
  const userId = "1";

  // estado de carga de direcciones
  const [loading, setLoading] = useState(false);

  // direcciones en la tabla
  const [rows, setRows] = useState<AddressRow[]>([]);

  // modal crear / editar
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // modal eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  // modal detalle (ver referencias / resumen)
  const [openDetail, setOpenDetail] = useState(false);
  const [detailRow, setDetailRow] = useState<any | null>(null);

  // formulario actual
  const [form, setForm] = useState<NewAddress>({
    street: "",
    number: "",
    regionId: "",
    provinceId: "",
    communeId: "",
    postalCode: "",
    references: "",
  });

  // datos territoriales (regiones, provincias, comunas)
  const [postalLoading, setPostalLoading] = useState(false);
  const [regions, setRegions] = useState<PostalRegion[]>([]);
  const [provinces, setProvinces] = useState<PostalProvince[]>([]);
  const [communes, setCommunes] = useState<PostalCommune[]>([]);

  // manejo del scroll horizontal
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  // --------------------------------------
  // Efectos: cargar datos territoriales
  // --------------------------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPostalLoading(true);
        const data = await getRegionsWithProvincesAndCommunes();
        if (mounted) setRegions(data);
      } catch (err) {
        console.error("Error cargando regiones/provincias/comunas", err);
      } finally {
        if (mounted) setPostalLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------
  // Efectos: cargar direcciones del backend
  // --------------------------------------
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAddresses(userId);
        if (active) {
          setRows(data);
        }
      } catch (err) {
        console.error("Error cargando direcciones", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  // --------------------------------------
  // Detectar si hay overflow horizontal, para ocultar la barra si no se necesita
  // --------------------------------------
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

  // --------------------------------------
  // Helpers internos
  // --------------------------------------

  const resetForm = () =>
    setForm({
      street: "",
      number: "",
      regionId: "",
      provinceId: "",
      communeId: "",
      postalCode: "",
      references: "",
    });

  const requiredOk = useMemo(
    () =>
      form.regionId.trim() &&
      form.provinceId.trim() &&
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
      provinceId: "",
      communeId: "",
    }));

    // al seleccionar región -> cargamos provincias para esa región
    setProvinces(value?.provinces ?? []);
    // limpiamos comunas porque aún no hay provincia seleccionada
    setCommunes([]);
  };

  const handleSelectProvince = (_: any, value: PostalProvince | null) => {
    const provinceName = value?.name ?? "";

    setForm((prev) => ({
      ...prev,
      provinceId: provinceName,
      communeId: "",
    }));

    // al seleccionar provincia -> cargamos comunas de esa provincia
    setCommunes(value?.communes ?? []);
  };

  const handleSelectCommune = (_: any, value: PostalCommune | null) => {
    setForm((prev) => ({
      ...prev,
      communeId: value?.name ?? "",
    }));
  };

  // abrir modal para crear
  const handleOpenCreate = () => {
    setMode("create");
    setEditingId(null);
    resetForm();
    setProvinces([]);
    setCommunes([]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // abrir modal para editar una fila existente
  const handleOpenEdit = (row: AddressRow) => {
    setMode("edit");

    // soportar ._id (mongo) primero y si no .id
    const safeId = (row as any)._id ?? (row as any).id ?? null;
    setEditingId(safeId);

    // normalizamos nombres según lo que devuelva el backend
    const regionName =
      (row as any).regionId ??
      (row as any).region ??
      "";

    const provinceName =
      (row as any).provinceId ??
      (row as any).province ??
      "";

    const communeName =
      (row as any).communeId ??
      (row as any).comune ??
      "";

    // postalCode puede venir vacío o no venir
    const postal =
      (row as any).postalCode ??
      (row as any).postal_code ??
      "";

    // llenamos el formulario
    setForm({
      street: row.street ?? "",
      number: row.number ?? "",
      regionId: regionName,
      provinceId: provinceName,
      communeId: communeName,
      postalCode: postal,
      references: row.references ?? "",
    });

    // reconstruir cascada selects para que el modal muestre provincia / comuna correctas
    const regionMatch =
      regions.find((r) => r.name === regionName) || null;
    setProvinces(regionMatch?.provinces ?? []);

    const provinceMatch =
      regionMatch?.provinces?.find((p) => p.name === provinceName) || null;
    setCommunes(provinceMatch?.communes ?? []);

    setOpen(true);
  };

  // mostrar modal de detalle (referencias / resumen)
  const handleOpenDetail = (row: any) => {
    setDetailRow(row);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setDetailRow(null);
    setOpenDetail(false);
  };

  // abrir confirmación de eliminar
  const handleAskDelete = (id: number | string | undefined | null) => {
    if (!id) return;
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  // guardar (create o update)
  const handleSave = async () => {
    if (!requiredOk) return;
    try {
      if (mode === "create") {
        const created = await createAddress(userId, form);
        setRows((prev) => [created, ...prev]);
      } else if (mode === "edit" && editingId != null) {
        const updated = await updateAddress(editingId, form);
        setRows((prev) =>
          prev.map((r) => {
            const rid = (r as any)._id ?? (r as any).id;
            return rid === editingId ? updated : r;
          })
        );
      }

      resetForm();
      setOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error guardando dirección", err);
      setOpen(false);
    }
  };

  // confirmar eliminación
  const handleConfirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteAddress(deleteId);
      setRows((prev) =>
        prev.filter((r) => {
          const rid = (r as any)._id ?? (r as any).id;
          return rid !== deleteId;
        })
      );
    } catch (err) {
      console.error("Error eliminando dirección", err);
    } finally {
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  // --------------------------------------
  // Render
  // --------------------------------------

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
                  "& th, & td": {
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                  },
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
                    <TableCell>Provincia</TableCell>
                    <TableCell>Región</TableCell>
                    <TableCell sx={{ width: 220 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ py: 6, textAlign: "center" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Cargando...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ textAlign: "center", py: 6 }}
                      >
                        <Typography
                          variant="body1"
                          color="text.secondary"
                        >
                          No hay direcciones aún
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    rows.map((r) => {
                      const rid = (r as any)._id ?? (r as any).id;
                      return (
                        <TableRow key={rid} hover>
                          <TableCell>
                            {r.street} {r.number}
                          </TableCell>

                          <TableCell>
                            {(r as any).communeId ??
                              (r as any).comune ??
                              ""}
                          </TableCell>

                          <TableCell>
                            {(r as any).provinceId ??
                              (r as any).province ??
                              ""}
                          </TableCell>

                          <TableCell>
                            {(r as any).regionId ??
                              (r as any).region ??
                              ""}
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={1.2}>
                              {/* Ver detalle / referencias */}
                              <Tooltip title="Ver detalle">
                                <span>
                                  <SoftIconButton
                                    aria-label="Ver detalle"
                                    onClick={() => handleOpenDetail(r)}
                                    color="#1D4ED8"
                                    hoverColor="#1E40AF"
                                  >
                                    <InfoOutlinedIcon fontSize="small" />
                                  </SoftIconButton>
                                </span>
                              </Tooltip>

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
                                    onClick={() =>
                                      handleAskDelete(rid)
                                    }
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
                      );
                    })}
                </TableBody>
              </Table>
            </ScrollX>
          </TableOuter>
        </Box>
      </PageCard>

      {/* Modal crear / editar */}
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
              {mode === "create"
                ? "Nueva Dirección"
                : "Editar Dirección"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Los campos marcados con * son obligatorios
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Región */}
            <Autocomplete
              options={regions}
              loading={postalLoading}
              autoHighlight
              getOptionLabel={(opt) => opt.name}
              value={
                regions.find(
                  (r) => r.name === form.regionId
                ) ?? null
              }
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

            {/* Provincia */}
            <Autocomplete
              options={provinces}
              autoHighlight
              disabled={!form.regionId}
              getOptionLabel={(opt) => opt.name}
              value={
                provinces.find(
                  (p) => p.name === form.provinceId
                ) ?? null
              }
              onChange={handleSelectProvince}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Provincia *"
                  placeholder="Selecciona provincia"
                  fullWidth
                />
              )}
            />

            {/* Comuna */}
            <Autocomplete
              options={communes}
              autoHighlight
              disabled={!form.provinceId}
              getOptionLabel={(opt) => opt.name}
              value={
                communes.find(
                  (c) => c.name === form.communeId
                ) ?? null
              }
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

            {/* Calle + Número */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Calle *"
                placeholder="Ej: Av. Providencia"
                value={form.street}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    street: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Número *"
                placeholder="Ej: 123"
                value={form.number}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    number: e.target.value,
                  }))
                }
                sx={{ width: 160 }}
              />
            </Stack>

            {/* Código Postal */}
            <TextField
              label="Código Postal (Opcional)"
              placeholder="Ej: 750000"
              value={form.postalCode}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  postalCode: e.target.value,
                }))
              }
              fullWidth
            />

            {/* Referencias */}
            <TextField
              label="Referencias (Opcional)"
              placeholder="Ej: Edificio azul, departamento 205"
              value={form.references}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  references: e.target.value,
                }))
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
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Eliminar dirección</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            ¿Seguro que deseas eliminar esta dirección?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detalle dirección / referencias */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalle de la Dirección</DialogTitle>
        <DialogContent dividers>
          {detailRow && (
            <Stack spacing={1.5}>
              <Typography>
                <strong>Calle:</strong> {detailRow.street} {detailRow.number}
              </Typography>
              <Typography>
                <strong>Comuna:</strong>{" "}
                {(detailRow as any).comune ??
                  (detailRow as any).communeId ??
                  ""}
              </Typography>
              <Typography>
                <strong>Provincia:</strong>{" "}
                {(detailRow as any).province ??
                  (detailRow as any).provinceId ??
                  ""}
              </Typography>
              <Typography>
                <strong>Región:</strong>{" "}
                {(detailRow as any).region ??
                  (detailRow as any).regionId ??
                  ""}
              </Typography>
              {detailRow.postalCode && (
                <Typography>
                  <strong>Código Postal:</strong> {detailRow.postalCode}
                </Typography>
              )}
              {detailRow.references && (
                <Typography>
                  <strong>Referencias:</strong> {detailRow.references}
                </Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
