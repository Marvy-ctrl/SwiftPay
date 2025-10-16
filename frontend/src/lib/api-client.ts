"use client";

type AuthContextType = {
  getAccessToken: () => string | null;
  refreshToken: () => Promise<string>;
  clearUser: () => void;
} | null;

let authContext: AuthContextType = null;
export const setAuthContext = (ctx: AuthContextType) => {
  authContext = ctx;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : "http://localhost:3000/api/v1";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const token = authContext?.getAccessToken?.();

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // send cookies for refresh token
  };

  let response = await fetch(url, fetchOptions);

  // if access token expired -> try refresh
  if ((response.status === 401 || response.status === 403) && authContext) {
    try {
      const newToken = await authContext.refreshToken();

      // retry the same request with new token
      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (retryResponse.status === 401) {
        authContext.clearUser();
        throw new Error("Session expired");
      }

      return retryResponse;
    } catch (err) {
      authContext.clearUser();
      throw err;
    }
  }

  return response;
}
export const apiPatch = (
  endpoint: string,
  data?: unknown,
  options: RequestInit = {}
) =>
  apiClient(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
