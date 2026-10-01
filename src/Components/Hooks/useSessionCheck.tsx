import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isTokenExpired, handleLogout } from "../Utility/Auth";

export const useSessionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("accessTokens");
      
      if (token && isTokenExpired(token)) {
        console.warn("Session expired detected by useSessionCheck");
        handleLogout();
        // The handleLogout function already performs window.location.href = "/login"
        // but we can also use navigate for a smoother experience if needed
      }
    };

    // Check on mount
    checkSession();

    // Optionally check periodically (e.g., every 5 minutes)
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);
};
