import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOneUser, useUpdateUserByAdmin } from "../../../hooks/use-admin";
import * as Icons from "lucide-react";

export default function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetOneUser(userId);
  const mutation = useUpdateUserByAdmin();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    userRole: ""
  });

  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        username: user.username || "",
        email: user.email || "",
        userRole: user.userRole || "USER"
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    if (!formData.full_name.trim() || !formData.username.trim() || !formData.email.trim()) {
      setFeedback({ message: "All fields are required.", type: "error" });
      return;
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      setFeedback({ message: "Invalid email format.", type: "error" });
      return;
    }

    if (formData.full_name.length > 50) {
      setFeedback({ message: "Full Name must be at most 50 characters.", type: "error" });
      return;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setFeedback({ message: "Username must be between 3 and 20 characters.", type: "error" });
      return;
    }

    const payload = {};
    const isNameChanged = formData.full_name?.trim() !== (user.full_name || "").trim();
    const isUsernameChanged = formData.username?.trim() !== (user.username || "").trim();
    const isEmailChanged = formData.email?.trim() !== (user.email || "").trim();
    const isRoleChanged = formData.userRole?.toUpperCase() !== (user.userRole || "USER").toUpperCase();

    if (isNameChanged) payload.full_name = formData.full_name;
    if (isUsernameChanged) payload.username = formData.username;
    if (isEmailChanged) payload.email = formData.email;
    if (isRoleChanged) payload.userRole = formData.userRole;

    if (Object.keys(payload).length === 0) {
      setFeedback({ message: "No changes detected!", type: "error" });
      return;
    }

    mutation.mutate({ userId, payload }, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: (err) => {
        const message = err?.response?.status === 400 ? "Invalid credentials" : "Update failed.";
        setFeedback({ message, type: "error" });
      }
    });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-bingo-dark flex items-center justify-center text-white font-black tracking-widest">
      LOADING...
    </div>
  );

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white flex flex-col items-center">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-bingo-red"
        >
          <Icons.ChevronLeft size={24} />
        </button>

        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-bingo-red p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 text-center">Edit User</h2>

          {feedback.message && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border ${feedback.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
              {feedback.type === 'error' ? <Icons.AlertCircle size={20} /> : <Icons.CheckCircle2 size={20} />}
              {feedback.message}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Full Name</label>
              <input
                className="w-full bg-slate-950 border border-slate-800 py-3.5 px-4 rounded-2xl text-white outline-none focus:border-bingo-red"
                value={formData.full_name}
                maxLength={50}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              />
              <p className="text-[10px] text-slate-600 text-right mt-1">{formData.full_name.length}/50</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Username</label>
              <input
                className="w-full bg-slate-950 border border-slate-800 py-3.5 px-4 rounded-2xl text-white outline-none focus:border-bingo-red"
                value={formData.username}
                maxLength={20}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
              <p className="text-[10px] text-slate-600 text-right mt-1">{formData.username.length}/20</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Email</label>
              <input className="w-full bg-slate-950 border border-slate-800 py-3.5 px-4 rounded-2xl text-white outline-none focus:border-bingo-red" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="space-y-1" ref={dropdownRef}>
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Role</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white flex justify-between items-center hover:border-slate-600 transition-all focus:border-bingo-red"
                >
                  {formData.userRole === "USER" ? "User" : "Admin"}
                  <Icons.ChevronDown size={18} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl z-10">
                    {["USER", "ADMIN"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => { setFormData({ ...formData, userRole: role }); setIsOpen(false); }}
                        className={`w-full text-left p-4 hover:bg-bingo-red/10 transition-colors ${formData.userRole === role ? "text-bingo-red font-bold" : "text-white"}`}
                      >
                        {role === "USER" ? "User" : "Admin"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-bingo-red mt-10 py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {mutation.isPending ? "SAVING..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}