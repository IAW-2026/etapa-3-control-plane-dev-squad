"use client";

import { useEffect, useState } from "react";
import { Search, Store, ChevronDown, Filter } from "lucide-react";

interface Seller {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  _count?: { products: number; orders: number };
  createdAt?: string;
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        const list = Array.isArray(d) ? d : d.sellers ?? d.users ?? [];
        setSellers(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sellers.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-medium mb-1">
            Error al cargar vendedores
          </p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Vendedores</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestiona los vendedores registrados en la plataforma
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar vendedor..."
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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {search
              ? "No se encontraron vendedores con ese criterio"
              : "No hay vendedores registrados"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                  Vendedor
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                  Email
                </th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                  Productos
                </th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                  Ventas
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((seller) => (
                <tr
                  key={seller.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {seller.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "?"}
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {seller.name || "Sin nombre"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {seller.email}
                  </td>
                  <td className="px-5 py-4 text-center text-sm text-slate-700 font-medium">
                    {seller._count?.products ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-center text-sm text-slate-700 font-medium">
                    {seller._count?.orders ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
