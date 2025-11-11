// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import HeaderGPI from "./menuHeader/HeaderGPI";
import { useEffect, useState } from "react";

/**
 * Layout principal PulgaShop
 * - Detección móvil robusta (usa visualViewport cuando está disponible).
 * - Funciona de forma consistente aunque cambies el % de zoom.
 */
export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(false);

  // Cambia este valor si quieres que el menú colapse antes o después
  const MOBILE_CUTOFF = 1280;

  const readViewportWidth = () =>
    (window as any).visualViewport?.width ?? window.innerWidth;

  useEffect(() => {
    const update = () => {
      const vw = readViewportWidth();
      setIsMobile(vw < MOBILE_CUTOFF);
    };

    update();
    window.addEventListener("resize", update);
    (window as any).visualViewport?.addEventListener?.("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      (window as any).visualViewport?.removeEventListener?.("resize", update);
    };
  }, [MOBILE_CUTOFF]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flex: 1,
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Menú: Drawer en móvil, rail en desktop */}
        <HeaderGPI isMobile={isMobile} />

        {/* Contenido */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
