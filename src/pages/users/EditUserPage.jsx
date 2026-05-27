import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOneUser, useUpdateUserByAdmin } from "../../hooks/useAdmin";
import * as Icons from "lucide-react";

export default function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetOneUser(userId);
  const mutation = useUpdateUserByAdmin();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    userRole: ""
  });

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
      alert("Nenhuma alteração foi detetada!");
      return;
    }

    mutation.mutate({ userId, payload }, {
      onSuccess: () => {
        navigate(-1);
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

        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 text-center">Edit User</h2>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Full Name</label>
              <input className="w-full bg-slate-950 border border-slate-800 py-3.5 px-4 rounded-2xl text-white outline-none focus:border-bingo-red" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Username</label>
              <input className="w-full bg-slate-950 border border-slate-800 py-3.5 px-4 rounded-2xl text-white outline-none focus:border-bingo-red" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Email</label>
              <input className="w-full bg-slate-950 border border-slate-800 py-3.5 px-4 rounded-2xl text-white outline-none focus:border-bingo-red" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Role</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-bingo-red transition-all cursor-pointer"
                value={formData.userRole}
                onChange={(e) => setFormData(prev => ({ ...prev, userRole: e.target.value }))}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-bingo-red mt-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all"
          >
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}