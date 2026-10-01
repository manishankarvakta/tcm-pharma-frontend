import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const accessToken = localStorage.getItem("accessTokens");
  // const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  // console.log( user)

  if (!accessToken) {
    console.log(location);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // if(user.type !== 'POS'){
  //     console.log(location);
  //     return <Navigate to="/" replace />;
  // }
  return children;
};

export default RequireAuth;
