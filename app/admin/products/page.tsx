"use client";

import { useState } from "react";
import { Search, Package, ChevronDown, Filter, Plus } from "lucide-react";

const mockProducts = [
  { id: "PROD-001", name: "Nike Air Force 1 White", price: 120000, stock: 45, sales: 128, seller: "Urban Sneakers", status: "ACTIVE" },
  { id: "PROD-002", name: "Adidas Samba OG Black", price: 95000, stock: 32, sales: 94, seller: "Shoe Haven", status: "ACTIVE" },
  { id: "PROD-003", name: "New Balance 550 White", price: 110000, stock: 18, sales: 67, seller: "Urban Sneakers", status: "ACTIVE" },
  { id: "PROD-004", name: "Air Jordan 1 High OG", price: 180000, stock: 0, sales: 156, seller: "Kick Lab", status: "INACTIVE" },
  { id: "PROD-005", name: "Puma Suede Classic", price: 75000, stock: 28, sales: 43, seller: "Shoe Haven", status: "ACTIVE" },
  { id: "PROD-006", name: "Converse Chuck Taylor Hi", price: 65000, stock: 52, sales: 89, seller: "Kick Lab", status: "ACTIVE" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
      status === "ACTIVE"
        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
        : "border-[var(--border)] bg-[var(--muted)]"
    }`}>
      {status}
    </span>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Productos</h1>
          <p className="text-sm opacity-60 mt-1">
            Catálogo completo de zapatillas del marketplace
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-lg hover:opacity-80 transition-opacity">
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-[var(--foreground)]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm opacity-70 hover:opacity-100 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
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
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-[var(--muted)] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 opacity-40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs opacity-40">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm opacity-60">{product.seller}</td>
                <td className="px-5 py-4 text-right text-sm font-semibold">{formatCurrency(product.price)}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-sm font-medium ${product.stock === 0 ? "opacity-40" : ""}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-sm">{product.sales}</td>
                <td className="px-5 py-4 text-center">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="px-3 py-1.5 text-xs font-medium hover:bg-[var(--muted)] rounded-lg transition-colors">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
