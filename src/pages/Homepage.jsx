import { Lock, Grid3x3, DollarSign, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import { ALL_CARDS } from "../data/Cards";

export default function Homepage() {

  const cardsList = Object.entries(ALL_CARDS).map(([key, value]) => ({
    ...value,
    id: key
  }));

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
        <h1 className="text-5xl font-black text-bingo-red mb-3 uppercase">
          Available Bingo Cards
        </h1>
        <p className="text-slate-400">
          Choose your card and win prizes by predicting sports events
        </p>
        <div className="flex justify-center">
          <button className="mt-6 bg-bingo-red text-bingo-dark px-10 py-4 rounded-2xl hover:brightness-110 font-bold transition-all flex items-center justify-center gap-3 uppercase tracking-tight shadow-lg shadow-bingo-red/10">
            <Lock size={20} strokeWidth={3} className="shrink-0" />
            <span className="text-lg leading-none">
              Log in to interact with cards
            </span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {cardsList.map((card, index) => (
          <div
            key={card.id || index}
            className="border-2 border-bingo-red rounded-[2rem] bg-slate-900/40 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-bingo-red">
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {card.title}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                Created on {card.date}
              </p>
            </div>

            <div className="p-6 space-y-2 bg-slate-900/20 grow">
              <div className="flex items-center gap-2 text-xs">
                <Grid3x3 size={15} className="text-blue-600" />
                <span className="text-slate-400 font-medium">Size:</span>
                <span className="text-white font-bold">{card.size}</span>
                <span className="text-slate-500">({card.events?.length || 0} events)</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <DollarSign size={15} className="text-green-500" />
                <span className="text-slate-400 font-medium">Prize per line:</span>
                <span className="text-green-500 font-bold">€{card.prizePerLine || card.line}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Trophy size={15} className="text-orange-500" />
                <span className="text-slate-400 font-medium">Full card prize:</span>
                <span className="text-orange-500 font-bold">€{card.fullPrize || card.full}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-bingo-red">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black">
                    Progress
                  </span>
                  <div className="w-3 h-3 flex items-center justify-center">
                    <Lock size={10} />
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <Link
                to={`/card/${card.id}`}
                className="block w-full py-3 bg-bingo-red text-white font-black rounded-xl hover:brightness-110 uppercase text-[11px] tracking-wider transition-all text-center"
              >
                View Card
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 w-full max-w-6xl border-3 border-bingo-red rounded-[2.5rem] p-10 bg-slate-900/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-bingo-red text-bingo-dark flex items-center justify-center rounded-full text-2xl font-black shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="text-bingo-red text-xl font-bold mb-2 uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
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