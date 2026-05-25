import { ShoppingCart, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuestCTA({ role, onBuy, isLoading, price }) {
  if (role === "user") {
    return (
      <div className="border-2 border-bingo-red p-6 rounded-[2rem] bg-slate-900/40 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div className="flex items-center gap-5">
          <div className="bg-bingo-red p-4 rounded-2xl text-white shadow-lg shadow-bingo-red/20">
            <ShoppingCart size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Buy this Card</h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Get full access and win prizes.</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <span className="block text-[9px] uppercase font-black text-slate-500 tracking-[0.3em] mb-1">Price</span>
            <span className="text-3xl font-black text-white italic">€{price}</span>
          </div>

          <button
            onClick={onBuy}
            disabled={isLoading}
            className="bg-bingo-red hover:bg-[#cc0000] text-white font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-[10px] py-4 px-10 rounded-2xl shadow-xl shadow-bingo-red/30 disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              "Confirm Purchase"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-bingo-red p-6 rounded-[2rem] bg-slate-900/40 text-white flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-5">
        <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
          <Lock size={24} className="text-bingo-red" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Log in to purchase</h3>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Account required to participate.</p>
        </div>
      </div>

      <Link 
        to="/login" 
        className="bg-bingo-red hover:bg-[#cc0000] text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 px-10 rounded-2xl transition-all shadow-xl shadow-bingo-red/20 text-center block md:inline-block"
      >
        Sign in
      </Link>
    </div>
  );
}