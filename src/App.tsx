//src/App.tsx
import { useRoutes } from "react-router-dom";
import Router from "./routes/Routes";
import Spinner from "./components/spinner/Spinner";
import { Suspense } from "react";

/**
 * App raíz del proyecto EnviosTITEC / PulgaShop
 * - Carga las rutas con Suspense (lazy).
 * - Usa Spinner como loader global.
 */
export default function App() {
  const routing = useRoutes(Router);

  return (
    <Suspense fallback={<Spinner fullPage />}>
      {routing}
    </Suspense>
  );
}
