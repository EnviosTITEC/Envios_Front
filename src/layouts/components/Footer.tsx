import { Box, Container, Typography, Link, useTheme } from "@mui/material";
import logo from "../../assets/EII_logo.svg";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: theme.palette.primary.contrastText,
        mt: "auto",
        pt: 6,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Company Info */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="PulgaShop"
                sx={{ height: 60, width: "auto" }}
              />
            </Box>
          </Box>

          {/* Company Links */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Link
                href="#"
                sx={{
                  color: "inherit",
                  opacity: 0.8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              >
                About us
              </Link>
              <Link
                href="#"
                sx={{
                  color: "inherit",
                  opacity: 0.8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              >
                Blog
              </Link>
              <Link
                href="#"
                sx={{
                  color: "inherit",
                  opacity: 0.8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              >
                Contact us
              </Link>
            </Box>
          </Box>

          {/* Support Links */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Link
                href="#"
                sx={{
                  color: "inherit",
                  opacity: 0.8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              >
                Help center
              </Link>
              <Link
                href="#"
                sx={{
                  color: "inherit",
                  opacity: 0.8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              >
                Terms of service
              </Link>
              <Link
                href="#"
                sx={{
                  color: "inherit",
                  opacity: 0.8,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              >
                Legal
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.primary.contrastText}`,
            opacity: 0.6,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="caption">
            Copyright © 2024 PulgaShop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
