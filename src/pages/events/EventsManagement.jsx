import { useAdminEvents, useDeleteEvent, useUpdateEventStatus } from "../../hooks/useAdmin";
import { Plus, Search, Filter, Edit2, Trash2, CheckCircle, XCircle, Clock, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/common/LoadingState";

export default function EventManagement() {
  const { data: events, isLoading } = useAdminEvents();
  const { mutate: deleteEvent} = useDeleteEvent();
  const { mutate: updateStatus } = useUpdateEventStatus();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event ?")){
        deleteEvent(id);
    }
  };

  if (isLoading) return <LoadingState />;

  const stats = {
    total: events?.length || 0,
    won: events?.filter(e => e.status === "won").length || 0,
    lost: events?.filter(e => e.status === "lost").length || 0,
    pending: events?.filter(e => e.status === "pending").length || 0,
  };

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border border-bingo-red/50 rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link to="/admin" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft size={24} className="text-bingo-red" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase">Event Management</h1>
            <p className="text-slate-500 text-sm">Create, edit, remove events</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Events" value={stats.total} icon={<Clock />} color="blue" />
          <StatCard label="Events Won" value={stats.won} icon={<CheckCircle />} color="green" />
          <StatCard label="Events Lost" value={stats.lost} icon={<XCircle />} color="red" />
          <StatCard label="Pending Events" value={stats.pending} icon={<Clock />} color="slate" />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 text-sm" placeholder="Searching Events" />
          </div>
          <button className="bg-slate-800 px-4 rounded-xl border border-slate-700 flex items-center gap-2 text-sm">
            <Filter size={18} /> Filter
          </button>
          <Link to="/admin/events/create" className="bg-bingo-red px-6 rounded-xl flex items-center gap-2 text-sm font-bold">
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
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <span className="bg-red-900/30 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded italic">{event.sport}</span>
                       <span className="font-bold">{event.team1} vs {event.team2}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{event.prediction}</td>
                  <td className="p-4 text-slate-400">{event.date}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2 text-slate-600">
                      <button
                        onClick={() => updateStatus({ eventId: event.id, status: "won"})} 
                        className={`p-1 rounded-md transition-all ${event.status === 'won' ? 'text-green-500 bg-green-500/10' : 'text-slate-600 hover:text-green-500'}`}>
                        <CheckCircle size={18} className={event.status === 'won' ? "text-green-500" : ""} />
                      </button>
                      <button
                        onClick={() => updateStatus({ eventId: event.id, status: "lost"})}
                        className={`p-1 rounded-md transition-all ${event.status === 'lost' ? 'text-red-500 bg-red-500/10' : 'text-slate-600 hover:text-red-500'}`}>
                        <XCircle size={18} className={event.status === 'lost' ? "text-red-500" : ""} />
                      </button>
                      <button
                        onClick={() => updateStatus({ eventId: event.id, status: "pending"})}
                        className={`p-1 rounded-md transition-all ${event.status === 'pending' ? 'text-white bg-white/10' : 'text-slate-600 hover:text-white'}`}>
                        <Clock size={18} className={event.status === 'pending' ? "text-white" : ""} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Link to={`/admin/events/edit/${event.id}`}>
                        <button className="text-blue-500 hover:text-blue-400"><Edit2 size={16}/></button>
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
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
    slate: "text-slate-400 bg-slate-400/10 border-slate-400/20"
  };
  return (
    <div className={`border rounded-2xl p-6 bg-slate-900/40 ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl font-black">{value}</span>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{label}</p>
    </div>
  );
}