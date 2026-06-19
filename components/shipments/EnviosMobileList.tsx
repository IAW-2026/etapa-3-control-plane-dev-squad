"use client";

import { useRouter } from "next/navigation";

type Shipment = {
  id: number;
  orderId: string;
  status: string;
  address: string;
  carrier: string;
  estimatedDeliveryDate: string | null;
  deliveryDate: string | null;
};

interface EnviosMobileListProps {
  shipments: Shipment[];
  StatusBadge: React.ComponentType<{ status: string }>;
  DeliveryCell: React.ComponentType<{ shipment: any }>;
}

export function EnviosMobileList({ shipments, StatusBadge, DeliveryCell }: EnviosMobileListProps) {
  const router = useRouter();

  if (shipments.length === 0) {
    return (
      <div className="p-8 text-center text-sm opacity-40 border border-border rounded-xl">
        No hay envíos para mostrar.
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3">
      {shipments.map((s) => (
        <div
          key={s.id}
          onClick={() => router.push(`/admin/envios/${s.orderId}`)}
          className="p-4 border border-border rounded-xl bg-background active:bg-muted space-y-3 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Orden #{s.orderId}</span>
            <StatusBadge status={s.status} />
          </div>
          <div className="text-xs opacity-70 wrap-break-word line-clamp-2">
            <span className="font-medium block opacity-50 mb-0.5">Dirección:</span> {s.address}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs border-t border-border/60">
            <div>
              <span className="opacity-50 font-medium">Método:</span>{" "}
              {s.carrier === "MAIL" ? "Correo" : "Retiro"}
            </div>
            <div className="text-right font-medium">
              <DeliveryCell shipment={s} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}