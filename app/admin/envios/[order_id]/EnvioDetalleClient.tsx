"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_LOGISTICS_API_KEY ?? "";
const API_BASE = process.env.NEXT_PUBLIC_LOGISTICS_API_URL ?? "";

const ORDER = ["PENDING", "PREPARING", "IN_TRANSIT", "DELIVERED"];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

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

type TrackingItem = {
  id: number;
  status: string;
  description: string | null;
  location: string;
  timestamp: string;
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--muted)] border border-[var(--border)]">
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function EnvioDetalleClient({ orderId }: { orderId: string }) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [tracking, setTracking] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [shipmentRes, trackingRes] = await Promise.all([
        fetch(`${API_BASE}/api/superadmin/shipments/${orderId}`, {
          headers: { "x-api-key": API_KEY },
        }),
        fetch(`${API_BASE}/api/superadmin/shipments/${orderId}/tracking`, {
          headers: { "x-api-key": API_KEY },
        }),
      ]);

      if (!shipmentRes.ok) throw new Error(`Error ${shipmentRes.status}`);
      if (!trackingRes.ok) throw new Error(`Error ${trackingRes.status}`);

      setShipment(await shipmentRes.json());
      setTracking(await trackingRes.json());
    } catch (e) {
      setError("No se pudo cargar el envío.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const nextStatus = shipment
    ? ORDER[ORDER.indexOf(shipment.status) + 1]
    : undefined;

  async function handleAdvanceStatus() {
    if (!nextStatus) return;
    setSubmittingStatus(true);
    setActionError(null);
    try {
      const res = await fetch(`${API_BASE}/api/superadmin/shipments/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchAll();
    } catch (e) {
      setActionError("No se pudo actualizar el estado.");
    } finally {
      setSubmittingStatus(false);
    }
  }

  async function handleAddComment() {
    if (!comment.trim()) return;
    setSubmittingComment(true);
    setActionError(null);
    try {
      const res = await fetch(`${API_BASE}/api/superadmin/shipments/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ description: comment.trim() }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setComment("");
      await fetchAll();
    } catch (e) {
      setActionError("No se pudo agregar el comentario.");
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return <div className="text-sm opacity-40 py-10 text-center">Cargando...</div>;
  }

  if (error || !shipment) {
    return (
      <div className="space-y-4">
        <Link href="/admin/envios" className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1 w-fit">
          <ArrowLeft className="w-4 h-4" /> Volver a envíos
        </Link>
        <div className="text-sm text-red-500">{error ?? "Envío no encontrado."}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/envios" className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1 w-fit">
        <ArrowLeft className="w-4 h-4" /> Volver a envíos
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Orden #{shipment.orderId}</h1>
          <p className="text-sm opacity-60 mt-1">{shipment.address}</p>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      {actionError && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {actionError}
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] p-5 space-y-4">
        <div className="text-sm font-semibold">Estado del envío</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="opacity-60">Carrier</div>
          <div>{shipment.carrier === "MAIL" ? "Correo" : "Retiro en persona"}</div>
          <div className="opacity-60">Entrega estimada</div>
          <div>
            {shipment.estimatedDeliveryDate
              ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString("es-AR")
              : "—"}
          </div>
          <div className="opacity-60">Fecha de entrega</div>
          <div>
            {shipment.deliveryDate
              ? new Date(shipment.deliveryDate).toLocaleDateString("es-AR")
              : "—"}
          </div>
        </div>

        {nextStatus ? (
          <button
            onClick={handleAdvanceStatus}
            disabled={submittingStatus}
            className="px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submittingStatus ? "Actualizando..." : `Avanzar a "${STATUS_LABELS[nextStatus]}"`}
          </button>
        ) : (
          <div className="text-sm opacity-50">El envío ya fue entregado.</div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5 space-y-3">
        <div className="text-sm font-semibold">Agregar comentario</div>
        <div className="flex items-start gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribí una novedad sobre este envío..."
            rows={2}
            className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 resize-none"
          />
          <button
            onClick={handleAddComment}
            disabled={submittingComment || !comment.trim()}
            className="px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors disabled:opacity-30 shrink-0"
            title="Agregar comentario"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="text-sm font-semibold px-5 py-4 border-b border-[var(--border)]">
          Historial
        </div>
        <div className="divide-y divide-[var(--border)]">
          {tracking.length === 0 ? (
            <div className="px-5 py-6 text-sm opacity-40 text-center">Sin movimientos todavía.</div>
          ) : (
            [...tracking].reverse().map((t) => (
              <div key={t.id} className="px-5 py-3 flex items-start justify-between gap-4">
                <div>
                  <StatusBadge status={t.status} />
                  {t.description && (
                    <p className="text-sm mt-1.5">{t.description}</p>
                  )}
                </div>
                <span className="text-xs opacity-50 whitespace-nowrap">
                  {new Date(t.timestamp).toLocaleString("es-AR")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}