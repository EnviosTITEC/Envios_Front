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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  LinearProgress,
  Button,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";

import PageCard from "../../components/primitives/PageCard";
import SectionHeader from "../../components/primitives/SectionHeader";
import NavigationButtons from "../../components/common/NavigationButtons";
import { getUserDeliveries } from "../../db/config/postal.service";

const USER_ID = "user_456"; // Usuario actual


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

export default function ShipmentsReadOnly() {
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
        const data = await getUserDeliveries(USER_ID);
        setDeliveries(data || []);
      } catch {
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
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDelivery(null);
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
              <Grid item xs={12} key={delivery.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    border: "2px solid #22c55e",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
                      borderColor: "#16a34a",
                    },
                  }}
                  onClick={() => handleOpenDetails(delivery)}
                >
                  <CardContent sx={{ p: 3, pb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {getStatusIcon(delivery.status)}
                      <Typography variant="h6" sx={{ ml: 2 }}>
                        {delivery.trackingNumber}
                      </Typography>
                      <Chip
                        label={delivery.status}
                        color={getStatusColor(delivery.status)}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {delivery.items?.map((item, idx) => (
                        <span key={idx}>
                          {item.name} x{item.quantity} (${item.price}){" "}
                        </span>
                      ))}
                    </Typography>
                  </CardContent>

                  {/* Barra de progreso - fuera del CardContent para llegar a los bordes */}
                  <Box sx={{ px: 3, py: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Progreso de envío
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        {getProgressValue(delivery.status)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(delivery.status)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e8e8e8",
                        transition: 'all 0.7s cubic-bezier(.4,2,.6,1)',
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          transition: 'all 0.7s cubic-bezier(.4,2,.6,1)',
                          backgroundColor: "#22c55e",
                        },
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Detalle del envío (solo lectura) */}
        <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem", pb: 2, borderBottom: "2px solid #22c55e" }}>
            Detalles del Envío
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedDelivery && (
              <Box>
                {/* Tracking */}
                <Box sx={{ mt: 2, mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1.5, border: "1px solid #e0e0e0" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                    TRACKING
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", fontFamily: "monospace", mt: 0.5 }}>
                    {selectedDelivery.trackingNumber}
                  </Typography>
                </Box>

                {/* Estado */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                    ESTADO
                  </Typography>
                  <Chip
                    label={selectedDelivery.status}
                    color={getStatusColor(selectedDelivery.status)}
                    size="medium"
                    icon={getStatusIcon(selectedDelivery.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Productos */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                    PRODUCTOS
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {selectedDelivery.items?.map((item, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{item.name}</strong> x{item.quantity}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          ${item.price} c/u
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Paquete */}
                {selectedDelivery.package && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                      PAQUETE
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1.5, border: "1px solid #e8e8e8" }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Peso:</strong> {selectedDelivery.package.weight} kg
                      </Typography>
                      <Typography variant="body2">
                        <strong>Dimensiones:</strong> {selectedDelivery.package.length}L × {selectedDelivery.package.width}A × {selectedDelivery.package.height}H cm
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Envío */}
                {selectedDelivery.shippingInfo && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                      ENVÍO
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1.5, border: "1px solid #e8e8e8" }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Servicio:</strong> {selectedDelivery.shippingInfo.serviceType}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 600 }}>
                        <strong>Costo:</strong> ${selectedDelivery.shippingInfo.estimatedCost?.toLocaleString() || "—"}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Fecha de creación */}
                {selectedDelivery.createdAt && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
                      CREADO
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedDelivery.createdAt).toLocaleDateString("es-CL", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
            <Button
              onClick={handleCloseDetails}
              variant="contained"
              sx={{ 
                bgcolor: "#22c55e",
                "&:hover": { bgcolor: "#16a34a" }
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </PageCard>
    </Box>
  );
}
