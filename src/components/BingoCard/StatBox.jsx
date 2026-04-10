export default function StatBox({ label, value }) {
  return (
    <div className="bg-slate-800/40 p-4 rounded-xl flex-1">
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}