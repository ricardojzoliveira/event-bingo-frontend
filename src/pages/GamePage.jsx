import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCard, useBuyCard } from "../hooks/useCards";

import BingoCard from "../components/BingoCard/BingoCard";
import BingoLegend from "../components/BingoCard/BingoLegend";
import GuestCTA from "../components/BingoCard/GuestCTA";
import StatBox from "../components/BingoCard/StatBox";
import { Trophy } from "lucide-react";

export default function GamePage({ role }) {
    const { id } = useParams();

    const { data: currentCard, isLoading, isError } = useCard(id);

    const buyMutation = useBuyCard();
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const isLogged = role !== null;
    const isUser = role === "user";

    const handleBuyCard = () => {
        buyMutation.mutate(
            { cardId: id, price: currentCard.price },
            {
                onSuccess: () => {
                    setShowSuccessMsg(true);
                    setTimeout(() => setShowSuccessMsg(false), 4000);
                },
                onError: (err) => {
                    console.error(err.message);
                }
            }
        );
    };

    if (isLoading) return (
        <div className="min-h-screen bg-bingo-dark flex items-center justify-center">
            <div className="text-white font-black text-2xl animate-pulse">LOADING BINGO CARD...</div>
        </div>
    );

    if (isError || !currentCard) return (
        <div className="min-h-screen bg-bingo-dark flex items-center justify-center">
            <div className="text-red-500 font-bold">Error: Card not found.</div>
        </div>
    );

    const hasPurchased = currentCard.isPurchased && role === "user";

    const totalEvents = currentCard.events?.length || 0;
    const wonEvents = hasPurchased
        ? currentCard.events.filter(e => e.status === "won").length
        : 0;

    const dynamicProgress = hasPurchased ? `${wonEvents}/${totalEvents}` : `--/${totalEvents}`;

    return (
        <div className="min-h-screen bg-bingo-dark p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {showSuccessMsg && (
                    <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl text-green-500 text-center font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-300">
                        Card purchased successfully! Good luck.
                    </div>
                )}

                {buyMutation.isError && (
                    <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-500 text-center font-black uppercase tracking-widest">
                        {buyMutation.error.message}
                    </div>
                )}

                <div className="border-2 border-bingo-red rounded-[2.5rem] p-8 bg-slate-900/20 backdrop-blur-sm shadow-2xl shadow-bingo-red/5 text-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic">{currentCard.title}</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                                Card {currentCard.size} • {totalEvents} events
                            </p>
                        </div>
                        <div className="bg-bingo-dark p-3 rounded-xl border border-bingo-red/20 text-bingo-red">
                            <Trophy size={24} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatBox label="Prize per Line" value={currentCard.prizePerLine} />
                        <StatBox label="Full Card Prize" value={currentCard.fullPrize} />
                        <StatBox label="Progress" value={dynamicProgress} highlight={hasPurchased} />
                    </div>
                </div>

                {(!hasPurchased && (isUser || !isLogged)) && (
                    <GuestCTA
                        role={role}
                        price={currentCard.price}
                        onBuy={handleBuyCard}
                        isLoading={buyMutation.isPending}
                    />
                )}

                {role === "admin" && (
                    <div className="bg-blue-500/10 border-2 border-blue-500/50 p-4 rounded-2xl text-blue-400 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                        Admin Mode: Previewing Card Structure
                    </div>
                )}

                <div className={!hasPurchased && role !== "admin" ? "opacity-50 grayscale pointer-events-none" : ""}>
                    <BingoCard
                        data={currentCard}
                        isLogged={hasPurchased || role === "admin"}
                    />
                </div>

                {hasPurchased && <BingoLegend />}
            </div>
        </div>
    );
}