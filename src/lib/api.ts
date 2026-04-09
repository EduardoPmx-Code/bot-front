export type TaskStatus = "pending" | "completed";
export type TaskCategory = "personal" | "work" | "urgent" | null;

export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Subtask {
  id: string;
  title: string;
  order: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  created_at: string;
  updated_at: string;
  subtasks: Subtask[];
}

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

async function request<T>(
  path: string,
  opts: RequestInit & { userId?: string } = {}
): Promise<T> {
  const url = `${apiBaseUrl()}${path}`;
  const headers = new Headers(opts.headers);
  headers.set("Accept", "application/json");
  if (opts.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (opts.userId) headers.set("X-User-Id", opts.userId);

  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail =
      data?.detail ||
      (Array.isArray(data?.detail) ? data.detail[0]?.msg : undefined) ||
      `HTTP ${res.status}`;
    throw new Error(detail);
  }
  return data as T;
}

export async function register(username: string, password: string): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function login(username: string, password: string): Promise<User> {
  return request<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function listTasks(
  userId: string,
  params?: { status?: TaskStatus; ordering?: string }
): Promise<Task[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.ordering) qs.set("ordering", params.ordering);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request<Task[]>(`/api/tasks/${suffix}`, { method: "GET", userId });
}

export async function createTask(
  userId: string,
  payload: { title: string; description: string }
): Promise<Task> {
  return request<Task>("/api/tasks/", {
    method: "POST",
    userId,
    body: JSON.stringify(payload),
  });
}

export async function getTask(userId: string, taskId: string): Promise<Task> {
  return request<Task>(`/api/tasks/${taskId}/`, { method: "GET", userId });
}

export async function updateTask(
  userId: string,
  taskId: string,
  payload: Partial<Pick<Task, "title" | "description" | "status" | "category">>
): Promise<Task> {
  return request<Task>(`/api/tasks/${taskId}/`, {
    method: "PATCH",
    userId,
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  await request<unknown>(`/api/tasks/${taskId}/`, { method: "DELETE", userId });
}

export async function analyzeTask(userId: string, taskId: string): Promise<Task> {
  return request<Task>(`/api/tasks/${taskId}/analyze/`, { method: "POST", userId });
}

export async function updateSubtask(
  userId: string,
  taskId: string,
  subtaskId: string,
  completed: boolean
): Promise<Subtask> {
  return request<Subtask>(`/api/tasks/${taskId}/subtasks/${subtaskId}/`, {
    method: "PATCH",
    userId,
    body: JSON.stringify({ completed }),
  });
}

