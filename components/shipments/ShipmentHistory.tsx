import { StatusBadge } from "./StatusBadge";

type TrackingItem = {
  id: number;
  status: string;
  description: string | null;
  location: string;
  timestamp: string;
};

export function ShipmentHistory({ tracking }: { tracking: TrackingItem[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="text-sm font-semibold px-5 py-4 border-b border-border">
        Historial
      </div>
      <div className="divide-y divide-border">
        {tracking.length === 0 ? (
          <div className="px-5 py-6 text-sm opacity-40 text-center">Sin movimientos todavía.</div>
        ) : (
          [...tracking].reverse().map((t) => (
            <div key={t.id} className="px-5 py-3 flex items-start justify-between gap-4">
              <div>
                <StatusBadge status={t.status} />
                {t.description && <p className="text-sm mt-1.5">{t.description}</p>}
              </div>
              <span className="text-xs opacity-50 whitespace-nowrap">
                {new Date(t.timestamp).toLocaleString("es-AR")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}