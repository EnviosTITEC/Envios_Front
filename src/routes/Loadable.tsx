import React, { Suspense } from "react";
import Spinner from "../components/spinner/Spinner";

/**
 * Envuelve un componente con <Suspense> para carga diferida.
 * Muestra el Spinner de PulgaShop mientras el componente carga.
 */
export default function Loadable<P extends object>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = (props: P) => (
    <Suspense fallback={<Spinner fullPage={false} />}>
      <Component {...props} />
    </Suspense>
  );
  WrappedComponent.displayName = `Loadable(${Component.displayName || Component.name || "Component"})`;
  return WrappedComponent;
}
