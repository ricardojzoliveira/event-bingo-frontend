import {
  useAdminEvents,
  useDeleteEvent,
  useUpdateEventStatus,
} from "../../hooks/use-admin";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  Check,
  X,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/common/LoadingState";
import { formatDateTime } from "../../utils/date";
import { useState } from "react";

export default function EventManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingStatus, setConfirmingStatus] = useState(null);

  const { data: serverEvents, isLoading } = useAdminEvents();
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: updateStatus } = useUpdateEventStatus();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id);
    }
  };

  const handleStatusClick = (eventId, status) => {
    setConfirmingStatus({ eventId, status });
  };

  const handleConfirmStatus = () => {
    if (confirmingStatus) {
      updateStatus({
        eventId: confirmingStatus.eventId,
        status: confirmingStatus.status,
      });
      setConfirmingStatus(null);
    }
  };

  if (isLoading) return <LoadingState />;

  const events =
    serverEvents?.filter((event) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      return (
        event.home_team?.toLowerCase().includes(query) ||
        event.away_team?.toLowerCase().includes(query) ||
        event.sport?.toLowerCase().includes(query) ||
        event.prediction?.toLowerCase().includes(query)
      );
    }) || [];

  const stats = {
    total: events.length,
    won: events.filter((e) => e.status === "Win").length,
    lost: events.filter((e) => e.status === "Lose").length,
    pending: events.filter((e) => e.status === "Pending").length,
  };

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border border-bingo-red rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link
            to="/admin"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-bingo-red" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase">Event Management</h1>
            <p className="text-slate-500 text-sm">
              Create, edit, remove events
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Events"
            value={stats.total}
            icon={<Clock />}
            color="blue"
          />
          <StatCard
            label="Events Won"
            value={stats.won}
            icon={<CheckCircle />}
            color="green"
          />
          <StatCard
            label="Events Lost"
            value={stats.lost}
            icon={<XCircle />}
            color="red"
          />
          <StatCard
            label="Pending Events"
            value={stats.pending}
            icon={<Clock />}
            color="slate"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 text-sm focus:outline-none"
              placeholder="Searching Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link
            to="/admin/events/create"
            className="bg-bingo-red px-6 rounded-xl flex items-center gap-2 text-sm font-bold"
          >
            <Plus size={18} /> New Event
          </Link>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Prevision</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center w-56">Status</th>
                <th className="p-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider"
                  >
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const isConfirmingThisEvent =
                    confirmingStatus?.eventId === event.id;

                  const isLocked =
                    event.status === "Win" || event.status === "Lose";

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-red-900/30 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded italic">
                            {event.sport}
                          </span>
                          <span className="font-bold">
                            {event.home_team} vs {event.away_team}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400">{event.prediction}</td>
                      <td className="p-4 text-slate-400">
                        {formatDateTime(event.date)}
                      </td>

                      <td className="p-4 relative">
                        <div className="flex justify-center items-center">
                          {isLocked ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase border select-none ${
                                event.status === "Win"
                                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                              }`}
                            >
                              <Lock size={10} strokeWidth={3} />
                              {event.status}
                            </span>
                          ) : isConfirmingThisEvent ? (
                            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl shadow-xl animate-scale-up text-[10px] font-bold tracking-tight uppercase">
                              <span className="text-slate-400">
                                Confirm {confirmingStatus.status}?
                              </span>
                              <button
                                onClick={handleConfirmStatus}
                                className="p-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-md hover:bg-green-500 hover:text-black transition-all cursor-pointer"
                              >
                                <Check size={12} strokeWidth={3} />
                              </button>
                              <button
                                onClick={() => setConfirmingStatus(null)}
                                className="p-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 text-slate-600">
                              <button
                                onClick={() =>
                                  handleStatusClick(event.id, "Win")
                                }
                                className="p-1 text-slate-600 hover:text-green-500 rounded-md transition-all cursor-pointer"
                              >
                                <CheckCircle size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusClick(event.id, "Lose")
                                }
                                className="p-1 text-slate-600 hover:text-red-500 rounded-md transition-all cursor-pointer"
                              >
                                <XCircle size={18} />
                              </button>

                              <button
                                disabled
                                className="p-1 text-white bg-white/10 rounded-md opacity-40 cursor-not-allowed"
                              >
                                <Clock size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-3">
                          {isLocked ? (
                            <span className="text-[10px] uppercase font-bold text-slate-600 select-none italic pt-0.5">
                              Read Only
                            </span>
                          ) : (
                            <>
                              <Link to={`/admin/events/edit/${event.id}`}>
                                <button className="text-blue-500 hover:text-blue-400 cursor-pointer">
                                  <Edit2 size={16} />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-500 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    slate: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  };
  return (
    <div className={`border rounded-2xl p-6 bg-slate-900/40 ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl font-black">{value}</span>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">
        {label}
      </p>
    </div>
  );
}
