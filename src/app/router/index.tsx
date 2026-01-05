import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import DashboardLayout from "../../layouts/DashboardLayouts";
import Login from "../../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import NotFound2 from "../../pages/errors/NotFound2";
import LoaderLex from "../../pages/loaders/Loader";
import Procesos from "../../pages/proceso/Procesos";
import NuevoProceso from "../../pages/proceso/NuevoProceso";
import BasesProcesales from "../../pages/proceso/BasesProcesales";
import NuevoJuzgado from "../../pages/juzgados/NuevoJuzgado";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      { path: "", element: <Login /> },
      /* { path: "register", element: <Register /> },
      { path: "recover-password", element: <RecoverPassword /> }, */
    ],
  },

  {
    path: "/proceso",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/nuevoProceso",
    element: (
      <ProtectedRoute>
        <NuevoProceso />
      </ProtectedRoute>
    )
  },
  {
    path: "/procesos",
    element: (
      <ProtectedRoute>
        <Procesos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/basesProcesales",
    element: (
      <ProtectedRoute>
        <BasesProcesales />
      </ProtectedRoute>
    ),
  },
  {
    path: "/NuevoJuzgado",
    element: (
      <ProtectedRoute>
        <NuevoJuzgado />
      </ProtectedRoute>
    ),
  },
  { path: "/loader", element: <LoaderLex /> },
  { path: "*", element: <NotFound2 /> },
]);


