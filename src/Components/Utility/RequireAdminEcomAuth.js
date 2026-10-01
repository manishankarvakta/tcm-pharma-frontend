import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { signInUser } from "./Auth";

const RequireAdminEcomAuth = ({ children }) => {
  const accessToken = localStorage.getItem("accessTokens");
  const user = signInUser()
  const location = useLocation();

  // console.log( user)

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.type === "POS" || user.type === "deliver" || user.type === "supervisor") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAdminEcomAuth;
