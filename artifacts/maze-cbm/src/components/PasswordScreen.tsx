import { useState } from "react";

const ACCESS_PASSWORD = "1234";

interface Props {
  onUnlock: () => void;
}

export default function PasswordScreen({ onUnlock }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ACCESS_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 w-full max-w-sm p-8 text-center">
        <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg inline-block mb-4">
          MAZE CBM
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome</h1>
        <p className="text-sm text-slate-500 mb-6">Enter the password to begin your assessment</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className={`w-full border rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 transition-colors ${
              error
                ? "border-red-400 bg-red-50 focus:ring-red-300 text-red-600"
                : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm font-medium">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-base transition-colors shadow-sm"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
