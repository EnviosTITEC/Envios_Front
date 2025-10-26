// theme.mui.ts
import { createTheme } from "@mui/material/styles";

const TEAL = "#5A7F78";
const TEAL_DARK = "#314C53";

const theme = createTheme({
  palette: {
    primary: { main: TEAL },
    background: {
      default: "#F0FDF4",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F1F1F",
      secondary: "#5F5F5F",
    },
  },

  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.3px" },
  },

  components: {
    /* --- Reset y estilos globales reutilizables (Paso 4) --- */
    MuiCssBaseline: {
      styleOverrides: {
        /* Scrollbar global (coincide con tus tablas) */
        "*, *::before, *::after": {
          scrollbarColor: `${TEAL} transparent`,
          scrollbarWidth: "thin",
        },
        "*::-webkit-scrollbar": { height: 8, width: 8 },
        "*::-webkit-scrollbar-track": { background: "transparent" },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(90,127,120,0.4)",
          borderRadius: 8,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(90,127,120,0.6)",
        },
      },
    },

    /* --- Botones (incluye variante “cta” para Nueva dirección) --- */
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: "10px 18px", boxShadow: "none" },
        contained: { boxShadow: "0 2px 6px rgba(0,0,0,0.10)" },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary", size: "medium" },
          style: {
            backgroundColor: TEAL,
            "&:hover": { backgroundColor: TEAL_DARK, boxShadow: "0 4px 10px rgba(0,0,0,0.12)" },
          },
        },
        {
          // variante super-liviana para “Nueva dirección”
          props: { variant: "contained", color: "primary", size: "small" },
          style: {
            padding: "8px 14px",
            borderRadius: 10,
            backgroundColor: TEAL,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "&:hover": {
              backgroundColor: TEAL_DARK,
              boxShadow: "0 4px 10px rgba(0,0,0,0.10)",
            },
          },
        },
        {
          // “ghost” para los botones de la barra superior (sin fondos raros)
          props: { variant: "text", color: "primary" },
          style: {
            color: TEAL,
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": { backgroundColor: "transparent", color: TEAL_DARK },
            "&:active": { backgroundColor: "transparent" },
            "&:focus": { backgroundColor: "transparent" },
          },
        },
      ],
    },

    /* --- Card por defecto de páginas --- */
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" },
      },
    },

    /* --- Tabla: header consistente --- */
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: TEAL,
          "& .MuiTableCell-root": { backgroundColor: TEAL, color: "#fff", fontWeight: 700 },
        },
      },
    },
  },
});

export default theme;
