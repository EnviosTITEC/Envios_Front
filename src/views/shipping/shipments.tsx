import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";

import PageCard from "../../components/primitives/PageCard";
import SectionHeader from "../../components/primitives/SectionHeader";
import NavigationButtons from "../../components/common/NavigationButtons";
import { getUserDeliveries, deleteDelivery } from "../../db/config/postal.service";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const USER_ID = "user_456"; // Usuario actual

// Define los estados posibles
const DELIVERY_STATUSES = {
  PREPARANDO: "Preparando",
  EN_TRANSITO: "EnTransito",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  DEVUELTO: "Devuelto",
};

interface DeliveryItem {
  id: string;
  trackingNumber: string;
  status: string;
  shippingInfo?: {
    estimatedCost: number;
    serviceType: string;
    originAddressId: string;
    destinationAddressId: string;
    street?: string;
    number?: string;
  };
  package?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  items: { name: string; quantity: number; price: number }[];
  selectedOption?: {
    serviceName: string;
    etaDescription?: string;
  };
  destinationAddress?: {
    street: string;
    number: string;
    communeName: string;
    regionId: string;
  };
  createdAt?: string;
}

// Definir un tipo para los errores
interface ApiError {
  response?: { status: number };
  message?: string;
}

export default function Shipments() {
  const [searchParams] = useSearchParams();
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadDeliveries() {
      try {
        setLoading(true);
        setError("");
        const data = await getUserDeliveries(USER_ID);
        setDeliveries(data || []);
      } catch (err: unknown) {
        setError("No se pudieron cargar los envíos desde la base de datos.");
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    }
    loadDeliveries();
  }, [searchParams]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "entregado":
        return <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 28 }} />;
      case "enviado":
      case "entransito":
      case "en tránsito":
        return <LocalShippingIcon sx={{ color: "#00bcd4", fontSize: 28, animation: 'shake 0.7s infinite' }} />;
      case "preparando":
        return <PendingIcon sx={{ color: "#ffc107", fontSize: 28 }} />;
      case "cancelado":
        return <ErrorIcon sx={{ color: "#f44336", fontSize: 28 }} />;
      case "devuelto":
        return <ErrorIcon sx={{ color: "#9c27b0", fontSize: 28 }} />;
      default:
        return <PendingIcon sx={{ color: "#9e9e9e", fontSize: 28 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "preparando":
        return "warning";
      case "enviado":
      case "entransito":
      case "en tránsito":
        return "info";
      case "entregado":
        return "success";
      case "cancelado":
        return "error";
      case "devuelto":
        return "secondary";
      default:
        return "default";
    }
  };

  const getProgressValue = (status: string) => {
    switch (status?.toLowerCase()) {
      case "preparando":
        return 25;
      case "enviado":
      case "entransito":
      case "en tránsito":
        return 75;
      case "entregado":
        return 100;
      case "cancelado":
        return 0;
      case "devuelto":
        return 10;
      default:
        return 0;
    }
  };

  const handleOpenDetails = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery);
    setSelectedStatusValue((delivery.status || "").toLowerCase());
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDelivery(null);
  };

  const handleDeleteDelivery = async () => {
    if (!selectedDelivery) {
      setError("No se pudo identificar el envío. Por favor intente nuevamente.");
      return;
    }
    const deliveryId = (selectedDelivery as any)._id || selectedDelivery.id || selectedDelivery.trackingNumber;
    if (!deliveryId) {
      setError("No se pudo identificar el envío. Por favor intente nuevamente.");
      return;
    }
    try {
      await deleteDelivery(deliveryId);
      // Recargar desde la base de datos
      const data = await getUserDeliveries(USER_ID);
      setDeliveries(data || []);
      setSuccessMsg("Envío eliminado exitosamente");
      setTimeout(() => setSuccessMsg(""), 3000);
      handleCloseDetails();
    } catch (err: unknown) {
      const status = (err as ApiError)?.response?.status;
      if (status === 404) {
        setError("No existe el envío en el servidor (404).");
        handleCloseDetails();
      } else if (status && status >= 500) {
        setError("Error del servidor. Intente más tarde.");
      } else {
        setError((err as ApiError)?.message || "Error al eliminar envío");
      }
    }
  };

  const handleUpdateStatus = async (newStatus?: string) => {
    if (!selectedDelivery || !selectedDelivery.trackingNumber) {
      console.error("No se encontró el envío seleccionado o su número de tracking.");
      return;
    }

    setUpdating(true);
    try {
      // Actualizar en backend
      const API_BASE = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${API_BASE}/deliveries/tracking/${selectedDelivery.trackingNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del envío");
      }

      const updatedDelivery = await response.json();

      // Actualizar el estado local del envío seleccionado
      setSelectedDelivery((prev) => ({
        ...prev!,
        status: updatedDelivery.estado as DeliveryItem["status"],
      }));

      // Actualizar la lista de envíos en memoria
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.trackingNumber === selectedDelivery.trackingNumber
            ? { ...delivery, status: updatedDelivery.estado }
            : delivery
        )
      );



      setSuccessMsg("Estado actualizado correctamente");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (error) {
      console.error("Error en la solicitud PATCH:", error);
      alert("Hubo un problema al actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 1 }, py: 1, mb: 80 }}>
      <NavigationButtons />
      <PageCard>
        <SectionHeader
          title="Mis Envíos (admin)"
          subtitle="Consulta el estado y detalles de todos tus envíos"
          actions={null}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 6 }}>
            <CircularProgress size={50} />
          </Box>
        ) : deliveries.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <LocalShippingIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
              No tienes envíos registrados aún
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Crea tu primer envío desde la sección de Cotización
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: -3, mb: 3}}>
            {deliveries.map((delivery) => (
              <Grid item xs={12} key={delivery.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    border: "2px solid #22c55e",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
                      borderColor: "#16a34a",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, pb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Icono y tracking */}
                      <Grid item xs={12} sm="auto">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {getStatusIcon(delivery.status)}
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                            >
                              Tracking
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#1976d2",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                fontFamily: "monospace",
                              }}
                            >
                              {delivery.trackingNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Estado y costo */}
                      <Grid item xs={6} sm={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Estado
                          </Typography>
                          <Chip
                            label={delivery.status || "Desconocido"}
                            color={getStatusColor(delivery.status)}
                            size="small"
                            sx={{ mt: 0.5, fontWeight: 600 }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Costo
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "1.1rem",
                              color: "#2e7d32",
                              mt: 0.5,
                            }}
                          >
                            ${delivery.shippingInfo?.estimatedCost?.toLocaleString() || "—"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Servicio
                          </Typography>
                          <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
                            {delivery.shippingInfo?.serviceType || "—"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Items
                          </Typography>
                          <Chip
                            label={`${delivery.items?.length || 0} producto(s)`}
                            variant="outlined"
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetails(delivery)}
                          startIcon={<MoreVertIcon />}
                        >
                          Detalles
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Barra de progreso */}
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Progreso de envío
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {getProgressValue(delivery.status)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressValue(delivery.status)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#e0e0e0",
                          transition: 'all 0.7s cubic-bezier(.4,2,.6,1)',
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            transition: 'all 0.7s cubic-bezier(.4,2,.6,1)',
                            backgroundColor:
                              delivery.status?.toLowerCase() === "entregado"
                                ? "#4caf50"
                                : delivery.status?.toLowerCase() === "enviado" || delivery.status?.toLowerCase() === "entransito" || delivery.status?.toLowerCase() === "en tránsito"
                                  ? "#00bcd4"
                                : delivery.status?.toLowerCase() === "preparando"
                                  ? "#ffc107"
                                : delivery.status?.toLowerCase() === "cancelado"
                                  ? "#f44336"
                                : delivery.status?.toLowerCase() === "devuelto"
                                  ? "#9c27b0"
                                  : "#9e9e9e",
                          },
                        }}
                      />
                    </Box>

                    {/* Información adicional */}
                    <Box sx={{ mt: 2, pt: 2, pb: 2, borderTop: "1px solid #e0e0e0" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Peso
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>
                            {delivery.package?.weight || "—"} kg
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Dimensiones
                          </Typography>
                          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                            {delivery.package?.length || "—"}L × {delivery.package?.width || "—"}A ×{" "}
                            {delivery.package?.height || "—"}H cm
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Fecha de creación
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>
                            {delivery.createdAt
                              ? new Date(delivery.createdAt).toLocaleDateString("es-CL", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </PageCard>

      {/* Modal de detalles */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 2, fontSize: "1.4rem", borderBottom: "2px solid #22c55e" }}>
          Detalles del Envío
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>
          )}
          {selectedDelivery && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Tracking Number */}
              <Box sx={{ mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: 1.5, border: "1px solid #e0e0e0" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  NÚMERO DE TRACKING
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                    color: "#22c55e",
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {selectedDelivery.trackingNumber}
                </Typography>
              </Box>

              {/* Estado y Actualizar */}
              <Box>
                <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                      ESTADO ACTUAL
                    </Typography>
                    <Chip
                      label={selectedDelivery.status || "Desconocido"}
                      color={getStatusColor(selectedDelivery.status)}
                      size="medium"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                      ACTUALIZAR ESTADO
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status-select-label">Cambiar estado</InputLabel>
                      <Select
                        labelId="status-select-label"
                        label="Cambiar estado"
                        value={selectedStatusValue}
                        onChange={(e) => setSelectedStatusValue(String(e.target.value))}
                      >
                        <MenuItem value={DELIVERY_STATUSES.PREPARANDO}>{DELIVERY_STATUSES.PREPARANDO}</MenuItem>
                        <MenuItem value={DELIVERY_STATUSES.EN_TRANSITO}>{DELIVERY_STATUSES.EN_TRANSITO}</MenuItem>
                        <MenuItem value={DELIVERY_STATUSES.ENTREGADO}>{DELIVERY_STATUSES.ENTREGADO}</MenuItem>
                        <MenuItem value={DELIVERY_STATUSES.CANCELADO}>{DELIVERY_STATUSES.CANCELADO}</MenuItem>
                        <MenuItem value={DELIVERY_STATUSES.DEVUELTO}>{DELIVERY_STATUSES.DEVUELTO}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>

              {/* Información General 2x2 */}
              <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1.5, border: "1px solid #e8e8e8" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
                  INFORMACIÓN GENERAL
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Transportista
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        Chilexpress
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Tipo de Servicio
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedDelivery.shippingInfo?.serviceType || "—"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Costo Estimado
                      </Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#22c55e", mt: 0.5 }}>
                        ${selectedDelivery.shippingInfo?.estimatedCost?.toLocaleString() || "—"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Peso
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedDelivery.package?.weight || "—"} kg
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Dimensiones del Paquete */}
              <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1.5, border: "1px solid #e8e8e8" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
                  DIMENSIONES DEL PAQUETE
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Peso
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedDelivery.package?.weight || "—"} kg
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Largo
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedDelivery.package?.length || "—"} cm
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Ancho
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedDelivery.package?.width || "—"} cm
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Alto
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedDelivery.package?.height || "—"} cm
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Fechas */}
              <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1.5, border: "1px solid #e8e8e8" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
                  FECHAS
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Fecha de Creación
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5, fontSize: "0.95rem" }}>
                        {selectedDelivery.createdAt
                          ? new Date(selectedDelivery.createdAt).toLocaleDateString("es-CL", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Entrega Estimada
                      </Typography>
                      <Typography sx={{ fontWeight: 500, mt: 0.5, fontSize: "0.95rem" }}>
                        {selectedDelivery.selectedOption?.etaDescription || "—"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Dirección de destino */}
              <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1.5, border: "1px solid #e8e8e8" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
                  DIRECCIÓN DE DESTINO
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    RegionID
                  </Typography>
                  <Typography sx={{ fontWeight: 500, mt: 0.3 }}>
                    {selectedDelivery.shippingInfo?.destinationAddressId || "—"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Calle
                  </Typography>
                  <Typography sx={{ fontWeight: 500, mt: 0.3 }}>
                    {selectedDelivery.shippingInfo?.street || selectedDelivery.destinationAddress?.street || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Número
                  </Typography>
                  <Typography sx={{ fontWeight: 500, mt: 0.3 }}>
                    {selectedDelivery.shippingInfo?.number || selectedDelivery.destinationAddress?.number || "—"}
                  </Typography>
                </Box>
              </Box>

              {/* Artículos */}
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1.5 }}>
                  ARTÍCULOS ({selectedDelivery.items?.length || 0})
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {selectedDelivery.items?.map((item, idx) => (
                    <Box key={`${item.name}-${idx}`} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{item.name}</strong> x{item.quantity}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        ${item.price?.toLocaleString() || "—"} c/u
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1, justifyContent: "flex-end" }}>
          <Button 
            onClick={handleDeleteDelivery} 
            variant="outlined" 
            color="error"
          >
            Eliminar
          </Button>
          <Button
            onClick={() => handleUpdateStatus(selectedStatusValue)}
            variant="contained"
            sx={{ 
              bgcolor: "#22c55e",
              "&:hover": { bgcolor: "#16a34a" }
            }}
            disabled={updating || selectedStatusValue === (selectedDelivery?.status || "").toLowerCase()}
          >
            {updating ? <CircularProgress size={18} color="inherit" /> : "Actualizar estado"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Animación para el icono de EnTransito ahora está en index.css */}
    </Box>
  );
}
