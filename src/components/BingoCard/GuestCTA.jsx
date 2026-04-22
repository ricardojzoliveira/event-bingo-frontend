import { ShoppingCart, Lock } from "lucide-react";

export default function GuestCTA({ role, onBuy, isLoading }) {
  if (role === "user") {
    return (
      <div className="border border-bingo-red/40 rounded-xl p-5 bg-[#02182B] shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-bingo-red/20 p-3 rounded-lg text-bingo-red">
            <ShoppingCart size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold uppercase tracking-tight">Buy this Card</h3>
            <p className="text-slate-400 text-xs">Get full access to events and win prizes.</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-black opacity-60 tracking-widest">Price</span>
            <span className="text-2xl font-black text-white">€100</span>
          </div>

          <button
            onClick={onBuy}
            disabled={isLoading}
            className="bg-bingo-red hover:bg-red-700 text-white font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-xs py-2.5 px-8 rounded-lg shadow-md shadow-red-600/20"
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
    <div className="border border-bingo-red rounded-xl p-5 bg-[#02182B] shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-white/5 p-3 rounded-lg">
          <Lock size={24} className="text-bingo-red" />
        </div>
        <div className="text-left">
          <h3 className="text-lg font-bold">Log in to purchase</h3>
          <p className="text-slate-400 text-xs">Account required to participate.</p>
        </div>
      </div>

      <a href="/login" className="bg-bingo-red hover:bg-red-700 text-white font-bold text-xs py-2.5 px-8 rounded-lg transition-all shadow-md">
        Sign in
      </a>
    </div>
  );
}