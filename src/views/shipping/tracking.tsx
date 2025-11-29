import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Card,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import PageCard from "../../components/primitives/PageCard";
import SectionHeader from "../../components/primitives/SectionHeader";
import NavigationButtons from "../../components/common/NavigationButtons";

interface LocalDelivery {
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
}

interface DeliveryDetails extends LocalDelivery {
  carrierName?: string;
  serviceType?: string;
  estimatedCost?: number;
  currency?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  estimatedDeliveryDate?: string;
  destinationAddress?: any;
  selectedOption?: any;
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  Preparando: {
    color: "warning",
    icon: <WarningAmberIcon />,
    label: "Preparando envío",
  },
  "En tránsito": {
    color: "info",
    icon: <LocalShippingIcon />,
    label: "En tránsito",
  },
  "EnTransito": {
    color: "info",
    icon: <LocalShippingIcon />,
    label: "En tránsito",
  },
  Enviado: {
    color: "info",
    icon: <LocalShippingIcon />,
    label: "Enviado",
  },
  Entregado: {
    color: "success",
    icon: <CheckCircleOutlineIcon />,
    label: "Entregado",
  },
  Cancelado: {
    color: "error",
    icon: <WarningAmberIcon />,
    label: "Cancelado",
  },
  Devuelto: {
    color: "secondary",
    icon: <WarningAmberIcon />,
    label: "Devuelto",
  },
};

export default function Tracking() {
  const [trackingInput, setTrackingInput] = useState("");
  const [delivery, setDelivery] = useState<DeliveryDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSearch = async () => {
    if (!trackingInput.trim()) {
      setError("Por favor ingresa un número de seguimiento");
      return;
    }

    setLoading(true);
    setError("");
    setDelivery(null);


    try {
      // Solo buscar en el backend
      const API_BASE = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(
        `${API_BASE}/deliveries/tracking/${trackingInput.trim()}`
      );
      if (response.ok) {
        const data = await response.json();
        setDelivery(data);
        setLoading(false);
        return;
      } else {
        setError(
          `No se encontró envío con el número de seguimiento "${trackingInput.trim()}"`
        );
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Error al buscar el envío en el backend.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusConfig = (status: string) => {
    // Buscar en el objeto STATUS_CONFIG de manera case-insensitive
    const statusKey = Object.keys(STATUS_CONFIG).find(
      (key) => key.toLowerCase() === status?.toLowerCase()
    );
    return statusKey ? STATUS_CONFIG[statusKey] : STATUS_CONFIG.Preparando;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number | undefined, currency: string = "CLP") => {
    if (typeof value !== "number" || isNaN(value)) return "—";
    return `$${value.toLocaleString("es-CL")} ${currency}`;
  };

  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <NavigationButtons />
      <PageCard sx={{ pb: 6, pr: 2, overflow: "visible" }}>
        <SectionHeader
          title="Seguimiento"
          subtitle="Rastrea tus envíos por código de seguimiento."
        />

        <Stack direction="column" spacing={3} sx={{ mt: 4, pr: 0 }}>
          {/* Búsqueda */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Ingresa tu número de seguimiento
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Código de seguimiento"
                placeholder="Ej: ENV-1763923987880-RCZGC5"
                fullWidth
                variant="outlined"
                size="medium"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(49,76,83,0.10)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(49,76,83,0.20)",
                  },
                }}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Buscar"}
              </Button>
            </Stack>
          </Card>

          {/* Mensaje de error */}
          {error && <Alert severity="error">{error}</Alert>}



          {/* Resultado de búsqueda */}
          {delivery && (
            <Card variant="outlined" sx={{ p: 4 }}>
              {/* Encabezado con seguimiento y estado */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Detalles del Envío
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.8 }}>
                  Número de Tracking
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700, 
                    fontFamily: "monospace", 
                    fontSize: "1.1rem",
                    color: "primary.main",
                    mb: 2
                  }}
                >
                  {delivery.trackingNumber || "—"}
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Estado Actual
                    </Typography>
                    {getStatusConfig(delivery.status).icon ? (
                      <Chip
                        label={getStatusConfig(delivery.status).label}
                        color={getStatusConfig(delivery.status).color as any}
                        icon={getStatusConfig(delivery.status).icon as React.ReactElement}
                        variant="filled"
                        size="medium"
                      />
                    ) : (
                      <Chip
                        label={getStatusConfig(delivery.status).label}
                        color={getStatusConfig(delivery.status).color as any}
                        variant="filled"
                        size="medium"
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Información en Grid 2x2 */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Transportista */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Transportista
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {delivery.carrierName || "Chilexpress"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Tipo de servicio */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Tipo de Servicio
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {delivery.serviceType || (delivery as any).selectedOption?.serviceName || (delivery as any).shippingInfo?.serviceType || "—"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Costo estimado */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Costo Estimado
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "1rem", color: "primary.main" }}>
                      {formatCurrency(delivery.estimatedCost, delivery.currency)}
                    </Typography>
                  </Box>
                </Grid>

                {/* Peso */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Peso
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      {delivery.weight || delivery.package?.weight || "—"} kg
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Paquete - Dimensiones */}
              {delivery.package && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Paquete
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.3 }}>
                        Peso
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.package.weight} kg
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.3 }}>
                        Largo
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.package.length} cm
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.3 }}>
                        Ancho
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.package.width} cm
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.3 }}>
                        Alto
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.package.height} cm
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Fechas */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(delivery.createdAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 600 }}>
                      Entrega Estimada
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(delivery.estimatedDeliveryDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Dirección de destino */}
              {delivery.destinationAddress && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Dirección de Destino
                    </Typography>
                    <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.destinationAddress.street || delivery.destinationAddress.calle || "—"} {delivery.destinationAddress.number || delivery.destinationAddress.numero || ""}, {delivery.destinationAddress.communeId || delivery.destinationAddress.comuna_id || "—"}, {delivery.destinationAddress.region_id || delivery.destinationAddress.regionId || "—"}
                      </Typography>
                      {delivery.destinationAddress.references && (
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1 }}>
                          <strong>Referencias:</strong> {delivery.destinationAddress.references}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </>
              )}

              {/* Botones de acción */}
              <Divider sx={{ my: 3 }} />
              <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Cerrar
                </Button>
              </Stack>
            </Card>
          )}

          {/* Placeholder cuando no hay búsqueda */}
          {!delivery && !loading && !error && (
            <Card variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <LocalShippingIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
              />
              <Typography color="text.secondary">
                Ingresa un número de seguimiento para ver el estado de tu envío
              </Typography>
            </Card>
          )}
        </Stack>
      </PageCard>
    </Box>
  );
}
