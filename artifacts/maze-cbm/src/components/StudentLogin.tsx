import { useState } from "react";
import { studentLogin, StudentLoginResult } from "@/lib/api";

interface Props {
  onLogin: (studentId: string, result: StudentLoginResult) => void;
  onTeacherMode: () => void;
}

export default function StudentLogin({ onLogin, onTeacherMode }: Props) {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = studentId.replace(/\D/g, "");
    if (id.length !== 10) {
      setError("Please enter your full 10-digit student ID.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await studentLogin(id);
      onLogin(id, result);
    } catch (err: any) {
      setError(err.message ?? "Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg mb-3">
            MAZE CBM
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Student Login</h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Enter your 10-digit student ID to begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={10}
              value={studentId}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setStudentId(digits);
                setError("");
              }}
              placeholder="0000000000"
              className="w-full text-center text-3xl font-mono tracking-[0.4em] border-2 border-slate-300 rounded-xl py-4 px-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300 placeholder:tracking-[0.4em]"
              autoFocus
            />
            <div className="flex justify-center mt-1">
              <span className={`text-xs font-mono ${studentId.length === 10 ? "text-green-600" : "text-slate-400"}`}>
                {studentId.length}/10 digits
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || studentId.length !== 10}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-base transition-colors"
          >
            {loading ? "Loading…" : "Continue →"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onTeacherMode}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
          >
            Teacher Access
          </button>
        </div>
      </div>
    </div>
  );
}
