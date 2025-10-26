import * as React from "react";
import { Button, ButtonProps } from "@mui/material";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

/**
 * NavButton: botón de navegación estilo “fantasma”
 * - Permite usar `to="/ruta"` con RouterLink sin errores de tipo.
 * - Ideal para enlaces tipo “Volver a…” o navegación interna.
 */
type NavButtonProps = ButtonProps & {
  to?: RouterLinkProps["to"];
};

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ to, sx, ...rest }, ref) => (
    <Button
      ref={ref}
      component={RouterLink} // ✅ lo vinculamos aquí
      to={to ?? "/"}
      variant="text"
      color="primary"
      size="small"
      disableElevation
      {...rest}
      sx={{
        px: 1,
        minHeight: 22,
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 1,
        textTransform: "none",
        color: "#5A7F78",
        "&:hover": {
          color: "#314C53",
          backgroundColor: "transparent",
        },
        ...sx,
      }}
    />
  )
);

NavButton.displayName = "NavButton";
export default NavButton;
