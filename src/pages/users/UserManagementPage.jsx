import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ChevronLeft,
  Users,
  UserCheck,
  UserMinus,
  UserX,
  Search,
  Edit2,
  Ban,
  Trash2,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import LoadingState from "../../components/common/LoadingState";
import {
  useAllUsers,
  useUpdateUserByAdmin,
  useAdminDeleteUser,
} from "../../hooks/use-admin";
import { useCurrentUser } from "../../hooks/use-auth";
import { PaginationControls } from "../../components/common/PaginationControls";

export default function UserManagementPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading: loadingUsers } = useAllUsers();
  const { user: currentUser } = useCurrentUser();

  const updateMutation = useUpdateUserByAdmin();
  const deleteMutation = useAdminDeleteUser();

  if (loadingUsers) return <LoadingState />;

  const stats = {
    total: users?.length || 0,
    active: users?.filter((u) => u.status === "ACTIVE").length || 0,
    deleted: users?.filter((u) => u.status === "DELETED").length || 0,
    Excluded: users?.filter((u) => u.status === "SUSPENDED").length || 0,
  };

  const filteredUsers = users?.filter((user) => {
    const name = (user.full_name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const handleUpdateStatus = (user, newStatus) => {
    const actionText =
      newStatus === "ACTIVE"
        ? "ativar"
        : newStatus === "SUSPENDED"
          ? "suspender"
          : "alterar";

    if (
      window.confirm(
        `Are you sure you want to ${actionText} the user ${user.full_name}?`,
      )
    ) {
      updateMutation.mutate({
        userId: user.id,
        payload: { status: newStatus },
      });
    }
  };

  const handleDeleteUser = (user) => {
    if (
      window.confirm(
        `WARNING: You are about to delete the user ${user.full_name}. Continue?`,
      )
    ) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border border-bingo-red rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link
            to="/admin"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-bingo-red" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase">Users Management</h1>
            <p className="text-slate-500 text-sm">Manage users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMiniCard
            label="Total Users"
            value={stats.total}
            icon={Users}
            color="slate"
          />
          <StatMiniCard
            label="Active Users"
            value={stats.active}
            icon={UserCheck}
            color="slate"
          />
          <StatMiniCard
            label="Excluded"
            value={stats.Excluded}
            icon={UserMinus}
            color="slate"
          />
          <StatMiniCard
            label="Deleted"
            value={stats.deleted}
            icon={UserX}
            color="red"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-bingo-red rounded-xl py-4 pl-12 text-sm focus:border-bingo-red outline-none"
              placeholder="Search by name or email..."
            />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="p-6">User</th>
                <th className="p-6">Username</th>
                <th className="p-6">Role</th>
                <th className="p-6">Status</th>
                <th className="p-6">Balance</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers?.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const isOtherAdmin = u.role === "ADMIN";
                const isDeleted = u.status === "DELETED";
                const canPerformAction = !isSelf && !isOtherAdmin && !isDeleted;

                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="font-bold">{u.full_name}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} /> {u.email}
                      </div>
                    </td>
                    <td className="p-6 font-bold text-xs uppercase text-slate-400">
                      {u.username}
                    </td>
                    <td className="p-6 font-bold text-xs uppercase text-slate-400">
                      {u.role}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase ${getStatusColor(u.status)}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-green-500" />
                        {u.role === "ADMIN" ? (
                          <span className="text-slate-600">—</span>
                        ) : (
                          <span>€{u.balance}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      {canPerformAction ? (
                        <>
                          <Link
                            to={`/admin/users/transactions/${u.id}`}
                            className="inline-flex items-center justify-center p-2 rounded-lg transition-all hover:bg-gray-600 hover:text-gray-500 text-slate-500"
                          >
                            <ArrowLeftRight size={16} />
                          </Link>
                          <Link
                            to={`/admin/users/edit/${u.id}`}
                            className="inline-flex items-center justify-center p-2 rounded-lg transition-all hover:bg-blue-500/10 hover:text-blue-500 text-slate-500"
                          >
                            <Edit2 size={16} />
                          </Link>
                          {u.status === "SUSPENDED" ? (
                            <button
                              onClick={() => handleUpdateStatus(u, "ACTIVE")}
                              className="p-2 rounded-lg transition-all hover:bg-green-500/10 hover:text-green-500 text-slate-500"
                            >
                              <UserCheck size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(u, "SUSPENDED")}
                              className="p-2 rounded-lg transition-all hover:bg-orange-500/10 hover:text-orange-500 text-slate-500"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-2 rounded-lg transition-all hover:bg-red-600/10 hover:text-red-600 text-slate-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-700 text-xs italic uppercase">
                          Read Only
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-slate-900/40 border border-bingo-red p-6 rounded-2xl flex justify-between items-center">
      <div>
        <p className="text-[10px] uppercase font-black text-slate-500 mb-1">
          {label}
        </p>
        <span className="text-3xl font-black">{value}</span>
      </div>
      <div
        className={`p-3 rounded-xl bg-white/5 ${color === "red" ? "text-bingo-red" : "text-slate-600"}`}
      >
        <Icon size={24} />
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500/10 text-green-500";
    case "DELETED":
      return "bg-red-500/10 text-red-500";
    case "SUSPENDED":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-slate-500/10 text-slate-500";
  }
}
