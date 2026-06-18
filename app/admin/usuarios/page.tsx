"use client";

import { useEffect, useState } from "react";
import { Search, Users, ChevronDown, Filter } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  _count?: { products: number; orders: number };
  createdAt?: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        const list = Array.isArray(d) ? d : d.sellers ?? d.users ?? [];
        setUsers(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-6 text-center max-w-md">
          <p className="font-medium mb-1">Error al cargar usuarios</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Usuarios</h1>
        <p className="text-sm opacity-60 mt-1">
          Gestiona los usuarios registrados en la plataforma
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            placeholder="Buscar usuario..."
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

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <Users className="w-12 h-12 opacity-30 mx-auto mb-3" />
          <p className="font-medium opacity-60">
            {search
              ? "No se encontraron usuarios con ese criterio"
              : "No hay usuarios registrados"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                  Usuario
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                  Email
                </th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                  Productos
                </th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                  Ventas
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] text-xs font-bold shrink-0">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "?"}
                      </div>
                      <span className="text-sm font-medium">
                        {user.name || "Sin nombre"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm opacity-60">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-medium">
                    {user._count?.products ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-medium">
                    {user._count?.orders ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-3 py-1.5 text-xs font-medium hover:bg-[var(--muted)] rounded-lg transition-colors">
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
