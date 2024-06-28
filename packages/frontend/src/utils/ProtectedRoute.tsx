import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("ProtectedRoute must be used within an AuthProvider");
  }

  const { authUser } = context;
  console.log("ProtectedRoute authUser : ", authUser);

  if (!authUser) {
    return <Navigate to="/" />;
  }

  if (role && authUser.role !== role) {
    return <Navigate to="/unauthorized" />; // Rediriger vers une page d'accès refusé
  }

  return <>{children}</>;
};

export default ProtectedRoute;
