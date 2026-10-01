import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { signInUser } from "./Auth";

const RequireAdminAuthManager = ({ children }) => {
  const accessToken = localStorage.getItem("accessTokens");
  const user = signInUser()
  const location = useLocation();

  // console.log( user)

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.type === "asst_manager" || user.type === "store_manager" || user.type === "POS" || user.type === "ecom" || user.type === "deliver" || user.type === "supervisor" || user.type === "manager") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAdminAuthManager;
