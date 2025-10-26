// src/ui/primitives.ts
import { Button, Box, TableContainer, styled, alpha } from "@mui/material";

/* Barra superior translúcida */
export const TranslucentTopBar = styled(Box)({
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "transparent",
  backdropFilter: "saturate(120%) blur(2px)",
  borderBottom: "1px solid #5A7F78",
});

/* Botón de texto (como los de “Volver a Envíos”) */
export const TransparentButton = styled(Button)({
  textTransform: "none",
  fontSize: 13,
  fontWeight: 500,
  color: "#5A7F78",
  backgroundColor: "transparent",
  "&:hover": {
    color: "#314C53",
    backgroundColor: "transparent",
  },
  boxShadow: "none",
});

/* Tabla con scroll bonito */
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.06)",
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  "&::-webkit-scrollbar": { height: 10 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(90,127,120,0.45)",
    borderRadius: 8,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(90,127,120,0.65)",
  },
}));
