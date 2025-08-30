const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {}; // empty object is valid HeadersInit
}

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...authHeaders(),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // auth
  async register(name: string, phone: string, password: string) {
    return http<{ access_token: string; token_type: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, phone, password }),
    });
  },
  async login(phone: string, password: string) {
    return http<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    });
  },
  // categories
  async categories() {
    return http<Array<{ id: number; name: string }>>("/categories");
  },
  async subcategories(categoryId: number) {
    return http<Array<{ id: number; name: string; category_id: number }>>(
      `/categories/${categoryId}/subcategories`
    );
  },
  // prompts
  async createPrompt(input: { category_id: number; sub_category_id: number; prompt: string }) {
    return http<{
      id: number;
      prompt: string;
      response: string;
      created_at: string;
    }>("/prompts", {
      method: "POST",
      headers: { ...authHeaders() },
      body: JSON.stringify(input),
    });
  },
  async myHistory(page = 1, page_size = 10) {
    return http<{
      items: Array<{
        id: number;
        prompt: string;
        response: string;
        created_at: string;
      }>;
      total: number;
      page: number;
      page_size: number;
    }>(`/prompts/history?page=${page}&page_size=${page_size}`, {
      headers: { ...authHeaders() },
    });
  },
  // admin
  async adminUsers(page = 1, page_size = 10) {
    return http<{
      items: Array<{ id: number; name: string; phone: string; role: string }>;
      total: number;
      page: number;
      page_size: number;
    }>(`/admin/users?page=${page}&page_size=${page_size}`, {
      headers: { ...authHeaders() },
    });
  },
  async adminPrompts(user_id?: number, page = 1, page_size = 10) {
    const q = new URLSearchParams({
      ...(user_id ? { user_id: String(user_id) } : {}),
      page: String(page),
      page_size: String(page_size),
    }).toString();
    return http<{
      items: Array<{ id: number; prompt: string; response: string; created_at: string }>;
      total: number;
      page: number;
      page_size: number;
    }>(`/admin/prompts?${q}`, { headers: { ...authHeaders() } });
  },
};
