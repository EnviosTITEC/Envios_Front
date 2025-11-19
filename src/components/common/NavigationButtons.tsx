import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

interface NavigationButtonsProps {
  showBackToShipping?: boolean;
  showBackToHome?: boolean;
  sx?: any;
}

/**
 * Componente de botones de navegación reutilizable
 * Proporciona botones para volver a Shipping o al inicio de PulgaShop
 */
export default function NavigationButtons({
  showBackToShipping = true,
  showBackToHome = true,
  sx,
}: NavigationButtonsProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        justifyContent: "space-between",
        alignItems: "center",
        ...sx,
      }}
    >
      {showBackToShipping && (
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/shipping")}
          sx={{
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
              bgcolor: "transparent",
            },
          }}
        >
          Volver a Envíos
        </Button>
      )}
      
      {showBackToHome && (
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="text"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "transparent",
              },
            }}
          >
            Volver a PulgaShop
          </Button>
        </Box>
      )}
    </Box>
  );
}
