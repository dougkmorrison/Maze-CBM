import { useState } from "react";
import { passages } from "@/data/passages";

const LEVELS = [2, 3, 4, 5, 6, 7, 8] as const;
type Level = (typeof LEVELS)[number];

interface Props {
  onStart: (studentName: string, passageId: string) => void;
}

export default function StudentSetup({ onStart }: Props) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level | null>(null);

  const handleStart = () => {
    if (!level) return;
    const pool = passages.filter((p) => p.grade === level);
    const random = pool[Math.floor(Math.random() * pool.length)];
    onStart(name.trim(), random.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
            MAZE CBM
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Reading Assessment</h1>
            <p className="text-xs text-slate-500">DIBELS 8th Edition • 3-Minute Timer</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Your Name <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Your Reading Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`py-3 rounded-xl font-bold text-lg border-2 transition-all ${
                    level === l
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm scale-105"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {level && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                A passage will be randomly selected for Level {level}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
            <p className="font-semibold mb-1 text-blue-800">How it works</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>A reading passage will appear with some words replaced by choices</li>
              <li>Click the correct word for each blank</li>
              <li>You have 3 minutes — work as quickly and accurately as you can</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            disabled={!level}
            className={`w-full font-semibold py-3 rounded-xl text-base transition-colors shadow-sm ${
              level
                ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Start Assessment ▶
          </button>
        </div>
      </div>
    </div>
  );
}
