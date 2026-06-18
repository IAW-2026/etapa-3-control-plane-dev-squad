"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shirt,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sellers", label: "Vendedores", icon: Store },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/products", label: "Productos", icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-slate-900 text-white flex flex-col transition-all duration-200 shrink-0`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 shrink-0">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold leading-tight">ZAPASYA</h1>
              <p className="text-[10px] text-slate-400 leading-tight">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-slate-700">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="px-2 py-3 border-t border-slate-700">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
