// src/ui/NavButton.tsx
import * as React from "react";
import { Button, ButtonProps } from "@mui/material";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

/**
 * NavButton: botón de navegación estilo “ghost” coherente con el tema PulgaShop.
 * - Usa el color primario del theme.
 * - Ideal para navegación interna tipo “Volver” o enlaces de toolbar.
 */
type NavButtonProps = ButtonProps & {
  to?: RouterLinkProps["to"];
};

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ to, sx, ...rest }, ref) => (
    <Button
      ref={ref}
      component={RouterLink}
      to={to ?? "/"}
      variant="text"
      color="primary"
      size="small"
      disableElevation
      {...rest}
      sx={{
        px: 1.5,
        minHeight: 28,
        fontSize: (t) => t.typography.button.fontSize,
        fontWeight: 500,
        borderRadius: 1.5,
        textTransform: "none",
        color: (t) => t.palette.primary.main,
        "&:hover": {
          color: (t) => t.palette.primary.dark,
          backgroundColor: "transparent",
        },
        "&:focus-visible": {
          outline: "none",
          boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}33`,
        },
        ...sx,
      }}
    />
  )
);

NavButton.displayName = "NavButton";
export default NavButton;
