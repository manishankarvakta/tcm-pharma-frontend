import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "./Auth";

const RequireAuth = ({ children }) => {
  const accessToken = localStorage.getItem("accessTokens");
  const location = useLocation();

  if (!accessToken || isTokenExpired(accessToken)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // if(user.type !== 'POS'){
  //     console.log(location);
  //     return <Navigate to="/" replace />;
  // }
  return children;
};

export default RequireAuth;
