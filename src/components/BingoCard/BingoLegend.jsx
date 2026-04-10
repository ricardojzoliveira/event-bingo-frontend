export default function BingoLegend() {
  const items = [
    { label: "Won", desc: "Correct Prediction", color: "text-green-500", bg: "bg-green-500/10", icon: "✓" },
    { label: "Lost", desc: "Incorrect Prediction", color: "text-red-500", bg: "bg-red-500/10", icon: "×" },
    { label: "Pending", desc: "Awaiting Result", color: "text-slate-400", bg: "bg-slate-400/10", icon: "🕒" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 border border-bingo-red rounded-3xl p-8 bg-[#02182B]/50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-8">
          Match Status Legend
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-3xl">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              
              <div className={`w-12 h-12 rounded-full ${item.bg} ${item.color} flex items-center justify-center text-xl font-bold mb-4 border border-white/5 transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-tight">
                  {item.label}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[120px]">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}