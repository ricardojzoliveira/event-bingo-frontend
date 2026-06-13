import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser, useUpdateProfile, useDeleteAccount, useSelfExclusion } from "../../hooks/use-auth";
import * as Icons from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileUpdatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const mutation = useUpdateProfile();
  const deleteMutation = useDeleteAccount();
  const selfExclusionMutation = useSelfExclusion();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const avatarChoices = [
    { id: 'av-1', url: '/avatars/anonymous.png' },
    { id: 'av-2', url: '/avatars/avatar1.png' },
    { id: 'av-3', url: '/avatars/avatar2.png' },
    { id: 'av-4', url: '/avatars/avatar3.png' },
    { id: 'av-5', url: '/avatars/avatar4.png' },
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarChoices[0].url);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

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

  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setFeedback({ message: "Invalid email format", type: "error" });
      return;
    }
    if (password && password.length < 6) {
      setFeedback({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ message: "Passwords do not match", type: "error" });
      return;
    }

    const payload = {
      ...(fullName !== user.full_name && { full_name: fullName }),
      ...(username !== user.username && { username: username }),
      ...(email !== user.email && { email: email }),
      ...(password && password.trim() !== "" && { password: password }),
      ...(selectedAvatar.split("/").pop().replace(".png", "") !== user.avatar && { avatar: selectedAvatar.split("/").pop().replace(".png", "") })
    };

    if (Object.keys(payload).length === 0) {
      setFeedback({ message: "No changes to save!", type: "error" });
      return;
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        setFeedback({ message: "Settings saved successfully!", type: "success" });
        setTimeout(() => navigate(-1), 2000);
      },
      onError: (err) => {
        const errorMessage = err?.response?.status === 400 ? "Invalid credentials" : (err.message || "Update failed.");
        setFeedback({ message: errorMessage, type: "error" });
      }
    });
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
      selfExclusionMutation.mutate(null, {
        onSuccess: () => {
          navigate("/");
        },
        onError: (error) => {
          console.error("Self-Exclusion Failed!", error);
          alert("Could not process self-exclusion");
        }
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

      <div className="w-full max-w-2xl flex flex-col gap-8">

        <div className="bg-bingo-dark/50 border border-slate-800 backdrop-blur-sm rounded-[2rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {feedback.message && (
              <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border ${feedback.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                {feedback.type === 'error' ? <Icons.AlertCircle size={20} /> : <Icons.CheckCircle2 size={20} />}
                {feedback.message}
              </div>
            )}
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
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors">
                    <Icons.User size={18} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={50}
                    required
                    placeholder="Full Name"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all text-sm focus:border-bingo-red"
                  />
                </div>
                <p className="text-[10px] text-slate-600 text-right mt-1">{fullName.length}/50</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors">
                    <Icons.AtSign size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    required
                    placeholder="Username"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all text-sm focus:border-bingo-red"
                  />
                </div>
                <p className="text-[10px] text-slate-600 text-right mt-1">{username.length}/20</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-bingo-red transition-colors">
                    <Icons.Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Email"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white outline-none transition-all text-sm focus:border-bingo-red"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white outline-none transition-all text-sm focus:border-bingo-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-white outline-none transition-all text-sm focus:border-bingo-red"
                  />
                  {(confirmPassword.length > 0 && password !== confirmPassword) && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-bingo-red text-white py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              {mutation.isPending ? "SAVING..." : "Save Settings"}
            </button>
          </form>
        </div>

        <div className="bg-red-950/10 border border-bingo-red rounded-[2rem] p-10 shadow-2xl flex flex-col gap-6">
          <h3 className="text-xl font-black text-white uppercase tracking-widest text-center flex items-center justify-center gap-2">
            <Icons.AlertTriangle className="text-red-500" size={20} />
            Danger Zone
          </h3>

          {user?.role === "user" && (
            <button onClick={handleSelfExclusion} className="w-full bg-amber-900/20 border border-amber-600/30 text-amber-500 py-4 rounded-xl font-black uppercase text-xs hover:bg-amber-600/10 transition">
              Request Self-Exclusion
            </button>
          )}

          <button onClick={handleDelete} className="w-full bg-red-900/20 border border-red-900/50 text-red-500 py-4 rounded-xl font-black uppercase text-xs hover:bg-red-900/30 transition">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}