import { ShoppingCart, Lock } from "lucide-react";

export default function GuestCTA({ role, onBuy }) {
  if (role === "user") {
    return (
      <div className="border-2 border-bingo-red rounded-2xl p-10 bg-[#02182B] shadow-[0_0_30px_rgba(220,38,38,0.2)] text-white flex flex-col items-center text-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-bingo-red mb-2">
            <ShoppingCart size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Buy Card</h3>
          <p className="text-slate-400 text-sm max-w-sm">
            Get this card to participate and have the chance to win prizes!
          </p>
        </div>

        <div className="bg-bingo-red rounded-2xl p-6 w-48 flex flex-col items-center justify-center shadow-xl border border-white/10 my-2">
          <span className="text-[10px] uppercase font-black opacity-80 mb-1 tracking-widest">Price of the card</span>
          <span className="text-4xl font-black">€100</span>
        </div>
        
        <button 
          onClick={onBuy}
          className="bg-bingo-red hover:bg-red-700 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-lg shadow-red-600/40 flex items-center gap-3 active:scale-95 transform"
        >
          <ShoppingCart size={20} />
          Buy Card
        </button>
      </div>
    );
  }

  return (
    <div className="border-2 border-bingo-red rounded-2xl p-8 bg-[#02182B] shadow-[0_0_25px_rgba(220,38,38,0.15)] text-white flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-bingo-red/20 p-4 rounded-full text-bingo-red">
          <Lock size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Log in to purchase this card</h3>
          <p className="text-slate-400 text-sm">To purchase and participate in this bingo card, you need to have an account.</p>
        </div>
      </div>
      
      <a href="/login" className="bg-bingo-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-600/20">
        Sign in
      </a>
    </div>
  );
}