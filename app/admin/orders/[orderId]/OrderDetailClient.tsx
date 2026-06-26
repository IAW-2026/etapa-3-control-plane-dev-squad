"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import type { OrderItem } from "../../../../components/shipments/types";
import { ShipmentItemsList } from "../../../../components/shipments/ShipmentItemsList";

interface Order {
  id: string
  userId: string
  status: string
  total: number
  discount: number
  shipping: number
  address?: string
  originAddress?: string
  receiverName: string
  receiverPhone: string
  deliveryType: string
  shippingAddress?: string
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  shippingCompany?: string
  items?: OrderItem[]
}

const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function Field({
  label,
  children,
  fullWidth,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium mb-1.5 opacity-60 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-[var(--foreground)] transition-shadow"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-[var(--foreground)] transition-shadow"
    />
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="px-5 py-3 bg-[var(--muted)] border-b border-[var(--border)]">
        <h2 className="text-xs font-semibold uppercase tracking-widest opacity-60">
          {title}
        </h2>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--muted)] rounded-lg">
      <span className="text-xs font-medium opacity-50 uppercase tracking-wider min-w-[5rem]">
        {label}
      </span>
      <span className="text-sm font-mono text-[var(--foreground)] break-all">
        {value}
      </span>
    </div>
  );
}

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [address, setAddress] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCompany, setShippingCompany] = useState("");

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Error al cargar la orden");
      }
      const data = await res.json();
      const o: Order = data.data ?? data;
      setOrder(o);
      setStatus(o.status || "");
      setReceiverName(o.receiverName || "");
      setReceiverPhone(o.receiverPhone || "");
      setDeliveryType(o.deliveryType || "");
      setAddress(o.address || o.shippingAddress || "");
      setOriginAddress(o.originAddress || "");
      setTotal(o.total ?? 0);
      setDiscount(o.discount ?? 0);
      setShipping(o.shipping ?? 0);
      setTrackingNumber(o.trackingNumber || "");
      setShippingCompany(o.shippingCompany || "");

      if (o.items && o.items.length > 0) {
        setOrderItems(
          o.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            size: item.size,
            color: item.color ?? null,
            imageUrl: item.imageUrl || null,
            productOriginAddress: null,
          }))
        );
      } else {
        // Fallback: fetch items from shipments API
        try {
          const shipRes = await fetch(`/api/admin/shipments/${orderId}`);
          if (shipRes.ok) {
            const shipData = await shipRes.json();
            const ship = shipData.data ?? shipData;
            if (ship.items) {
              setOrderItems(ship.items);
            }
          }
        } catch {
          // silent fail — items are optional
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const body: Record<string, unknown> = {
        status,
        receiverName,
        receiverPhone,
        deliveryType,
        address,
        originAddress,
        total,
        discount,
        shipping,
      };
      if (trackingNumber.trim()) body.trackingNumber = trackingNumber.trim();
      if (shippingCompany.trim()) body.shippingCompany = shippingCompany.trim();

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const bodyErr = await res.json().catch(() => ({}));
        throw new Error(bodyErr.error || "Error al guardar");
      }
      setSuccess(true);
      await fetchOrder();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1 w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a órdenes
        </Link>
        <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-6 text-center max-w-md">
          <p className="font-medium mb-1">Error al cargar la orden</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <Link
        href="/admin/orders"
        className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1 w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a órdenes
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Orden <span className="font-mono">#{order.id}</span>
          </h1>
          <p className="text-sm opacity-50 mt-0.5">
            Creada el{" "}
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              dateStyle: "long",
            })}
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          Orden actualizada correctamente.
        </div>
      )}

      {/* Read-only metadata */}
      <div className="flex flex-wrap gap-2">
        <InfoRow label="ID" value={order.id} />
        <InfoRow label="Usuario" value={order.userId} />
      </div>

      <Section title="Información del cliente">
        <Field label="Nombre">
          <Input
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />
        </Field>
        <Field label="Teléfono">
          <Input
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Detalles de la orden">
        <Field label="Tipo de entrega">
          <Input
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          />
        </Field>
        <Field label="Estado">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Dirección de envío" fullWidth>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, número, ciudad, código postal"
          />
        </Field>
        <Field label="Dirección de origen" fullWidth>
          <Input
            value={originAddress}
            onChange={(e) => setOriginAddress(e.target.value)}
            placeholder="Dirección del vendedor"
          />
        </Field>
      </Section>

      <Section title="Envío">
        <Field label="Número de seguimiento">
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="ABC123"
          />
        </Field>
        <Field label="Empresa de envío">
          <Input
            value={shippingCompany}
            onChange={(e) => setShippingCompany(e.target.value)}
            placeholder="Correo Argentino"
          />
        </Field>
      </Section>

      <Section title="Información financiera">
        <Field label="Total">
          <Input
            type="number"
            step="0.01"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
        </Field>
        <Field label="Descuento">
          <Input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </Field>
        <Field label="Costo de envío">
          <Input
            type="number"
            step="0.01"
            value={shipping}
            onChange={(e) => setShipping(Number(e.target.value))}
          />
        </Field>
      </Section>

      {/* Items de la orden */}
      {orderItems.length > 0 && (
        <ShipmentItemsList
          items={orderItems}
          shippingCost={shipping}
          discount={discount}
        />
      )}

      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
