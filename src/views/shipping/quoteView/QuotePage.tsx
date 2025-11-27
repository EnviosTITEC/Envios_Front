// src/views/shipping/Quote/QuotePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  Typography,
  Alert,
  Button,
  CircularProgress,
  List,
  Chip,
} from "@mui/material";

import PageCard from "../../../components/primitives/PageCard";
import SectionHeader from "../../../components/primitives/SectionHeader";
import NavigationButtons from "../../../components/common/NavigationButtons";

import { useAddresses } from "./hooks/useAddresses";
import { useQuote } from "./hooks/useQuote";
import { useChilexpress } from "./hooks/useChilexpress";
import { useCart } from "./hooks/useCart";
import { useLocalDeliveries } from "./hooks/useLocalDeliveries";

import { labelOfAddress } from "../../../utils/addressHelpers";
import AddressPicker from "./AddressPicker";
import QuoteList from "./QuoteList";

import AddressModal from "./AddressModal";
import ConfirmDialog from "./ConfirmDialog";

import { ORIGIN_CODE } from "./constants";
import type { AddressRow } from "../../../types/address";

/* ----------------------------- Tipos locales ----------------------------- */
type AddressFormValue = {
  street: string;
  number: string;
  regionId: string;
  communeId: string;        // nombre de la comuna
  countyCode?: string;       // código Chilexpress (ej: "STGO")
  postalCode?: string;
  references?: string;
};

type AddressOption = { label: string; value: AddressRow };

export default function QuotePage() {
  const navigate = useNavigate();

  const { cart, calculateTotalCartDimensions, calculateTotalDeclaredWorth } = useCart();
  const { addDelivery } = useLocalDeliveries();

  const { items: addresses, addAddress } = useAddresses("1");
  const {
    quotes,
    selected,
    setSelected,
    loading,
    error,
    setError,
    getQuote,
  } = useQuote();
  const {
    regions: chilexpressRegions,
    loadCoverageAreas,
  } = useChilexpress();

  const [selectedAddress, setSelectedAddress] = useState<AddressRow | null>(
    null,
  );
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [formAddress, setFormAddress] = useState<AddressFormValue>({
    street: "",
    number: "",
    regionId: "",
    communeId: "",
    countyCode: undefined,
    postalCode: "",
    references: "",
  });
  const [openConfirm, setOpenConfirm] = useState(false);

  // Cargar datos de Chilexpress al montar
  useEffect(() => {
    (async () => {
      const mappedRegions: any[] = [];
      for (const region of chilexpressRegions) {
        const regionId = (region as any).regionId;
        const areas = await loadCoverageAreas(regionId);
        // Deduplicar por nombre de comuna
        const uniqueByName = Array.from(
          new Map(areas.map(a => [a.countyName, a])).values()
        );
        mappedRegions.push({
          name: (region as any).regionName,
          code: regionId,
          communes: uniqueByName.map(area => ({
            name: area.countyName,
            code: area.countyCode,
          })),
        });
      }
      setRegions(mappedRegions);
    })();
  }, [chilexpressRegions]);

  const addressOptions: AddressOption[] = addresses.map((a) => ({
    label: labelOfAddress(a),
    value: a,
  }));

  // validaciones derivadas: solo necesitamos dirección destino ahora
  const isFormValid = cart.items.length > 0 && !!selectedAddress;

  /* --------------------------- Acciones principales ----------------------- */
  async function onQuote() {
    if (cart.items.length === 0 || !selectedAddress) {
      setError("Asegúrate de tener productos en el carrito y selecciona una dirección destino.");
      return;
    }

    const destCountyCode = selectedAddress.countyCode;
    if (!destCountyCode) {
      setError(
        "La dirección seleccionada no tiene un código de Chilexpress válido.",
      );
      return;
    }

    setError("");

    // Cotizar carrito completo
    const dimensions = calculateTotalCartDimensions();
    const totalDeclaredWorth = calculateTotalDeclaredWorth();

    getQuote({
      originCountyCode: ORIGIN_CODE,
      destinationCountyCode: destCountyCode,
      package: {
        weight: String(dimensions.weight),
        height: String(dimensions.height),
        width: String(dimensions.width),
        length: String(dimensions.length),
      },
      productType: 3,
      contentType: 1,
      declaredWorth: String(totalDeclaredWorth),
      deliveryTime: 0,
    });
  }

  async function onCreateDelivery() {
    if (!selected || !selectedAddress || cart.items.length === 0) return;

    const destCountyCode = selectedAddress.countyCode;
    if (!destCountyCode) {
      setError("No se puede procesar: falta código de Chilexpress");
      return;
    }

    try {
      const dimensions = calculateTotalCartDimensions();

      // Guardar en localStorage y backend
      const delivery = await addDelivery({
        status: "Preparando",
        shippingInfo: {
          estimatedCost: Number(selected.price),
          serviceType: selected.serviceName || "EXPRESS",
          originAddressId: "addr_origin_123",
          destinationAddressId: (selectedAddress as any)._id ?? selectedAddress.id,
        },
        items: cart.items,
        package: {
          weight: Number(dimensions.weight),
          length: Number(dimensions.length),
          width: Number(dimensions.width),
          height: Number(dimensions.height),
        },
        selectedOption: selected,
        destinationAddress: selectedAddress,
      });

      if (delivery?.trackingNumber) {
        setError("");
        alert(`¡Envío creado exitosamente!\nTracking: ${delivery.trackingNumber}`);
        setOpenConfirm(false);
        setSelected(null);
        // Redirigir a Mis envíos con timestamp para forzar refetch
        setTimeout(() => {
          navigate(`/shipping/shipments?refresh=${Date.now()}`);
        }, 500);
      }
    } catch (err: any) {
      setError(err?.message || "Error al crear envío");
    }
  }

  /* ------------------------ Handlers modal de dirección ------------------- */
  function handleCloseAddressModal() {
    setOpenAddressModal(false);
    setFormAddress({
      street: "",
      number: "",
      regionId: "",
      communeId: "",
      countyCode: undefined,
      postalCode: "",
      references: "",
    });
    setCommunes([]);
  }

  function handleSelectRegion(region: any | null) {
    if (region) {
      setFormAddress((prev) => ({
        ...prev,
        regionId: region.name,
        communeId: "",
        countyCode: undefined,
      }));
      setCommunes(region.communes || []);
    } else {
      setCommunes([]);
      setFormAddress((prev) => ({
        ...prev,
        regionId: "",
        communeId: "",
        countyCode: undefined,
      }));
    }
  }

  function handleSelectCommune(commune: any | null) {
    if (commune) {
      setFormAddress((prev) => ({
        ...prev,
        communeId: commune.name,
        countyCode: commune.code,
      }));
    } else {
      setFormAddress((prev) => ({
        ...prev,
        communeId: "",
        countyCode: undefined,
      }));
    }
  }

  async function handleSaveAddress() {
    const created = await addAddress(formAddress as any);
    setSelectedAddress(created);
    handleCloseAddressModal();
  }

  /* -------------------------------- Render -------------------------------- */
  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1, mb: 30 }}>
      <NavigationButtons />
      <PageCard>
        <SectionHeader
          title="Cotización"
          subtitle="Calcula el costo estimado de tus envíos."
          actions={null}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Izquierda */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Card variant="outlined" sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700, fontSize: "0.95rem" }}>
                Dirección de destino
              </Typography>

              <AddressPicker
                options={addressOptions}
                selected={
                  selectedAddress
                    ? {
                        label: labelOfAddress(selectedAddress),
                        value: selectedAddress,
                      }
                    : null
                }
                onChange={setSelectedAddress}
                onOpenNew={() => setOpenAddressModal(true)}
                originCode={ORIGIN_CODE}
                destLabel={
                  selectedAddress ? (selectedAddress as any).countyCode || (selectedAddress as any).communeId || (selectedAddress as any).commune || "—" : "—"
                }
              />
            </Card>

            <Card variant="outlined" sx={{ p: 1.5, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700, fontSize: "0.95rem" }}>
                Productos del carrito
              </Typography>

              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {cart.items.map((item) => (
                  <Box key={item.productId} sx={{ 
                    p: 1,
                    mb: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                        Precio: ${item.price.toLocaleString()} | Peso: {item.weight || 0.5}kg
                      </Typography>
                    </Box>
                    <Chip label={`x${item.quantity}`} size="small" variant="outlined" />
                  </Box>
                ))}
              </List>

              <Button
                variant="contained"
                fullWidth
                onClick={onQuote}
                disabled={loading || !isFormValid}
                size="small"
                sx={{ mt: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={18} />
                ) : (
                  "Cotizar carrito completo"
                )}
              </Button>
            </Card>
          </Grid>

          {/* Derecha */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", mt: { xs: 0, md: 0 } }}
          >
            <Card variant="outlined" sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700, fontSize: "0.95rem" }}>
                Opciones disponibles
              </Typography>

              <QuoteList
                quotes={quotes}
                selected={selected}
                onSelect={setSelected}
                onConfirm={() => setOpenConfirm(true)}
                disabledConfirm={!selected}
              />
            </Card>
          </Grid>
        </Grid>
      </PageCard>

      {/* Modal: Agregar dirección */}
      <AddressModal
        open={openAddressModal}
        onClose={handleCloseAddressModal}
        value={formAddress}
        onChange={setFormAddress}
        regions={regions}
        communes={communes}
        onSelectRegion={handleSelectRegion}
        onSelectCommune={handleSelectCommune}
        onSave={handleSaveAddress}
      />

      {/* Modal: Confirmar envío */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        address={selectedAddress}
        quote={selected}
        packageData={cart.items.length > 0 ? (() => {
          const dimensions = calculateTotalCartDimensions();
          return {
            weight: String(dimensions.weight),
            height: String(dimensions.height),
            width: String(dimensions.width),
            length: String(dimensions.length),
            volume: String(dimensions.weight * dimensions.length * dimensions.width / dimensions.height),
          };
        })() : {
          weight: "0",
          height: "0",
          width: "0",
          length: "0",
          volume: "0",
        }}
        creating={false}
        onConfirm={onCreateDelivery}
      />
    </Box>
  );
}
