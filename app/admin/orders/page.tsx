"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Edit } from "lucide-react";
import FilterSelect from "@/components/FilterSelect";
import Pagination from "@/components/Pagination";

const PER_PAGE = 10;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  PAID: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  SHIPPED:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  DELIVERED:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
  CANCELLED:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
};

function getStatusClass(status: string): string {
  const key = status?.toUpperCase();
  return STATUS_COLORS[key] ?? STATUS_COLORS[status] ?? "";
}

function getStatusLabel(status: string): string {
  const key = status?.toUpperCase();
  return STATUS_LABELS[key] ?? STATUS_LABELS[status] ?? status;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

interface Order {
  id: string;
  status: string;
  receiverName?: string;
  total?: number;
  createdAt?: string;
}

function StatusBadge({ status }: { status: string }) {
  const colorClass =
    getStatusClass(status) ||
    "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${colorClass}`}
    >
      {getStatusLabel(status)}
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      params.set("page", String(page));
      params.set("limit", String(PER_PAGE));

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      const list = Array.isArray(d.data) ? d.data : [];
      setOrders(list);
      if (d.pagination?.totalPages) {
        setTotalPages(d.pagination.totalPages);
      } else if (d.total != null) {
        setTotalPages(Math.max(1, Math.ceil(d.total / PER_PAGE)));
      } else {
        setTotalPages(1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar órdenes");
    } finally {
      setInitialLoading(false);
      setRefetching(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (initialLoading) {
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

      <div className="flex items-center gap-3 flex-wrap">
        <FilterSelect
          value={status}
          onChange={(v) => {
            setRefetching(true);
            setStatus(v);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
        />
      </div>

      {refetching && (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <ShoppingBag className="w-12 h-12 opacity-30 mx-auto mb-3" />
          <p className="font-medium opacity-60">
            {status
              ? "No se encontraron órdenes con ese criterio"
              : "No hay órdenes registradas"}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Orden
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Cliente
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Total
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Estado
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Fecha
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--muted)] transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {order.receiverName || "—"}
                    </td>
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
                    <td className="px-5 py-4 text-center">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--muted)] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setRefetching(true);
              setPage(p);
            }}
          />
        </>
      )}
    </div>
  );
}