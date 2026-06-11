import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Award, Sparkles, X } from "lucide-react";

export default function ClaimPrize({ transactions = [], currentUserId, onCollect }) {
  const [activePrize, setActivePrize] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;

    const rawList = Array.isArray(transactions) 
      ? transactions 
      : transactions?.content || [];

    if (rawList.length === 0) return;

    const unclimedPrizes = rawList.filter((t) => {
      const isMyTransaction = Number(t.userId) === Number(currentUserId) || 
                              Number(t.user_id) === Number(currentUserId) || 
                              Number(t.user?.id) === Number(currentUserId);

      const isPrizeType = String(t.type) === "2" || (t.type || "").toLowerCase() === "prize";

      const isNotClaimedYet = t.claimed === false || String(t.claimed).toLowerCase() === "false" || t.claimed === null;

      return isMyTransaction && isPrizeType && isNotClaimedYet;
    });

    if (unclimedPrizes.length > 0) {
      const targetPrize = unclimedPrizes[0];
      
      if (!activePrize || activePrize.id !== targetPrize.id) {
        setActivePrize(targetPrize);
        triggerConfettiExplosion();
      }
    } else {
      setActivePrize(null);
    }
  }, [transactions, currentUserId, activePrize]);

  const triggerConfettiExplosion = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors: ["#ff0044", "#ffffff", "#ffcc00"] });
      confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors: ["#ff0044", "#ffffff", "#ffcc00"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  if (!activePrize) return null;

  const handleCollectClick = () => {
    if (onCollect) {
      onCollect(activePrize.id);
    }
    setActivePrize(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-bingo-dark border border-bingo-red rounded-3xl p-8 text-center shadow-2xl shadow-red-950/40">
        
        <button 
          onClick={handleCollectClick}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-black/40 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mx-auto w-20 h-20 bg-bingo-dark border border-bingo-red rounded-2xl flex items-center justify-center mb-6 relative animate-bounce">
          <Award size={42} className="text-bingo-red" />
          <Sparkles size={20} className="text-bingo-red absolute -top-2 -right-2 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-1.5">
            <Sparkles size={14} /> Prize Detected <Sparkles size={14} />
          </h2>
          <h1 className="text-2xl font-black uppercase tracking-tight text-bingo-red">
            Congratulations!
          </h1>
          <p className="text-slate-400 text-xs max-w-xs mx-auto pt-1 font-mono">
            {activePrize.message || "A winning pattern was detected on your card! The prize has been credited."}
          </p>
        </div>

        <div className="mt-6 p-4 bg-bingo-dark border border-bingo-red rounded-2xl font-mono">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Amount Added to Wallet
          </span>
          <span className="text-3xl font-black tracking-tight text-bingo-red">
            +{activePrize.amount ? Number(activePrize.amount).toFixed(2) : "0.00"} €
          </span>
        </div>

        <button
          onClick={handleCollectClick}
          className="mt-6 w-full py-3 bg-bingo-red font-black uppercase tracking-wider text-xs text-white rounded-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          Collect Rewards
        </button>

      </div>
    </div>
  );
}