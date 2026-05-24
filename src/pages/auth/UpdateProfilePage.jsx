import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser, useUpdateProfile, useDeleteAccount, useSelfExclusion } from "../../hooks/useAuth";
import * as Icons from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export default function ProfileUpdatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const mutation = useUpdateProfile();
  const deleteMutation = useDeleteAccount();
  const selfExclusionMutation = useSelfExclusion();

  // Campos para o forms.
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const avatarChoices = [
    { id: 'av-1', url: '/avatars/anonymous.png' },
    { id: 'av-2', url: '/avatars/avatar1.png' },
    { id: 'av-3', url: '/avatars/avatar2.png' },
    { id: 'av-4', url: '/avatars/avatar3.png' },
    { id: 'av-5', url: '/avatars/avatar4.png' },
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarChoices[0].url);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Sincroniza os inputs com os dados reais do utilizador.
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      if (user.avatar) {
        setSelectedAvatar(`/avatars/${user.avatar}.png`);
      }
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações básicas.
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      alert("Fields cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Extrai o nome do ficheiro do avatar.
    const avatarName = selectedAvatar
      .split("/")
      .pop()
      .replace(".png", "");

    // Constrói o payload apenas com o que mudou.
    const payload = {};

    if (fullName !== user.full_name) payload.full_name = fullName;
    if (username !== user.username) payload.username = username;
    if (email !== user.email) payload.email = email;
    if (avatarName !== user.avatar) payload.avatar = avatarName;

    // A password só vai se for preenchida.
    if (password && password.trim() !== "") {
      payload.password = password;
    }

    // Verifica se algo foi alterado antes de enviar. Se não foi, não deixa fazer o pedido.
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      alert("No changes to save!");
      return;
    }

    mutation.mutate(payload);
  };

  const handleDelete = () => {
    if (!user?.id) return;

    if (window.confirm("ARE YOU SURE? Your account will be eliminated from the platform.")) {
      deleteMutation.mutate(user.id, {
        onSuccess: () => {
          navigate("/")
        },
        onError: (error) => {
          console.error("Delete Failed!", error);
          alert("Could not delete account");
        }
      });
    }
  };

  const handleSelfExclusion = () => {
    if (window.confirm("ARE YOU SURE? You will be excluded from the platform.")) {
      const payload = { status: "SUSPENDED" };
      selfExclusionMutation.mutate(payload, {
        onSuccess: () => navigate("/login")
      });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-bingo-dark flex items-center justify-center">
      <div className="text-white font-black tracking-[0.5em] animate-pulse">LOADING...</div>
    </div>
  );

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-bingo-dark p-6 min-h-screen font-sans relative text-white space-y-8">
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl relative">
            <button type="button" onClick={() => setIsAvatarModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
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
                  <img src={opt.url} alt="avatar" className="w-full h-full object-cover" />
                  {selectedAvatar === opt.url && (
                    <div className="absolute inset-0 bg-bingo-red/10 flex items-center justify-center">
                      <Icons.Check className="text-white" size={32} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <div className="bg-bingo-dark/50 border border-slate-800 backdrop-blur-sm rounded-[2rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-5 border-b border-slate-800 pb-8 mb-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Your Avatar</label>
              <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl">
                <img src={selectedAvatar} alt="Current selection" className="w-full h-full object-cover" />
              </div>
              <button type="button" onClick={() => setIsAvatarModalOpen(true)} className="w-full bg-bingo-red text-white py-3 rounded-xl font-black uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97] text-xs flex items-center justify-center gap-2">
                Change Avatar
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors"><Icons.User size={18} /></div>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all text-sm focus:border-bingo-red" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors"><Icons.AtSign size={18} /></div>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all text-sm focus:border-bingo-red" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors"><Icons.Mail size={18} /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all text-sm focus:border-bingo-red" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white outline-none transition-all text-sm focus:border-bingo-red" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Confirm</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white outline-none transition-all text-sm focus:border-bingo-red" />
                </div>
              </div>
            </div>
            <button type="submit" disabled={mutation.isPending} className="w-full bg-bingo-red text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 mt-4">
              {mutation.isPending ? <Icons.Loader2 className="animate-spin" size={22} /> : "Save Settings"}
            </button>
          </form>
        </div>

        <div className="bg-red-950/10 border border-red-900/30 rounded-[2rem] p-10 shadow-2xl flex flex-col gap-6 h-fit">
          <h3 className="text-xl font-black text-white uppercase tracking-widest text-center flex items-center justify-center gap-2">
            <Icons.AlertTriangle className="text-red-500" size={20} />
            Danger Zone
          </h3>
          <button onClick={handleSelfExclusion} className="w-full bg-amber-900/20 border border-amber-600/30 text-amber-500 py-4 rounded-xl font-black uppercase text-xs hover:bg-amber-600/10 transition">
            Request Self-Exclusion
          </button>
          <button onClick={handleDelete} className="w-full bg-red-900/20 border border-red-900/50 text-red-500 py-4 rounded-xl font-black uppercase text-xs hover:bg-red-900/30 transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}