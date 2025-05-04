import { QueryClient } from "@tanstack/react-query";
const defaultQueryFn = async ({ queryKey }) => {
  const url = queryKey[0]; // assuming first item in queryKey is URL string
  return apiRequest("GET", url);
};
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn, // 👈 Add this line
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Performs a fetch request with support for session cookies
 * and handles different response content types appropriately
 */
export async function apiRequest<T = any>(
    method: string,
    url: string,
    data?: any
): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    // Handle error responses
    try {
      const err = await res.json();
      throw new Error(err.message || "Request failed");
    } catch (parseError) {
      // If JSON parsing fails, throw error with status
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
  }

  // Check if response has content and a content-type header
  const contentType = res.headers.get("Content-Type");

  // For empty responses or non-JSON content types
  if (res.status === 204 || !contentType || !contentType.includes("application/json")) {
    // Return a standardized success object for non-JSON responses
    return { success: true, status: res.status } as unknown as T;
  }

  // For JSON responses
  try {
    return await res.json();
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    // Return a standardized object when JSON parsing fails
    return { success: true, status: res.status, text: await res.text() } as unknown as T;
  }
}

/**
 * Helper for generating query functions, with optional 401 fallback
 */
export function getQueryFn<T = any>({
                                      on401 = "throw",
                                    }: {
  on401?: "throw" | "returnNull";
} = {}) {
  return async (): Promise<T | null> => {
    const res = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401) {
      if (on401 === "returnNull") return null;
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Something went wrong");
    }

    return res.json();
  };
}