// src/components/common/feedback/ModeView.tsx
import { useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Fab, Tooltip } from "@mui/material";
import { createTheme, type ThemeOptions, PaletteMode } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { getPulgaTheme } from "pulga-shop-ui";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";

type Mode = "light" | "dark";
const STORAGE_KEY = "themeMode";

function getInitialMode(): Mode {
  const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ModeView({ children }: { children?: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  // Seguir cambios del sistema si el usuario no fijó manualmente un modo
  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;
    const handler = (e: MediaQueryListEvent) => {
      const manual = localStorage.getItem(STORAGE_KEY);
      if (!manual) setMode(e.matches ? "dark" : "light");
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  // Persistir modo y exponerlo a CSS global vía data-theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = useMemo(() => {
    const base = getPulgaTheme();

    // 1) Forzar modo
    base.palette.mode = mode as PaletteMode;

    // 2) Sobrescribir primario AQUÍ (ajusta si quieres otro tono)
    base.palette.primary = {
      ...base.palette.primary,
      main: "#528275",
      light: "#6e9a8e",
      dark: "#3a5e55",
      contrastText: "#ffffff",
    };

    // 3) Si tienes overrides adicionales, agrégalos en este objeto
    const overrides: ThemeOptions = {
      palette: { mode: base.palette.mode, primary: base.palette.primary },
    };

    const merged = deepmerge(base, overrides);
    return createTheme(merged as ThemeOptions);
  }, [mode]);

  const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <Tooltip title={mode === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}>
        <Fab
          color="primary"
          aria-label="toggle theme"
          onClick={toggle}
          sx={{ position: "fixed", bottom: 24, right: 24, zIndex: (t) => t.zIndex.drawer + 2 }}
        >
          {mode === "dark" ? <LightModeIcon /> : <ModeNightIcon />}
        </Fab>
      </Tooltip>
    </ThemeProvider>
  );
}
