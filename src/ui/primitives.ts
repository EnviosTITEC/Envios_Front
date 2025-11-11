import { Button, Box, TableContainer, styled, alpha } from "@mui/material";

/* ------------------ Barra superior translúcida ------------------ */
export const TranslucentTopBar = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  backdropFilter: "saturate(120%) blur(4px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
}));

/* ------------------ Botón de texto transparente ------------------ */
export const TransparentButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: theme.typography.pxToRem(13),
  fontWeight: 500,
  color: theme.palette.primary.main,
  backgroundColor: "transparent",
  boxShadow: "none",
  "&:hover": {
    color: theme.palette.primary.dark,
    backgroundColor: "transparent",
  },
  "&:focus": { outline: "none" },
}));

/* ------------------ Tabla con scroll estético ------------------ */
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": { height: 8 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
    borderRadius: 8,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.6),
  },
}));
