export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted border border-border">
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}