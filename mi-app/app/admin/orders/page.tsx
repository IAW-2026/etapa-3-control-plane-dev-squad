"use client";

import { useState } from "react";
import { Search, ShoppingBag, ChevronDown, Filter } from "lucide-react";

const mockOrders = [
  { id: "ORD-001", user: "Juan Pérez", total: 125000, status: "PAID", items: 3, date: "2025-06-15" },
  { id: "ORD-002", user: "María García", total: 89000, status: "PENDING", items: 1, date: "2025-06-14" },
  { id: "ORD-003", user: "Carlos López", total: 210000, status: "SHIPPED", items: 2, date: "2025-06-13" },
  { id: "ORD-004", user: "Ana Martínez", total: 56000, status: "DELIVERED", items: 1, date: "2025-06-12" },
  { id: "ORD-005", user: "Pedro Rodríguez", total: 178000, status: "CANCELLED", items: 2, date: "2025-06-11" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-red-100 text-red-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
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

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Órdenes</h1>
        <p className="text-sm text-slate-500 mt-1">
          Administra las órdenes de compra del marketplace
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar orden..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Orden</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Cliente</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Items</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Total</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                <td className="px-5 py-4 text-sm text-slate-900">{order.user}</td>
                <td className="px-5 py-4 text-center text-sm text-slate-700">{order.items}</td>
                <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                <td className="px-5 py-4 text-center"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-4 text-right text-sm text-slate-400">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
