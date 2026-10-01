import axios from "../../services/apiClient";
import { jwtDecode } from "jwt-decode";
import md5 from "md5";
import { Navigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const hash = (str) => {
  const pass = `${str}${process.env.REACT_APP_HASH_SECRET}`;
  return md5(pass);
};

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// handleLogOut
const handleLogout = () => {
  localStorage.removeItem("accessTokens");
  localStorage.removeItem("user");
  // Force a hard reload to clear any sensitive in-memory state if needed,
  // or just redirect to login
  window.location.href = "/login";
};

//SIGNIN USER WITH JWT

// const signInUser = () => {
//   const token = localStorage.getItem("accessTokens");
//   try {
//     const decoded = jwtDecode(token);
//     console.log("Decoded Token:", decoded);
//     if (decoded) {
//       return decoded;
//     } else {
//       return null; // or any default value you want to return when user data is not available
//     }
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// };
// const redirect = (path :string)=>{
//   window.location.href = `${path}`;
// }

const JwtReValidate = async () => {
  const token = localStorage.getItem("accessTokens");
  if (!token || isTokenExpired(token)) {
    handleLogout();
    return null;
  }
  try {
    const decoded: any = jwtDecode(token);
    if (decoded) {
      const { aamarId, id } = decoded;
      const response = await axios.get(
        `${BASE_URL}/aamarDokan/jwt-revalidate/${aamarId}/${id}`
      );
      if (response.data?.access_token) {
        localStorage.setItem("accessTokens", response.data.access_token);
        return response.data.access_token;
      }
    }
  } catch (error) {
    console.error("Token revalidation failed", error);
    handleLogout();
    return null;
  }
};

interface CustomJwtPayload {
  type: string;
  warehouse?: { name: string } | string;
  aamarId?: string;
  package?: string;
  storeSettings?: { posScreen?: string } | string;
  exp?: number;
}

const signInUser = (): CustomJwtPayload | null => {
  const token = localStorage.getItem("accessTokens");
  
  if (!token || isTokenExpired(token)) {
    if (token) {
      console.warn("Token expired, logging out...");
      handleLogout();
    }
    return null;
  }

  try {
    const decoded: CustomJwtPayload = jwtDecode(token);
    return decoded || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// const signInUser = () => {
//   const user = localStorage.getItem("user");
//   if (user) {
//     return JSON.parse(user);
//   } else {
//     return null; // or any default value you want to return when user data is not available
//   }
// };

export { handleLogout, hash, JwtReValidate, signInUser, isTokenExpired };
