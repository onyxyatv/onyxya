import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
  permission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role, permission }) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("ProtectedRoute must be used within an AuthProvider");
  }

  const { authUser, isLoading } = context;

  if (isLoading) {
    return null;
  }

  if (!authUser) {
    return <Navigate to="/" />;
  }

  if (role && authUser.role.name !== role) {
    return <Navigate to="/unauthorized" />;
  }

  if (permission && !authUser.permissions.includes(permission)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
