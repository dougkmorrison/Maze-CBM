import { useState } from "react";

interface PracticeBlank {
  choices: string[];
  correctIndex: number;
}

const PRACTICE_TEXT_PARTS = [
  "Maria loved going to the park near her house. She would ",
  " her dog along the path every morning. One day she found a small ",
  " hiding under a bush. It looked ",
  " and scared. Maria sat quietly and waited until it felt safe.",
];

const PRACTICE_BLANKS: PracticeBlank[] = [
  { choices: ["walk", "eat", "sleep"], correctIndex: 0 },
  { choices: ["cloud", "bird", "stone"], correctIndex: 1 },
  { choices: ["hungry", "tired", "lost"], correctIndex: 2 },
];

interface Props {
  onContinue: () => void;
  onSkip: () => void;
}

export default function PracticeScreen({ onContinue, onSkip }: Props) {
  const [selected, setSelected] = useState<(number | null)[]>([null, null, null]);
  const allAnswered = selected.every((s) => s !== null);

  const handleSelect = (blankIdx: number, choiceIdx: number) => {
    setSelected((prev) => {
      const next = [...prev];
      next[blankIdx] = choiceIdx;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-2xl p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              MAZE CBM
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Practice</h1>
              <p className="text-xs text-slate-500">Try choosing the correct word for each blank</p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            Skip practice →
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 mb-6">
          <span className="font-semibold">Directions:</span> Read each sentence and click the word that makes the most sense in the blank space.
        </div>

        <div
          className="text-lg text-slate-800 font-serif bg-slate-50 rounded-xl border border-slate-200 p-5 mb-6"
          style={{ lineHeight: "3rem" }}
        >
          {PRACTICE_TEXT_PARTS.map((part, i) => (
            <span key={i}>
              {part}
              {i < PRACTICE_BLANKS.length && (
                <span
                  className="inline-flex flex-col items-start mx-1 border border-slate-400 rounded bg-white"
                  style={{ verticalAlign: "middle", lineHeight: "1.45rem" }}
                >
                  {PRACTICE_BLANKS[i].choices.map((choice, cidx) => {
                    const isSelected = selected[i] === cidx;
                    return (
                      <button
                        key={cidx}
                        onClick={() => handleSelect(i, cidx)}
                        className={`
                          w-full text-left font-sans text-base px-2 py-0.5 transition-all
                          ${isSelected ? "bg-blue-600 text-white font-semibold" : "text-slate-800 hover:bg-blue-50"}
                          ${cidx < PRACTICE_BLANKS[i].choices.length - 1 ? "border-b border-slate-300" : ""}
                        `}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </span>
              )}
            </span>
          ))}
        </div>

        {allAnswered && (
          <div className="mb-5 space-y-1.5">
            {PRACTICE_BLANKS.map((blank, i) => {
              const correct = selected[i] === blank.correctIndex;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                    correct ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <span>{correct ? "✓" : "✗"}</span>
                  <span>
                    Blank {i + 1}: <strong>{blank.choices[selected[i]!]}</strong>
                    {!correct && (
                      <span className="ml-1 text-red-500">
                        — correct answer is <strong>{blank.choices[blank.correctIndex]}</strong>
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-base transition-colors shadow-sm"
        >
          {allAnswered ? "Begin Timed Assessment ▶" : "Start Timed Assessment ▶"}
        </button>
        {!allAnswered && (
          <p className="text-center text-xs text-slate-400 mt-2">
            You can answer the practice blanks above, or click to begin immediately
          </p>
        )}
      </div>
    </div>
  );
}
