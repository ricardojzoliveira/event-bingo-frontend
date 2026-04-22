import { Loader2 } from "lucide-react";

export default function LoadingState({ message = "Loading Bingo Data..." }) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-bingo-dark gap-4">
      <Loader2 
        className="text-bingo-red animate-spin" 
        size={48} 
        strokeWidth={2.5} 
      />
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs animate-pulse">
        {message}
      </p>
    </div>
  );
}