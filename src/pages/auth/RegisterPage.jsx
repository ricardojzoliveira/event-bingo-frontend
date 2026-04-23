import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth"; 
import { User, Mail, Lock, Eye, EyeOff, Trophy, AlertCircle, Loader2, ImagePlus, AtSign } from "lucide-react";

export default function RegisterPage({ setRole }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  const { mutate: register, isPending, isError, error } = useRegister(setRole, () => {
    navigate("/");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    register({ fullName, username, email, password, avatar });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-bingo-dark p-6 min-h-[calc(100vh-76px)] font-sans">
      
      <div className="flex flex-col items-center mb-8">
        <div className="bg-bingo-red p-4 rounded-2xl mb-4 shadow-xl shadow-bingo-red/20 transform hover:scale-105 transition-transform">
          <Trophy size={40} className="text-bingo-dark" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
          Event <span className="text-bingo-red">Bingo</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-medium">Create your player account</p>
      </div>

      <div className="w-full max-w-[480px] bg-bingo-dark/50 border border-slate-800 backdrop-blur-sm rounded-[2rem] p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {isError && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} /> {error.message || "Registration error"}
            </div>
          )}

          <div className="flex flex-col items-center mb-2">
            <div className="relative group w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden transition-all hover:border-bingo-red">
                {avatar ? (
                    <img src={URL.createObjectURL(avatar)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <ImagePlus size={24} className="text-slate-600 group-hover:text-bingo-red" />
                )}
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. John Doe"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:border-bingo-red focus:ring-1 focus:ring-bingo-red/50 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors">
                <AtSign size={18} />
              </div>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="username"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:border-bingo-red focus:ring-1 focus:ring-bingo-red/50 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:border-bingo-red focus:ring-1 focus:ring-bingo-red/50 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:border-bingo-red outline-none transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Confirm</label>
              <div className="relative group">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:border-bingo-red outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center text-[11px] font-bold uppercase tracking-wide">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
              <input 
                type="checkbox" 
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                required 
                className="rounded border-slate-700 bg-slate-900 text-bingo-red focus:ring-0 w-4 h-4" 
              />
              I confirm I am 18+ years old.
            </label>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-bingo-red text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-bingo-red/20"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Already have an account? <Link to="/login" className="text-bingo-red font-black hover:underline underline-offset-4">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}