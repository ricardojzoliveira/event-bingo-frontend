import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateEvent } from "../hooks/useAdmin";
import {
  ChevronLeft,
  Trophy,
  Target,
  Calendar,
  Clock,
  PlusCircle,
} from "lucide-react";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const [sport, setSport] = useState("Football");
  const [team1, setteam1] = useState("");
  const [team2, setteam2] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState("");

  const sports = [
    "Football",
    "Basket",
    "Tennis",
    "American Football",
    "Ice Hockey",
    "Volleyball",
    "Rugby",
    "Handball",
    "MMA",
    "Box",
  ];
  const outcomes = [
    "Home wins",
    "Away Wins",
    "Draw",
    "More than 2.5 goals",
    "Less than 2.5 goals",
    "Both teams score",
    "No Team Score",
    "More than 3.5 goals",
    "Home wins and both team scores",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      sport,
      team1,
      team2,
      date: `${date} ${time}`,
      prediction,
      status: "pending",
    };

    createEvent(eventData, {
      onSuccess: () => navigate("/admin/events"),
    });
  };

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border border-bingo-red/50 rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link
            to="/admin/events"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-bingo-red"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase">Create New Event</h1>
            <p className="text-slate-500 text-sm font-bold uppercase">
              Add a new event to the system.
            </p>
          </div>
        </div>

        <div className="border border-bingo-red rounded-3xl p-8 bg-slate-900/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-bingo-red font-black uppercase text-xs tracking-widest">
                <Trophy size={16} /> <span>Event Information</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sports.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSport(s)}
                    className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${sport === s ? "border-bingo-red bg-bingo-red text-white shadow-lg shadow-bingo-red/20" : "border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-600"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Home Team / Athlete 1 *
                </label>
                <input
                  required
                  value={team1}
                  onChange={(e) => setteam1(e.target.value)}
                  placeholder="Ex: FC Porto"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Away Team / Athlete 2 *
                </label>
                <input
                  required
                  value={team2}
                  onChange={(e) => setteam2(e.target.value)}
                  placeholder="Ex: Benfica"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 text-red-500/80">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Event Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-bingo-red font-black uppercase text-xs tracking-widest">
                <Target size={16} /> <span>Outcome / Bet *</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {outcomes.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setPrediction(o)}
                    className={`py-4 px-5 rounded-xl border border-slate-800 font-bold text-left text-[11px] transition-all ${prediction === o ? "bg-slate-800 border-bingo-red text-white" : "bg-slate-900/40 text-slate-500 hover:border-slate-700"}`}
                  >
                    {o}
                  </button>
                ))}
                <button
                  type="button"
                  className="py-4 px-5 rounded-xl border border-dashed border-slate-800 text-slate-500 text-[11px] font-bold hover:border-slate-600 transition-all"
                >
                  + Personalized Bet
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-red-900/40 hover:bg-red-800 text-bingo-red border border-bingo-red/50 py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPending ? (
                "Creating..."
              ) : (
                <>
                  <PlusCircle size={20} /> Create Event
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
