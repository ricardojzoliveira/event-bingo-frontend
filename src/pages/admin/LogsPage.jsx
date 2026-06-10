import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RecentActivity from "./RecentActivity";

export default function AuditLogsPage() {
  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-6xl mx-auto space-y-8">


        <div className="border border-bingo-red/50 rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link to="/admin" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft size={24} className="text-bingo-red" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase">System Logs Console</h1>
            <p className="text-slate-500 text-sm">Raw database logs</p>
          </div>
        </div>

        <div className="w-full">
          <RecentActivity variant="full" />
        </div>

      </div>
    </div>
  );
}