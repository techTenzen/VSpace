import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Helper function to throw an error if the response is not OK
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Try to parse the error as JSON first, fall back to text
    try {
      const errorData = await res.json();
      throw new Error(
          errorData.message || `${res.status}: ${res.statusText}`
      );
    } catch (e) {
      // If JSON parsing fails, get the text
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
  }
}

/**
 * Generic API request function with improved error handling
 * Returns the parsed JSON data instead of the raw Response
 */
export async function apiRequest(
    method: string,
    url: string,
    data?: unknown | undefined,
): Promise<any> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    // Log response status for debugging
    console.log(`API ${method} ${url} - Status: ${res.status}`);

    // Handle empty responses (like 204 No Content)
    if (res.status === 204) {
      return { ok: true };
    }

    // Handle errors
    if (!res.ok) {
      await throwIfResNotOk(res);
    }

    // For DELETE requests that don't return content
    if (method === "DELETE" && res.status === 204) {
      return { ok: true };
    }

    // Parse and return JSON for other requests
    try {
      return await res.json();
    } catch (err) {
      console.log(`Response not JSON for ${method} ${url}`);
      return { ok: true };
    }
  } catch (error) {
    console.error(`API request error for ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Query function factory with authorization handling
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
    ({ on401: unauthorizedBehavior }) =>
        async ({ queryKey }) => {
          try {
            const url = queryKey[0] as string;
            console.log(`Fetching data from: ${url}`);

            const res = await fetch(url, {
              credentials: "include",
            });

            // Handle 401 according to specified behavior
            if (res.status === 401) {
              console.log(`401 Unauthorized from ${url}, behavior: ${unauthorizedBehavior}`);
              if (unauthorizedBehavior === "returnNull") {
                return null;
              }
              throw new Error("Unauthorized access");
            }

            await throwIfResNotOk(res);

            // For empty responses
            if (res.status === 204) {
              return null;
            }

            // Parse response
            const data = await res.json();
            console.log(`Data received from ${url}:`, data);
            return data;
          } catch (error) {
            console.error(`Query error for ${queryKey[0]}:`, error);
            throw error;
          }
        };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});