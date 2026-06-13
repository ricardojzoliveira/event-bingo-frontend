import { X, User, Mail, Calendar, Receipt } from "lucide-react";

export default function UsersBoughtCard({ isOpen, onClose, cardName, purchases = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-bingo-dark border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-slide-over text-white">
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight truncate max-w-[280px]">{cardName}</h1>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-black/20 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="bg-bingo-dark border border-bingo-red rounded-xl p-4 flex justify-between items-center font-mono text-xs">
            <span className="text-slate-500 uppercase font-bold tracking-wider">Total Bets:</span>
            <span className="bg-bingo-red/10 border border-bingo-red px-3 py-1 rounded-lg text-bingo-red font-black">
              {purchases.length}
            </span>
          </div>
        </div>

        <div className="flex-1 my-6 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {purchases.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
              <Receipt size={32} className="mb-2 opacity-40" />
              <p className="text-xs font-bold uppercase tracking-wider">No active bets found for this card.</p>
            </div>
          ) : (
            purchases.map((purchase, index) => (
              <div 
                key={purchase.id || index} 
                className="bg-bingo-dark border border-bingo-red p-4 rounded-xl space-y-2 group hover:border-bingo-red transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-bingo-red transition-colors">
                    <User size={14} />
                  </div>
                  <span className="font-bold text-sm text-slate-200">{purchase.username || "Unknown Player"}</span>
                </div>
                
                <div className="flex flex-col gap-1 pl-7 text-[11px] text-slate-500 font-medium font-mono">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="opacity-60" />
                    <span>{purchase.email || "no-email@bingo.com"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
        >
          Close
        </button>

      </div>
    </div>
  );
}