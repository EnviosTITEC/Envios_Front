// src/components/forms/AddressForm.tsx
import { Box, Grid, TextField, Autocomplete, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FieldCard,
  FieldLabel,
  inputTextSx,
  inputAutoSx,
  autoPaperSx,
  autoIndicatorSlots,
  RADIUS,
} from "../primitives/formPrimitives";

/** Tipos territoriales */
// Chilexpress: Región → Comuna directamente (sin provincias)
export type Region = {
  name: string;
  code: string;
  communes?: { name: string; code: string }[];
};

export type Commune = { name: string; code: string };

/** Shape del form controlado desde Addresses */
export type AddressFormValue = {
  street: string;
  number: string;
  regionId: string;
  communeId: string;       // nombre de la comuna
  countyCode?: string;     // código Chilexpress (ej: "STGO")
  postalCode?: string;
  references?: string;
};

type Props = {
  value: AddressFormValue;
  onChange: (next: AddressFormValue) => void;

  regions: Region[];
  communes: Commune[];
  onSelectRegion: (_: any, r: Region | null) => void;
  onSelectCommune: (_: any, c: Commune | null) => void;
};

export default function AddressForm({
  value,
  onChange,
  regions,
  communes,
  onSelectRegion,
  onSelectCommune,
}: Props) {
  const theme = useTheme();
  const refsLen = value.references?.length ?? 0;

  const communeDisabled = !value.regionId;

  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* Región */}
        <Grid item xs={12}>
          <FieldCard>
            <FieldLabel>Región *</FieldLabel>
            <Autocomplete<Region>
              options={regions}
              autoHighlight
              isOptionEqualToValue={(o, v) => o.name === v.name}
              getOptionLabel={(opt) => opt?.name ?? ""}
              getOptionKey={(option) => option.code}
              value={regions.find((r) => r.name === value.regionId) ?? null}
              onChange={(e, r) => {
                // avisamos al hook
                onSelectRegion(e, r);
                // actualizamos el form
                onChange({
                  ...value,
                  regionId: r?.name ?? "",
                  communeId: "",
                  countyCode: undefined,
                });
              }}
              slotProps={{
                popper: { sx: { zIndex: 1500 } },
                paper: { sx: autoPaperSx(theme) },
                popupIndicator: autoIndicatorSlots.popupIndicator,
                clearIndicator: autoIndicatorSlots.clearIndicator,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccionar región"
                  size="small"
                  sx={inputAutoSx(theme)}
                />
              )}
            />
          </FieldCard>
        </Grid>

        {/* Comuna */}
        <Grid item xs={12} sm={6}>
          <FieldCard>
            <FieldLabel sx={{ color: communeDisabled ? "text.disabled" : undefined }}>
              Comuna *
            </FieldLabel>
            <Autocomplete<Commune>
              options={communes}
              autoHighlight
              disabled={communeDisabled}
              isOptionEqualToValue={(o, v) => o.code === v.code}
              getOptionLabel={(opt) => opt?.name ?? ""}
              getOptionKey={(option) => option.code}
              value={
                communes.find((c) => c.code === value.countyCode) ?? 
                (value.countyCode ? { name: value.communeId, code: value.countyCode } : null)
              }
              onChange={(e, c) => {
                // avisamos al hook (para postal)
                onSelectCommune(e, c);
                // y actualizamos **nombre** + **código Chilexpress**
                // Solo actualizar si se selecciona algo, no limpiar si es null
                if (c) {
                  onChange({
                    ...value,
                    communeId: c.name,
                    countyCode: c.code,
                  });
                }
              }}
              slotProps={{
                popper: { sx: { zIndex: 1500 } },
                paper: { sx: autoPaperSx(theme) },
                popupIndicator: autoIndicatorSlots.popupIndicator,
                clearIndicator: autoIndicatorSlots.clearIndicator,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccionar comuna"
                  size="small"
                  sx={inputAutoSx(theme)}
                />
              )}
            />
          </FieldCard>
        </Grid>

        {/* Calle */}
        <Grid item xs={12} sm={8}>
          <FieldCard>
            <FieldLabel>Calle *</FieldLabel>
            <TextField
              placeholder="Ej: Av. Providencia"
              value={value.street}
              onChange={(e) => onChange({ ...value, street: e.target.value })}
              fullWidth
              size="small"
              sx={inputTextSx(theme)}
            />
          </FieldCard>
        </Grid>

        {/* Número */}
        <Grid item xs={12} sm={4}>
          <FieldCard>
            <FieldLabel>Número *</FieldLabel>
            <TextField
              placeholder="Ej: 123"
              value={value.number}
              onChange={(e) => onChange({ ...value, number: e.target.value })}
              fullWidth
              size="small"
              sx={inputTextSx(theme)}
            />
          </FieldCard>
        </Grid>

        {/* Código Postal */}
        <Grid item xs={12}>
          <FieldCard>
            <FieldLabel>Código Postal (Opcional)</FieldLabel>
            <TextField
              placeholder="Ej: 750000"
              value={value.postalCode ?? ""}
              onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
              fullWidth
              size="small"
              sx={inputTextSx(theme)}
            />
          </FieldCard>
        </Grid>

        {/* Referencias */}
        <Grid item xs={12}>
          <FieldCard>
            <FieldLabel>Indicaciones para la entrega (opcional)</FieldLabel>
            <TextField
              placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
              value={value.references ?? ""}
              onChange={(e) => onChange({ ...value, references: e.target.value })}
              fullWidth
              multiline
              minRows={3}
              inputProps={{ maxLength: 128 }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: 14,
                  borderRadius: RADIUS,
                  alignItems: "flex-start",
                  padding: "8px 10px",
                  backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.text.secondary,
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 1,
                },
                "& .MuiInputBase-input": { padding: 0, margin: 0 },
                "& .MuiInputBase-input::placeholder": {
                  opacity: 1,
                  color: theme.palette.text.disabled,
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
              <Typography
                variant="caption"
                color={refsLen >= 120 ? "error.main" : "text.secondary"}
              >
                {refsLen} / 128
              </Typography>
            </Box>
          </FieldCard>
        </Grid>
      </Grid>
    </Box>
  );
}
