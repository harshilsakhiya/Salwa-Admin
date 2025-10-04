import { getStoredToken } from "../context/AuthContext";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

const parseJsonSafely = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Failed to parse JSON response", error);
    return text;
  }
};

export const apiRequest = async <T = unknown>(input: string | URL, options: RequestOptions = {}): Promise<T> => {
  const { skipAuth = false, headers: headersInit, body, ...rest } = options;
  const headers = new Headers(headersInit ?? {});

  if (!(body instanceof FormData) && !headers.has("Content-Type") && body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("accept", "application/json, text/plain, */*");

  if (!skipAuth) {
    const token = getStoredToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(input, {
    ...rest,
    headers,
    body: body instanceof FormData || typeof body === "string" ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const parsed = await parseJsonSafely(response);

  if (!response.ok) {
    const fallbackStatusText = response.statusText && response.statusText.length > 0 ? response.statusText : "Request failed";
    const message = (parsed as { message?: string; error?: string } | null)?.message ??
      (parsed as { error?: string } | null)?.error ??
      fallbackStatusText;
    throw new ApiError(message, response.status, parsed);
  }

  return parsed as T;
};
