import { Box, Container, Button, useTheme, alpha } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/EII_logo.svg";

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Envíos", path: "/shipping" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
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
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 70,
            gap: 3,
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
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

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flex: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: "inherit",
                  fontSize: "0.95rem",
                  fontWeight: isActive(item.path) ? 600 : 500,
                  position: "relative",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: alpha(theme.palette.primary.contrastText, 0.8),
                  },
                  ...(isActive(item.path) && {
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      right: 0,
                      height: 3,
                      bgcolor: "white",
                      borderRadius: "2px 2px 0 0",
                    },
                  }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            sx={{
              bgcolor: alpha(theme.palette.primary.contrastText, 0.2),
              color: "inherit",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.contrastText, 0.3),
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Salir
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
