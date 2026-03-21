import { useState, useEffect, useCallback } from "react";
import {
  getTeacherResults,
  deleteTeacherResult,
  getExportUrl,
  ResultRow,
} from "@/lib/api";

interface Props {
  onBack: () => void;
}

const TEACHER_PASSWORD = "1234";

export default function TeacherPortal({ onBack }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<keyof ResultRow>("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterText, setFilterText] = useState("");

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTeacherResults(TEACHER_PASSWORD);
      setRows(data.rows);
      setSpreadsheetUrl(data.spreadsheetUrl);
    } catch (err: any) {
      setError(err.message ?? "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadResults();
  }, [authed, loadResults]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === TEACHER_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password.");
    }
  };

  const handleDelete = async (row: ResultRow) => {
    if (
      !window.confirm(
        `Delete result for student ${row.studentId} — ${row.passageTitle} (${row.date})?\n\nThe student will retake this passage next time they log in.`
      )
    )
      return;
    setDeleting(row.rowIndex);
    try {
      await deleteTeacherResult(TEACHER_PASSWORD, row.rowIndex);
      await loadResults();
    } catch (err: any) {
      setError(err.message ?? "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const toggleSort = (col: keyof ResultRow) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  const filtered = rows.filter(
    (r) =>
      filterText === "" ||
      r.studentId.includes(filterText) ||
      r.passageTitle.toLowerCase().includes(filterText.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    const cmp = typeof av === "number" && typeof bv === "number"
      ? av - bv
      : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-700 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              TEACHER
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Teacher Portal</h1>
              <p className="text-xs text-slate-500">Enter teacher password</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setPwError(""); }}
              placeholder="Password"
              className="w-full text-center text-2xl font-mono tracking-widest border-2 border-slate-300 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              autoFocus
            />
            {pwError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 text-center">
                {pwError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl text-base transition-colors"
            >
              Enter
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600 underline">
              ← Back to Student Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-green-700 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
            TEACHER
          </div>
          <h1 className="text-lg font-bold text-slate-800">Assessment Results</h1>
          <span className="text-sm text-slate-500">{rows.length} records</span>
        </div>
        <div className="flex items-center gap-2">
          {spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              Open Sheet ↗
            </a>
          )}
          <a
            href={getExportUrl(TEACHER_PASSWORD)}
            download
            className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            ↓ Download CSV
          </a>
          <button
            onClick={loadResults}
            disabled={loading}
            className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            {loading ? "Loading…" : "↺ Refresh"}
          </button>
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-slate-600 underline ml-2"
          >
            ← Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 flex gap-3">
          <input
            type="text"
            placeholder="Filter by student ID or passage…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="flex-1 max-w-xs border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <div className="text-sm text-slate-500 self-center">
            {filtered.length} of {rows.length} shown
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {(
                    [
                      ["studentId", "Student ID"],
                      ["grade", "Level"],
                      ["passageTitle", "Passage"],
                      ["date", "Date"],
                      ["correct", "Correct"],
                      ["incorrect", "Incorrect"],
                      ["score", "Score"],
                    ] as [keyof ResultRow, string][]
                  ).map(([col, label]) => (
                    <th
                      key={col}
                      onClick={() => toggleSort(col)}
                      className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                    >
                      {label}{" "}
                      {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-slate-600 font-semibold whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      {loading ? "Loading results…" : "No results yet."}
                    </td>
                  </tr>
                )}
                {sorted.map((row) => (
                  <tr
                    key={`${row.rowIndex}`}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-700">{row.studentId}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{row.grade}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">{row.passageTitle}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 text-center font-medium text-green-700">{row.correct}</td>
                    <td className="px-4 py-3 text-center font-medium text-red-600">{row.incorrect}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700 text-base">{row.score}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(row)}
                        disabled={deleting === row.rowIndex}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium px-3 py-1 rounded-lg transition-colors disabled:opacity-40"
                        title="Delete — student will retake this passage"
                      >
                        {deleting === row.rowIndex ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400 text-center">
          Deleting a result causes the student to retake that passage next time they log in.
        </div>
      </main>
    </div>
  );
}
