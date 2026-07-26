import { Lock, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function BingoSquare({ event, isLogged, gridSize = 3 }) {
  const sportStyles = {
    football: "bg-red-600 text-white",
    basketball: "bg-yellow-500 text-black",
    basket: "bg-yellow-500 text-black",
    tennis: "bg-green-500 text-black",
    "american football": "bg-[#FFE5A0] text-black",
    default: "bg-slate-600 text-white",
  };

  const currentSport = (event?.sport || "").toLowerCase();
  const currentSportStyle = sportStyles[currentSport] || sportStyles.default;

  const isCompact = gridSize >= 4; // True para 4x4 ou 5x5

  const statusConfig = {
    win: {
      border: "border-green-500/50",
      bg: "bg-green-500/10",
      icon: <CheckCircle2 size={isCompact ? 12 : 16} strokeWidth={2.5} />,
      footer: "text-green-500",
      label: "Won!",
    },
    lose: {
      border: "border-red-500/50",
      bg: "bg-red-500/10",
      icon: <XCircle size={isCompact ? 12 : 16} strokeWidth={2.5} />,
      footer: "text-red-500",
      label: "Lost",
    },
    pending: {
      border: "border-slate-700",
      bg: "bg-slate-800/50",
      icon: <Clock size={isCompact ? 12 : 16} strokeWidth={2.5} />,
      footer: "text-slate-400",
      label: "Pending",
    },
  };

  const eventStatus = (event?.status || "").toLowerCase();

  const currentStatus = isLogged
    ? statusConfig[eventStatus] || statusConfig.pending
    : statusConfig.pending;

  const formattedDate = event?.date ? event.date.split("T")[0] : "----(--(--";

  return (
    <div
      className={`border sm:border-2 rounded-lg sm:rounded-xl p-1 sm:p-3 flex flex-col justify-between transition-all w-full min-w-0 ${
        currentStatus.border
      } ${currentStatus.bg}`}
    >
      {/* Cabeçalho: Desporto + Ícone de Estado */}
      <div className="flex justify-between items-center gap-0.5 mb-1">
        <span
          title={event?.sport}
          className={`text-[7px] sm:text-[10px] px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded font-bold uppercase tracking-wider truncate max-w-[80%] cursor-pointer ${currentSportStyle}`}
        >
          {event?.sport}
        </span>

        <div className={`${currentStatus.footer} shrink-0`}>
          {!isLogged ? (
            <Lock size={12} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
          ) : (
            <span className="block">{currentStatus.icon}</span>
          )}
        </div>
      </div>

      {/* Equipas com Tooltip no Hover / Touch */}
      <div className="text-center my-auto py-0.5">
        <p
          title={event?.home_team}
          className="text-[9px] sm:text-xs font-bold text-white leading-tight break-words line-clamp-1 cursor-pointer"
        >
          {event?.home_team}
        </p>

        <p className="text-[7px] sm:text-[9px] text-slate-500 font-medium uppercase leading-none my-0.5">
          vs
        </p>

        <p
          title={event?.away_team}
          className="text-[9px] sm:text-xs font-bold text-white leading-tight break-words line-clamp-1 cursor-pointer"
        >
          {event?.away_team}
        </p>
      </div>

      {/* Previsão com Tooltip no Hover / Touch */}
      <div
        title={event?.prediction}
        className="bg-white text-slate-900 text-center py-0.5 px-0.5 my-1 rounded font-black text-[7px] sm:text-xs shadow-inner uppercase truncate cursor-pointer"
      >
        {event?.prediction}
      </div>

      {/* Rodapé: Data + Estado */}
      <div className="flex flex-col items-center gap-0 mt-auto pt-0.5 border-t border-slate-700/30">
        <span className="text-[7px] sm:text-[10px] text-slate-400 whitespace-nowrap truncate">
          📅 {formattedDate}
        </span>

        <span
          className={`text-[7px] sm:text-[10px] font-black uppercase tracking-wider ${currentStatus.footer}`}
        >
          {!isLogged ? "Locked" : currentStatus.label}
        </span>
      </div>
    </div>
  );
}