import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import { User, Lock, Eye, EyeOff, Trophy, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  // Campos para o forms.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { mutate: login, isPending, isError, error } = useLogin(() => {
    // Se fizer login com sucesso, vai para a homepage com login feito.
    navigate("/"); 
  });

  // Função para submeter os dados para o hook.
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-bingo-dark p-6 min-h-[calc(100vh-76px)]">

      <div className="flex flex-col items-center mb-8">
        <div className="bg-bingo-red p-3 rounded-xl mb-4 shadow-lg shadow-bingo-red/20">
          <Trophy size={40} className="text-bingo-dark" />
        </div>
        <h1 className="text-3xl font-black text-bingo-red uppercase tracking-tight">Event Bingo</h1>
        <p className="text-slate-500 text-sm mt-1">Please log in to continue</p>
      </div>

      <div className="w-full max-w-[400px] bg-transparent border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {isError && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle size={16} /> {error.message || "Invalid credentials"}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:border-bingo-red focus:ring-1 focus:ring-bingo-red outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-slate-600 focus:border-bingo-red focus:ring-1 focus:ring-bingo-red outline-none transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/*<div className="flex items-center justify-between text-xs font-medium">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
              <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-bingo-red focus:ring-0 w-4 h-4" />
              Remember me
            </label>
            <button type="button" className="text-bingo-red hover:brightness-125 transition-all">
              Forgot your password?
            </button>
          </div>*/}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-bingo-red text-white py-3.5 rounded-xl font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-bingo-red/20 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-bingo-red font-bold hover:brightness-125 transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}