"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { EnviosMobileList } from "../../../components/shipments/EnviosMobileList";
import { EnviosDesktopTable } from "../../../components/shipments/EnviosDesktopTable";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  PREPARING:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  IN_TRANSIT:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  DELIVERED:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
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
  const colorClass =
    STATUS_COLORS[status] ??
    "bg-muted border-border text-[var(--foreground)]";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${colorClass}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function DeliveryCell({ shipment }: { shipment: Shipment }) {
  if (shipment.status === "DELIVERED" && shipment.deliveryDate) {
    return (
      <span className="text-green-600">
        {new Date(shipment.deliveryDate).toLocaleDateString("es-AR")}
      </span>
    );
  }
  return (
    <span className="opacity-60">
      {shipment.estimatedDeliveryDate
        ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString("es-AR")
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

      const res = await fetch(`/api/admin/shipments?${params}`);

      if (!res.ok) throw new Error();
      const data = await res.json();
      setShipments(data.shipments);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError("No se pudieron cargar los envíos.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Envíos</h1>
        <p className="text-sm opacity-60 mt-1">Seguimiento y gestión de envíos del marketplace</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="relative w-full sm:w-64">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="appearance-none w-full pl-4 pr-10 py-2 rounded-lg border border-border text-sm bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
        </div>
        <span className="text-sm opacity-50 font-medium">{total} envíos registrados</span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm opacity-40 border border-border rounded-xl bg-background">Cargando...</div>
      ) : error ? (
        <div className="p-12 text-center text-sm text-red-500 border border-border rounded-xl bg-background">{error}</div>
      ) : (
        <>
          <EnviosMobileList
            shipments={shipments}
            StatusBadge={StatusBadge}
            DeliveryCell={DeliveryCell}
          />
          <EnviosDesktopTable
            shipments={shipments}
            StatusBadge={StatusBadge}
            DeliveryCell={DeliveryCell}
          />
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs sm:text-sm opacity-50 font-medium">Página {page} de {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}