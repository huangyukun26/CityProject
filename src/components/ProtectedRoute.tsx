import React from "react";
import { Navigate } from "react-router-dom";
import { Role } from "../types";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute: React.FC<{ roles?: Role[]; children: React.ReactNode }> = ({
  roles,
  children
}) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
};
