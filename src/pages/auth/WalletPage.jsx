import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { useCurrentUser, useWallet } from "../../hooks/use-auth";

export default function WalletPage() {
  const { data: user } = useCurrentUser();
  const { useTransactions, useTransactionMutation } = useWallet();

  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const { data: serverTransactions, isLoading } = useTransactions();
  const mutation = useTransactionMutation();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardValid, setCardValid] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [ccNumber, setCcNumber] = useState("");

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ").trim();
    if (value.length <= 19) setCardNumber(value);
  };

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    const currentYear = new Date().getFullYear() % 100;

    if (value.length >= 2) {
      let month = parseInt(value.slice(0, 2), 10);
      if (month > 12) month = 12;
      if (month < 1) month = 1;

      let year = value.slice(2, 4);
      if (year.length === 2) {
        let yearNum = parseInt(year, 10);
        if (yearNum <= currentYear) {
          year = (currentYear + 1).toString();
        }
      }

      value = month.toString().padStart(2, '0') + (year ? "/" + year : "");
    }

    if (value.length <= 5) setCardValid(value);
  };

  const transactions = serverTransactions?.content || [];
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleOperation = () => {
    setFeedback({ message: "", type: "" });
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount < 10) {
      setFeedback({ message: "The minimum operation amount is 10€", type: "error" });
      return;
    }
    if (cardHolderName.length < 3) {
      setFeedback({ message: "Please enter a valid card holder name", type: "error" });
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setFeedback({ message: "Card number must have 16 digits", type: "error" });
      return;
    }
    if (cardValid.length < 5) {
      setFeedback({ message: "Please enter a valid expiry date (MM/YY)", type: "error" });
      return;
    }
    if (ccNumber.length < 3) {
      setFeedback({ message: "CVC must have 3 digits", type: "error" });
      return;
    }

    const payload = { amount: numAmount, type, cardNumber, cardValid, cardHolderName, ccNumber };

    mutation.mutate(payload, {
      onSuccess: () => {
        setFeedback({ message: "Operation successful!", type: "success" });
        setAmount(""); setCardNumber(""); setCardValid(""); setCardHolderName(""); setCcNumber("");
      },
      onError: (error) => {
        setFeedback({ message: error.message || "Operation failed", type: "error" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-bingo-dark text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase flex items-center justify-center gap-4">
            <Wallet className="text-bingo-red shrink-0" size={48} />
            <span>Wallet</span>
          </h1>
        </div>

        <div className="relative overflow-hidden bg-slate-900/40 border-2 border-red-500/30 rounded-[2rem] p-8 flex justify-between items-center shadow-2xl shadow-red-500/5">
          <div className="z-10">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Available Balance</p>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter">€{user?.balance?.toFixed(2) || "0.00"}</h2>
          </div>
          <Wallet size={120} className="absolute -right-4 text-red-500/10 rotate-12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/40 border-2 border-red-500/30 rounded-[2rem] p-8 space-y-6 flex flex-col">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="text-red-500" /> New Operation
            </h3>

            {feedback.message && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 border ${feedback.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                {feedback.message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setType("deposit")} className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${type === "deposit" ? "bg-bingo-red shadow-lg shadow-red-600/20 scale-[1.02]" : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                <ArrowDownCircle size={20} /> Deposit
              </button>
              <button type="button" onClick={() => setType("withdraw")} className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${type === "withdraw" ? "bg-bingo-red shadow-lg shadow-red-600/20 scale-[1.02]" : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                <ArrowUpCircle size={20} /> Withdraw
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h2 className="text-sm font-black uppercase tracking-wider text-red-500">
                  Minimum operation: 10€
                </h2>
              </div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Amount to {type}</label>
              <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#051124] border-2 border-slate-800 rounded-2xl p-5 text-3xl font-black outline-none focus:border-bingo-red transition-all placeholder:text-slate-800" />
              <div className="grid grid-cols-4 gap-2">
                {["10", "20", "50", "100"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="bg-slate-800/30 border border-slate-700 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all font-bold text-slate-400"
                  >
                    €{val}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard size={16} className="text-red-500" /> Card Details
              </h4>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  maxLength={20}
                  className="w-full bg-[#051124] border-2 border-slate-800 rounded-xl p-3 text-sm font-medium outline-none focus:border-bingo-red transition-all"
                />
                <p className="text-[10px] text-slate-600 text-right">{cardHolderName.length}/20</p>
              </div>
              <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} maxLength={19} className="w-full bg-[#051124] border-2 border-slate-800 rounded-xl p-3 text-sm font-medium outline-none focus:border-bingo-red transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" value={cardValid} onChange={handleDateChange} maxLength={5} className="w-full bg-[#051124] border-2 border-slate-800 rounded-xl p-3 text-sm font-medium outline-none focus:border-bingo-red transition-all" />
                <input type="text" placeholder="CVC" maxLength={3} value={ccNumber} onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, ""))} className="w-full bg-[#051124] border-2 border-slate-800 rounded-xl p-3 text-sm font-medium outline-none focus:border-bingo-red transition-all" />
              </div>
            </div>

            <button onClick={handleOperation} disabled={mutation.isPending} className="w-full mt-4 bg-bingo-red disabled:bg-slate-700 py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95">
              {mutation.isPending ? "Processing..." : `Confirm ${type}`}
            </button>
          </div>

          <div className="bg-slate-900/40 border-2 border-red-500/30 rounded-[2rem] p-8 space-y-6 flex flex-col h-full">
            <h3 className="text-2xl font-black uppercase tracking-tight">Transaction History</h3>
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar flex-1">
              {isLoading ? <p className="text-center py-10 text-slate-500 animate-pulse">Loading...</p> : transactions.length === 0 ? <p className="text-center py-10 text-slate-600">No movements recorded yet.</p> : (
                sortedTransactions.map((tx) => {
                  const txType = tx.type?.toLowerCase();
                  return (
                    <div key={tx.id} className="bg-[#051124] border border-slate-800/50 p-4 rounded-2xl flex justify-between items-center group hover:border-red-500/40 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${txType === "deposit" || txType === "prize" || txType === "win" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}>
                          {txType === "withdraw" || txType === "purchase" ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">{tx.label || tx.type}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{tx.date ? new Date(tx.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "No date"}</p>
                        </div>
                      </div>
                      <p className={`text-xl font-black ${txType === "deposit" || txType === "prize" || txType === "win" ? "text-green-500" : "text-red-500"}`}>
                        {txType === "deposit" || txType === "prize" || txType === "win" ? `+€${tx.amount.toFixed(2)}` : `-€${Math.abs(tx.amount).toFixed(2)}`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}