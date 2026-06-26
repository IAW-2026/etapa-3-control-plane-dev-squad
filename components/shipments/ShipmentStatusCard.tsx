"use client";

import { STATUS_LABELS } from "./StatusBadge";

type ShipmentStatusCardProps = {
  address: string;
  originAddress: string | null;
  carrier: string;
  estimatedDeliveryDate: string | null;
  deliveryDate: string | null;
  nextStatus?: string;
  statusComment: string;
  setStatusComment: (val: string) => void;
  onAdvanceStatus: () => void;
  submittingStatus: boolean;
};

export function ShipmentStatusCard({
  address,
  originAddress,
  carrier,
  estimatedDeliveryDate,
  deliveryDate,
  nextStatus,
  statusComment,
  setStatusComment,
  onAdvanceStatus,
  submittingStatus,
}: ShipmentStatusCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="text-sm font-semibold px-5 py-4 border-b border-border">
        Datos del envío
      </div>

      <div className="divide-y divide-border">
        {/* Usamos flex-col por defecto (mobile) y sm:flex-row en pantallas más grandes */}
        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-sm">
          <span className="opacity-60 font-medium shrink-0">Dirección</span>
          <span className="text-left sm:text-right font-normal wrap-break-word sm:max-w-md">
            {address}
          </span>
        </div>

        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-sm">
          <span className="opacity-60 font-medium shrink-0">Origen</span>
          <span className="text-left sm:text-right font-normal wrap-break-word">
            {originAddress ?? "—"}
          </span>
        </div>

        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-sm">
          <span className="opacity-60 font-medium shrink-0">Carrier</span>
          <span className="text-left sm:text-right font-normal">
            {carrier === "MAIL" ? "Correo" : "Retiro en persona"}
          </span>
        </div>

        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-sm">
          <span className="opacity-60 font-medium shrink-0">Entrega estimada</span>
          <span className="text-left sm:text-right font-normal">
            {estimatedDeliveryDate
              ? new Date(estimatedDeliveryDate).toLocaleDateString("es-AR")
              : "—"}
          </span>
        </div>

        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-sm">
          <span className="opacity-60 font-medium shrink-0">Fecha de entrega</span>
          <span className="text-left sm:text-right font-normal">
            {deliveryDate
              ? new Date(deliveryDate).toLocaleDateString("es-AR")
              : "—"}
          </span>
        </div>
      </div>

      <div className="p-5 border-t border-border bg-muted bg-opacity-30">
        {nextStatus ? (
          <div className="space-y-3">
            <textarea
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Comentario para este cambio de estado (obligatorio)..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-20 resize-none"
            />
            {/* El botón ocupa el 100% en mobile (w-full) y tamaño normal en escritorio (sm:w-auto) */}
            <div className="flex justify-end">
              <button
                onClick={onAdvanceStatus}
                disabled={submittingStatus || !statusComment.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-95 transition-opacity disabled:opacity-40"
              >
                {submittingStatus ? "Actualizando..." : `Avanzar a "${STATUS_LABELS[nextStatus]}"`}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm opacity-50 text-center sm:text-left">
            El envío ya fue entregado.
          </div>
        )}
      </div>
    </div>
  );
}