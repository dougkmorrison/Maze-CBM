interface Props {
  studentId: string;
  onSelect: (grade: number) => void;
}

const GRADES = [2, 3, 4, 5, 6, 7, 8];

export default function GradePicker({ studentId, onSelect }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg mb-3">
            MAZE CBM
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Select Your Level</h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Student ID: <span className="font-mono font-semibold text-slate-700">{studentId}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {GRADES.map((g) => (
            <button
              key={g}
              onClick={() => onSelect(g)}
              className="bg-blue-50 hover:bg-blue-600 hover:text-white border-2 border-blue-200 hover:border-blue-600 text-blue-800 font-bold text-2xl rounded-xl py-5 transition-all active:scale-95"
            >
              {g}
            </button>
          ))}
        </div>

        <p className="text-xs text-center text-slate-400 mt-5">
          Your level is saved after your first assessment.
        </p>
      </div>
    </div>
  );
}
