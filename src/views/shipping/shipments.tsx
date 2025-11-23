import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Stack,
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
import { getUserDeliveries } from "../../db/config/postal.service";

const USER_ID = "1"; // Usuario actual

interface DeliveryItem {
  _id: string;
  trackingNumber: string;
  status: string;
  shippingInfo: {
    estimatedCost: number;
    serviceType: string;
    originAddressId: string;
    destinationAddressId: string;
  };
  items: any[];
  package: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  selectedProduct?: any;
  selectedOption?: any;
  destinationAddress?: any;
}

export default function Shipments() {
  const [searchParams] = useSearchParams();
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    async function loadDeliveries() {
      try {
        setLoading(true);
        setError("");
        
        // Leer primero del localStorage
        const stored = localStorage.getItem("local_deliveries");
        let localDels: DeliveryItem[] = [];
        if (stored) {
          try {
            localDels = JSON.parse(stored) as DeliveryItem[];
          } catch (e) {
            console.error("Error parsing localStorage:", e);
          }
        }
        
        setDeliveries(localDels);
        
        // Intentar obtener del API como complemento
        try {
          const data = await getUserDeliveries(USER_ID);
          if (data && data.length > 0) {
            // Combinar API + local (evitar duplicados)
            setDeliveries([...localDels, ...data]);
          }
        } catch (apiError) {
          // Si falla la API, solo mostrar locales
          console.log("API no disponible, usando deliveries locales");
        }
      } catch (err: any) {
        console.error("Error:", err);
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
        return <LocalShippingIcon sx={{ color: "#2196f3", fontSize: 28 }} />;
      case "preparando":
        return <PendingIcon sx={{ color: "#ffc107", fontSize: 28 }} />;
      case "cancelado":
        return <ErrorIcon sx={{ color: "#f44336", fontSize: 28 }} />;
      default:
        return <PendingIcon sx={{ color: "#9e9e9e", fontSize: 28 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "preparando":
        return "warning";
      case "enviado":
        return "info";
      case "entregado":
        return "success";
      case "cancelado":
        return "error";
      default:
        return "default";
    }
  };

  const getProgressValue = (status: string) => {
    switch (status?.toLowerCase()) {
      case "preparando":
        return 25;
      case "enviado":
        return 75;
      case "entregado":
        return 100;
      case "cancelado":
        return 0;
      default:
        return 0;
    }
  };

  const handleOpenDetails = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDelivery(null);
  };

  const handleDeleteDelivery = () => {
    if (!selectedDelivery) return;
    
    // Eliminar del localStorage
    const stored = localStorage.getItem("local_deliveries");
    if (stored) {
      const parsed = JSON.parse(stored) as DeliveryItem[];
      const filtered = parsed.filter(d => d._id !== selectedDelivery._id);
      localStorage.setItem("local_deliveries", JSON.stringify(filtered));
      
      // Actualizar estado
      setDeliveries(deliveries.filter(d => d._id !== selectedDelivery._id));
      
      // Cerrar modal
      handleCloseDetails();
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 1 }, py: 1, mb: 80 }}>
      <NavigationButtons />
      <PageCard>
        <SectionHeader
          title="Mis Envíos"
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
              <Grid item xs={12} key={delivery._id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    border: "1px solid #e0e0e0",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
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
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor:
                              delivery.status?.toLowerCase() === "entregado"
                                ? "#4caf50"
                                : delivery.status?.toLowerCase() === "enviado"
                                  ? "#2196f3"
                                  : delivery.status?.toLowerCase() === "preparando"
                                    ? "#ffc107"
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
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Detalles del Envío
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          {selectedDelivery && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Número de Tracking
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: "#1976d2",
                    fontSize: "1.1rem",
                  }}
                >
                  {selectedDelivery.trackingNumber}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Estado Actual
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Chip
                    label={selectedDelivery.status || "Desconocido"}
                    color={getStatusColor(selectedDelivery.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Servicio
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {selectedDelivery.shippingInfo?.serviceType || "—"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Costo Estimado
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", color: "#2e7d32" }}>
                  ${selectedDelivery.shippingInfo?.estimatedCost?.toLocaleString() || "—"}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Paquete
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Peso:</strong> {selectedDelivery.package?.weight || "—"} kg
                </Typography>
                <Typography variant="body2">
                  <strong>Largo:</strong> {selectedDelivery.package?.length || "—"} cm
                </Typography>
                <Typography variant="body2">
                  <strong>Ancho:</strong> {selectedDelivery.package?.width || "—"} cm
                </Typography>
                <Typography variant="body2">
                  <strong>Alto:</strong> {selectedDelivery.package?.height || "—"} cm
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Artículos ({selectedDelivery.items?.length || 0})
                </Typography>
                {selectedDelivery.items?.map((item: any, idx: number) => (
                  <Typography key={idx} variant="body2" sx={{ mt: 0.5 }}>
                    • {item.name} (Qty: {item.quantity}) - ${item.price?.toLocaleString() || "—"}
                  </Typography>
                ))}
              </Box>

              {selectedDelivery.selectedOption && (
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Opción de Envío Seleccionada
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {selectedDelivery.selectedOption.serviceName || "—"}
                  </Typography>
                  {selectedDelivery.selectedOption.etaDescription && (
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {selectedDelivery.selectedOption.etaDescription}
                    </Typography>
                  )}
                </Box>
              )}

              {selectedDelivery.destinationAddress && (
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Dirección de Destino
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, display: "flex", flexWrap: "wrap" }}>
                    {selectedDelivery.destinationAddress.street} {selectedDelivery.destinationAddress.number}, {selectedDelivery.destinationAddress.communeName} ({selectedDelivery.destinationAddress.regionId})
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Fecha de Creación
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {selectedDelivery.createdAt
                    ? new Date(selectedDelivery.createdAt).toLocaleDateString("es-CL", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "—"}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleDeleteDelivery} 
            variant="outlined" 
            color="error"
          >
            Eliminar
          </Button>
          <Button onClick={handleCloseDetails} variant="contained" fullWidth>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
