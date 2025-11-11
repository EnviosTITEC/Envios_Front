import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

import PageCard from "../../components/ui/layout/PageCard";
import SectionHeader from "../../components/ui/layout/SectionHeader";
import { fetchAddresses } from "../../db/config/address.service";
import { quoteShipping, createDelivery } from "../../db/config/postal.service";
import { labelOfAddress, getCommune } from "../../utils/addressHelpers";
import type { AddressRow } from "../../types/address";
import type { QuoteOption } from "../../types/postal";

const RADIUS = 8;
const SUBTLE_BORDER = "1px solid rgba(0, 0, 0, 0.08)";

export default function Quote() {
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressRow | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [declaredWorth, setDeclaredWorth] = useState<string>("");
  const [quotes, setQuotes] = useState<QuoteOption[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [creatingDelivery, setCreatingDelivery] = useState(false);

  // Carga direcciones del usuario
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await fetchAddresses("1");
        setAddresses(data);
      } catch (err) {
        console.error("Error loading addresses:", err);
        setError("No se pudieron cargar las direcciones");
      }
    };
    loadAddresses();
  }, []);

  const handleQuote = async () => {
    setError("");
    setQuotes([]);

    // Validaciones
    if (!selectedAddress) {
      setError("Selecciona una dirección de origen");
      return;
    }
    if (!weight || parseFloat(weight) <= 0) {
      setError("El peso debe ser mayor a 0 kg");
      return;
    }
    if (!height || !width || !length) {
      setError("Ingresa todas las dimensiones");
      return;
    }
    if (!declaredWorth || parseFloat(declaredWorth) <= 0) {
      setError("Ingresa el valor declarado");
      return;
    }

    setLoading(true);
    try {
      // Construye request
      const originCommune = getCommune(selectedAddress);
      const quoteRequest = {
        originCountyCode: originCommune,
        destinationCountyCode: "Santiago",
        package: {
          weight: weight,
          height: height,
          width: width,
          length: length,
        },
        productType: 1,
        contentType: 1,
        declaredWorth: declaredWorth,
        deliveryTime: 1, // Por defecto estándar, el usuario elige en las opciones
      };

      // Llama al servicio
      const options = await quoteShipping(quoteRequest);
      setQuotes(options);

      if (options.length === 0) {
        setError("No hay opciones disponibles para esta ruta");
      }
    } catch (err: any) {
      setError(err.message || "Error al calcular cotización");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = async () => {
    if (!selectedAddress || !selectedQuote) return;

    setCreatingDelivery(true);
    try {
      const deliveryData = {
        addressId: (selectedAddress as any)._id || selectedAddress.id || "",
        quoteServiceCode: selectedQuote.serviceCode,
        quotePrice: selectedQuote.price,
        package: {
          weight: weight,
          height: height,
          width: width,
          length: length,
        },
        meta: {
          speed: selectedQuote?.serviceName || "STANDARD",
          carrier: "CHILEXPRESS",
          declaredWorth: declaredWorth,
        },
      };

      await createDelivery(deliveryData);
      setShowConfirm(false);
      setError("");
      alert("Envío creado exitosamente");
      // Reset form
      setWeight("");
      setHeight("");
      setWidth("");
      setLength("");
      setDeclaredWorth("");
      setSelectedQuote(null);
      setQuotes([]);
    } catch (err: any) {
      setError(err.message || "Error al crear envío");
    } finally {
      setCreatingDelivery(false);
    }
  };

  const addressOptions = addresses.map((addr) => ({
    label: labelOfAddress(addr),
    value: addr,
  }));

  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
      <PageCard>
        <SectionHeader
          title="Cotización"
          subtitle="Calcula el costo estimado de tus envíos"
          actions={null}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Columna izquierda: Parámetros */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Parámetros del envío
            </Typography>

            <Stack spacing={2}>
              <Autocomplete
                options={addressOptions}
                getOptionLabel={(opt) => opt.label}
                value={
                  selectedAddress
                    ? {
                        label: labelOfAddress(selectedAddress),
                        value: selectedAddress,
                      }
                    : null
                }
                onChange={(_, newValue) =>
                  setSelectedAddress(newValue?.value || null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Dirección de origen"
                    placeholder="Selecciona una dirección"
                  />
                )}
              />

              <TextField
                label="Peso (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                inputProps={{ step: "0.1", min: "0.1" }}
              />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                <TextField
                  label="Alto (cm)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <TextField
                  label="Ancho (cm)"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </Box>

              <TextField
                label="Largo (cm)"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />

              <TextField
                label="Valor declarado (CLP)"
                type="number"
                value={declaredWorth}
                onChange={(e) => setDeclaredWorth(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={handleQuote}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Calcular cotización"
                )}
              </Button>
            </Stack>
          </Grid>

          {/* Columna derecha: Resultados */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Opciones disponibles
            </Typography>

            {quotes.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: RADIUS,
                  border: SUBTLE_BORDER,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {loading
                    ? "Cargando opciones..."
                    : "Completa el formulario y calcula una cotización"}
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {quotes.map((quote, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor:
                        selectedQuote?.serviceCode === quote.serviceCode
                          ? "primary.main"
                          : "#e0e0e0",
                      backgroundColor:
                        selectedQuote?.serviceCode === quote.serviceCode
                          ? "rgba(25, 103, 210, 0.08)"
                          : "background.paper",
                      transition: "all 0.25s ease",
                      borderRadius: RADIUS,
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: "0 4px 12px rgba(25, 103, 210, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setSelectedQuote(quote)}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Radio
                        checked={
                          selectedQuote?.serviceCode === quote.serviceCode
                        }
                        size="small"
                        sx={{ mt: 0.5, flexShrink: 0 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {quote.serviceName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {quote.etaDescription}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: "success.main", fontSize: "1.1rem" }}
                        >
                          ${quote.price.toLocaleString("es-CL")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                          {quote.currency}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setShowConfirm(true)}
                  disabled={!selectedQuote}
                  sx={{ mt: 2 }}
                >
                  Confirmar envío
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      </PageCard>

      {/* Diálogo de confirmación */}
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar envío</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Dirección
              </Typography>
              <Typography variant="body2">
                {selectedAddress ? labelOfAddress(selectedAddress) : "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Paquete
              </Typography>
              <Typography variant="body2">
                {weight} kg | {height}x{width}x{length} cm
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Servicio
              </Typography>
              <Typography variant="body2">{selectedQuote?.serviceName}</Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: RADIUS,
                backgroundColor: "rgba(25, 103, 210, 0.08)",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                ${selectedQuote?.price.toLocaleString("es-CL")} CLP
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateDelivery}
            disabled={creatingDelivery}
          >
            {creatingDelivery ? <CircularProgress size={24} /> : "Crear envío"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
