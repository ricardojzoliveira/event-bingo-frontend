import { useState } from "react";
import { Lock, Grid3x3, DollarSign, Trophy, Check, ShoppingCart, History, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCards } from "../hooks/useCards";
import { useAdminEvents } from "../hooks/useAdmin";
import LoadingState from "../components/common/LoadingState";
import { calculateCardProgress } from "../utils/cardHelpers";
import { useCurrentUser } from "../hooks/useAuth";
import { formatDate } from "../utils/date";

export default function Homepage({ role }) {
  const [activeTab, setActiveTab] = useState("market");
  const { data: serverCards, isLoading: loadingCards } = useCards();
  const { data: currentUser, isLoading, error} = useCurrentUser();

  if (loadingCards) return <LoadingState message="Syncing data..." />;

  const isLogged = role !== null;

  const cardsList = serverCards?.map((card) => {
    const { totalEvents, completedEvents } = calculateCardProgress(card.events);

  const wins = card.events?.filter((e) => (e.status || "").toLowerCase() === "win").length || 0;
  const losses = card.events?.filter((e) => (e.status || "").toLowerCase() === "lose").length || 0;
  const pending = card.events?.filter((e) => (e.status || "").toLowerCase() === "pending").length || 0;

  const isPurchased = role === "user" && (currentUser?.cards?.some(userCard => Number(userCard.id) === Number(card.id)) || false);

  const isAvailable = pending === totalEvents;

  return { ...card, wins, losses, pending, total: totalEvents, isPurchased, isAvailable };
  }) || [];

  const marketplaceCards = cardsList?.filter(c => !c.isPurchased && c.isAvailable) || [];
  const activeUserCards = cardsList?.filter(c => c.isPurchased && c.pending > 0) || [];
  const historyUserCards = cardsList?.filter(c => c.isPurchased && c.pending === 0) || [];

  const displayCards = (() => {
    if (role === "user") {
      if (activeTab === "active") return activeUserCards;
      if (activeTab === "history") return historyUserCards;
      return marketplaceCards; 
    }
    return role === "admin" ? cardsList: marketplaceCards ;
  })();

  const steps = [
    { number: "1", title: "Choose a card", desc: "Select the bingo card with the sports events that interest you the most." },
    { number: "2", title: "Track the Events", desc: "The administrators mark the events as won or lost, according to the results" },
    { number: "3", title: "Win Prizes!", desc: "Complete a line to win the base prize, or the full card for the jackpot!" },
  ];

  return (
    <main className="min-h-screen bg-bingo-dark text-slate-300 p-8 flex flex-col items-center">
      <header className="text-center max-w-2xl mb-12">
        <h1 className="text-5xl font-black text-bingo-red mb-3 uppercase tracking-tighter">
          Bingo Cards
        </h1>
        <p className="text-slate-400">
          {isLogged
            ? `Welcome back! You have ${activeUserCards.length} cards in progress.`
            : "Choose your card and win prizes by predicting sports events"}
        </p>
      </header>
      
      {role === "user" && (
        <div className="flex gap-2 p-1.5 bg-slate-900/60 rounded-4xl border border-white/5 mb-12 backdrop-blur-md">
        <TabButton 
          active={activeTab === "market"} 
          onClick={() => setActiveTab("market")}
          icon={<ShoppingCart size={16} />}
          label="Marketplace"
          count={marketplaceCards.length}
        />
        {isLogged && (
          <>
            <TabButton 
              active={activeTab === "active"} 
              onClick={() => setActiveTab("active")}
              icon={<PlayCircle size={16} />}
              label="My Active Cards"
              count={activeUserCards.length}
              color="text-green-500"
            />
            <TabButton 
              active={activeTab === "history"} 
              onClick={() => setActiveTab("history")}
              icon={<History size={16} />}
              label="History"
              count={historyUserCards.length}
            />
          </>
        )}
      </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mb-20 transition-all">
        {displayCards.length > 0 ? (
          displayCards.map((card) => (
            <div
              key={card.id}
              className="border-2 border-bingo-red/30 rounded-[2.5rem] bg-slate-900/40 flex flex-col overflow-hidden relative transition-all hover:scale-[1.02] hover:border-bingo-red group shadow-2xl"
            >
              <div className="absolute top-6 right-6 z-10">
                {card.isPurchased ? (
                  <span className="bg-green-500 text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white uppercase italic shadow-lg shadow-green-900/20">
                    <Check size={12} strokeWidth={4} /> Purchased
                  </span>
                ) : (
                  <span className="bg-orange-500 text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white uppercase italic shadow-lg shadow-orange-900/20">
                    <ShoppingCart size={12} strokeWidth={4} /> €{card.price}
                  </span>
                )}
              </div>

              <div className="p-8 border-b border-white/5">
                <h2 className="text-2xl font-black text-white leading-tight pr-12 group-hover:text-bingo-red transition-colors">
                  {card.name}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest italic">
                  Created on {formatDate(card.date) || "Date not available"}
                </p>
              </div>

              <div className="p-8 space-y-5 grow bg-slate-900/20">
                <div className="grid grid-cols-1 gap-3">
                  <DetailItem icon={<Grid3x3 size={16} className="text-blue-500" />} label="Size" value={`${card.cols}x${card.rows}`} />
                  <DetailItem icon={<DollarSign size={16} className="text-green-500" />} label="Line Prize" value={card.line_prize} isPrice />
                  <DetailItem icon={<Trophy size={16} className="text-orange-500" />} label="Bingo" value={card.bingo_prize} isPrice />
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">Progress</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {card.isPurchased || role === "admin" ? `${card.wins}/${card.total}` : `--/${card.total}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden shadow-inner">
                    {(card.isPurchased || role === "admin") ? (
                      <>
                        <div className="bg-green-500 h-full transition-all duration-700" style={{ width: `${(card.wins / card.total) * 100}%` }} />
                        <div className="bg-red-500 h-full transition-all duration-700" style={{ width: `${(card.losses / card.total) * 100}%` }} />
                      </>
                    ) : (
                      <div className="w-0 bg-slate-700 h-full" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0">
                <Link
                  to={`/card/${card.id}`}
                  className={`block w-full py-4 rounded-2xl font-black text-center uppercase text-xs tracking-widest transition-all transform active:scale-95 shadow-xl ${
                    card.isPurchased
                      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-bingo-red hover:bg-red-600 text-white shadow-red-900/20"
                  }`}
                >
                  {role === "admin" ? "Preview Structure" : card.isPurchased ? "Open My Card" : "View Card Details"}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800">
            <p className="text-slate-500 font-bold italic uppercase tracking-widest">No cards found in this category.</p>
          </div>
        )}
      </section>

      {activeTab === "market" && (
        <section className="w-full max-w-6xl border-2 border-bingo-red/20 rounded-[3rem] p-12 bg-slate-900/30 backdrop-blur-sm mb-20 shadow-2xl">
          <h2 className="text-center text-white font-black text-3xl uppercase mb-12 tracking-widest italic">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-5">
                <div className="w-14 h-14 bg-bingo-red text-bingo-dark flex items-center justify-center rounded-2xl text-2xl font-black rotate-3 shadow-lg">
                  <span className="-rotate-3">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-bingo-red text-lg font-black mb-2 uppercase italic">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}


function TabButton({ active, onClick, icon, label, count, color = "text-slate-400" }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 border ${
        active 
          ? "bg-slate-800 border-white/10 text-white shadow-xl scale-105" 
          : "border-transparent text-slate-500 hover:text-slate-300"
      }`}
    >
      <span className={active ? "text-bingo-red" : ""}>{icon}</span>
      {label}
      <span className={`ml-1 px-1.5 py-0.5 rounded-md bg-black/40 text-[8px] ${active ? "text-white" : "text-slate-600"}`}>
        {count}
      </span>
    </button>
  );
}

function DetailItem({ icon, label, value, isPrice = false }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon}
      <span className="text-slate-500 font-bold uppercase text-[10px] tracking-tighter">{label}:</span>
      <strong className={`font-black ${isPrice ? 'text-white' : 'text-slate-200'}`}>{value}</strong>
    </div>
  );
}