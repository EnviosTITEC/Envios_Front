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
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  Preparando: {
    color: "info",
    icon: <WarningAmberIcon />,
    label: "Preparando envío",
  },
  "En tránsito": {
    color: "warning",
    icon: <LocalShippingIcon />,
    label: "En tránsito",
  },
  Entregado: {
    color: "success",
    icon: <CheckCircleOutlineIcon />,
    label: "Entregado",
  },
};

export default function Tracking() {
  const [trackingInput, setTrackingInput] = useState("");
  const [delivery, setDelivery] = useState<DeliveryDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"backend" | "local" | null>(null);

  const searchLocalStorage = (trackingNumber: string): DeliveryDetails | null => {
    try {
      const stored = localStorage.getItem("local_deliveries");
      if (!stored) return null;

      const deliveries = JSON.parse(stored) as LocalDelivery[];
      const found = deliveries.find((d) => d.trackingNumber === trackingNumber);

      if (found) {
        return {
          ...found,
          carrierName: "Chilexpress",
          currency: "CLP",
          weight: found.package?.weight || 0,
          dimensions: found.package,
          estimatedDeliveryDate: new Date(
            new Date(found.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
      }
      return null;
    } catch (e) {
      console.error("Error searching localStorage:", e);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!trackingInput.trim()) {
      setError("Por favor ingresa un número de seguimiento");
      return;
    }

    setLoading(true);
    setError("");
    setDelivery(null);
    setSource(null);

    try {
      // Primero intentar en el backend
      const response = await fetch(
        `http://localhost:3100/api/deliveries/tracking/${trackingInput.trim()}`
      );

      if (response.ok) {
        const data = await response.json();
        setDelivery(data);
        setSource("backend");
        return;
      }
    } catch (err) {
      console.warn("Backend search failed, trying localStorage...", err);
    }

    // Si falla el backend, buscar en localStorage
    const localDelivery = searchLocalStorage(trackingInput.trim());
    if (localDelivery) {
      setDelivery(localDelivery);
      setSource("local");
      setLoading(false);
      return;
    }

    // No encontrado en ningún lado
    setError(
      `No se encontró envío con el número de seguimiento "${trackingInput.trim()}"`
    );
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.Preparando;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-CL", {
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

  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <NavigationButtons />
      <PageCard sx={{ pb: 6, pr: 2, overflow: "visible" }}>
        <SectionHeader
          title="Seguimiento"
          subtitle="Rastrea tus envíos por código de seguimiento."
          actions={null}
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

          {/* Badge de fuente */}
          {source && (
            <Alert severity={source === "backend" ? "success" : "warning"} sx={{ mb: 2 }}>
              {source === "backend"
                ? "Información obtenida del servidor"
                : "Información obtenida localmente"}
            </Alert>
          )}

          {/* Resultado de búsqueda */}
          {delivery && (
            <Grid container spacing={4} sx={{ mt: 1, width: "100%", pr: 1 }}>
              {/* Columna izquierda - Información principal */}
              <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                    >
                      Número de seguimiento
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.95rem", mb: 1.5 }}
                    >
                      {delivery.trackingNumber}
                    </Typography>
                    <Chip
                      label={getStatusConfig(delivery.status).label}
                      color={getStatusConfig(delivery.status).color as any}
                      icon={getStatusConfig(delivery.status).icon}
                      variant="filled"
                      size="medium"
                    />
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  {/* Información del envío */}
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Transportista
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.carrierName || "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Tipo de servicio
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.shippingInfo?.serviceType || "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Costo estimado
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${delivery.shippingInfo?.estimatedCost?.toLocaleString() || "0"} {delivery.currency || "CLP"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Peso
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.package?.weight || "—"} kg
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Dimensiones
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.package?.length || "—"} L x {delivery.package?.width || "—"} W x{" "}
                        {delivery.package?.height || "—"} H cm
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Fecha de creación
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(delivery.createdAt)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                      >
                        Entrega estimada
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.estimatedDeliveryDate ? formatDate(delivery.estimatedDeliveryDate) : "—"}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Columna derecha - Productos */}
              <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  {delivery.items && delivery.items.length > 0 ? (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                        Productos ({delivery.items.length})
                      </Typography>
                      <Stack spacing={1}>
                        {delivery.items.map((item, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              p: 1.25,
                              bgcolor: "background.default",
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary", display: "block", mt: 0.25 }}
                              >
                                ${item.price.toLocaleString()} CLP
                              </Typography>
                            </Box>
                            <Chip
                              label={`x${item.quantity}`}
                              size="small"
                              variant="outlined"
                              sx={{ flexShrink: 0 }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      Sin productos asociados
                    </Typography>
                  )}
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Placeholder cuando no hay búsqueda */}
          {!delivery && !loading && !error && !source && (
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
