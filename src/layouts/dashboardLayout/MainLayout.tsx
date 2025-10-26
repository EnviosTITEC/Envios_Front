import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import HeaderGPI from "./menuHeader/HeaderGPI";

function MainLayout() {
  const theme = useTheme();
  // ↓ breakpoint más bajo para que el zoom no dispare modo móvil
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // antes usabas 1024 (lg)

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Header + menú: pasa isMobile según breakpoint */}
        <HeaderGPI isMobile={!isDesktop} />

        <main className="flex-1 overflow-y-auto">
          <Box
            sx={{
              px: 3,        // ≈ Tailwind p-6
              py: 4,
              minHeight: "100dvh",
              bgcolor: "background.default", // usa el tema (blanco)
            }}
          >
            <Outlet />
          </Box>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
