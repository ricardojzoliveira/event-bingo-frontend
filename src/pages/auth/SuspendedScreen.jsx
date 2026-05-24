import { useNavigate } from "react-router-dom";
import { ShieldAlert, LifeBuoy, LogOut } from "lucide-react";

export default function SuspendedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bingo-dark flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full border-2 border-amber-500/30 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-md p-10 text-center space-y-6 shadow-2xl shadow-amber-500/5 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="mx-auto w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center rounded-2xl shadow-lg">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight italic text-amber-500">
            Account Suspended
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            This account is currently under a self-exclusion period or has been suspended. Access to the betting arena and wallet operations is restricted.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button 
            onClick={() => navigate("/support")}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <LifeBuoy size={16} className="text-bingo-red" />
            Contact Support
          </button>
          
          <button 
            onClick={() => navigate("/logout")}
            className="w-full bg-red-950/20 border border-red-900/40 text-red-500 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition hover:bg-red-900/20 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}