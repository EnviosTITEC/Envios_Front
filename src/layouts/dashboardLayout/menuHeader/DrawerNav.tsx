//src/layouts/dashboardLayout/menuHeader/DrawerNav.tsx
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import type React from "react";

// usa tu logo real
import logo from "../../../assets/EII_logo2.svg";

interface DrawerNavProps {
  closeMenuAction: () => void;
  openMenu: boolean;
  menuItems: {
    name: string;
    href: string;
    icon: React.ReactNode;
    isActive?: (path: string) => boolean;
  }[];
}

export default function DrawerNav({
  closeMenuAction,
  openMenu,
  menuItems,
}: DrawerNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const go = (path: string) => {
    navigate(path);
    closeMenuAction();
  };

  // subrutas de Envíos
  const [openEnvios, setOpenEnvios] = useState<boolean>(true);
  const shippingSubitems = [
    { name: "Direcciones", href: "/shipping/addresses" },
    { name: "Cotización", href: "/shipping/quote" },
    { name: "Envíos", href: "/shipping/shipments" },
    { name: "Seguimiento", href: "/shipping/tracking" },
    { name: "Transportistas", href: "/shipping/carriers" },
  ];

  // helper activo (exacto opcional)
  const isActive = (href: string, exact = false) => {
    const p = location.pathname;
    return exact ? p === href : p === href || p.startsWith(href + "/");
  };

  const shippingGroupActive = isActive("/shipping");

  return (
    <Drawer
      anchor="right"
      open={openMenu}
      onClose={closeMenuAction}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: (t) => ({
          width: 360,
          bgcolor: t.palette.background.default,
          borderLeft: "none",
        }),
      }}
    >
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
          gap: 2,
          width: "100%",
        }}
      >
        {/* Header del drawer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48 }}>JD</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                John Doe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admin
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={closeMenuAction}
            aria-label="Cerrar menú"
            sx={{
              color: "text.primary",
              transition: "background-color .2s ease, transform .1s ease",
              "&:hover": { bgcolor: (t) => alpha(t.palette.text.primary, 0.06) },
              "&:active": { transform: "scale(0.96)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Lista de opciones */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, px: 3, mt: 2 }}>
          {menuItems.map((item, index) => {
            const isEnviosRoot = item.name.toLowerCase().includes("envío");
            if (isEnviosRoot) {
              const activeGroup = shippingGroupActive;
              return (
                <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      onClick={() => go(item.href)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 1,
                        py: 0.75,
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: (t) =>
                          activeGroup ? alpha(t.palette.primary.main, 0.10) : "transparent",
                        transition: "background-color .15s ease",
                      }}
                    >
                      <Box
                        sx={{
                          color: activeGroup ? "primary.dark" : "text.primary",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: "20px",
                          color: activeGroup ? "primary.dark" : "text.primary",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => setOpenEnvios((v) => !v)}
                      aria-label={openEnvios ? "Contraer Envíos" : "Expandir Envíos"}
                      sx={{
                        color: "text.primary",
                        "&:hover": { bgcolor: (t) => alpha(t.palette.text.primary, 0.06) },
                      }}
                    >
                      {openEnvios ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          width={22}
                          height={22}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 14.25-7.5-7.5-7.5 7.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          width={22}
                          height={22}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      )}
                    </IconButton>
                  </Box>

                  {/* submenú */}
                  <Collapse in={openEnvios} timeout="auto" unmountOnExit>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pl: 4 }}>
                      {shippingSubitems.map((sub) => {
                        const subActive = isActive(sub.href, true);
                        return (
                          <Box
                            key={sub.href}
                            onClick={() => go(sub.href)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              px: 1,
                              py: 0.5,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "background-color .15s ease",
                              bgcolor: (t) =>
                                subActive ? alpha(t.palette.primary.main, 0.08) : "transparent",
                              "&:hover": {
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.10),
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: 999,
                                bgcolor: subActive ? "primary.main" : "transparent",
                                boxShadow: (t) =>
                                  subActive ? `0 0 0 2px ${alpha(t.palette.primary.main, 0.25)}` : "none",
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 15,
                                lineHeight: "20px",
                                color: subActive ? "primary.dark" : "text.primary",
                                fontWeight: subActive ? 700 : 400,
                              }}
                            >
                              {sub.name}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                </Box>
              );
            }

            // Item simple (Home o similares)
            const activeExact = isActive(item.href, true);
            return (
              <Box
                key={index}
                onClick={() => go(item.href)}
                sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 1,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: (t) =>
                      activeExact ? alpha(t.palette.primary.main, 0.10) : "transparent",
                    transition: "background-color .15s ease",
                  }}
                >
                  <Box
                    sx={{
                      color: activeExact ? "primary.dark" : "text.primary",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: activeExact ? 700 : 600,
                      lineHeight: "20px",
                      color: activeExact ? "primary.dark" : "text.primary",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Footer del drawer */}
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            gap: 1.5,
            p: 2,
          }}
        >
          <Box
            sx={(t) => ({
              display: "inline-block",
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(t.palette.text.primary, 0.04),
              boxShadow: `0 1px 5px ${alpha(t.palette.common.black, 0.12)}`,
            })}
          >
            <Box
              component="img"
              src={logo}
              alt="PulgaShop"
              sx={{ width: 200, height: 90, objectFit: "contain" }}
            />
          </Box>

          <Button
            variant="text"
            color="primary"
            onClick={() => go("/auth/login")}
            sx={{ textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
