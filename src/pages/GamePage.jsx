import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCard, useBuyCard } from "../hooks/useCards";
import BingoCard from "../components/BingoCard/BingoCard";
import BingoLegend from "../components/BingoCard/BingoLegend";
import GuestCTA from "../components/BingoCard/GuestCTA";
import StatBox from "../components/BingoCard/StatBox";
import { Trophy } from "lucide-react";
import { useAdminEvents } from "../hooks/useAdmin";
import LoadingState from "../components/common/LoadingState"; 
import { calculateCardProgress } from "../utils/cardHelpers";

export default function GamePage({ role }) {
  const { id } = useParams();
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const { data: currentCard, isLoading: loadingCard, isError } = useCard(id);
  const buyMutation = useBuyCard();

  const isLogged = role !== null;
  const isUser = role === "user";
  const hasPurchased = currentCard?.isPurchased && role === "user";

  const { completedEvents: wins, totalEvents: total } = calculateCardProgress(currentCard?.events);
  const progressText = (hasPurchased || role === "admin") ? `${wins}/${total}` : "-- / --";

  const handleBuyCard = () => {
    buyMutation.mutate(
      { cardId: id, price: currentCard.price },
      {
        onSuccess: () => {
          setShowSuccessMsg(true);
          setTimeout(() => setShowSuccessMsg(false), 4000);
        }
      }
    );
  };

  if (loadingCard) return <LoadingState message="Loading Card" />;

  if (isError || !currentCard) return (
    <div className="min-h-screen bg-bingo-dark flex items-center justify-center text-red-500 font-bold">
      Error: Card not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {showSuccessMsg && (
          <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl text-green-500 text-center font-black uppercase animate-in fade-in slide-in-from-top-4">
            Card purchased successfully! Good luck.
          </div>
        )}
        {buyMutation.isError && (
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-500 text-center font-black uppercase">
            {buyMutation.error.message}
          </div>
        )}

        <div className="border-2 border-bingo-red rounded-[2.5rem] p-8 bg-slate-900/20 backdrop-blur-sm shadow-2xl shadow-bingo-red/5 text-white">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">{currentCard.name}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                Card {currentCard.rows}x{currentCard.cols} • {total} events
              </p>
            </div>
            <div className="bg-bingo-dark p-3 rounded-xl border border-bingo-red/20 text-bingo-red">
              <Trophy size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBox label="Prize per Line" value={currentCard.line_prize} />
            <StatBox label="Full Card Prize" value={currentCard.bingo_prize} />
            <StatBox label="Progress" value={progressText} />
          </div>
        </div>

        {!hasPurchased && (isUser || !isLogged) && (
          <GuestCTA 
            role={role} 
            price={currentCard.price} 
            onBuy={handleBuyCard} 
            isLoading={buyMutation.isPending} 
          />
        )}

        {role === "admin" && (
          <div className="bg-blue-500/10 border-2 border-blue-500/50 p-4 rounded-2xl text-blue-400 text-center text-[10px] font-black uppercase tracking-[0.2em]">
            Admin Mode: Previewing Live Status
          </div>
        )}

        <div className={!hasPurchased && role !== "admin" ? "opacity-50 grayscale pointer-events-none" : ""}>
          <BingoCard 
            data={currentCard} // Passamos os eventos já sincronizados!
            isLogged={hasPurchased || role === "admin"} 
          />
        </div>

        {hasPurchased && <BingoLegend />}
      </div>
    </div>
  );
}