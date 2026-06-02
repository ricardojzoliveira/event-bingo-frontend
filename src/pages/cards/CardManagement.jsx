import { useCards } from "../../hooks/useCards";
import {
  Plus,
  Search,
  Trophy,
  LayoutGrid,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/common/LoadingState";
import { useAdminEvents, useDeleteCard } from "../../hooks/useAdmin";
import { useState } from "react";
import { calculateCardProgress } from "../../utils/cardHelpers";
import { formatDate } from "../../utils/date";

export default function CardManagement() {
  const { data: cards, isLoading: loadingCards } = useCards();
  const { data: globalEvents, isLoading: loadingEvents } = useAdminEvents();

  const [ searchBox, setSearchBox ] = useState("");

  if (loadingCards || loadingEvents) return <LoadingState />;

  const stats = {
    total: cards?.length || 0,
    s3x3: cards?.filter((c) => c.cols === 3).length || 0,
    s4x4: cards?.filter((c) => c.cols === 4).length || 0,
    s5x5: cards?.filter((c) => c.size === 5).length || 0,
  };

  const filteredCards = cards?.filter((card) => {
    const cardName = (card.title || card.name || "").toLowerCase();
    return cardName.includes(searchBox.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border border-bingo-red rounded-2xl p-8 bg-slate-900/20 flex items-center gap-6 relative overflow-hidden">
          <Link
            to="/admin"
            className="p-3 hover:bg-slate-800 rounded-xl transition-all text-bingo-red border border-slate-800"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Cards Management
            </h1>
            <p className="text-slate-500 font-bold uppercase text-sm tracking-tight">
              Create and edit cards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMiniCard label="Total Cards" value={stats.total} color="red" />
          <StatMiniCard label="3x3 Cards" value={stats.s3x3} color="slate" />
          <StatMiniCard label="4x4 Cards" value={stats.s4x4} color="slate" />
          <StatMiniCard label="5x5 Cards" value={stats.s5x5} color="slate" />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              className="w-full bg-slate-900/50 border border-bingo-red rounded-xl py-4 pl-12 text-sm focus:border-bingo-red outline-none transition-all"
              placeholder="Search Cards..." 
              onChange={(e) => setSearchBox(e.target.value)}
            />
          </div>
          <Link
            to="/admin/cards/create"
            className="bg-bingo-red hover:bg-red-600 px-8 rounded-xl flex items-center gap-3 text-sm font-black uppercase transition-all shadow-lg shadow-red-900/20"
          >
            <Plus size={20} /> Create Card
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards?.map((card) => (
            <AdminCardItem
              key={card.id}
              card={card}
              globalEvents={globalEvents}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, color }) {
  return (
    <div className="bg-slate-900/40 border border-bingo-red p-6 rounded-2xl flex justify-between items-center">
      <div>
        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">
          {label}
        </p>
        <span className="text-3xl font-black">{value}</span>
      </div>
      <div
        className={`p-3 rounded-xl bg-white/5 ${color === "red" ? "text-bingo-red" : "text-slate-600"}`}
      >
        <LayoutGrid size={24} />
      </div>
    </div>
  );
}

function AdminCardItem({ card, globalEvents }) {
  const { mutate: deleteCard } = useDeleteCard();

  const syncedEvents = card.events?.map((cardEvent) => {
    const live = globalEvents?.find((g) => g.id === cardEvent.id);
    return live ? { ...cardEvent, status: live.status } : cardEvent;
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      deleteCard(card.id);
    }
  };

  const { totalEvents, completedEvents, progressPercent } = calculateCardProgress(syncedEvents)

  return (
    <div className="bg-slate-900/20 border border-bingo-red rounded-3xl p-6 space-y-6 hover:border-bingo-red/30 transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black uppercase leading-tight">
            {card.name}
          </h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">
            Created at {formatDate(card.date)}
          </p>
        </div>
        <Trophy
          className="text-bingo-red opacity-50 group-hover:opacity-100 transition-opacity"
          size={24}
        />
      </div>

      <div className="flex gap-2">
        <span className="bg-slate-800 text-[10px] font-black px-2 py-1 rounded text-slate-400 uppercase">
          {`${card.cols}x${card.rows}`}
        </span>
        <span className="bg-slate-800 text-[10px] font-black px-2 py-1 rounded text-slate-400 uppercase">
          {totalEvents} events
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
          <span className="text-slate-500">Progress</span>
          <span className="text-bingo-red">
            {completedEvents}/{totalEvents}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-bingo-red to-red-400 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <p className="text-[8px] uppercase font-black text-slate-500">
            Line Prize
          </p>
          <p className="text-green-500 font-bold">
            {card.line_prize || "€50"}
          </p>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <p className="text-[8px] uppercase font-black text-slate-500">
            Bingo Prize
          </p>
          <p className="text-yellow-500 font-bold">
            {card.bingo_prize || "€500"}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-800 pt-4">
        <span className="text-[10px] font-black text-slate-500 uppercase">
          Cost to Play
        </span>
        <span className="text-xl font-black text-yellow-500">
          €{card.price}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <Link to={`/card/${card.id}`} className="block">
          <button className="w-full bg-bingo-red/10 hover:bg-bingo-red text-bingo-red hover:text-white py-2.5 rounded-xl transition-all flex justify-center items-center border border-bingo-red/20">
            <Eye size={18} />
          </button>
        </Link>
        <Link to={`/admin/cards/edit/${card.id}`} className="block">
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl transition-all flex justify-center items-center border border-slate-700">
            <Edit2 size={18} />
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className="bg-slate-800 hover:bg-red-900/50 text-white py-2.5 rounded-xl transition-all flex justify-center items-center border border-slate-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
