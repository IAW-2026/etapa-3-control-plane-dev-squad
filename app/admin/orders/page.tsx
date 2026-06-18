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
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--muted)] border border-[var(--border)]">
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
        <h1 className="text-xl font-bold">Ordenes</h1>
        <p className="text-sm opacity-60 mt-1">
          Administra las órdenes de compra del marketplace
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            placeholder="Buscar orden..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-[var(--foreground)]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm opacity-70 hover:opacity-100 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Orden</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Cliente</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Items</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Total</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Estado</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--muted)] transition-colors">
                <td className="px-5 py-4 text-sm font-medium">{order.id}</td>
                <td className="px-5 py-4 text-sm">{order.user}</td>
                <td className="px-5 py-4 text-center text-sm">{order.items}</td>
                <td className="px-5 py-4 text-right text-sm font-semibold">{formatCurrency(order.total)}</td>
                <td className="px-5 py-4 text-center"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-4 text-right text-sm opacity-60">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
