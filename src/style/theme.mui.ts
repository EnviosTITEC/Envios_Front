import { createTheme, alpha, type ThemeOptions } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { getPulgaTheme } from "pulga-shop-ui";

const base = getPulgaTheme();

// Color primario (ajústalo si quieres otro)
base.palette.primary = {
  ...base.palette.primary,
  main: "#528275",
  light: "#6e9a8e",
  dark: "#3a5e55",
  contrastText: "#ffffff",
};

// Overrides
const { palette } = base;
const overrides: ThemeOptions = {
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          border: `1px solid ${alpha(palette.primary.main, 0.08)}`,
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiAutocomplete: {
      defaultProps: { size: "small" },
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: "0 12px 28px rgba(0,0,0,.12)",
          border: `1px solid ${alpha(palette.primary.main, 0.08)}`,
        },
        listbox: { padding: 6, maxHeight: 280 },
        option: {
          borderRadius: 6,
          padding: "8px 10px",
          margin: "2px 6px",
          minHeight: 36,
          "&::before": { display: "none" },
          "&::after": { display: "none" },
          "&[aria-selected='true']": {
            backgroundColor: alpha(palette.primary.main, 0.1),
          },
          "&.Mui-focused": {
            backgroundColor: alpha(palette.primary.main, 0.12),
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: palette.background.paper,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(palette.text.primary, 0.18),
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(palette.primary.main, 0.5),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.primary.main,
            borderWidth: 2,
          },
        },
        input: { paddingTop: 12, paddingBottom: 12 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: alpha(palette.text.primary, 0.75) },
        asterisk: { color: palette.error.main },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: "none", fontWeight: 600 },
        contained: { boxShadow: "0 6px 14px rgba(0,0,0,0.08)" },
      },
      variants: [
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            borderColor: alpha(palette.primary.main, 0.25),
            backgroundColor: alpha(palette.primary.main, 0.04),
            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.08),
              borderColor: alpha(palette.primary.main, 0.4),
            },
          },
        },
        {
          props: { variant: "contained", size: "small" },
          style: {
            borderRadius: 10,
            padding: "6px 14px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
          },
        },
      ],
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          border: `1px solid ${alpha(palette.primary.main, 0.06)}`,
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.primary.main,
          "& .MuiTableCell-root": {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            fontWeight: 700,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*:focus-visible": { outline: "none" },
        "*, *::before, *::after": {
          scrollbarColor: `${palette.primary.main} transparent`,
          scrollbarWidth: "thin",
        },
        "*::-webkit-scrollbar": { width: 8, height: 8 },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(palette.primary.main, 0.4),
          borderRadius: 8,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha(palette.primary.main, 0.6),
        },
      },
    },
  },
};

const merged = deepmerge(base, overrides);
const theme = createTheme(merged as ThemeOptions);

export default theme;
