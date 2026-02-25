import { Navigate } from "react-router-dom";
import { auth } from "../api/auth";
import type { ReactNode } from "react";

export function AdminRoute({ children }: { children: ReactNode }) {
  if (!auth.isAdmin()) {
    return <Navigate to="/properties" replace />;
  }
  return <>{children}</>;
}

