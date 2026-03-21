interface Props {
  studentName: string;
  passageTitle: string;
  grade: number;
  correct: number;
  incorrect: number;
  score: number;
  totalBlanks: number;
  onReset: () => void;
}

const TEACHER_EMAIL = "douglas.morrison@k12.hi.us";

export default function ScoreSummary({
  studentName,
  passageTitle,
  grade,
  correct,
  incorrect,
  score,
  totalBlanks,
  onReset,
}: Props) {
  const unanswered = totalBlanks - correct - incorrect;
  const scoreFormula = `${correct} - [${incorrect}/2] = ${score}`;
  const benchmark = getDIBELSBenchmark(grade);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
            SCORE SUMMARY
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Assessment Complete</h1>
            <p className="text-xs text-slate-500">DIBELS 8th Edition Maze CBM</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Student</span>
            <span className="font-medium text-slate-800">{studentName || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Date</span>
            <span className="font-medium text-slate-800">{today}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Passage</span>
            <span className="font-medium text-slate-800">{passageTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Level</span>
            <span className="font-medium text-slate-800">{grade}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total Blanks</span>
            <span className="font-medium text-slate-800">{totalBlanks}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{correct}</div>
            <div className="text-xs text-green-600 font-medium mt-1">Correct</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{incorrect}</div>
            <div className="text-xs text-red-500 font-medium mt-1">Incorrect</div>
          </div>
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-slate-500">{unanswered}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Skipped</div>
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-xl p-5 text-center mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1 text-blue-200">
            DIBELS Score Formula: C − (I÷2)
          </div>
          <div className="text-base font-mono text-blue-100 mb-2">{scoreFormula}</div>
          <div className="text-5xl font-extrabold">{score}</div>
          <div className="text-sm text-blue-200 mt-1">Adjusted Correct per 3 min</div>
        </div>

        {benchmark && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 text-sm text-amber-800">
            <p className="font-semibold mb-0.5">DIBELS 8th Edition Benchmark (Level {grade})</p>
            <p className="text-xs">{benchmark}</p>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            📸 Take a screenshot of this page, then email it to your teacher:
          </p>

          <div className="flex items-center justify-center gap-2 mb-3">
            <ChromebookKey label="ctrl" wide />
            <span className="text-slate-400 font-bold text-lg">+</span>
            <ChromebookKey label="⬛▭▭" showWindows />
          </div>
          <p className="text-xs text-center text-slate-500 mb-4">
            Press <strong>Ctrl</strong> + the <strong>Show Windows</strong> key to take a screenshot
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-600 mb-0.5">Email your screenshot to:</p>
            <p className="text-sm font-bold text-blue-800 font-mono">{TEACHER_EMAIL}</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 font-semibold py-3 rounded-xl text-base transition-colors"
        >
          ↺ Reset — Next Student
        </button>
      </div>
    </div>
  );
}

function ChromebookKey({
  label,
  wide,
  showWindows,
}: {
  label: string;
  wide?: boolean;
  showWindows?: boolean;
}) {
  return (
    <div
      className={`
        inline-flex flex-col items-center justify-center
        bg-white border-2 border-slate-300 rounded-lg shadow-sm
        text-slate-700 font-bold select-none
        ${wide ? "px-4 py-2 text-sm min-w-[60px]" : ""}
        ${showWindows ? "px-3 py-2 min-w-[56px]" : ""}
      `}
      style={{ boxShadow: "0 3px 0 #cbd5e1" }}
    >
      {showWindows ? (
        <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
          <rect x="1" y="1" width="14" height="20" rx="2" stroke="#475569" strokeWidth="2" fill="#e2e8f0" />
          <rect x="18" y="4" width="13" height="5" rx="1.5" stroke="#475569" strokeWidth="1.5" fill="#e2e8f0" />
          <rect x="18" y="13" width="13" height="5" rx="1.5" stroke="#475569" strokeWidth="1.5" fill="#e2e8f0" />
        </svg>
      ) : (
        <span className="text-sm leading-tight">{label}</span>
      )}
    </div>
  );
}

function getDIBELSBenchmark(grade: number): string | null {
  const benchmarks: Record<number, string> = {
    2: "End of year: At/Above Benchmark ≥ 9 | Below Benchmark < 9",
    3: "End of year: At/Above Benchmark ≥ 14 | Below Benchmark < 14",
    4: "End of year: At/Above Benchmark ≥ 21 | Below Benchmark < 21",
    5: "End of year: At/Above Benchmark ≥ 25 | Below Benchmark < 25",
    6: "End of year: At/Above Benchmark ≥ 30 | Below Benchmark < 30",
    7: "End of year: At/Above Benchmark ≥ 30 | Below Benchmark < 30",
    8: "End of year: At/Above Benchmark ≥ 30 | Below Benchmark < 30",
  };
  return benchmarks[grade] ?? null;
}
