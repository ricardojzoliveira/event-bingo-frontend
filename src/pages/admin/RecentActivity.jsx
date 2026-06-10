import { useState } from "react";
import { useAdminLogs } from "../../hooks/useAdmin";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function RecentActivity({ variant = "panel" }) {
  const isFullView = variant === "full";
  const [page, setPage] = useState(0);
  
  const pageSize = isFullView ? 20 : 5;

  const { data: serverResponse, isLoading } = useAdminLogs(page, pageSize);

  const logsList = serverResponse?.content || [];
  const totalElements = serverResponse?.page?.totalElements || 0;
  const totalPages = serverResponse?.page?.totalPages || 1;

  const getLevelBadge = (level) => {
    switch (level?.toUpperCase()) {
      case "ERROR":
        return {
          bg: "bg-red-500/10 border-red-500/20 text-red-400",
          icon: <XCircle size={12} className="text-red-500" />
        };
      case "WARNING":
      case "WARN":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
          icon: <AlertCircle size={12} className="text-yellow-500" />
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
          icon: <CheckCircle2 size={12} className="text-blue-400" />
        };
    }
  };

  if (isLoading) return <p className="text-slate-500 animate-pulse text-xs font-bold uppercase tracking-widest p-6">Fetching database logs...</p>;

  return (
    <div className="bg-bingo-dark border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <th className="py-3 px-4 w-16">ID</th>
              <th className="py-3 px-4 w-24">Level</th>
              <th className="py-3 px-4">Message</th>
              <th className="py-3 px-4 w-44 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
            {logsList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-600 font-bold uppercase tracking-wider">
                  No database logs found.
                </td>
              </tr>
            ) : (
              logsList.map((log) => {
                const badge = getLevelBadge(log.level);
                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-4 text-slate-500 font-bold">#{log.id}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-black uppercase ${badge.bg}`}>
                        {badge.icon}
                        {log.level || "INFO"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 break-all pr-4 select-all group-hover:text-white transition-colors">
                      {log.message}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-right whitespace-nowrap">
                      {log.timestamp 
                        ? new Date(log.timestamp).toLocaleString("pt-PT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })
                        : "n/a"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isFullView && logsList.length > 0 && (
        <div className="pt-4 border-t border-slate-800/40 flex justify-end">
          <Link 
            to="/admin/logs" 
            className="text-xs font-black uppercase tracking-wider text-bingo-red hover:text-red-400 flex items-center gap-1 group transition-colors cursor-pointer"
          >
            Open Logs Console 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {isFullView && totalPages > 1 && (
        <div className="pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-black/40 border border-slate-800 rounded-lg hover:border-bingo-red/40 disabled:opacity-30 disabled:hover:border-slate-800 transition-colors text-slate-300 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={12} /> Previous
          </button>
          
          <span>Page {page + 1} / {totalPages}</span>

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-black/40 border border-slate-800 rounded-lg hover:border-bingo-red/40 disabled:opacity-30 disabled:hover:border-slate-800 transition-colors text-slate-300 cursor-pointer disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={12} />
          </button>
        </div>
      )}

    </div>
  );
}