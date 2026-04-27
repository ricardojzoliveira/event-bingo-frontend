import { useState } from "react";
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingUp, Info } from "lucide-react";
import { useProfile } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useAuth";

export default function WalletPage() {
  const { data: user } = useProfile();
  const { useTransactions, useTransactionMutation } = useWallet();
  
  const { data: walletData, isLoading } = useTransactions();
  const mutation = useTransactionMutation();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");

  const transactions = walletData?.transactions || [];

  const handleOperation = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    mutation.mutate(
      { amount: numAmount, type },
      {
        onSuccess: () => {
          setAmount(""); 
        },
        onError: (error) => {
          alert("Operation failed: " + error.message);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#020c1b] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight uppercase">Wallet</h1>
          <p className="text-slate-400 font-medium">Manage deposits, withdraws and view history</p>
        </div>

        <div className="relative overflow-hidden bg-slate-900/40 border-2 border-red-500/30 rounded-[2rem] p-8 flex justify-between items-center shadow-2xl shadow-red-500/5">
          <div className="z-10">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Available Balance</p>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
              €{user?.balance?.toFixed(2) || "0.00"}
            </h2>
          </div>
          <Wallet size={120} className="absolute -right-4 text-red-500/10 rotate-12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-slate-900/40 border-2 border-red-500/30 rounded-[2rem] p-8 space-y-6 flex flex-col">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="text-red-500" /> New Operation
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setType("deposit")}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  type === 'deposit' ? 'bg-red-600 shadow-lg shadow-red-600/20 scale-[1.02]' : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <ArrowDownCircle size={20} /> Deposit
              </button>
              <button
                onClick={() => setType("withdraw")}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  type === 'withdraw' ? 'bg-red-600 shadow-lg shadow-red-600/20 scale-[1.02]' : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <ArrowUpCircle size={20} /> Withdraw
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Amount to {type}</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#051124] border-2 border-slate-800 rounded-2xl p-5 text-3xl font-black outline-none focus:border-red-600 transition-all placeholder:text-slate-800"
              />
              
              <div className="grid grid-cols-4 gap-2">
                {["10", "20", "50", "100"].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className="bg-slate-800/30 border border-slate-700 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all font-bold text-slate-400"
                  >
                    €{val}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleOperation}
              disabled={mutation.isPending}
              className="w-full mt-auto bg-red-600 hover:bg-red-700 disabled:bg-slate-700 py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {mutation.isPending ? "Processing..." : `Confirm ${type}`}
            </button>

            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
              <Info className="text-blue-500 shrink-0" size={18} />
              <p className="text-[11px] text-blue-200/60 leading-snug">
                <strong>Note:</strong> Financial operations are processed using our secure internal system. Deposits are usually available instantly.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border-2 border-red-500/30 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight">Transaction History</h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <p className="text-center py-10 text-slate-500 animate-pulse">Loading history...</p>
              ) : transactions.length === 0 ? (
                <p className="text-center py-10 text-slate-600">No movements recorded yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="bg-[#051124] border border-slate-800/50 p-4 rounded-2xl flex justify-between items-center group hover:border-red-500/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        tx.type === 'deposit' ? 'text-green-500 bg-green-500/10' : 
                        tx.type === 'purchase' ? 'text-red-500 bg-red-500/10' : 
                        'text-blue-500 bg-blue-500/10'
                      }`}>
                        {tx.type === 'withdraw' || tx.type === 'purchase' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">{tx.label || tx.type}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{tx.date}</p>
                      </div>
                    </div>
                    <p className={`text-xl font-black ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? `+€${tx.amount.toFixed(2)}` : `-€${Math.abs(tx.amount).toFixed(2)}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}