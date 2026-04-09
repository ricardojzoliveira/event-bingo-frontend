import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
          <h1 className="text-4xl font-extrabold text-blue-400 mb-4">
            Event Bingo 🎲
          </h1>
          <p className="text-slate-400">
            Tailwind v4 + Vite + React funcionando!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;