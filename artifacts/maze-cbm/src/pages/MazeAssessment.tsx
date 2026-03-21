import { useState, useEffect, useCallback, useRef } from "react";
import { passages } from "@/data/passages";
import { buildMazePassage, MazePassage, MazeToken } from "@/lib/maze-engine";
import { saveResult, StudentLoginResult } from "@/lib/api";
import StudentLogin from "@/components/StudentLogin";
import GradePicker from "@/components/GradePicker";
import PracticeScreen from "@/components/PracticeScreen";
import ScoreSummary from "@/components/ScoreSummary";
import TeacherPortal from "@/components/TeacherPortal";

type Phase =
  | "login"
  | "grade-pick"
  | "practice"
  | "assessment"
  | "done"
  | "teacher";

const TOTAL_SECONDS = 180;

interface StudentAnswer {
  blankIndex: number;
  selectedIndex: number | null;
  correctIndex: number;
}

function pickNextPassage(grade: number, completedPassages: string[]): string {
  const gradePassages = passages.filter((p) => p.grade === grade);
  const next = gradePassages.find((p) => !completedPassages.includes(p.id));
  if (next) return next.id;
  return gradePassages[0]?.id ?? passages[0].id;
}

export default function MazeAssessment() {
  const [phase, setPhase] = useState<Phase>("login");
  const [studentId, setStudentId] = useState("");
  const [studentGrade, setStudentGrade] = useState<number>(5);
  const [completedPassages, setCompletedPassages] = useState<string[]>([]);
  const [selectedPassageId, setSelectedPassageId] = useState<string>("");
  const [mazePassage, setMazePassage] = useState<MazePassage | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [saveError, setSaveError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passage = passages.find((p) => p.id === selectedPassageId) ?? passages[0];

  const handleLogin = useCallback(
    (id: string, loginResult: StudentLoginResult) => {
      setStudentId(id);
      setCompletedPassages(loginResult.completedPassages);
      if (loginResult.grade !== null) {
        const grade = loginResult.grade;
        setStudentGrade(grade);
        const nextId = pickNextPassage(grade, loginResult.completedPassages);
        setSelectedPassageId(nextId);
        setPhase("practice");
      } else {
        setPhase("grade-pick");
      }
    },
    []
  );

  const handleGradePick = useCallback(
    (grade: number) => {
      setStudentGrade(grade);
      const nextId = pickNextPassage(grade, completedPassages);
      setSelectedPassageId(nextId);
      setPhase("practice");
    },
    [completedPassages]
  );

  const beginAssessment = useCallback((passageId: string) => {
    const p = passages.find((x) => x.id === passageId)!;
    const built = buildMazePassage(p);
    const initialAnswers: StudentAnswer[] = Array.from(
      { length: built.totalBlanks },
      (_, i) => {
        const token = built.tokens.find(
          (t) => t.type === "blank" && t.blankIndex === i
        )!;
        return { blankIndex: i, selectedIndex: null, correctIndex: token.correctIndex ?? 0 };
      }
    );
    setMazePassage(built);
    setAnswers(initialAnswers);
    setTimeLeft(TOTAL_SECONDS);
    setTimerActive(true);
    setPhase("assessment");
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            setPhase("done");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const correct = answers.filter(
    (a) => a.selectedIndex !== null && a.selectedIndex === a.correctIndex
  ).length;
  const incorrect = answers.filter(
    (a) => a.selectedIndex !== null && a.selectedIndex !== a.correctIndex
  ).length;
  const score = Math.max(0, correct - Math.floor(incorrect / 2));

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setPhase("done");
  };

  useEffect(() => {
    if (phase === "done" && studentId && selectedPassageId) {
      setSaveError("");
      saveResult({
        studentId,
        grade: studentGrade,
        passageId: selectedPassageId,
        passageTitle: passage.title,
        correct,
        incorrect,
        score,
      }).catch((err) => setSaveError("Could not save to Google Sheets: " + err.message));
    }
  }, [phase]);

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setMazePassage(null);
    setAnswers([]);
    setTimeLeft(TOTAL_SECONDS);
    setStudentId("");
    setStudentGrade(5);
    setCompletedPassages([]);
    setSelectedPassageId("");
    setSaveError("");
    setPhase("login");
  };

  const handleSelect = (blankIndex: number, selectedIndex: number) => {
    if (phase !== "assessment") return;
    setAnswers((prev) =>
      prev.map((a) => (a.blankIndex === blankIndex ? { ...a, selectedIndex } : a))
    );
  };

  if (phase === "teacher") return <TeacherPortal onBack={() => setPhase("login")} />;
  if (phase === "login") return <StudentLogin onLogin={handleLogin} onTeacherMode={() => setPhase("teacher")} />;
  if (phase === "grade-pick") return <GradePicker studentId={studentId} onSelect={handleGradePick} />;

  if (phase === "practice") {
    return (
      <PracticeScreen
        onContinue={() => beginAssessment(selectedPassageId)}
        onSkip={() => beginAssessment(selectedPassageId)}
      />
    );
  }

  if (phase === "done") {
    return (
      <>
        <ScoreSummary
          studentName={studentId}
          passageTitle={passage.title}
          grade={passage.grade}
          correct={correct}
          incorrect={incorrect}
          score={score}
          totalBlanks={mazePassage?.totalBlanks ?? 0}
          onReset={handleReset}
        />
        {saveError && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
            {saveError}
          </div>
        )}
      </>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 30;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            MAZE CBM
          </div>
          <div className="text-sm font-mono text-slate-600 hidden sm:block">
            ID: {studentId}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Level {passage.grade} — {passage.title}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`font-mono text-xl font-bold px-3 py-1 rounded-lg border ${
              isLowTime
                ? "text-red-600 bg-red-50 border-red-200 animate-pulse"
                : "text-slate-800 bg-slate-100 border-slate-200"
            }`}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
          <button
            onClick={handleStop}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            End Early
          </button>
          <button
            onClick={handleReset}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-lg text-slate-800 font-serif leading-loose">
          <RenderPassage
            mazePassage={mazePassage!}
            answers={answers}
            onSelect={handleSelect}
          />
        </div>
        <div className="mt-4 text-center text-sm text-slate-500">
          Click an answer choice for each blank — answers are automatically recorded
        </div>
      </main>
    </div>
  );
}

function RenderPassage({
  mazePassage,
  answers,
  onSelect,
}: {
  mazePassage: MazePassage;
  answers: StudentAnswer[];
  onSelect: (blankIndex: number, selectedIndex: number) => void;
}) {
  return (
    <p className="whitespace-pre-wrap">
      {mazePassage.tokens.map((token, i) => {
        if (token.type === "word") return <span key={i}>{token.text}</span>;
        if (token.type === "blank") {
          return (
            <BlankChoice
              key={i}
              token={token}
              answer={answers[token.blankIndex!]}
              onSelect={onSelect}
            />
          );
        }
        return null;
      })}
    </p>
  );
}

function BlankChoice({
  token,
  answer,
  onSelect,
}: {
  token: MazeToken;
  answer: StudentAnswer;
  onSelect: (blankIndex: number, selectedIndex: number) => void;
}) {
  const blankIndex = token.blankIndex!;
  const choices = token.choices!;
  return (
    <span
      className="inline-flex flex-col items-start mx-1 border border-slate-400 rounded bg-white"
      style={{ verticalAlign: "middle", lineHeight: "1.45rem" }}
    >
      {choices.map((choice, idx) => {
        const isSelected = answer.selectedIndex === idx;
        return (
          <button
            key={idx}
            onClick={() => onSelect(blankIndex, idx)}
            className={`w-full text-left font-sans text-base px-2 py-0.5 transition-all ${
              isSelected
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-800 hover:bg-blue-50"
            } ${idx < choices.length - 1 ? "border-b border-slate-300" : ""}`}
          >
            {choice}
          </button>
        );
      })}
    </span>
  );
}
