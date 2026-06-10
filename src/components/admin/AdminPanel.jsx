import { Calendar, Grid, Users, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const managementCards = [
    {
      title: "Events Management",
      desc: "Create, edit and manage events",
      icon: <Calendar size={24} />,
      path: "/admin/events",
    },
    {
      title: "Cards Management",
      desc: "Create and manage cards",
      icon: <Grid size={24} />,
      path: "/admin/cards",
    },
    {
      title: "Users Management",
      desc: "Manage users and permissions",
      icon: <Users size={24} />,
      path: "/admin/users",
    },
    {
      title: "Statistics",
      desc: "Statistics Event Bingo",
      icon: <Calendar size={24} />,
      path: "/admin/statistics",
    },
  ];

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border border-bingo-red/50 rounded-2xl p-8 bg-slate-900/20 backdrop-blur-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-bingo-red mb-2">
              <Activity size={24} strokeWidth={3} />
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Admin Panel</h1>
            </div>
            <p className="text-slate-400">Welcome to the Admin Panel! Here you can manage events, cards and users.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Activity size={120} className="text-bingo-red" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {managementCards.map((card, index) => (
            <Link 
              key={index} 
              to={card.path}
              className="group border border-slate-800 rounded-2xl p-6 bg-slate-900/10 hover:border-bingo-red/50 transition-all duration-300 relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-800/50 rounded-xl text-bingo-red group-hover:bg-bingo-red group-hover:text-white transition-all">
                  {card.icon}
                </div>
                <ArrowRight size={20} className="text-slate-600 group-hover:text-bingo-red transition-all group-hover:translate-x-1" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-slate-500 text-sm">{card.desc}</p>
            </Link>
          ))}
        </div>

        <div className="border border-bingo-red/30 rounded-2xl p-8 bg-slate-900/5">
          <div className="flex items-center gap-2 text-bingo-red mb-6">
            <Activity size={18} />
            <h2 className="font-bold uppercase tracking-widest text-sm">Recent Activity</h2>
          </div>
          
          <div className="space-y-4 opacity-50 cursor-not-allowed">
            {[
                { label: "Evento marcado como ganho", detail: "Benfica vs Porto - há 5 minutos", icon: <Calendar size={16}/> },
                { label: "Novo cartão criado", detail: "Cartão UEFA - há 1 hora", icon: <Grid size={16}/> },
                { label: "Novo utilizador registado", detail: "João Silva - há 2 horas", icon: <Users size={16}/> }
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-slate-800 rounded-xl bg-slate-900/20">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">{item.icon}</div>
                    <div>
                        <p className="text-white text-sm font-bold">{item.label}</p>
                        <p className="text-slate-500 text-xs">{item.detail}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}