import { useState } from "react";
import {
  Grid3x3,
  Trophy,
  ShoppingCart,
  History,
  PlayCircle,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCards } from "../hooks/useCards";
import LoadingState from "../components/common/LoadingState";
import { calculateCardProgress } from "../utils/cardHelpers";
import { useCurrentUser } from "../hooks/useAuth";
import { useWallet } from "../hooks/useAuth";
import { formatDate } from "../utils/date";
import ClaimPrize from "./ClaimPrize";

export default function Homepage({ role }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("market");
  const { data: serverCards, isLoading: loadingCards } = useCards();
  const { data: currentUser } = useCurrentUser();

  const { useTransactions, useClaimPrizeMutation } = useWallet();
  const { data: transactions } = useTransactions();
  const { mutate: claimPrize } = useClaimPrizeMutation();

  if (loadingCards) return <LoadingState message="Syncing data..." />;

  const isLogged = role !== null;

  const cardsList =
    serverCards?.map((card) => {
      const { totalEvents } = calculateCardProgress(card.events);

      const wins =
        card.events?.filter((e) => (e.status || "").toLowerCase() === "win")
          .length || 0;
      const losses =
        card.events?.filter((e) => (e.status || "").toLowerCase() === "lose")
          .length || 0;
      const pending =
        card.events?.filter((e) => (e.status || "").toLowerCase() === "pending")
          .length || 0;

      const isPurchased =
        role === "user" &&
        (currentUser?.cards?.some(
          (userCard) => Number(userCard.id) === Number(card.id),
        ) ||
          false);
      const isAvailable = pending === totalEvents;

      return {
        ...card,
        wins,
        losses,
        pending,
        total: totalEvents,
        isPurchased,
        isAvailable,
      };
    }) || [];

  const marketplaceCards =
    cardsList?.filter((c) => !c.isPurchased && c.isAvailable) || [];
  const activeUserCards =
    cardsList?.filter((c) => c.isPurchased && c.pending > 0) || [];
  const historyUserCards =
    cardsList?.filter((c) => c.isPurchased && c.pending === 0) || [];

  const displayCards = (() => {
    if (role === "user") {
      if (activeTab === "active") return activeUserCards;
      if (activeTab === "history") return historyUserCards;
      return marketplaceCards;
    }
    return role === "admin" ? cardsList : marketplaceCards;
  })();

  const handleCollectPrize = (transactionId) => {
    claimPrize(transactionId);
  };

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
          Bingo Cards
        </h1>
        <div className="bg-bingo-dark border border-bingo-red/30 p-6 rounded-3xl mt-6 shadow-xl">
          <p className="text-slate-200 font-bold text-lg mb-2">
            {isLogged
              ? `Welcome back ${currentUser?.username || "Player"}! You have ${activeUserCards.length} cards in progress.`
              : "Choose your card and win prizes by predicting sports events!"}
          </p>
          <span className="text-slate-500 font-black uppercase text-xs tracking-widest">
            {isLogged ? "Get another card now" : "Start your journey today"}
          </span>
        </div>
      </header>

      <ClaimPrize 
        transactions={transactions} 
        currentUserId={currentUser?.id} 
        onCollect={handleCollectPrize} 
      />

      {role === "user" && (
        <div className="flex gap-3 p-2 bg-bingo-dark/40 rounded-3xl border border-bingo-red/20 mb-12 backdrop-blur-md">
          <TabButton
            active={activeTab === "market"}
            onClick={() => setActiveTab("market")}
            icon={<ShoppingCart size={15} />}
            label="Marketplace"
            count={marketplaceCards.length}
          />
          {isLogged && (
            <>
              <TabButton
                active={activeTab === "active"}
                onClick={() => setActiveTab("active")}
                icon={<PlayCircle size={15} />}
                label="Active Cards"
                count={activeUserCards.length}
              />
              <TabButton
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
                icon={<History size={15} />}
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
              className="border-2 border-bingo-red rounded-[2.5rem] bg-bingo-dark flex flex-col overflow-hidden relative transition-all duration-300 hover:scale-[1.01] hover:shadow-red-950/20 group shadow-2xl"
            >
              <div className="p-8 border-b border-bingo-red/20 bg-bingo-dark flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-black text-white leading-tight group-hover:text-bingo-red transition-colors">
                    {card.name}
                  </h2>
                  {card.isPurchased && (
                    <span className="bg-green-500/10 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-green-400 uppercase tracking-wider border border-green-500/20 shadow-lg shrink-0 mt-1">
                      <Check size={11} strokeWidth={4} /> In&nbsp;Play
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Created {formatDate(card.date) || "Date not available"}
                </p>
              </div>

              <div className="p-8 space-y-6 grow bg-bingo-dark flex flex-col justify-between">
                <div className="bg-bingo-dark/10 border border-bingo-red/10 rounded-2xl p-5 grid grid-cols-2 gap-4 relative">
                  <div className="col-span-2 flex justify-between items-center pb-2 border-b border-bingo-red/10 text-[10px] uppercase font-black tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Grid3x3 size={12} /> Card Size
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {card.cols}x{card.rows} Grid
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                      Line Prize
                    </span>
                    <strong className="text-lg font-black text-slate-200 tracking-tight">
                      € {card.line_prize ? Number(card.line_prize).toFixed(2) : "0.00"}
                    </strong>
                  </div>

                  <div className="flex flex-col gap-0.5 border-l border-bingo-red/10 pl-4">
                    <span className="text-[9px] font-black text-bingo-red uppercase tracking-wider flex items-center gap-1">
                      <Trophy size={11} /> Bingo Prize
                    </span>
                    <strong className="text-lg font-black text-white tracking-tight">
                      € {card.bingo_prize ? Number(card.bingo_prize).toFixed(2) : "0.00"}
                    </strong>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                      Progress Status
                    </span>
                    <span className="text-[11px] font-mono font-black text-slate-300 bg-bingo-dark/40 px-2 py-0.5 rounded-md border border-bingo-red/20">
                      {card.isPurchased || role === "admin"
                        ? `${card.wins}/${card.total}`
                        : `-- / ${card.total}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-bingo-dark/50 rounded-full flex overflow-hidden border border-bingo-red/10 p-[1px]">
                    {card.isPurchased || role === "admin" ? (
                      <>
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${(card.wins / card.total) * 100}%` }}
                        />
                        <div
                          className="bg-bingo-red h-full rounded-full transition-all duration-700"
                          style={{ width: `${(card.losses / card.total) * 100}%` }}
                        />
                      </>
                    ) : (
                      <div className="w-full bg-bingo-dark/40 h-full rounded-full" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 bg-bingo-dark">
                <Link
                  to={`/card/${card.id}`}
                  className={`w-full py-4 rounded-2xl font-black text-center uppercase text-xs tracking-widest transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
                    card.isPurchased
                      ? "bg-bingo-dark/30 text-white border border-bingo-red/30 shadow-black/20"
                      : "bg-bingo-red hover:bg-red-600 text-white shadow-red-950/40"
                  }`}
                >
                  {role === "admin" ? (
                    "Preview Structure"
                  ) : card.isPurchased ? (
                    "Open My Card"
                  ) : (
                    <>
                      <span>Get Card</span>
                      <span className="opacity-30 font-normal">|</span>
                      <span className="text-white">€{card.price?.toFixed(2)}</span>
                    </>
                  )}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-black/10 rounded-[3rem] border-2 border-dashed border-bingo-red/10">
            <p className="text-slate-500 font-bold uppercase tracking-widest">
              No cards found in this category.
            </p>
          </div>
        )}
      </section>

      {activeTab === "market" && (
        <section className="w-full max-w-6xl border border-bingo-red/20 rounded-[3rem] p-12 bg-bingo-dark/10 backdrop-blur-sm mb-20 shadow-2xl">
          <h2 className="text-center text-white font-black text-3xl uppercase mb-12 tracking-widest">
            How it Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-5">
                <div className="w-14 h-14 bg-bingo-red text-white flex items-center justify-center rounded-2xl text-2xl font-black rotate-3 shadow-lg shadow-red-950/30">
                  <span className="-rotate-3">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-bingo-red text-lg font-black mb-2 uppercase">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLogged && (
        <div className="fixed bottom-0 left-0 w-full bg-bingo-dark border-t border-bingo-red/20 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-50 flex justify-center items-center gap-6">
          <h3 className="text-white font-black uppercase tracking-widest text-sm">
            Join our community and start winning today!
          </h3>
          <button
            className="bg-bingo-red hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all transform active:scale-95"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      )}
    </main>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2.5 border ${
        active
          ? "bg-bingo-red border-transparent text-white shadow-xl shadow-red-950/30 scale-105"
          : "border-transparent bg-transparent text-slate-500 hover:text-slate-300"
      }`}
    >
      <span>{icon}</span>
      {label}
      <span
        className={`ml-1 px-2 py-0.5 rounded-md text-[9px] font-mono ${
          active ? "bg-black/30 text-white" : "bg-black/20 text-slate-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}