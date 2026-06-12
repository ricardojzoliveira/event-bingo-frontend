import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/use-auth";
import * as Icons from "lucide-react";

export default function RegisterPage({ setRole }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => setTouched({ ...touched, [field]: true });

  const [localError, setLocalError] = useState("");

  const avatarChoices = [
    { id: 'av-1', url: '/avatars/anonymous.png' },
    { id: 'av-2', url: '/avatars/avatar1.png' },
    { id: 'av-3', url: '/avatars/avatar2.png' },
    { id: 'av-4', url: '/avatars/avatar3.png' },
    { id: 'av-5', url: '/avatars/avatar4.png' },
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarChoices[0].url);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const navigate = useNavigate();
  const { mutate: register, isPending, isError, error } = useRegister(setRole, () => {
    navigate("/");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!fullName || fullName.trim().length === 0) {
      setLocalError("Full name is required.");
      return;
    }
    if (!username || username.trim().length === 0) {
      setLocalError("Username is required.");
      return;
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setLocalError("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (!ageConfirmed) {
      setLocalError("You must confirm you are 18+ years old.");
      return;
    }

    const avatarName = selectedAvatar.split("/").pop().replace(".png", "");

    register({
      full_name: fullName,
      username,
      email,
      password,
      avatar: avatarName
    });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-bingo-dark p-6 min-h-[calc(100vh-76px)] font-sans relative">
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button type="button" onClick={() => setIsAvatarModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <Icons.X size={24} />
            </button>
            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-8 text-center">Choose Your Avatar</h3>
            <div className="grid grid-cols-4 gap-6">
              {avatarChoices.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setSelectedAvatar(opt.url); setIsAvatarModalOpen(false); }}
                  className={`relative aspect-square rounded-3xl transition-all border-2 flex items-center justify-center overflow-hidden bg-slate-800/50 ${selectedAvatar === opt.url ? 'border-bingo-red scale-105 ring-4 ring-bingo-red/20' : 'border-transparent hover:border-slate-600'}`}
                >
                  <img src={opt.url} alt="avatar option" className="w-full h-full object-cover" />
                  {selectedAvatar === opt.url && (
                    <div className="absolute inset-0 bg-bingo-red/10 flex items-center justify-center"><Icons.Check className="text-white" size={32} /></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mb-8">
        <div className="bg-bingo-red p-4 rounded-2xl mb-4 shadow-xl shadow-bingo-red/20"><Icons.Trophy size={40} className="text-bingo-dark" /></div>
        <h1 className="text-4xl font-black text-bingo-red uppercase tracking-tighter">Event Bingo</h1>
      </div>

      <div className="w-full max-w-[480px] bg-bingo-dark/50 border border-slate-800 backdrop-blur-sm rounded-[2rem] p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {(isError || localError) && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 text-sm font-bold flex items-center gap-3">
              <Icons.AlertCircle size={20} className="shrink-0" />
              {localError || (error?.response?.status === 400 ? "Invalid credentials" : "Registration error")}
            </div>
          )}

          <div className="flex flex-col items-center gap-5 border-b border-slate-800 pb-8 mb-6">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Your Avatar</label>
            <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl">
              <img src={selectedAvatar} alt="Current" className="w-full h-full object-cover" />
            </div>
            <button type="button" onClick={() => setIsAvatarModalOpen(true)} className="w-full bg-bingo-red text-white py-3 rounded-xl font-black uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97] text-xs flex items-center justify-center gap-2">
              Change Avatar
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Icons.User size={18} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={50}
                  placeholder="Full Name"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none text-sm focus:border-bingo-red"
                />
              </div>
              <p className="text-[10px] text-slate-600 text-right">{fullName.length}/50</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Icons.AtSign size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  placeholder="Username"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none text-sm focus:border-bingo-red"
                />
              </div>
              <p className="text-[10px] text-slate-600 text-right">{username.length}/20</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white text-sm outline-none focus:border-bingo-red" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white text-sm outline-none focus:border-bingo-red" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Confirm</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white text-sm outline-none focus:border-bingo-red" />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-slate-400 cursor-pointer pt-2">
            <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-bingo-red w-5 h-5" />
            I confirm I am 18+ years old.
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-bingo-red disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            {isPending ? <Icons.Loader2 className="animate-spin" size={22} /> : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}