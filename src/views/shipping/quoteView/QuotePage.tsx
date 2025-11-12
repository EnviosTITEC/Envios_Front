// src/views/shipping/Quote/QuotePage.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";

import PageCard from "../../../components/primitives/PageCard";
import SectionHeader from "../../../components/primitives/SectionHeader";

import { useAddresses } from "./hooks/useAddresses";
import { useAddressModal } from "./hooks/useAddressModal";
import { useQuote } from "./hooks/useQuote";

import { labelOfAddress, getCommune } from "../../../utils/addressHelpers";
import ParamsGrid from "./ParamsGrid";
import AddressPicker from "./AddressPicker";
import QuoteList from "./QuoteList";

import AddressModal from "./AddressModal";
import ConfirmDialog from "./ConfirmDialog";

import { ORIGIN_CODE, DEST_CODE_FALLBACK } from "./constants";
import type { AddressRow } from "../../../types/address";

/* ----------------------------- Tipos locales ----------------------------- */
type AddressFormValue = {
  street: string;
  number: string;
  regionId: string;
  provinceId: string;
  communeId: string;
  postalCode?: string;
  references?: string;
};

type AddressOption = { label: string; value: AddressRow };

/* ----------------------------- Helpers locales --------------------------- */
const toNum = (v: string) => Number.parseFloat(v || "0");

/* ======================================================================== */
export default function QuotePage() {
  const userId = "1";

  // data
  const { items: addresses, addAddress } = useAddresses(userId);
  const {
    regions,
    provinces,
    communes,
    loading: loadingPostal,
    handleSelectRegion: hookSelectRegion,
    handleSelectProvince: hookSelectProvince,
    handleSelectCommune: hookSelectCommune,
    reset: resetAddressModal,
  } = useAddressModal();
  const {
    quotes,
    selected,
    setSelected,
    loading,
    error,
    setError,
    getQuote,
    createDeliveryFrom,
  } = useQuote();

  // address
  const [selectedAddress, setSelectedAddress] = useState<AddressRow | null>(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [formAddress, setFormAddress] = useState<AddressFormValue>({
    street: "",
    number: "",
    regionId: "",
    provinceId: "",
    communeId: "",
    postalCode: "",
    references: "",
  });

  // package
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [declared, setDeclared] = useState("");

  const m3 = useMemo(() => {
    const h = toNum(height), w = toNum(width), l = toNum(length);
    if (!h || !w || !l) return "";
    return ((h * w * l) / 1_000_000).toFixed(4);
  }, [height, width, length]);

  const addressOptions: AddressOption[] = addresses.map((a) => ({
    label: labelOfAddress(a),
    value: a,
  }));

  // validaciones derivadas
  const hasDims = height !== "" && width !== "" && length !== "";
  const isFormValid =
    !!selectedAddress && toNum(weight) > 0 && hasDims && toNum(declared) > 0;

  // confirm dialog
  const [openConfirm, setOpenConfirm] = useState(false);

  /* --------------------------- Acciones principales ----------------------- */
  function onQuote() {
    if (!isFormValid) {
      setError("Completa correctamente los parámetros y selecciona una dirección.");
      return;
    }
    setError("");

    getQuote({
      originCountyCode: ORIGIN_CODE,
      destinationCountyCode: DEST_CODE_FALLBACK, // pendiente mapping real
      package: {
        weight: String(toNum(weight)),
        height: String(toNum(height)),
        width: String(toNum(width)),
        length: String(toNum(length)),
      },
      productType: 1,
      contentType: 1,
      declaredWorth: String(toNum(declared)),
      deliveryTime: 0,
    });
  }

  async function onCreateDelivery() {
    if (!selected || !selectedAddress) return;

    await createDeliveryFrom({
      addressId: (selectedAddress as any)._id ?? selectedAddress.id,
      quoteServiceCode: selected.serviceCode,
      quotePrice: selected.price,
      package: {
        weight: String(toNum(weight)),
        height: String(toNum(height)),
        width: String(toNum(width)),
        length: String(toNum(length)),
      },
      meta: {
        carrier: "CHILEXPRESS",
        speed: selected.serviceName,
        declaredWorth: String(toNum(declared)),
        originCountyCode: ORIGIN_CODE,
        destinationCountyCode: DEST_CODE_FALLBACK,
      },
    });

    setOpenConfirm(false);
    // reset suave (opcional)
    setSelected(null);
  }

  /* ------------------------ Handlers modal de dirección ------------------- */
  function handleCloseAddressModal() {
    setOpenAddressModal(false);
    resetAddressModal();
    setFormAddress({
      street: "",
      number: "",
      regionId: "",
      provinceId: "",
      communeId: "",
      postalCode: "",
      references: "",
    });
  }

  function handleSelectRegion(region: any | null) {
    hookSelectRegion(region);
    if (region) {
      setFormAddress((prev) => ({
        ...prev,
        regionId: region.name,
        provinceId: "",
        communeId: "",
      }));
    }
  }

  function handleSelectProvince(province: any | null) {
    hookSelectProvince(province);
    if (province) {
      setFormAddress((prev) => ({
        ...prev,
        provinceId: province.name,
        communeId: "",
      }));
    }
  }

  function handleSelectCommune(commune: any | null) {
    hookSelectCommune(commune);
    if (commune) {
      setFormAddress((prev) => ({
        ...prev,
        communeId: commune.name,
      }));
    }
  }

  async function handleSaveAddress() {
    const created = await addAddress(formAddress);
    setSelectedAddress(created); // queda seleccionada para cotizar de inmediato
    handleCloseAddressModal();
  }

  /* -------------------------------- Render -------------------------------- */
  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
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
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
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
                destLabel={selectedAddress ? getCommune(selectedAddress) : "—"}
              />
            </Card>

            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                Parámetros del envío
              </Typography>

              <ParamsGrid
                weight={weight}
                setWeight={setWeight}
                height={height}
                setHeight={setHeight}
                width={width}
                setWidth={setWidth}
                length={length}
                setLength={setLength}
                declared={declared}
                setDeclared={setDeclared}
                volumeM3={m3}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={onQuote}
                disabled={loading || !isFormValid}
                size="small"
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={18} /> : "Calcular cotización"}
              </Button>
            </Card>
          </Grid>

          {/* Derecha */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
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
        loadingPostal={loadingPostal}
        regions={regions}
        provinces={provinces}
        communes={communes}
        onSelectRegion={handleSelectRegion}
        onSelectProvince={handleSelectProvince}
        onSelectCommune={handleSelectCommune}
        onSave={handleSaveAddress}
      />

      {/* Modal: Confirmar envío */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        address={selectedAddress}
        quote={selected}
        packageData={{
          weight,
          height,
          width,
          length,
          volume: m3,
        }}
        creating={false}
        onConfirm={onCreateDelivery}
      />
    </Box>
  );
}
