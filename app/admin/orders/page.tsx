"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingBag, Filter, ChevronDown } from "lucide-react";

const PER_PAGE = 10;

interface Order {
  id: string
  status: string
  receiverName?: string
  total?: number
  createdAt?: string
}

interface Pagination {
  page: number
  limit: number
}

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: PER_PAGE });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    params.set("page", String(pagination.page))
    params.set("limit", String(PER_PAGE))

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        const list = Array.isArray(d.data) ? d.data : []
        setOrders(list)
        if (d.pagination) setPagination(d.pagination)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [search, pagination.page])

  const totalPages = Math.max(1, Math.ceil(orders.length / PER_PAGE))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-6 text-center max-w-md">
          <p className="font-medium mb-1">Error al cargar órdenes</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    );
  }

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

      {orders.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <ShoppingBag className="w-12 h-12 opacity-30 mx-auto mb-3" />
          <p className="font-medium opacity-60">
            {search
              ? "No se encontraron órdenes con ese criterio"
              : "No hay órdenes registradas"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Orden</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Cliente</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Total</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Estado</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--muted)] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium">{order.id}</td>
                  <td className="px-5 py-4 text-sm">{order.receiverName || "—"}</td>
                  <td className="px-5 py-4 text-right text-sm font-semibold">
                    {order.total != null ? formatCurrency(order.total) : "—"}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-right text-sm opacity-60">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("es-AR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
