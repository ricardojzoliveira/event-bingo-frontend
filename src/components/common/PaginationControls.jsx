import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationControls({ currentPage, totalPages, totalElements, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800/60 bg-black/10 rounded-b-2xl">
      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
        Total Items: <span className="text-slate-300 font-mono">{totalElements}</span>
      </span>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-bingo-red disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
          Page <span className="font-mono text-white text-sm">{currentPage + 1}</span> of{" "}
          <span className="font-mono text-white text-sm">{totalPages}</span>
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-bingo-red disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}