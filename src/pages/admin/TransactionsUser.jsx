import { useParams, useNavigate } from "react-router-dom";
import { useGetOneUser, useAdminTransactionsUSer } from "../../hooks/useAdmin";
import * as Icons from "lucide-react";

export default function UserTransactionsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser } = useGetOneUser(userId);
  const { data: walletData, isLoading: loadingTx } = useAdminTransactionsUSer(userId);

  const transactions = walletData || [];

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  if (loadingUser || loadingTx) return (
    <div className="min-h-screen bg-bingo-dark flex items-center justify-center text-white font-black tracking-widest">
      SYNCING HISTORY...
    </div>
  );

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-8 p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-bingo-red flex items-center justify-center"
        >
          <Icons.ChevronLeft size={24} />
        </button>

        <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm space-y-8">
          
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              User Statements
            </h2>
            <p className="text-slate-400 font-medium text-sm">
              Auditing movements for: <span className="text-bingo-red font-bold">@{user?.username || 'user'}</span> ({user?.full_name})
            </p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedTransactions.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-800/60 rounded-2xl">
                <p className="text-slate-500 font-bold italic uppercase tracking-wider text-sm">
                  This user has no financial history.
                </p>
              </div>
            ) : (
              sortedTransactions.map((tx, index) => {
                const txType = tx.type?.toLowerCase();
                const isPositive = txType === "deposit" || txType === "prize" || txType === "win";

                return (
                  <div
                    /* 🟢 CORRIGIDO: Chave combinada única para silenciar o aviso do React */
                    key={`${tx.id || "tx"}-${index}`}
                    className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl flex justify-between items-center group hover:border-red-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          isPositive
                            ? "text-green-500 bg-green-500/10"
                            : "text-red-500 bg-red-500/10"
                        }`}
                      >
                        {txType === "withdraw" || txType === "purchase" ? (
                          <Icons.ArrowUpCircle size={20} />
                        ) : (
                          <Icons.ArrowDownCircle size={20} />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight text-white group-hover:text-bingo-red transition-colors">
                          {tx.label || tx.type}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                          {tx.date
                            ? new Date(tx.date).toLocaleDateString("pt-PT", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "No date"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-lg font-black ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {isPositive
                          ? `+€${tx.amount.toFixed(2)}`
                          : `-€${Math.abs(tx.amount).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Current Account Balance:</span>
            <span className="text-sm font-black text-white bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-xl">
              €{user?.balance?.toFixed(2) || "0.00"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}