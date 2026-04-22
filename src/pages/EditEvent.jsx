import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdminEvent, useUpdateEvent } from "../hooks/useAdmin";
import { ChevronLeft, Trophy, Target, Save, Calendar, Clock } from "lucide-react";
import LoadingState from "../components/common/LoadingState";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading } = useAdminEvent(id);
  const { mutate: updateEvent, isPending } = useUpdateEvent();

  const [sport, setSport] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState("");

  const sports = ["Football", "Basket", "Tennis", "American Football", "Ice Hockey", "Volleyball", "Rugby", "Handball", "MMA", "Box"];
  const outcomes = ["Home wins", "Away Wins", "Draw", "More than 2.5 goals", "Less than 2.5 goals", "Both teams score", "No Team Score", "More than 3.5 goals", "Home wins and both team scores"];

  useEffect(() => {
    if (event) {
      setSport(event.sport);
      setHomeTeam(event.team1);
      setAwayTeam(event.team2);
      setPrediction(event.prediction);
      const [d, t] = event.date.split(" ");
      setDate(d || "");
      setTime(t || "");
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = { 
      sport, 
      team1: homeTeam, 
      team2: awayTeam, 
      date: `${date} ${time}`.trim(), 
      prediction 
    };

    updateEvent({ id, eventData }, {
      onSuccess: () => navigate("/admin/events")
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="border border-blue-500/50 rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link to="/admin/events" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-blue-500">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Edit Event</h1>
            <p className="text-slate-500 text-sm font-bold uppercase">Update details for ID: {id}</p>
          </div>
        </div>

        <div className="border border-slate-800 rounded-3xl p-8 bg-slate-900/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-10">

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500 font-black uppercase text-xs tracking-widest">
                <Trophy size={16} /> <span>Sport Category</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {sports.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setSport(s)}
                    className={`py-3 rounded-xl border-2 font-bold text-[10px] uppercase transition-all ${sport === s ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Home Team</label>
                <input required value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Away Team</label>
                <input required value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Date</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Time</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 text-slate-300" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500 font-black uppercase text-xs tracking-widest">
                <Target size={16} /> <span>Outcome / Prediction</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {outcomes.map(o => (
                  <button
                    key={o} type="button"
                    onClick={() => setPrediction(o)}
                    className={`py-4 px-5 rounded-xl border border-slate-800 font-bold text-left text-[11px] transition-all ${prediction === o ? 'bg-slate-800 border-blue-500 text-white' : 'bg-slate-900/40 text-slate-500 hover:border-slate-700'}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/50 py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Save size={20}/> {isPending ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}