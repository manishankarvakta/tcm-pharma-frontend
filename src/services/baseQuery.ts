import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { handleLogout } from "../Components/Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessTokens");
    if (token) {
      // Clean up the token if it's stored with quotes (from JSON.stringify)
      const cleanToken = token.replace(/^"(.*)"$/, "$1");
      headers.set("authorization", `Bearer ${cleanToken}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    console.warn("Unauthorized request, logging out...");
    handleLogout();
  }

  // Handle the specific backend error message "Authentication Failure!" which might come as 500
  if (
    result.error &&
    result.error.status === 500 &&
    (result.error.data as any)?.err === "Authentication Failure!"
  ) {
    console.warn("Authentication failure detected in 500 response, logging out...");
    handleLogout();
  }

  return result;
};
