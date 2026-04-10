import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { ALL_CARDS } from "../data/Cards";

import BingoCard from "../components/BingoCard/BingoCard";
import BingoLegend from "../components/BingoCard/BingoLegend";
import GuestCTA from "../components/BingoCard/GuestCTA";
import StatBox from "../components/BingoCard/StatBox";
import { Trophy } from "lucide-react";

export default function GamePage({ role }) {
    const { id } = useParams(); 
    
    const currentCard = ALL_CARDS[id] || ALL_CARDS["1"];
    
    const [hasPurchased, setHasPurchased] = useState(currentCard.isPurchased && role === "user");
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);


    useEffect(() => {
        setHasPurchased(currentCard.isPurchased && role === "user");
    }, [id, role, currentCard.isPurchased]);
    
    const isLogged = role !== null;
    const isUser = role === "user"; 

    const totalEvents = currentCard.events.length;

    const wonEvents = hasPurchased 
        ? currentCard.events.filter(e => e.status === "won").length 
        : 0;
    
    const dynamicProgress = hasPurchased ? `${wonEvents}/${totalEvents}` : `--/${totalEvents}`;

    const handleBuyCard = () => {
        setHasPurchased(true);
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), 4000);
    };

    return (
        <div className="min-h-screen bg-bingo-dark p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {showSuccessMsg && (
                    <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl text-green-500 text-center font-medium animate-in fade-in zoom-in duration-300">
                        Card purchased successfully! Good luck.
                    </div>
                )}

                <div className="border-2 border-bingo-red rounded-2xl p-6 bg-bingo-dark shadow-[0_0_20px_rgba(220,38,38,0.1)] text-white relative overflow-hidden">

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">{currentCard.title}</h2>
                            <p className="text-slate-400 text-sm">Card {currentCard.size} • {totalEvents} events</p>
                        </div>
                        <Trophy size={20} className="text-bingo-red" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <StatBox label="Prize per Line" value={currentCard.prizePerLine} />
                        <StatBox label="Full Card Prize" value={currentCard.fullPrize} />
                        <StatBox label="Progress" value={dynamicProgress} />
                    </div>
                </div>

                {(!hasPurchased && (isUser || !isLogged)) && (
                    <GuestCTA role={role} onBuy={handleBuyCard} />
                )}

                {role === "admin" && (
                    <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-xl text-blue-400 text-center text-sm font-bold uppercase tracking-widest">
                        Admin Mode: Previewing Card Structure
                    </div>
                )}

                <BingoCard 
                    data={currentCard} 
                    isLogged={hasPurchased} 
                />

                {hasPurchased && <BingoLegend />}
            </div>
        </div>
    );
}