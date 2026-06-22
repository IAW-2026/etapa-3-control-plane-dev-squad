"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "../../../../components/shipments/StatusBadge";
import { ShipmentItemsList } from "../../../../components/shipments/ShipmentItemsList";
import { ShipmentHistory } from "../../../../components/shipments/ShipmentHistory";
import { ShipmentStatusCard } from "../../../../components/shipments/ShipmentStatusCard";
import { AddCommentCard } from "../../../../components/shipments/AddCommentCard";
import { Shipment, TrackingItem } from "../../../../components/shipments/types";

const ORDER = ["PENDING", "PREPARING", "IN_TRANSIT", "DELIVERED"];

export default function EnvioDetalleClient({ orderId }: { orderId: string }) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [tracking, setTracking] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comment, setComment] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [shipmentRes, trackingRes] = await Promise.all([
        fetch(`/api/admin/shipments/${orderId}`),
        fetch(`/api/admin/shipments/${orderId}/tracking`),
      ]);

      if (!shipmentRes.ok || !trackingRes.ok) throw new Error();

      setShipment(await shipmentRes.json());
      setTracking(await trackingRes.json());
    } catch {
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

  const originAddress = shipment?.items.find((item) => item.productOriginAddress)?.productOriginAddress ?? null;

  async function handleAdvanceStatus() {
    if (!nextStatus || !statusComment.trim()) return;
    setSubmittingStatus(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/shipments/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          description: statusComment.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setStatusComment("");
      await fetchAll();
    } catch {
      setActionError("No se pudo actualizar el estado.");
    } finally {
      setSubmittingStatus(false);
    }
  }

  async function handleAddComment() {
    if (!comment.trim() || shipment?.status === "DELIVERED") return;
    setSubmittingComment(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/shipments/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: comment.trim() }),
      });
      if (!res.ok) throw new Error();
      setComment("");
      await fetchAll();
    } catch {
      setActionError("No se pudo agregar el comentario.");
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) return <div className="text-sm opacity-40 py-10 text-center">Cargando...</div>;

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
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link href="/admin/envios" className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1 w-fit">
        <ArrowLeft className="w-4 h-4" /> Volver a envíos
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orden #{shipment.orderId}</h1>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      {actionError && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <ShipmentStatusCard
            address={shipment.address}
            originAddress={originAddress}
            carrier={shipment.carrier}
            estimatedDeliveryDate={shipment.estimatedDeliveryDate}
            deliveryDate={shipment.deliveryDate}
            nextStatus={nextStatus}
            statusComment={statusComment}
            setStatusComment={setStatusComment}
            onAdvanceStatus={handleAdvanceStatus}
            submittingStatus={submittingStatus}
          />

          {shipment.status !== "DELIVERED" && (
            <AddCommentCard
              comment={comment}
              setComment={setComment}
              onAddComment={handleAddComment}
              submittingComment={submittingComment}
            />
          )}

          <ShipmentItemsList
            items={shipment.items}
            shippingCost={shipment.shippingCost}
            discount={shipment.discount}
          />
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <ShipmentHistory tracking={tracking} />
        </div>
      </div>
    </div>
  );
}