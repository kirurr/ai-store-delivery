import { cookies } from "next/headers";

export async function fetchWithAuth(
  token: string,
  url: string,
  options: RequestInit,
) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    return true;
  }
  return false;
}
