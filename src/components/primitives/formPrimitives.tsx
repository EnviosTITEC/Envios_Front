import { alpha, styled } from "@mui/material/styles";
import { Box, IconButton, Typography } from "@mui/material";

/** Radio y bordes coherentes en todo el formulario */
export const RADIUS = 8;
export const SUBTLE_BORDER = (theme: any) =>
  `1px solid ${alpha(theme.palette.divider, 0.5)}`;

/** Contenedor visual de cada campo */
export const FieldCard = styled(Box)(({ theme }) => ({
  border: SUBTLE_BORDER(theme),
  background: "#fff",
  borderRadius: RADIUS,
  padding: 10,
  transition: "border-color .12s ease, box-shadow .12s ease, background .12s",
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.18)}`,
    background: "#fff",
  },
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.2,
  color: alpha(theme.palette.text.primary, 0.9),
  marginBottom: 4,
}));

/**
 * Estilo base para TextField / Autocomplete (outlined)
 * - Mismos altos (~40px)
 * - Misma tipografía
 */
/** Inputs compactos y alineados verticalmente */
/** Inputs compactos y alineados verticalmente */
/** Base común */
const baseInput = (theme: any) => ({
  "& .MuiInputBase-root": {
    height: 40,
    fontSize: 14,
    borderRadius: RADIUS,
    backgroundColor: "#fff",
    alignItems: "center",
    position: "relative",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.divider, 0.6),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.5),
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
  "& .MuiInputBase-input": { padding: "0 8px" },
  "& .MuiInputBase-input::placeholder": {
    opacity: 1,
    color: alpha(theme.palette.text.primary, 0.45),
  },
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.disabled, 0.25),
  },
});

/** TextField (Calle, Número, etc.) – sin adornos especiales */
export const inputTextSx = (theme: any) => ({
  ...baseInput(theme),
});

/** Autocomplete – habilitado limpio, chevron grande; deshabilitado con borde punteado */
export const inputAutoSx = (theme: any) => ({
  ...baseInput(theme),

  /* ===== Campo normal (habilitado) ===== */
  "& .MuiInputBase-root": {
    ...baseInput(theme)["& .MuiInputBase-root"],
    paddingRight: 40,              // espacio para el chevron grande
    borderRadius: RADIUS,
    backgroundColor: "#fff",
  },

  // Borde del fieldset (idle / hover / focus)
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.28),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.45),
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },

  /* End-adornment: contenedor de íconos a la derecha */
  "& .MuiAutocomplete-endAdornment": {
    position: "absolute",
    right: 6,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 1,
    background: "transparent",
    border: "none",
    padding: 0,
  },

  // Botones sin fondo, área de click más grande
  "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator": {
    m: 0,
    p: 0,
    width: 25,     // ↑ agranda área de click del chevron
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    boxShadow: "none",
    bgcolor: "transparent",
  },

  // Tamaño/color del chevron y del clear
  "& .MuiAutocomplete-popupIndicator .MuiSvgIcon-root": {
    fontSize: 28,                    // ↑ tamaño del triángulo
    color: theme.palette.primary.main,
  },
  "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
    fontSize: 18,
  },

  /* ===== Estado DESHABILITADO (borde punteado rectangular) ===== */
  "& .MuiInputBase-root.Mui-disabled": {
    paddingRight: 12,                                 // sin adornos
    backgroundColor: theme.palette.background.paper,  // evita "pill"
    borderRadius: `${RADIUS}px !important`,
  },
  // oculta adornos cuando está deshabilitado
  "& .MuiInputBase-root.Mui-disabled .MuiAutocomplete-endAdornment": {
    display: "none",
  },
  // borde punteado en todo el fieldset
  "& .MuiInputBase-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderStyle: "dashed",
    borderColor: alpha(theme.palette.text.primary, 0.28),
    borderRadius: `${RADIUS}px !important`,
    borderWidth: "1px !important",
  },
  // quita el notch visual
  "& .MuiInputBase-root.Mui-disabled .MuiOutlinedInput-notchedOutline legend": {
    width: 0,
  },
  // placeholder más visible en disabled
  "& .MuiInputBase-root.Mui-disabled .MuiInputBase-input::placeholder": {
    color: alpha(theme.palette.text.primary, 0.55),
  },
});


/** Dropdown del Autocomplete – compacto y sin "pill" */
export const autoPaperSx = (theme: any) => ({
  borderRadius: "8px !important",
  boxShadow: "0 12px 28px rgba(0,0,0,.12)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  overflow: "hidden",
  mt: 0.5,

  /* lista interna */
  "& .MuiAutocomplete-listbox": {
    padding: 1,
    maxHeight: 225,                            // ↓ alto total del menú
  },

  /* cada opción: más densa y sin pill */
  "& .MuiAutocomplete-option": {
    margin: "0 !important",
    borderRadius: "4px !important",            // bordes moderados
    padding: "6px 10px !important",            // ↓ padding = opción más baja
    minHeight: 32,                              // ↓ altura mínima
    fontSize: 14,
    lineHeight: 1.25,
    position: "relative",
    "&::before": { display: "none !important" },
    "&::after":  { display: "none !important" },
  },

  /* hover/seleccionado sutil */
  "& .MuiAutocomplete-option.Mui-focused, & .MuiAutocomplete-option[aria-selected='true']": {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.10)} !important`,
    borderRadius: "4px !important",
  },

  /* scrollbar discreto y angosto */
  "& .MuiAutocomplete-listbox::-webkit-scrollbar": { width: 6 },
  "& .MuiAutocomplete-listbox::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.text.primary, 0.25),
    borderRadius: 6,
  },
});

/** Estilo simple para los íconos del Autocomplete */
export const autoIndicatorSlots = {
  popupIndicator: {
    sx: {
      p: 0,
      mr: 0.5,
      bgcolor: "transparent",
      border: "none",
      borderRadius: 0,
      "& .MuiSvgIcon-root": {
        fontSize: 25,
        color: (t: any) => t.palette.text.secondary,
        transition: "color 0.2s ease",
      },
      "&:hover .MuiSvgIcon-root": {
        color: (t: any) => t.palette.primary.main,
      },
      "&:hover": {
        bgcolor: "transparent",
        borderColor: "transparent",
      },
    },
  },
  clearIndicator: {
    sx: {
      p: 0,
      mr: 0.5,
      bgcolor: "transparent",
      border: "none",
      borderRadius: 0,
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: (t: any) => t.palette.text.secondary,
        transition: "color 0.2s ease",
      },
      "&:hover .MuiSvgIcon-root": {
        color: (t: any) => t.palette.primary.main,
      },
      "&:hover": {
        bgcolor: "transparent",
        borderColor: "transparent",
      },
    },
  },
};

/** Botón suave para acciones en tabla, coherente con el diseño */
export const SoftIconButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 6,
  backgroundColor: "#ffffff",
  color: "#111827",
  border: SUBTLE_BORDER(theme),
  boxShadow: "0 1px 3px rgba(15,23,42,.12)",
  transition: "transform .15s ease, box-shadow .15s ease, color .15s",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 10px rgba(15,23,42,.18)",
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&:active": {
    transform: "none",
    boxShadow: "0 2px 5px rgba(15,23,42,.18)",
  },
}));
