import { Lock, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function BingoSquare({ event, isLogged }) {
  
  const sportStyles = {
    "Football": "bg-red-600 text-white",
    "Basketball": "bg-yellow-500 text-black",
    "Tennis": "bg-green-500 text-black",
    "American Football": "bg-[#FFE5A0] text-black",
    "default": "bg-slate-600 text-white"
  };

  const currentSportStyle = sportStyles[event.sport] || sportStyles.default;

  const statusConfig = {
    won: { 
      border: "border-green-500/50", 
      bg: "bg-green-500/10", 
      icon: <CheckCircle2 size={16} strokeWidth={2.5} />, 
      footer: "text-green-500", 
      label: "Won!" 
    },
    lost: { 
      border: "border-red-500/50", 
      bg: "bg-red-500/10", 
      icon: <XCircle size={16} strokeWidth={2.5} />, 
      footer: "text-red-500", 
      label: "Lost" 
    },
    pending: { 
      border: "border-slate-700", 
      bg: "bg-slate-800/50", 
      icon: <Clock size={16} strokeWidth={2.5} />, 
      footer: "text-slate-400", 
      label: "Pending" 
    }
  };

  const currentStatus = isLogged 
    ? (statusConfig[event.status] || statusConfig.pending) 
    : statusConfig.pending;

  return (
    <div className={`border-2 rounded-xl p-4 flex flex-col gap-3 transition-all ${currentStatus.border} ${currentStatus.bg}`}>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${currentSportStyle}`}>
          {event.sport}
        </span>
        
        <div className={currentStatus.footer}>
          {!isLogged ? (
            <Lock size={16} strokeWidth={2.5} />
          ) : (
            currentStatus.icon
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-white leading-tight">{event.team1}</p>
        <p className="text-[10px] text-slate-500 my-1 font-medium">vs</p>
        <p className="font-bold text-white leading-tight">{event.team2}</p>
      </div>

      <div className="bg-white text-slate-900 text-center py-1.5 rounded-lg font-bold text-xs shadow-inner">
        {event.prediction}
      </div>

      <div className="flex flex-col items-center gap-1 mt-auto">
        <span className="text-[10px] text-slate-400">📅 {event.date}</span>
        
        <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStatus.footer}`}>
          {!isLogged ? (
            "Locked"
          ) : (
            <div className="flex items-center gap-1">
              {currentStatus.label}
            </div>
          )}
        </span>
      </div>
    </div>
  );
}