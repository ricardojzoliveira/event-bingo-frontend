import { Lock, Grid3x3, DollarSign, Trophy, Check, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { ALL_CARDS } from "../data/Cards";

export default function Homepage({ role, setRole }) {
  const cardsList = Object.entries(ALL_CARDS).map(([id, data]) => {
    const wins = data.events.filter((e) => e.status === "won").length;
    const losses = data.events.filter((e) => e.status === "lost").length;
    const pending = data.events.filter((e) => e.status === "pending").length;
    const total = data.events.length;

    return {
      ...data,
      id,
      wins,
      losses,
      pending,
      total,
      isPurchased: id === "1" || id === "2", 
    };
  });

  const isLogged = role !== null;

  const steps = [
    {
      number: "1",
      title: "Choose a card",
      desc: "Select the bingo card with the sports events that interest you the most.",
    },
    {
      number: "2",
      title: "Track the Events",
      desc: "The administrators mark the events as won or lost, according to the results",
    },
    {
      number: "3",
      title: "Win Prizes!",
      desc: "Complete a line to win the base prize, or the full card for the jackpot!",
    },
  ];

  return (
    <main className="min-h-screen bg-bingo-dark text-slate-300 p-8 flex flex-col items-center">
      <header className="text-center max-w-2xl mb-12">
        <h1 className="text-5xl font-black text-bingo-red mb-3 uppercase tracking-tighter">
          Available Bingo Cards
        </h1>
        <p className="text-slate-400">
          {isLogged 
            ? `Welcome back! You have ${cardsList.filter(c => c.isPurchased).length} active cards.` 
            : "Choose your card and win prizes by predicting sports events"}
        </p>
        
        {!isLogged && (
          <div className="flex justify-center">
            <button 
              onClick={() => setRole("user")}
              className="mt-6 bg-bingo-red text-bingo-dark px-10 py-4 rounded-2xl hover:brightness-110 font-bold transition-all flex items-center justify-center gap-3 uppercase tracking-tight shadow-lg shadow-bingo-red/20"
            >
              <Lock size={20} strokeWidth={3} />
              <span className="text-lg">Log in to interact with cards</span>
            </button>
          </div>
        )}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-16">
        {cardsList.map((card) => {
          const hasCard = role === "user" && card.isPurchased;

          return (
            <div
              key={card.id}
              className="border-2 border-bingo-red rounded-[2.5rem] bg-slate-900/40 flex flex-col overflow-hidden relative transition-transform hover:scale-[1.02]"
            >
              <div className="absolute top-5 right-5">
                {hasCard ? (
                  <span className="bg-green-500 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 text-white uppercase italic">
                    <Check size={12} strokeWidth={4} /> Purchased
                  </span>
                ) : (
                  <span className="bg-orange-500 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 text-white uppercase italic">
                    <ShoppingCart size={12} strokeWidth={4} /> Available
                  </span>
                )}
              </div>

              <div className="p-8 border-b border-bingo-red/20">
                <h2 className="text-2xl font-black text-white leading-tight pr-10">
                  {card.title}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">
                  Created on 10/03/2026
                </p>
              </div>

              <div className="p-8 space-y-4 grow bg-slate-900/20">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Grid3x3 size={18} className="text-blue-500" />
                    <span className="text-slate-400">Size: <strong className="text-white">{card.size}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign size={18} className="text-green-500" />
                    <span className="text-slate-400">Prize per line: <strong className="text-green-500">{card.prizePerLine}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Trophy size={18} className="text-orange-500" />
                    <span className="text-slate-400">Full prize: <strong className="text-orange-500">{card.fullPrize}</strong></span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">
                      Progress
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {hasCard ? `${card.wins}/${card.total}` : `--/${card.total}`}
                    </span>
                  </div>

                  <div className="h-3 w-full bg-slate-800 rounded-full flex overflow-hidden shadow-inner">
                    {hasCard ? (
                      <>
                        <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${(card.wins / card.total) * 100}%` }} />
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${(card.losses / card.total) * 100}%` }} />
                      </>
                    ) : (
                      <div className="w-0 bg-slate-700 h-full" />
                    )}
                  </div>

                  {hasCard && (
                    <div className="flex justify-between mt-4 text-[10px] font-bold italic">
                      <span className="text-green-500">✓ {card.wins} wins</span>
                      <span className="text-red-500">× {card.losses} lost</span>
                      <span className="text-slate-400">○ {card.pending} pending</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 pt-0">
                <Link
                  to={`/card/${card.id}`}
                  className={`block w-full py-4 rounded-2xl font-black text-center uppercase text-xs tracking-widest transition-all transform active:scale-95 shadow-xl ${
                    hasCard
                      ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20"
                      : "bg-bingo-red hover:bg-red-500 text-white shadow-red-900/20"
                  }`}
                >
                  {hasCard ? "View My Card" : "View Card"}
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      <section className="w-full max-w-6xl border-2 border-bingo-red rounded-[3rem] p-12 bg-slate-900/30 backdrop-blur-sm mb-20">
        <h2 className="text-center text-white font-black text-3xl uppercase mb-12 tracking-widest">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-bingo-red text-bingo-dark flex items-center justify-center rounded-2xl text-3xl font-black rotate-3 shadow-lg">
                <span className="-rotate-3">{step.number}</span>
              </div>
              <div>
                <h3 className="text-bingo-red text-xl font-black mb-3 uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}