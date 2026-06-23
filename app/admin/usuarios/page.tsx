"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import SearchInput from "../../../components/SearchInput";
import FilterSelect from "../../../components/FilterSelect";
import Pagination from "../../../components/Pagination";

const PER_PAGE = 10;

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  status?: string;
  _count?: { products: number; orders: number };
  createdAt?: string;
}

const roleOptions = [
  { value: "", label: "Todos" },
  { value: "seller", label: "Vendedor" },
  { value: "user", label: "Usuario" },
];

const roleBadge: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  seller: "bg-blue-100 text-blue-700 border-blue-200",
  user: "bg-green-100 text-green-700 border-green-200",
};

const statusBadge: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  SUSPENDED: "bg-red-100 text-red-700 border-red-200",
};

function UsuariosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== "page") next.delete("page");
    router.replace(`/admin/usuarios?${next.toString()}`, { scroll: false });
  }

  async function handleToggleStatus(user: User) {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setTogglingId(user.id);
    try {
      const res = await fetch(
        `/api/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, role: user.role }),
        }
      );
      if (!res.ok) throw new Error("Error al cambiar estado");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch {
      alert("Error al cambiar el estado del usuario");
    } finally {
      setTogglingId(null);
    }
  }

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        const list = Array.isArray(d) ? d : d.users ?? d.data ?? d.sellers ?? [];
        setUsers(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      !roleFilter ||
      u.role?.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

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
        <SearchInput
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(v) => setParam("search", v)}
        />
        <FilterSelect
          value={roleFilter}
          onChange={(v) => setParam("role", v)}
          options={roleOptions}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <Users className="w-12 h-12 opacity-30 mx-auto mb-3" />
          <p className="font-medium opacity-60">
            {search || roleFilter
              ? "No se encontraron usuarios con ese criterio"
              : "No hay usuarios registrados"}
          </p>
        </div>
      ) : (
        <>
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
                    Rol
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Productos
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Ventas
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginated.map((user) => (
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
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          roleBadge[user.role?.toLowerCase()] ||
                          "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {user.role || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-medium">
                      {user._count?.products ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-medium">
                      {user._count?.orders ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={togglingId === user.id}
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer transition-opacity disabled:opacity-50 ${
                          statusBadge[user.status || "ACTIVE"] ||
                          "bg-green-100 text-green-700 border-green-200"
                        }`}
                      >
                        {togglingId === user.id
                          ? "..."
                          : user.status || "ACTIVE"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={(p) => setParam("page", String(p))}
          />
        </>
      )}
    </div>
  );
}

export default function UsuariosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <UsuariosContent />
    </Suspense>
  );
}
