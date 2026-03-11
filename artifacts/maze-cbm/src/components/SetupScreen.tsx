import { Passage } from "@/data/passages";

interface Props {
  passages: Passage[];
  selectedPassageId: string;
  setSelectedPassageId: (id: string) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  onStart: () => void;
}

const gradeGroups: Record<string, Passage[]> = {};

export default function SetupScreen({
  passages,
  selectedPassageId,
  setSelectedPassageId,
  studentName,
  setStudentName,
  onStart,
}: Props) {
  const gradeGroups: Record<number, Passage[]> = {};
  for (const p of passages) {
    if (!gradeGroups[p.grade]) gradeGroups[p.grade] = [];
    gradeGroups[p.grade].push(p);
  }

  const selectedPassage = passages.find((p) => p.id === selectedPassageId)!;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
            MAZE CBM
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Maze Assessment</h1>
            <p className="text-xs text-slate-500">DIBELS 8th Edition • 3-Minute Timer</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Student Name <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student name..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Passage
            </label>
            <div className="space-y-2">
              {Object.entries(gradeGroups)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([grade, gradePassages]) => (
                  <div key={grade}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 mt-2">
                      Grade {grade}
                    </p>
                    <div className="space-y-1">
                      {gradePassages.map((p) => (
                        <label
                          key={p.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                            selectedPassageId === p.id
                              ? "bg-blue-50 border-blue-300 text-blue-800"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name="passage"
                            value={p.id}
                            checked={selectedPassageId === p.id}
                            onChange={() => setSelectedPassageId(p.id)}
                            className="accent-blue-600"
                          />
                          <span className="text-sm font-medium">{p.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">How this works</p>
            <ul className="space-y-1 text-xs text-blue-700 list-disc list-inside">
              <li>Every 7th word is replaced with 3 answer choices</li>
              <li>
                {selectedPassage.grade === 2
                  ? "First 2 sentences and last sentence kept intact (Grade 2)"
                  : "First and last sentences kept intact (Grades 3–8)"}
              </li>
              <li>3-minute countdown timer starts immediately</li>
              <li>Score shown on screen — no data is saved</li>
            </ul>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-base transition-colors shadow-sm"
          >
            Start Assessment ▶
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center">
        No student data is stored. Results appear on screen for teacher recording only.
      </p>
    </div>
  );
}
