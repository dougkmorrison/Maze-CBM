const API_BASE = "/api";

function apiUrl(path: string) {
  return API_BASE + path;
}

export interface StudentLoginResult {
  completedPassages: string[];
  grade: number | null;
}

export async function studentLogin(studentId: string): Promise<StudentLoginResult> {
  const res = await fetch(apiUrl("/student/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error ?? "Login failed");
  }
  return res.json();
}

export async function saveResult(data: {
  studentId: string;
  grade: number;
  passageId: string;
  passageTitle: string;
  correct: number;
  incorrect: number;
  score: number;
}): Promise<void> {
  const res = await fetch(apiUrl("/student/result"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error ?? "Failed to save");
  }
}

export interface ResultRow {
  rowIndex: number;
  studentId: string;
  grade: number;
  passageId: string;
  passageTitle: string;
  date: string;
  correct: number;
  incorrect: number;
  score: number;
  timestamp: string;
}

export async function getTeacherResults(
  password: string
): Promise<{ rows: ResultRow[]; spreadsheetUrl: string }> {
  const res = await fetch(apiUrl("/teacher/results"), {
    headers: { "x-teacher-password": password },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unauthorized" }));
    throw new Error(err.error ?? "Unauthorized");
  }
  return res.json();
}

export async function deleteTeacherResult(
  password: string,
  rowIndex: number
): Promise<void> {
  const res = await fetch(apiUrl(`/teacher/result/${rowIndex}`), {
    method: "DELETE",
    headers: { "x-teacher-password": password },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed" }));
    throw new Error(err.error ?? "Failed to delete");
  }
}

export function getExportUrl(password: string): string {
  return apiUrl(`/teacher/export?pw=${encodeURIComponent(password)}`);
}
