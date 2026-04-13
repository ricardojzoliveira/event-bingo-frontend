import { Lock, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function BingoSquare({ event, isLogged }) {
  const sportStyles = {
    Football: "bg-red-600 text-white",
    Basketball: "bg-yellow-500 text-black",
    Tennis: "bg-green-500 text-black",
    "American Football": "bg-[#FFE5A0] text-black",
    default: "bg-slate-600 text-white",
  };

  const currentSportStyle = sportStyles[event.sport] || sportStyles.default;

  const statusConfig = {
    won: {
      border: "border-green-500/50",
      bg: "bg-green-500/10",
      icon: <CheckCircle2 size={16} strokeWidth={2.5} />,
      footer: "text-green-500",
      label: "Won!",
    },
    lost: {
      border: "border-red-500/50",
      bg: "bg-red-500/10",
      icon: <XCircle size={16} strokeWidth={2.5} />,
      footer: "text-red-500",
      label: "Lost",
    },
    pending: {
      border: "border-slate-700",
      bg: "bg-slate-800/50",
      icon: <Clock size={16} strokeWidth={2.5} />,
      footer: "text-slate-400",
      label: "Pending",
    },
  };

  const currentStatus = isLogged
    ? statusConfig[event.status] || statusConfig.pending
    : statusConfig.pending;

  return (
    <div
      className={`border-2 rounded-xl p-2 sm:p-4 flex flex-col gap-2 sm:gap-3 transition-all min-w-[130px] ${currentStatus.border} ${currentStatus.bg}`}
    >
      {/* Header do Square */}
      <div className="flex justify-between items-start gap-1">
        <span
          className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider truncate ${currentSportStyle}`}
        >
          {event.sport}
        </span>

        <div className={`${currentStatus.footer} shrink-0`}>
          {!isLogged ? (
            <Lock size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
          ) : (
            <span className="sm:scale-100 scale-90 block">
              {currentStatus.icon}
            </span>
          )}
        </div>
      </div>

      {/* Equipas */}
      <div className="text-center my-1">
        <p className="text-[11px] sm:text-sm font-bold text-white leading-tight break-words line-clamp-2">
          {event.team1}
        </p>
        <p className="text-[9px] text-slate-500 my-0.5 font-medium uppercase">
          vs
        </p>
        <p className="text-[11px] sm:text-sm font-bold text-white leading-tight break-words line-clamp-2">
          {event.team2}
        </p>
      </div>

      {/* Prediction Badge */}
      <div className="bg-white text-slate-900 text-center py-1 rounded-lg font-black text-[9px] sm:text-xs shadow-inner uppercase tracking-tighter sm:tracking-normal">
        {event.prediction}
      </div>

      {/* Footer do Square */}
      <div className="flex flex-col items-center gap-0.5 mt-auto pt-2">
        <span className="text-[8px] sm:text-[10px] text-slate-400 whitespace-nowrap">
          📅 {event.date}
        </span>

        <span
          className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${currentStatus.footer}`}
        >
          {!isLogged ? "Locked" : currentStatus.label}
        </span>
      </div>
    </div>
  );
}
