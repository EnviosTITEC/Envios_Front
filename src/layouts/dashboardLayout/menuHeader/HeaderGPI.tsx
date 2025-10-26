// HeaderGPI.tsx
/**
 * Menú lateral (Desktop retraíble + Móvil drawer)
 * – Flecha de colapso centrada en rail y a la derecha cuando está expandido
 */
import { Avatar, Box, Typography, Tooltip } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DrawerNav from "./DrawerNav";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/EII_logo.svg";

interface HeaderGPIProps {
  isMobile?: boolean;
}

export default function HeaderGPI({ isMobile = false }: HeaderGPIProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const actionsMenu = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={24}
          height={24}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      isActive: (p: string) => p === "/",
    },
    {
      name: "Envíos",
      href: "/shipping",
      icon: <LocalShippingIcon sx={{ fontSize: 24 }} />,
      isActive: (p: string) => p === "/shipping" || p.startsWith("/shipping/"),
    },
  ];

  // Drawer móvil
  const [openMenu, setOpenMenu] = useState(false);
  const openMenuAction = () => setOpenMenu(true);
  const closeMenuAction = () => setOpenMenu(false);

  // Rail desktop
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("ps_nav_collapsed");
    return saved === "1";
  });
  useEffect(() => {
    localStorage.setItem("ps_nav_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const redirectTo = (path: string) => navigate(path);

  const RAIL_WIDTH = 72;    // ancho del rail colapsado
  const FULL_WIDTH = 320;   // ancho expandido
  const currentWidth = collapsed ? RAIL_WIDTH : FULL_WIDTH;

  /* -------------------- MÓVIL -------------------- */
  if (isMobile) {
    return (
      <nav>
        <div className="h-16 w-full bg-(--color-green)">
          <div className="flex w-full h-full items-center justify-end p-4 py-0">
            <div
              onClick={openMenuAction}
              className="cursor-pointer p-2 text-white hover:bg-white rounded-full hover:bg-opacity-10 hover:text-(--color-darkgreen)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </div>
        </div>
        <DrawerNav closeMenuAction={closeMenuAction} openMenu={openMenu} menuItems={actionsMenu} />
      </nav>
    );
  }

  /* ------------------ DESKTOP -------------------- */
  return (
    <nav
      className="flex flex-col bg-(--color-green) h-full overflow-hidden"
      style={{
        width: currentWidth,
        transition: "width 200ms ease",
        position: "relative",           // para posicionar la flecha
      }}
    >
      {/* Toggle FAB (no altera los círculos de los íconos) */}
      <Box
        sx={{
          position: "absolute",
          top: 14,
          // centrado cuando está colapsado; pegado a la derecha cuando está expandido
          left: collapsed ? "50%" : "auto",
          transform: collapsed ? "translateX(-50%)" : "none",
          right: collapsed ? "auto" : 12,
          width: 50,
          height: 38,
          borderRadius: "80px",
          display: "grid",
          placeItems: "center",
          color: "#fff",
          cursor: "pointer",
          // mismo lenguaje visual que tus círculos: borde + halo suave
          background: "rgba(255,255,255,0.12)",
          border: "0.5px solid rgba(255,255,255,0.55)",
          boxShadow:
            "0 5px 15px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.14)",
          backdropFilter: "blur(2px)",
          transition: "transform .15s ease, background-color .2s ease",
          "&:hover": {
            background: "rgba(255,255,255,0.18)",
            transform: collapsed ? "translateX(-50%) scale(1.04)" : "scale(1.04)",
          },
          "&:active": {
            transform: collapsed ? "translateX(-50%) scale(.98)" : "scale(.98)",
          },
          zIndex: 2,
        }}
        onClick={() => setCollapsed(v => !v)}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Box>

      {/* Contenido scrollable del menú */}
      <div
        className="flex flex-col justify-between"
        style={{
          height: "100%",
          padding: collapsed ? "48px 12px 12px" : "56px 16px 16px", // deja espacio a la flecha arriba
        }}
      >
        {/* Logo (solo expandido) */}
        {!collapsed && (
          <Box width="100%" className="flex flex-col justify-center items-center pt-4 pb-2">
            <Box
              sx={{
                display: "inline-block",
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.08)",
                boxShadow: "0 1px 5px rgba(0,0,0,.12)",
              }}
            >
              <Box component="img" src={logo} alt="PulgaShop" sx={{ width: 200, height: 90, objectFit: "contain" }} />
            </Box>
          </Box>
        )}

        {/* ITEMS */}
        <Box className="flex-1 w-full" sx={{ mt: collapsed ? 1 : 4 }}>
          {actionsMenu.map((item, index) => {
            const active = item.isActive(pathname);

            if (collapsed) {
              // Rail colapsado: botón cuadrado 48x48 centrado
              return (
                <Tooltip key={index} title={item.name} placement="right">
                  <Box
                    onClick={() => redirectTo(item.href)}
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      my: 1,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "background-color .2s ease, transform .06s ease",
                      bgcolor: active ? "rgba(255,255,255,0.14)" : "transparent",
                      border: active ? "1px solid rgba(255,255,255,.35)" : "1px solid transparent",
                      "&:hover": { bgcolor: "rgba(255,255,255,.18)" },
                      "&:active": { transform: "scale(0.98)" },
                    }}
                  >
                    {item.icon}
                  </Box>
                </Tooltip>
              );
            }

            // Rail expandido
            return (
              <div
                key={index}
                onClick={() => redirectTo(item.href)}
                className="group flex items-center gap-3 rounded-lg cursor-pointer"
                style={{
                  padding: "12px",
                  border: active ? "0.5px solid rgba(255,255,255,.35)" : "0.5px solid transparent",
                  background: active ? "rgba(255,255,255,0.18)" : "transparent",
                }}
              >
                <span
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    borderRadius: 8,
                    background: active ? "#F7F8FC" : "transparent",
                    opacity: active ? 0.9 : 0,
                    transition: "opacity .2s",
                  }}
                />
                <div
                  className="text-white group-hover:text-[#FFFFFF]"
                  style={{ opacity: active ? 1 : 0.9 }}
                >
                  {item.icon}
                </div>
                <Typography
                  fontSize={18}
                  lineHeight={"24px"}
                  fontWeight={active ? 700 : 400}
                  sx={{ color: "#F7F8FC" }}
                >
                  {item.name}
                </Typography>
              </div>
            );
          })}
        </Box>

        {/* Usuario */}
        <div
          className="flex items-center rounded-lg"
          style={{
            padding: collapsed ? 8 : "8px 12px",
            gap: collapsed ? 0 : 10,
          }}
        >
          <Avatar className="w-10 h-10 rounded-full" alt="avatar" sx={{ fontSize: 14 }}>
            JD
          </Avatar>
          {!collapsed && (
            <div>
              <h4 className="text-md font-medium text-white leading-tight">John Doe</h4>
              <p className="text-sm font-light text-white mt-[-2px]">Admin</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
