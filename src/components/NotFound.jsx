import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-bingo-dark">
      
      <div className="relative mb-6">
        <AlertTriangle size={120} className="text-bingo-red opacity-20 absolute -top-10 -left-10 rotate-12" />
        <h1 className="text-9xl font-black text-bingo-red tracking-tighter relative z-10">
          404
        </h1>
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
        Bingo! ... Wait, no.
      </h2>
      
      <p className="text-slate-400 mt-4 max-w-md mx-auto font-medium">
        Oops! This page went to another bingo hall.
      </p>

      <Link 
        to="/" 
        className="mt-10 bg-bingo-red text-bingo-dark px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-3 shadow-lg shadow-bingo-red/20 active:scale-95"
      >
        <Home size={20} />
        Back to Homepage
      </Link>
    </div>
  );
}