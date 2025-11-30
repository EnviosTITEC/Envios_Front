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
          title="Mis Envíos (Solo Lectura)"
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
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenDetails(delivery)}
                >
                  <CardContent>
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
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(delivery.status)}
                      sx={{ mt: 2, height: 8, borderRadius: 5 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Detalle del envío (solo lectura) */}
        <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
          <DialogTitle>Detalles del Envío</DialogTitle>
          <DialogContent>
            {selectedDelivery && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Tracking: {selectedDelivery.trackingNumber}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Estado: {selectedDelivery.status}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Productos:
                  <ul>
                    {selectedDelivery.items?.map((item, idx) => (
                      <li key={idx}>{item.name} x{item.quantity} (${item.price})</li>
                    ))}
                  </ul>
                </Typography>
                {selectedDelivery.package && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Paquete: {selectedDelivery.package.weight}kg, {selectedDelivery.package.length}x{selectedDelivery.package.width}x{selectedDelivery.package.height}cm
                  </Typography>
                )}
                {selectedDelivery.shippingInfo && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Envío: {selectedDelivery.shippingInfo.serviceType} - ${selectedDelivery.shippingInfo.estimatedCost}
                  </Typography>
                )}
                {selectedDelivery.createdAt && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Creado: {new Date(selectedDelivery.createdAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box flex={1} />
            <Box>
              <button onClick={handleCloseDetails}>Cerrar</button>
            </Box>
          </DialogActions>
        </Dialog>
      </PageCard>
    </Box>
  );
}
