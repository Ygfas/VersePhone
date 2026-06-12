"use client";
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { ShoppingCart, Package, TrendingUp, Users, ArrowUpRight } from "lucide-react";

const COLORS = ["#1a1a1a", "#4B5563", "#9CA3AF", "#D1D5DB", "#6366F1", "#10B981"];

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [produkChart, setProdukChart] = useState([]);
  const [statusChart, setStatusChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sc, pc, stc] = await Promise.all([
          fetch("/api/dashboard/stats").then((r) => r.json()),
          fetch("/api/dashboard/sales-chart").then((r) => r.json()),
          fetch("/api/dashboard/produk-chart").then((r) => r.json()),
          fetch("/api/dashboard/status-chart").then((r) => r.json()),
        ]);
        setStats(s);
        setSalesChart(sc);
        setProdukChart(pc);
        setStatusChart(stc);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Transaksi", value: stats.totalTransaksi, icon: ShoppingCart, change: "+12%" },
        { label: "Produk Tersedia", value: stats.totalProduk, icon: Package, change: "stabil" },
        { label: "Total Pengguna", value: stats.totalUser, icon: Users, change: "+3%" },
        { label: "Total Artikel", value: stats.totalArtikel, icon: TrendingUp, change: "baru" },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon size={17} className="text-gray-600" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                {change} <ArrowUpRight size={11} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Sales Line Chart */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Tren Penjualan</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={salesChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #F3F4F6" }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#1a1a1a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Produk per brand */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Stok per Produk</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={produkChart} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="nama" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="stok" radius={[4, 4, 0, 0]}>
                {produkChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status transaksi pie */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Status Transaksi</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusChart}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {statusChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
