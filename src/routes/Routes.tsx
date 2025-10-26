import { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loadable from "./Loadable";

/* Layouts */
const BlankLayout = Loadable(lazy(() => import("../layouts/blank-layout/BlankLayout")));
const AuthLayout  = Loadable(lazy(() => import("../layouts/auth/AuthLayout")));
const MainLayout  = Loadable(lazy(() => import("../layouts/dashboardLayout/MainLayout")));
const ShippingLayout = Loadable(lazy(() => import("../layouts/shipping/ShippingLayout")));

/* General pages */
const Error     = Loadable(lazy(() => import("../views/authentication/Error")));
const Home      = Loadable(lazy(() => import("../views/home/Home")));
const Login     = Loadable(lazy(() => import("../views/authentication/Login")));
const Register  = Loadable(lazy(() => import("../views/authentication/Register")));
const ResetPass = Loadable(lazy(() => import("../views/authentication/ResetPass")));

/* Shipping module (files están en views/envios/) */
const ShippingHome = Loadable(lazy(() => import("../views/shipping/shipping")));
const Addresses    = Loadable(lazy(() => import("../views/shipping/addresses")));
const Quote        = Loadable(lazy(() => import("../views/shipping/quote")));
const Shipments    = Loadable(lazy(() => import("../views/shipping/shipments")));
const Tracking     = Loadable(lazy(() => import("../views/shipping/tracking")));
const Carriers     = Loadable(lazy(() => import("../views/shipping/carriers")));

const Router = [
  /* Errors */
  {
    path: "/error",
    element: <BlankLayout />,
    children: [{ path: "404", element: <Error /> }],
  },

  /* Auth */
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "", element: <Navigate to="/auth/login" /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ResetPass /> },
      { path: "*", element: <Navigate to="/error/404" /> }
    ],
  },

  /* App */
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },

      /* Shipping con rutas anidadas */
      {
        path: "shipping",
        element: <ShippingLayout />,
        children: [
          { index: true, element: <ShippingHome /> },
          { path: "addresses", element: <Addresses /> },
          { path: "quote",     element: <Quote /> },
          { path: "shipments", element: <Shipments /> },
          { path: "tracking",  element: <Tracking /> },
          { path: "carriers",  element: <Carriers /> }
        ],
      },

      { path: "*", element: <Navigate to="/error/404" /> },
    ],
  },
  /* Rutas no encontradas (mejor manejo de 404) */
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Navigate to="/error/404" />
      </Suspense>
    ),
  },
];

export default Router;
