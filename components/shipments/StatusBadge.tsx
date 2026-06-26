export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  PREPARING:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  IN_TRANSIT:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  DELIVERED:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
};

export function StatusBadge({ status }: { status: string }) {
  const colorClass =
    STATUS_COLORS[status] ??
    "bg-muted border-border text-[var(--foreground)]";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${colorClass}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}