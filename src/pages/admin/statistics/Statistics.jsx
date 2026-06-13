import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  ChevronLeft,
  TrendingUp,
  Wallet,
  ArrowDown,
  Gift,
  BarChart2,
  Activity,
} from "lucide-react";
import { useAllUsers, useAdminEvents } from "../../../hooks/use-admin";
import { useCards } from "../../../hooks/use-cards";
import { useWallet } from "../../../hooks/use-auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function AdminStatistics() {
  const navigate = useNavigate();
  const { data: users } = useAllUsers();
  const { data: cards } = useCards();
  const { data: events } = useAdminEvents();
  const { useTransactions } = useWallet();
  const { data: transactions } = useTransactions();

  const [timeFilter, setTimeFilter] = useState("day");
  const [chartType, setChartType] = useState("line");

  const stats = useMemo(() => {
    if (!transactions?.content || !users || !cards || !events) return null;
    const transactionList = transactions.content;
    const now = new Date();

    const calculateProfit = (data) =>
      data.reduce((acc, t) => {
        const type = String(t.type);
        if (type === "DEPOSIT" || type === "CARD")
          return acc + (Number(t.amount) || 0);
        if (type === "WITHDRAW" || type === "PRIZE")
          return acc - (Number(t.amount) || 0);
        return acc;
      }, 0);

    let labels = [];
    let dataPoints = [];

    if (timeFilter === "day") {
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        const hourlyData = transactionList.filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.toDateString() === now.toDateString() &&
            tDate.getHours() === i
          );
        });
        dataPoints.push(calculateProfit(hourlyData));
      }
    } else if (timeFilter === "month") {
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(i);
        const dailyData = transactionList.filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getDate() === i &&
            tDate.getMonth() === now.getMonth() &&
            tDate.getFullYear() === now.getFullYear()
          );
        });
        dataPoints.push(calculateProfit(dailyData));
      }
    } else if (timeFilter === "year") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      labels = months;
      months.forEach((_, i) => {
        const monthlyData = transactionList.filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getMonth() === i && tDate.getFullYear() === now.getFullYear()
          );
        });
        dataPoints.push(calculateProfit(monthlyData));
      });
    }

    return {
      totalGross: transactionList.reduce(
        (acc, t) =>
          ["1", "3", "DEPOSIT", "CARD"].includes(String(t.type))
            ? acc + (Number(t.amount) || 0)
            : acc,
        0,
      ),
      totalProfit: calculateProfit(transactionList),
      totalWithdraws: transactionList.reduce(
        (acc, t) =>
          ["0", "WITHDRAW"].includes(String(t.type))
            ? acc + (Number(t.amount) || 0)
            : acc,
        0,
      ),
      totalPrizes: transactionList.reduce(
        (acc, t) =>
          ["2", "PRIZE"].includes(String(t.type))
            ? acc + (Number(t.amount) || 0)
            : acc,
        0,
      ),
      chartLabels: labels,
      chartData: dataPoints,
    };
  }, [transactions, users, cards, events, timeFilter]);

  if (!stats)
    return (
      <div className="min-h-screen bg-bingo-dark p-12 text-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-bingo-dark p-6 md:p-12 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border border-bingo-red rounded-2xl p-6 bg-slate-900/20 flex items-center gap-6">
          <Link
            to="/admin"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-bingo-red" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase">Admin Statistics</h1>
            <p className="text-slate-500 text-sm">
              Financial Breakdown
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMiniCard
            label="Total Gross"
            value={`€${stats.totalGross.toFixed(2)}`}
            icon={TrendingUp}
          />
          <StatMiniCard
            label="Net Profit"
            value={`€${stats.totalProfit.toFixed(2)}`}
            icon={Wallet}
          />
          <StatMiniCard
            label="Withdraws"
            value={`€${stats.totalWithdraws.toFixed(2)}`}
            icon={ArrowDown}
          />
          <StatMiniCard
            label="Prizes Paid"
            value={`€${stats.totalPrizes.toFixed(2)}`}
            icon={Gift}
          />
        </div>

        <div className="bg-bingo-dark border border-bingo-red rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Profit Evolution
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setChartType(chartType === "line" ? "bar" : "line")
                }
                className="bg-bingo-dark border border-bingo-red rounded-lg p-2 text-xs flex items-center gap-2 hover:bg-[#d7263d]/10 transition-colors"
              >
                {chartType === "line" ? (
                  <BarChart2 size={14} />
                ) : (
                  <Activity size={14} />
                )}
                {chartType === "line" ? "SWITCH TO BAR" : "SWITCH TO LINE"}
              </button>
              <select
                className="bg-bingo-dark border border-bingo-red rounded-lg p-2 text-xs outline-none cursor-pointer"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="day">TODAY</option>
                <option value="month">THIS MONTH</option>
                <option value="year">THIS YEAR</option>
              </select>
            </div>
          </div>
          {chartType === "line" ? (
            <Line
              data={{
                labels: stats.chartLabels,
                datasets: [
                  {
                    label: "EUR",
                    data: stats.chartData,
                    borderColor: "#d7263d",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <Bar
              data={{
                labels: stats.chartLabels,
                datasets: [
                  {
                    label: "EUR",
                    data: stats.chartData,
                    backgroundColor: "#d7263d",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-bingo-dark border border-bingo-red p-6 rounded-2xl flex justify-between items-center">
      <div>
        <p className="text-[10px] uppercase font-black text-slate-500 mb-1">
          {label}
        </p>
        <span className="text-2xl font-black">{value}</span>
      </div>
      <div className="p-3 rounded-xl  text-bingo-red">
        <Icon size={20} />
      </div>
    </div>
  );
}
