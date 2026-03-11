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

const TEACHER_EMAIL = "20365466@k12.hi.us";

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

  const handleEmail = () => {
    const subject = encodeURIComponent(
      `Maze CBM Score – ${studentName || "Student"} – ${new Date().toLocaleDateString()}`
    );
    const body = encodeURIComponent(
      [
        `Maze CBM Assessment Results`,
        `Date: ${today}`,
        ``,
        `Student: ${studentName || "(not entered)"}`,
        `Level: ${grade}`,
        `Passage: ${passageTitle}`,
        ``,
        `--- RESULTS ---`,
        `Total Blanks:  ${totalBlanks}`,
        `Correct (C):   ${correct}`,
        `Incorrect (I): ${incorrect}`,
        `Skipped:       ${unanswered}`,
        ``,
        `DIBELS Score (C - I÷2): ${score}`,
        `Formula: ${correct} - [${incorrect}/2] = ${score}`,
        ``,
        benchmark ? `Benchmark Reference (Level ${grade}):` : "",
        benchmark ? benchmark : "",
        ``,
        `--`,
        `Sent from Maze CBM Assessment App`,
      ]
        .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
        .join("\n")
    );

    window.open(
      `mailto:${TEACHER_EMAIL}?subject=${subject}&body=${body}`,
      "_blank"
    );
  };

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

        <button
          onClick={handleEmail}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-xl text-base transition-colors shadow-sm mb-3 flex items-center justify-center gap-2"
        >
          <span>✉</span>
          Submit Score by Email
        </button>

        <p className="text-xs text-center text-slate-400 mb-4">
          Opens Gmail and sends results to{" "}
          <span className="font-mono">{TEACHER_EMAIL}</span>
        </p>

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
