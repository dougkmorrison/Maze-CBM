import { useState, useEffect, useCallback, useRef } from "react";
import { passages } from "@/data/passages";
import { buildMazePassage, MazePassage, MazeToken } from "@/lib/maze-engine";
import PasswordScreen from "@/components/PasswordScreen";
import StudentSetup from "@/components/StudentSetup";
import ScoreSummary from "@/components/ScoreSummary";

type Phase = "password" | "setup" | "assessment" | "done";

const TOTAL_SECONDS = 180;

interface StudentAnswer {
  blankIndex: number;
  selectedIndex: number | null;
  correctIndex: number;
}

export default function MazeAssessment() {
  const [phase, setPhase] = useState<Phase>("password");
  const [selectedPassageId, setSelectedPassageId] = useState<string>(passages[0].id);
  const [studentName, setStudentName] = useState<string>("");
  const [mazePassage, setMazePassage] = useState<MazePassage | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passage = passages.find((p) => p.id === selectedPassageId)!;

  const startAssessment = useCallback(
    (name: string, passageId: string) => {
      const p = passages.find((x) => x.id === passageId)!;
      const built = buildMazePassage(p);
      const initialAnswers: StudentAnswer[] = Array.from(
        { length: built.totalBlanks },
        (_, i) => {
          const token = built.tokens.find(
            (t) => t.type === "blank" && t.blankIndex === i
          )!;
          return {
            blankIndex: i,
            selectedIndex: null,
            correctIndex: token.correctIndex ?? 0,
          };
        }
      );
      setStudentName(name);
      setSelectedPassageId(passageId);
      setMazePassage(built);
      setAnswers(initialAnswers);
      setTimeLeft(TOTAL_SECONDS);
      setTimerActive(true);
      setPhase("assessment");
    },
    []
  );

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const handleSelect = (blankIndex: number, selectedIndex: number) => {
    if (phase !== "assessment") return;
    setAnswers((prev) =>
      prev.map((a) =>
        a.blankIndex === blankIndex ? { ...a, selectedIndex } : a
      )
    );
  };

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setPhase("done");
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setMazePassage(null);
    setAnswers([]);
    setTimeLeft(TOTAL_SECONDS);
    setPhase("setup");
    setStudentName("");
  };

  const correct = answers.filter(
    (a) => a.selectedIndex !== null && a.selectedIndex === a.correctIndex
  ).length;
  const incorrect = answers.filter(
    (a) => a.selectedIndex !== null && a.selectedIndex !== a.correctIndex
  ).length;
  const score = Math.max(0, correct - Math.floor(incorrect / 2));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 30;

  if (phase === "password") {
    return <PasswordScreen onUnlock={() => setPhase("setup")} />;
  }

  if (phase === "setup") {
    return <StudentSetup onStart={startAssessment} />;
  }

  if (phase === "done") {
    return (
      <ScoreSummary
        studentName={studentName}
        passageTitle={passage.title}
        grade={passage.grade}
        correct={correct}
        incorrect={incorrect}
        score={score}
        totalBlanks={mazePassage?.totalBlanks ?? 0}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            MAZE CBM
          </div>
          <div className="text-sm font-medium text-slate-700 hidden sm:block">
            {studentName ? `${studentName}` : "Assessment in progress"}
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 leading-relaxed text-lg text-slate-800 font-serif">
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
        if (token.type === "space") return <span key={i}> </span>;
        if (token.type === "punctuation") return <span key={i}>{token.text}</span>;
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
    <span className="inline-flex items-center gap-0.5 mx-0.5 align-baseline">
      <span className="text-slate-400 text-sm">(</span>
      {choices.map((choice, idx) => {
        const isSelected = answer.selectedIndex === idx;
        return (
          <button
            key={idx}
            onClick={() => onSelect(blankIndex, idx)}
            className={`
              text-base font-sans px-1.5 py-0.5 rounded transition-all border
              ${isSelected
                ? "bg-blue-600 text-white border-blue-700 font-semibold shadow-sm"
                : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-400"
              }
            `}
          >
            {choice}
          </button>
        );
      })}
      <span className="text-slate-400 text-sm">)</span>
    </span>
  );
}
