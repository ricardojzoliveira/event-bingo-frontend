import { useProfile } from "../../hooks/useAuth";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();

  if (isLoading) return (
    <div className="min-h-screen bg-bingo-dark flex items-center justify-center">
      <div className="text-white font-black tracking-[0.5em] animate-pulse">LOADING...</div>
    </div>
  );

  const stats = [
    { label: "Bought Cards", value: user?.stats?.totalPurchased || 0, icon: Icons.CreditCard, lifetime: "BOUGHT" },
    { label: "Total Earned", value: user?.stats?.cardsWon || 0, icon: Icons.Trophy, lifetime: "TOTAL" },
    { label: "Lines Won", value: user?.stats?.linesWon || 0, icon: Icons.Hash, lifetime: "LINES" },
    { label: "Bingo", value: user?.stats?.fullPrizes || 0, icon: Icons.Crown, lifetime: "FULL" },
  ];

  return (
    <div className="min-h-screen bg-bingo-dark text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="relative overflow-hidden bg-slate-900/20 border-2 border-bingo-red p-8 md:p-12 rounded-[3rem] backdrop-blur-md shadow-2xl shadow-bingo-red/5">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-bingo-red/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-bingo-red p-1 bg-bingo-dark shadow-2xl shadow-bingo-red/20 transition-transform duration-500 hover:scale-105">
                <img
                  src={user?.avatar || "/avatars/anonymous.png"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-lg">
                {user?.fullName}
              </h1>

              <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-5 items-center">
                <span className="font-black text-sm uppercase tracking-[0.25em] text-bingo-red">
                  @{user?.username}
                </span>

                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700" />

                <span className="font-bold text-sm uppercase tracking-[0.15em] flex items-center gap-2 text-slate-400">
                  <Icons.Calendar size={16} className="text-slate-600" />
                  Member since 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <div className="lg:col-span-4 flex flex-col gap-6">

            <div className="flex-1 bg-bingo-dark border-2 border-bingo-red p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-xl shadow-bingo-red/5">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">
                Available Balance
              </p>
              <h2 className="text-6xl font-black text-white italic tracking-tighter">
                €{user?.balance?.toLocaleString() || "0"}
              </h2>

              <div className="flex flex-col w-full gap-3 mt-10">
                <Link to="/wallet" className="w-full">
                  <button className="w-full bg-bingo-red hover:bg-[#cc0000] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-lg shadow-bingo-red/20">
                    Deposit Now
                  </button>
                </Link>

                <Link to="/wallet" className="w-full">
                  <button className="w-full bg-slate-900 border-2 border-white/10 hover:bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95">
                    Withdraw Funds
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="w-full flex items-center gap-5 bg-slate-900/40 hover:bg-slate-800 border-2 border-bingo-red text-white px-8 py-6 rounded-[2rem] transition-all group active:scale-[0.98]">
                <Icons.History size={22} className="text-bingo-red transition-transform group-hover:rotate-12" />
                <span className="font-black text-xs uppercase tracking-[0.15em]">View Full History</span>
              </button>

              <button className="w-full flex items-center gap-5 bg-slate-900/40 hover:bg-slate-800 border-2 border-bingo-red text-white px-8 py-6 rounded-[2rem] transition-all group active:scale-[0.98]">
                <Icons.Settings size={22} className="text-bingo-red transition-transform group-hover:rotate-12" />
                <span className="font-black text-xs uppercase tracking-[0.15em]">Account Settings</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-bingo-dark border-2 border-bingo-red p-8 rounded-[2.5rem] flex flex-col justify-between shadow-xl shadow-bingo-red/5 group transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 transition-colors group-hover:border-bingo-red/40">
                    <stat.icon size={22} className="text-bingo-red" />
                  </div>
                  <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">
                    LIFETIME {stat.lifetime}
                  </p>
                </div>

                <div className="mt-12">
                  <h3 className="text-6xl font-black text-white tracking-tighter italic group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}