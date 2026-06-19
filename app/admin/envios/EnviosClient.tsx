"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_LOGISTICS_API_KEY ?? "";
const API_BASE = process.env.NEXT_PUBLIC_LOGISTICS_API_URL ?? "";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

const STATUS_OPTIONS = ["", "PENDING", "PREPARING", "IN_TRANSIT", "DELIVERED"];

type Shipment = {
  id: number;
  orderId: string;
  buyerId: string;
  status: string;
  address: string;
  carrier: string;
  estimatedDeliveryDate: string | null;
  deliveryDate: string | null;
  createdAt: string;
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--muted)] border border-[var(--border)]">
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function DeliveryCell({ shipment }: { shipment: Shipment }) {
  if (shipment.status === "DELIVERED" && shipment.deliveryDate) {
    return (
      <span className="text-green-600">
        Entregado el {new Date(shipment.deliveryDate).toLocaleDateString("es-AR")}
      </span>
    );
  }

  return (
    <span className="opacity-60">
      {shipment.estimatedDeliveryDate
        ? `Est. ${new Date(shipment.estimatedDeliveryDate).toLocaleDateString("es-AR")}`
        : "—"}
    </span>
  );
}

export default function EnviosClient() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set("status", status);

      const res = await fetch(`${API_BASE}/api/superadmin/shipments?${params}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setShipments(data.shipments);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e: any) {
      setError("No se pudieron cargar los envíos.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Envíos</h1>
        <p className="text-sm opacity-60 mt-1">
          Seguimiento y gestión de envíos del marketplace
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={status}
            onChange={handleStatusChange}
            className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 cursor-pointer"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
        </div>

        <span className="text-sm opacity-50">{total} envíos</span>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Orden</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Dirección</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Carrier</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Estado</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Entrega</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm opacity-40">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm opacity-40">
                  No hay envíos para mostrar.
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--muted)] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium">{s.orderId}</td>
                  <td className="px-5 py-4 text-sm opacity-70 max-w-xs truncate">{s.address}</td>
                  <td className="px-5 py-4 text-sm">{s.carrier === "MAIL" ? "Correo" : "Retiro"}</td>
                  <td className="px-5 py-4 text-center"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-4 text-right text-sm">
                    <DeliveryCell shipment={s} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/envios/${s.orderId}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-50">
            Página {page} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--muted)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--muted)] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}