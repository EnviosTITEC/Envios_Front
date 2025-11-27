import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./Loadable";
import { Spinner } from "../components";

/* ---------------- Layouts ---------------- */
const BlankLayout = Loadable(lazy(() => import("../layouts/blank-layout/BlankLayout")));
const AuthLayout = Loadable(lazy(() => import("../layouts/auth/AuthLayout")));
const MainLayout = Loadable(lazy(() => import("../layouts/dashboardLayout/MainLayout")));
const ShippingLayout = Loadable(lazy(() => import("../layouts/shipping/ShippingLayout")));

/* ---------------- General pages ---------------- */
const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const Login = Loadable(lazy(() => import("../views/authentication/Login")));
const Register = Loadable(lazy(() => import("../views/authentication/Register")));
const ResetPass = Loadable(lazy(() => import("../views/authentication/ResetPass")));

/* ---------------- Shipping module ---------------- */
const ShippingHome = Loadable(lazy(() => import("../views/shipping/shipping")));
const Addresses = Loadable(lazy(() => import("../views/shipping/addressesView/AddressesPage")));
const Quote = Loadable(lazy(() => import("../views/shipping/quoteView/QuotePage")));
const Shipments = Loadable(lazy(() => import("../views/shipping/shipments")));
const Tracking = Loadable(lazy(() => import("../views/shipping/tracking")));
const Carriers = Loadable(lazy(() => import("../views/shipping/carriers")));

/* ---------------- Router config ---------------- */
const Router = [
  // 404
  {
    path: "/error",
    element: <BlankLayout />,
    children: [{ path: "404", element: <Error /> }],
  },

  // Auth
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ResetPass /> },
      { path: "*", element: <Navigate to="/error/404" /> },
    ],
  },

  // App
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/shipping" /> },

      // Shipping module
      {
        path: "shipping",
        element: <ShippingLayout />,
        children: [
          { index: true, element: <ShippingHome /> },
          { path: "addresses", element: <Addresses /> },
          { path: "quote", element: <Quote /> },
          { path: "shipments", element: <Shipments /> },
          { path: "tracking", element: <Tracking /> },
          { path: "carriers", element: <Carriers /> },
        ],
      },

      // Catch-all dentro de App
      { path: "*", element: <Navigate to="/error/404" /> },
    ],
  },

  // Fallback global
  {
    path: "*",
    element: <Spinner fullPage={true} />,
  },
];

export default Router;
