// src/layouts/dashboardLayout/menuHeader/HeaderGPI.tsx
import {
  Avatar,
  Box,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
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
  const theme = useTheme();
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

  const RAIL_WIDTH = 72;
  const FULL_WIDTH = 320;
  const currentWidth = collapsed ? RAIL_WIDTH : FULL_WIDTH;

  // ----------- MÓVIL -----------
  if (isMobile) {
    return (
      <nav>
        <Box
          sx={{
            height: 64,
            width: "100%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 2,
          }}
        >
          <IconButton
            onClick={openMenuAction}
            sx={{
              color: theme.palette.primary.contrastText,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={26}
              height={26}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </IconButton>
        </Box>
        <DrawerNav
          closeMenuAction={closeMenuAction}
          openMenu={openMenu}
          menuItems={actionsMenu}
        />
      </nav>
    );
  }

  // ----------- DESKTOP -----------
  return (
    <nav
      style={{
        width: currentWidth,
        transition: "width 200ms ease",
        position: "relative",
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          height: "100%",
          color: theme.palette.primary.contrastText,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {/* Toggle FAB */}
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: collapsed ? "50%" : "auto",
            transform: collapsed ? "translateX(-50%)" : "none",
            right: collapsed ? "auto" : 12,
            width: 50,
            height: 38,
            borderRadius: "80px",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: theme.palette.primary.contrastText,
            background: alpha(theme.palette.primary.contrastText, 0.12),
            border: `0.5px solid ${alpha(
              theme.palette.primary.contrastText,
              0.55
            )}`,
            boxShadow:
              "0 5px 15px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.14)",
            backdropFilter: "blur(2px)",
            transition: "transform .15s ease, background-color .2s ease",
            "&:hover": {
              background: alpha(theme.palette.primary.contrastText, 0.18),
              transform: collapsed
                ? "translateX(-50%) scale(1.04)"
                : "scale(1.04)",
            },
            "&:active": {
              transform: collapsed
                ? "translateX(-50%) scale(.98)"
                : "scale(.98)",
            },
            zIndex: 2,
          }}
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </Box>

        {/* Contenido scrollable del menú */}
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: collapsed ? "48px 12px 12px" : "56px 16px 16px",
          }}
        >
          {/* Logo (solo expandido) */}
          {!collapsed && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 2,
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.08),
                  boxShadow: `0 1px 5px ${alpha(
                    theme.palette.common.black,
                    0.12
                  )}`,
                }}
              >
                <Box
                  component="img"
                  src={logo}
                  alt="PulgaShop"
                  sx={{ width: 200, height: 90, objectFit: "contain" }}
                />
              </Box>
            </Box>
          )}

          {/* ITEMS */}
          <Box
            sx={{
              mt: collapsed ? 1 : 4,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1, // ← separa los botones del menú
            }}
          >
            {actionsMenu.map((item, index) => {
              const active = item.isActive(pathname);

              if (collapsed) {
                return (
                  <Tooltip key={index} title={item.name} placement="right">
                    <Box
                      onClick={() => redirectTo(item.href)}
                      sx={{
                        width: 48,
                        height: 48,
                        mx: "auto",
                        my: 1,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        color: theme.palette.primary.contrastText,
                        cursor: "pointer",
                        transition:
                          "background-color .2s ease, transform .06s ease",
                        bgcolor: active
                          ? alpha(theme.palette.primary.contrastText, 0.14)
                          : "transparent",
                        border: active
                          ? `1px solid ${alpha(
                              theme.palette.primary.contrastText,
                              0.35
                            )}`
                          : "1px solid transparent",
                        "&:hover": {
                          bgcolor: alpha(
                            theme.palette.primary.contrastText,
                            0.18
                          ),
                        },
                        "&:active": { transform: "scale(0.98)" },
                      }}
                    >
                      {item.icon}
                    </Box>
                  </Tooltip>
                );
              }

              return (
                <Box
                  key={index}
                  onClick={() => redirectTo(item.href)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.2,
                    minHeight: 44,
                    borderRadius: 2,
                    cursor: "pointer",
                    overflow: "hidden", // evita solapamiento visual
                    bgcolor: active
                      ? alpha(theme.palette.primary.contrastText, 0.18)
                      : "transparent",
                    border: active
                      ? `0.5px solid ${alpha(
                          theme.palette.primary.contrastText,
                          0.35
                        )}`
                      : "0.5px solid transparent",
                    "&:hover": {
                      bgcolor: alpha(
                        theme.palette.primary.contrastText,
                        0.12
                      ),
                    },
                    transition: "background-color .2s ease, border .2s ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      alignSelf: "stretch",
                      borderRadius: 8,
                      bgcolor: active
                        ? theme.palette.primary.contrastText
                        : "transparent",
                      opacity: active ? 0.9 : 0,
                      transition: "opacity .2s",
                    }}
                  />
                  <Box
                    sx={{
                      color: theme.palette.primary.contrastText,
                      opacity: active ? 1 : 0.9,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    fontSize={18}
                    lineHeight="24px"
                    fontWeight={active ? 700 : 400}
                    color={theme.palette.primary.contrastText}
                  >
                    {item.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Usuario */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              gap: collapsed ? 0 : 1.5,
              p: collapsed ? 1 : 1.5,
            }}
          >
            <Avatar sx={{ width: 40, height: 40, fontSize: 14 }}>JD</Avatar>
            {!collapsed && (
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color={theme.palette.primary.contrastText}
                >
                  John Doe
                </Typography>
                <Typography
                  variant="body2"
                  color={alpha(theme.palette.primary.contrastText, 0.85)}
                >
                  Admin
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </nav>
  );
}
