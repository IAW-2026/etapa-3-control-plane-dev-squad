"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  revenue: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    products: Array<{ name: string }>;
  }>;
  topProducts: Array<{
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  topSellers: Array<{
    id: string;
    name: string;
    email: string;
    _count: { orders: number };
  }>;
  dailySales: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-red-100 text-red-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-medium mb-1">Error al cargar datos</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Resumen general del marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Usuarios"
          value={data.totalUsers}
          color="bg-blue-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="Órdenes"
          value={data.totalOrders}
          color="bg-violet-500"
        />
        <StatCard
          icon={Package}
          label="Productos"
          value={data.totalProducts}
          color="bg-amber-500"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos"
          value={formatCurrency(data.revenue)}
          color="bg-emerald-500"
        />
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={data.pendingOrders}
          sub="órdenes por procesar"
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Ventas diarias (últimos 30 días)
            </h2>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailySales}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => {
                    const d = new Date(v + "T00:00:00");
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                  labelFormatter={(v) => {
                    const d = new Date(v + "T00:00:00");
                    return d.toLocaleDateString("es-AR");
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Ingresos",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Top Vendedores
          </h2>
          <div className="space-y-3">
            {data.topSellers.map((seller, i) => (
              <div
                key={seller.id}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    i === 0
                      ? "bg-amber-400"
                      : i === 1
                        ? "bg-slate-400"
                        : i === 2
                          ? "bg-amber-700"
                          : "bg-slate-300"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {seller.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {seller.email}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {seller._count.orders} ventas
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Top Productos
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topProducts}
                layout="vertical"
                margin={{ left: 0, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  width={120}
                  tickFormatter={(v) =>
                    v.length > 18 ? v.slice(0, 18) + "..." : v
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [Number(value), "Vendidos"]}
                />
                <Bar
                  dataKey="totalSold"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Órdenes Recientes
          </h2>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {order.user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {order.products.map((p) => p.name).join(", ")}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(order.total)}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
