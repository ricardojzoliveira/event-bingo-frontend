import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateEvent } from "../../hooks/useAdmin";
import {
  ChevronLeft,
  Trophy,
  Target,
  PlusCircle,
  Save,
  Pencil
} from "lucide-react";

export default function CreateEvent({ initialData, onSubmit, isEditing = false, externalLoading = false }) {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending: creating } = useCreateEvent();

  // Estados
  const [sport, setSport] = useState("Football");
  const [customSport, setCustomSport] = useState("");
  const [isCustomSport, setIsCustomSport] = useState(false);

  const [home_team, sethome_team] = useState("");
  const [away_team, setaway_team] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("PENDING");

  const [prediction, setPrediction] = useState("");
  const [customPrediction, setCustomPrediction] = useState("");
  const [isCustomPrediction, setIsCustomPrediction] = useState(false);

  const sports = ["Football", "Basket", "Tennis", "American Football", "Ice Hockey", "Volleyball", "Rugby", "Handball", "MMA", "Box"];
  const outcomes = ["Home wins", "Away Wins", "Draw", "More than 2.5 goals", "Less than 2.5 goals", "Both teams score", "No Team Score", "More than 3.5 goals", "Home wins and both team scores"];

  useEffect(() => {
    if (initialData) {
      if (sports.includes(initialData.sport)) {
        setSport(initialData.sport);
        setIsCustomSport(false);
      } else {
        setSport("Other");
        setCustomSport(initialData.sport);
        setIsCustomSport(true);
      }

      sethome_team(initialData.home_team || "");
      setaway_team(initialData.away_team || "");
      setStatus(initialData.status || "PENDING");

      if (outcomes.includes(initialData.prediction)) {
        setPrediction(initialData.prediction);
        setIsCustomPrediction(false);
      } else {
        setPrediction("Custom");
        setCustomPrediction(initialData.prediction);
        setIsCustomPrediction(true);
      }

      if (initialData.date) {
        const delimiter = initialData.date.includes("T") ? "T" : " ";
        const parts = initialData.date.split(delimiter);
        
        const d = parts[0]; 
        const t = parts[1]; 
        
        setDate(d || "");
        
        if (t) {
          setTime(t.substring(0, 5)); 
        } else {
          setTime("");
        }
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formatedTime = time ? (time.length === 5 ? `${time}:00` : time) : "00:00:00";
    const dateTime = `${date} ${formatedTime}`;

    const eventData = {
      sport: isCustomSport ? customSport : sport,
      home_team,
      away_team,
      date: dateTime,
      prediction: isCustomPrediction ? customPrediction : prediction,
      status
    };

    if (isEditing && onSubmit) {
      onSubmit(eventData);
    } else {
      createEvent(eventData, {
        onSuccess: () => navigate("/admin/events"),
      });
    }
  };

  const isProcessing = creating || externalLoading;

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border border-bingo-red/50 rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link to="/admin/events" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-bingo-red">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase">
              {isEditing ? `Updating event: ${initialData?.home_team} vs ${initialData?.away_team}` : "Add a new event to the system."}
            </p>
          </div>
        </div>

        <div className="border border-bingo-red rounded-3xl p-8 bg-slate-900/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-bingo-red font-black uppercase text-xs tracking-widest">
                <Trophy size={16} /> <span>Sport Category</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sports.map((s) => (
                  <button
                    key={s} type="button" 
                    onClick={() => { setSport(s); setIsCustomSport(false); }}
                    className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${sport === s && !isCustomSport ? "border-bingo-red bg-bingo-red text-white" : "border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-600"}`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setSport("Other"); setIsCustomSport(true); }}
                  className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${isCustomSport ? "border-bingo-red bg-bingo-red text-white" : "border-slate-800 border-dashed text-slate-500"}`}
                >
                  + Other
                </button>
              </div>
              {isCustomSport && (
                <input
                  required
                  value={customSport}
                  onChange={(e) => setCustomSport(e.target.value)}
                  placeholder="Type the sport name..."
                  className="w-full mt-2 bg-slate-950 border border-bingo-red/30 rounded-xl py-3 px-4 outline-none focus:border-bingo-red transition-all text-sm"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Home Team / Athlete 1 *</label>
                <input required value={home_team} onChange={(e) => sethome_team(e.target.value)} placeholder="Ex: FC Porto" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Away Team / Athlete 2 *</label>
                <input required value={away_team} onChange={(e) => setaway_team(e.target.value)} placeholder="Ex: Benfica" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 text-red-500/80">Event Date *</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Event Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 outline-none focus:border-bingo-red text-slate-300" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-bingo-red font-black uppercase text-xs tracking-widest">
                <Target size={16} /> <span>Outcome / Bet *</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {outcomes.map((o) => (
                  <button
                    key={o} type="button" 
                    onClick={() => { setPrediction(o); setIsCustomPrediction(false); }}
                    className={`py-4 px-5 rounded-xl border border-slate-800 font-bold text-left text-[11px] transition-all ${prediction === o && !isCustomPrediction ? "bg-slate-800 border-bingo-red text-white" : "bg-slate-900/40 text-slate-500 hover:border-slate-700"}`}
                  >
                    {o}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setPrediction("Custom"); setIsCustomPrediction(true); }}
                  className={`py-4 px-5 rounded-xl border-2 border-dashed font-bold text-left text-[11px] transition-all ${isCustomPrediction ? "border-bingo-red bg-bingo-red/10 text-white" : "border-slate-800 text-slate-500"}`}
                >
                  <Pencil size={14} className="inline mr-2" /> Personalized Bet
                </button>
              </div>
              {isCustomPrediction && (
                <input
                  required
                  value={customPrediction}
                  onChange={(e) => setCustomPrediction(e.target.value)}
                  placeholder="Describe the personalized outcome (ex: Cristiano Ronaldo scores 2+ goals)..."
                  className="w-full mt-2 bg-slate-950 border border-bingo-red/30 rounded-xl py-4 px-4 outline-none focus:border-bingo-red transition-all text-sm"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-red-900/40 hover:bg-red-800 text-bingo-red border border-bingo-red/50 py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-red-950/20"
            >
              {isProcessing ? "Processing..." : isEditing ? <><Save size={20}/> Save Changes</> : <><PlusCircle size={20} /> Create Event</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}