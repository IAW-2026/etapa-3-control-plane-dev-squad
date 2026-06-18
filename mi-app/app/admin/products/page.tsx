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
          <h1 className="text-xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Catálogo completo de zapatillas del marketplace
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Producto</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Vendedor</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Precio</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Stock</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Vendidos</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{product.seller}</td>
                <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : "text-slate-700"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-sm text-slate-700">{product.sales}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    product.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
