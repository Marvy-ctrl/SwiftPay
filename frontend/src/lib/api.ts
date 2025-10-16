let accessToken: string | null = null;
let isRefreshing = false;
let pendingRequests: ((value?: unknown) => void)[] = [];

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const setAccesToken = (token: string | null) => {
  accessToken = token;
};

export async function refreshAccessToken() {
  const res = await fetch(`${BASE_URL}/auth/refresh_token`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    console.log("refresh error: ", err);
    throw new Error("Failed to refresh token");
  }
  const data = await res.json();
  accessToken = data.access_token;
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
  return data.access_token;
}

// main fetcher
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    // credentials: "include",
  });

  // refresh token interceptor
  if (res.status === 401 && !endpoint.includes("/auth/refresh_token")) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        await refreshAccessToken();
      } catch (error) {
        isRefreshing = false;
        throw new Error("session expired");
      }
      isRefreshing = false;
    } else {
      await new Promise((resolve) => pendingRequests.push(resolve));
    }

    // retry original fetch
    const retryHeaders = new Headers(options.headers || {});

    if (accessToken) retryHeaders.set("Authorization", `Bearer ${accessToken}`);
    const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: retryHeaders,
      credentials: "include",
    });

    return retryRes;
  }

  return res;
}
