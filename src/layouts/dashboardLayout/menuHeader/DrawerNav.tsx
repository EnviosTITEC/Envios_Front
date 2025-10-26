import { Avatar, Box, Drawer, Typography, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { JSX, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// usa tu logo real
import logo from "../../../assets/EII_logo2.svg";

interface DrawerNavProps {
  closeMenuAction: () => void;
  openMenu: boolean;
  menuItems: {
    name: string;
    href: string;
    icon: JSX.Element;
    isActive?: (path: string) => boolean;
  }[];
}

function DrawerNav({ closeMenuAction, openMenu, menuItems }: DrawerNavProps) {
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
        sx: { width: 360, bgcolor: "background.default", borderRight: "none" },
      }}
    >
      <Box className="flex flex-col justify-between p-4 w-full" sx={{ minHeight: "100dvh" }}>
        <div>
          {/* Header del drawer */}
          <Box className="flex flex-row justify-between p-4 items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-15 h-15 rounded-full" alt="avatar">JD</Avatar>
                <div className="ml-4">
                  <h4 className="text-md font-medium text-(--color-green)">John Doe</h4>
                  <p className="text-sm font-light text-(--color-green)">Admin</p>
                </div>
              </div>
            </div>

            <IconButton
              onClick={closeMenuAction}
              aria-label="Cerrar menú"
              sx={{
                color: "text.primary",
                transition: "background-color .2s ease, transform .1s ease",
                "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
                "&:active": { transform: "scale(0.96)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Lista de opciones */}
          <Box className="flex flex-col p-6 pl-10 gap-8 mt-14">
            {menuItems.map((item, index) => {
              const isEnviosRoot = item.name.toLowerCase().includes("envío");

              if (isEnviosRoot) {
                const activeGroup = shippingGroupActive;
                return (
                  <Box key={index} className="flex flex-col gap-3">
                    <Box className="flex flex-row justify-between items-center">
                      <Box
                        className="flex flex-row items-center gap-4 cursor-pointer"
                        onClick={() => go(item.href)}
                        sx={{
                          px: 1,
                          py: 0.75,
                          borderRadius: 2,
                          background: activeGroup ? "rgba(90,127,120,0.10)" : "transparent",
                        }}
                      >
                        <div style={{ color: activeGroup ? "#314C53" : "inherit" }}>{item.icon}</div>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 700,
                            lineHeight: "20px",
                            color: activeGroup ? "var(--ps-teal-dark, #314C53)" : "text.primary",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => setOpenEnvios((v) => !v)}
                        aria-label={openEnvios ? "Contraer Envíos" : "Expandir Envíos"}
                        sx={{ color: "text.primary", "&:hover": { bgcolor: "rgba(0,0,0,0.06)" } }}
                      >
                        {openEnvios ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={22} height={22}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 14.25-7.5-7.5-7.5 7.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={22} height={22}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        )}
                      </IconButton>
                    </Box>

                    {/* submenú */}
                    <Collapse in={openEnvios} timeout="auto" unmountOnExit>
                      <Box className="flex flex-col gap-3 pl-6">
                        {shippingSubitems.map((sub) => {
                          const subActive = isActive(sub.href, true);
                          return (
                            <Box
                              key={sub.href}
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => go(sub.href)}
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: 2,
                                background: subActive ? "rgba(90,127,120,0.08)" : "transparent",
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 6,
                                  height: 6,
                                  borderRadius: 999,
                                  background: subActive ? "#5A7F78" : "transparent",
                                  boxShadow: subActive ? "0 0 0 2px rgba(90,127,120,0.25)" : "none",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  color: subActive ? "var(--ps-teal-dark, #314C53)" : "text.primary",
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

              // Item simple (Home)
              const activeExact = isActive(item.href, true);
              return (
                <Box
                  key={index}
                  className="flex flex-row justify-between items-center cursor-pointer"
                  onClick={() => go(item.href)}
                >
                  <Box
                    className="flex flex-row items-center gap-4"
                    sx={{
                      px: 1,
                      py: 0.75,
                      borderRadius: 2,
                      background: activeExact ? "rgba(90,127,120,0.10)" : "transparent",
                    }}
                  >
                    <div style={{ color: activeExact ? "#314C53" : "inherit" }}>{item.icon}</div>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: activeExact ? 700 : 600,
                        lineHeight: "20px",
                        color: activeExact ? "var(--ps-teal-dark, #314C53)" : "text.primary",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </div>

        {/* Footer del drawer */}
        <Box className="flex flex-col items-center p-4 gap-3">
          <Box
            sx={{
              display: "inline-block",
              p: 1,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.04)",
              boxShadow: "0 1px 5px rgba(0,0,0,.12)",
            }}
          >
            <Box component="img" src={logo} alt="PulgaShop" sx={{ width: 200, height: 90, objectFit: "contain" }} />
          </Box>

          <button
            className="text-md font-normal leading-6 cursor-pointer underline p-1 text-(--color-green)"
            onClick={() => go("/auth/login")}
          >
            Cerrar sesión
          </button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default DrawerNav;
