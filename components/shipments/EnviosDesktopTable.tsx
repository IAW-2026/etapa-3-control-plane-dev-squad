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

interface EnviosDesktopTableProps {
  shipments: Shipment[];
  StatusBadge: React.ComponentType<{ status: string }>;
  DeliveryCell: React.ComponentType<{ shipment: any }>;
}

export function EnviosDesktopTable({ shipments, StatusBadge, DeliveryCell }: EnviosDesktopTableProps) {
  const router = useRouter();

  if (shipments.length === 0) {
    return (
      <div className="p-8 text-center text-sm opacity-40 border border-border rounded-xl">
        No hay envíos para mostrar.
      </div>
    );
  }

  return (
    <div className="hidden md:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider opacity-60">
            <th className="w-[15%] text-left px-6 py-3.5">Orden</th>
            <th className="w-[40%] text-left px-6 py-3.5">Dirección</th>
            <th className="w-[15%] text-left px-6 py-3.5">Carrier</th>
            <th className="w-[15%] text-center px-6 py-3.5">Estado</th>
            <th className="w-[15%] text-right px-6 py-3.5">Entrega</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {shipments.map((s) => (
            <tr
              key={s.id}
              onClick={() => router.push(`/admin/envios/${s.orderId}`)}
              className="hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 text-sm font-medium text-foreground">
                #{s.orderId}
              </td>
              <td className="px-6 py-4 text-sm opacity-70 truncate" title={s.address}>
                {s.address}
              </td>
              <td className="px-6 py-4 text-sm">
                {s.carrier === "MAIL" ? "Correo" : "Retiro"}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge status={s.status} />
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <DeliveryCell shipment={s} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}