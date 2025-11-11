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
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { alpha, styled, useTheme } from "@mui/material/styles";
import {
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
} from "react";

import SectionHeader from "../../components/ui/layout/SectionHeader";
import PageCard from "../../components/ui/layout/PageCard";

import {
  getRegionsWithProvincesAndCommunes,
  PostalRegion,
  PostalProvince,
  PostalCommune,
} from "../../db/config/postal.service";

import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../db/config/address.service";

import type { AddressRow, NewAddress } from "../../types/address";

import AddressForm, {
  Region,
  Province,
  Commune,
  AddressFormValue,
} from "../../components/shipping/AddressForm";

import {
  RADIUS,
  SUBTLE_BORDER,
  SoftIconButton,
} from "../../components/ui/formPrimitives";

/* Tabla + scroll */

const TableOuter = styled(Paper)(({ theme }) => ({
  borderRadius: RADIUS,
  border: SUBTLE_BORDER(theme),
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

const ScrollX = styled("div")(() => ({
  overflowX: "auto",
  overflowY: "hidden",
  paddingBottom: 8,
  WebkitOverflowScrolling: "touch",
  "&::-webkit-scrollbar": { height: 8 },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: 999,
  },
  "&.no-scroll::-webkit-scrollbar": { height: 0 },
}));

/* Map postal->tipos del form */

const mapPostalToRegions = (data: PostalRegion[]): Region[] =>
  data.map((r) => ({
    name: r.name,
    provinces:
      r.provinces?.map((p: PostalProvince) => ({
        name: p.name,
        communes:
          p.communes?.map((c: PostalCommune) => ({
            name: c.name,
          })) ?? [],
      })) ?? [],
  }));

export default function Addresses() {
  const theme = useTheme();

  // TODO: reemplazar con userId real (auth)
  const userId = "1";

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AddressRow[]>([]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailRow, setDetailRow] = useState<AddressRow | null>(null);

  const [form, setForm] = useState<AddressFormValue>({
    street: "",
    number: "",
    regionId: "",
    provinceId: "",
    communeId: "",
    postalCode: "",
    references: "",
  });

  const [postalLoading, setPostalLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  /* Cargar regiones/provincias/comunas */

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPostalLoading(true);
        const data = await getRegionsWithProvincesAndCommunes();
        if (mounted) setRegions(mapPostalToRegions(data));
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

  /* Cargar direcciones */

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAddresses(userId);
        if (active) setRows(data);
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

  /* Detectar overflow horizontal */

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

  /* Helpers */

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

  /* Handlers territorio (form cascada) */

  const handleSelectRegion = (_: any, value: Region | null) => {
    const regionName = value?.name ?? "";
    setForm((prev) => ({
      ...prev,
      regionId: regionName,
      provinceId: "",
      communeId: "",
    }));
    setProvinces(value?.provinces ?? []);
    setCommunes([]);
  };

  const handleSelectProvince = (_: any, value: Province | null) => {
    const provinceName = value?.name ?? "";
    setForm((prev) => ({
      ...prev,
      provinceId: provinceName,
      communeId: "",
    }));
    setCommunes(value?.communes ?? []);
  };

  const handleSelectCommune = (_: any, value: Commune | null) => {
    setForm((prev) => ({
      ...prev,
      communeId: value?.name ?? "",
    }));
  };

  /* Abrir / cerrar modales */

  const handleOpenCreate = () => {
    setMode("create");
    setEditingId(null);
    resetForm();
    setProvinces([]);
    setCommunes([]);
    setOpen(true);
  };

  const handleOpenEdit = (row: AddressRow) => {
    setMode("edit");
    const safeId = (row as any)._id ?? (row as any).id ?? null;
    setEditingId(safeId);

    const regionName =
      (row as any).regionId ?? (row as any).region ?? "";
    const provinceName =
      (row as any).provinceId ?? (row as any).province ?? "";
    const communeName =
      (row as any).communeId ?? (row as any).comune ?? "";
    const postal =
      (row as any).postalCode ?? (row as any).postal_code ?? "";

    setForm({
      street: row.street ?? "",
      number: row.number ?? "",
      regionId: regionName,
      provinceId: provinceName,
      communeId: communeName,
      postalCode: postal,
      references: row.references ?? "",
    });

    const regionMatch = regions.find((r) => r.name === regionName) || null;
    setProvinces(regionMatch?.provinces ?? []);
    const provinceMatch =
      regionMatch?.provinces?.find((p) => p.name === provinceName) || null;
    setCommunes(provinceMatch?.communes ?? []);

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenDetail = (row: AddressRow) => {
    setDetailRow(row);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setDetailRow(null);
    setOpenDetail(false);
  };

  const handleAskDelete = (id: number | string | undefined | null) => {
    if (!id) return;
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  /* Guardar / eliminar */

  const handleSave = async () => {
    if (!requiredOk) return;

    const payload: NewAddress = {
      street: form.street,
      number: form.number,
      regionId: form.regionId,
      provinceId: form.provinceId,
      communeId: form.communeId,
      postalCode: form.postalCode || "",
      references: form.references || "",
    };

    try {
      if (mode === "create") {
        const created = await createAddress(userId, payload);
        setRows((prev) => [created, ...prev]);
      } else if (mode === "edit" && editingId != null) {
        const updated = await updateAddress(editingId, payload);
        setRows((prev) =>
          prev.map((r) => {
            const rid = (r as any)._id ?? (r as any).id;
            return rid === editingId ? updated : r;
          })
        );
      }

      resetForm();
      setEditingId(null);
      setOpen(false);
    } catch (err) {
      console.error("Error guardando dirección", err);
      setOpen(false);
    }
  };

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

  /* Render */

  return (
  <Box sx={{ px: { xs: 2, md: 0 }, pt: 1, pb: 8 }}>
    {/* Wrapper con margen inferior REAL para separar de la siguiente sección */}
    <Box sx={{ mb: 8 }}>
      <PageCard>
        <SectionHeader
          title="Mis direcciones"
          subtitle="Añade y administra tus direcciones de envío."
          actions={
            <Button
              onClick={handleOpenCreate}
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              size="small"
              sx={{ borderRadius: RADIUS }}
            >
              Nueva dirección
            </Button>
          }
        />

        <Box sx={{ mt: 2, pb: 3 }}>
          <TableOuter elevation={0}>
            <ScrollX
              ref={scrollRef}
              className={hasOverflow ? undefined : "no-scroll"}
            >
              <Table
                stickyHeader
                sx={{
                  minWidth: 900,
                  "& th, & td": {
                    whiteSpace: "nowrap",
                    borderBottom: "none",
                    px: 2,
                    py: 1.5,
                    fontSize: 14,
                  },
                  "& .MuiTableCell-stickyHeader": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                  },
                  "& tbody tr:not(:first-of-type) td": {
                    borderTop: `1px dashed ${alpha(
                      theme.palette.divider,
                      0.35
                    )}`,
                  },
                  "& tbody tr:hover td": {
                    backgroundColor: alpha(
                      theme.palette.primary.main,
                      0.04
                    ),
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
                        <CircularProgress size={22} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Cargando…
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
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Ver detalle">
                                <span>
                                  <SoftIconButton
                                    aria-label="Ver detalle"
                                    onClick={() => handleOpenDetail(r)}
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
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </SoftIconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <span>
                                  <SoftIconButton
                                    aria-label="Eliminar"
                                    onClick={() => handleAskDelete(rid)}
                                    sx={{ color: "#DC2626" }}
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
    </Box>

    {/* ==== Dialog: crear / editar ==== */}
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {mode === "create" ? "Nueva Dirección" : "Editar Dirección"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Los campos marcados con * son obligatorios
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 2 }}>
        <AddressForm
          value={form}
          onChange={setForm}
          loadingPostal={postalLoading}
          regions={regions}
          provinces={provinces}
          communes={communes}
          onSelectRegion={handleSelectRegion}
          onSelectProvince={handleSelectProvince}
          onSelectCommune={handleSelectCommune}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          borderTop: SUBTLE_BORDER(theme),
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!requiredOk}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>

    {/* ==== Dialog: confirmar eliminación ==== */}
    <Dialog
      open={openDelete}
      onClose={handleCloseDelete}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Eliminar dirección</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          ¿Seguro que deseas eliminar esta dirección? Esta acción no se puede
          deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleCloseDelete}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirmDelete}
          color="error"
          variant="contained"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>

    {/* ==== Dialog: detalle dirección ==== */}
    <Dialog
      open={openDetail}
      onClose={handleCloseDetail}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Detalle de la Dirección</DialogTitle>
      <DialogContent dividers>
        {detailRow && (
          <Stack spacing={1.25} sx={{ "& strong": { fontWeight: 700 } }}>
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
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}