import { Box, useTheme, alpha, IconButton, Drawer, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";
import logo from "../../assets/EII_logo.svg";

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado simple - integrar con auth real después

  const navItems = [
    { label: "Envíos", path: "/shipping" },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/auth/login");
    setSideMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/auth/login");
    setSideMenuOpen(false);
  };

  return (
    <Box
      component="nav"
      sx={{
        bgcolor: "primary.main",
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[2],
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 70,
        px: 5,
      }}
    >
      {/* LEFT - Hamburger Menu */}
      <IconButton
        onClick={() => setSideMenuOpen(true)}
        sx={{
          color: "inherit",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
          },
        }}
      >
        <MenuIcon sx={{ fontSize: 28 }} />
      </IconButton>

      {/* CENTER - Logo */}
      <Box
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "opacity 0.2s",
          "&:hover": { opacity: 0.8 },
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="PulgaShop"
          sx={{ height: 45, width: "auto" }}
        />
      </Box>

      {/* RIGHT - Empty for balance */}
      <Box sx={{ width: 40 }} />

      {/* SIDEBAR MENU - Left Drawer */}
      <Drawer
        anchor="left"
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "background.paper",
            width: 280,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2,
          }}
        >
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <IconButton onClick={() => setSideMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => (
              <Box
                key={item.path}
                component="a"
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setSideMenuOpen(false);
                }}
                sx={{
                  padding: "12px 16px",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  display: "block",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Login/Logout Button */}
          {!isLoggedIn ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{ mt: 2 }}
            >
              Ingresar
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Salir
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
