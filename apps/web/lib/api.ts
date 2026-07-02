const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ApiError = {
  code: string;
  message: string;
};

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = (await res.json()) as ApiError;
    throw new Error(error.message ?? '요청 실패');
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}
