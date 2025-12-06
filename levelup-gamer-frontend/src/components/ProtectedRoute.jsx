import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      return <Navigate to="/home" replace />;
    }

    if (!user?.roles?.includes(requiredRole)) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
