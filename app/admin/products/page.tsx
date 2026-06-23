"use client";

import { useState, useEffect } from "react";
import { Search, Package, Filter, ChevronDown } from "lucide-react";

interface Product {
  id: string; name: string; price: number; stock: number;
  brand: string; active: boolean; seller: string; totalSells: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
      active
        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
        : "border-[var(--border)] bg-[var(--muted)] opacity-60"
    }`}>
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [toggling, setToggling] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetch("/api/admin/sellers/products")
      .then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setProducts(data);
    })
    .catch(() => {
      setError("No se pudieron cargar los productos");
    })
    .finally(() => setLoading(false));
}, []);

  async function toggleProduct(id: string, active: boolean) {
    setToggling(id);
    try {
      const res = await fetch("/api/admin/sellers/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) =>
        prev.map((p) => p.id === id ? { ...p, active: !active } : p)
      );
    } catch {
      setError("Error al actualizar el producto");
    } finally {
      setToggling(null);
    }
  }

  const filtered = products.filter((p) => {
  const matchesSearch =
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.seller.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && p.active) ||
    (statusFilter === "inactive" && !p.active);

  return matchesSearch && matchesStatus;
});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold hidden md:block">Productos</h1>
        <p className="text-sm opacity-60 mt-1">
          Catálogo completo de zapatillas del marketplace
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            placeholder="Buscar producto, marca, vendedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-[var(--foreground)]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "active" | "inactive"
              )
            }
            className="pl-10 pr-8 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)]"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Desactivados</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-sm opacity-40">Cargando productos…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-sm opacity-40">No hay productos que coincidan.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Producto</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Vendedor</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Precio</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Stock</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Vendidos</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Estado</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--muted)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 opacity-40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs opacity-40">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm opacity-60">{p.seller}</td>
                  <td className="px-5 py-4 text-right text-sm font-semibold">{fmt(p.price)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-sm font-medium ${p.stock === 0 ? "opacity-40" : ""}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-sm">{p.totalSells}</td>
                  <td className="px-5 py-4 text-center">
                    <StatusBadge active={p.active} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleProduct(p.id, p.active)}
                      disabled={toggling === p.id}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
                        p.active
                          ? "text-red-500 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {toggling === p.id ? "…" : p.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}