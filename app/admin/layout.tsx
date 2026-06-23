//app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { AlertTriangle, ArrowLeftRight, CreditCard, Truck, PanelLeft } from "lucide-react";
import { useTheme } from "../../components/theme-provider";
import {
  Users,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Shield,
  MessageSquare,
  Flag,
} from "lucide-react";

const navItems = [
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/resenas", label: "Reseñas", icon: MessageSquare },
  { href: "/admin/reportes", label: "Reportes", icon: Flag },
  { href: "/admin/envios", label: "Envíos", icon: Truck },
  { href: "/admin/payments/transferencias", label: "Transferencias", icon: ArrowLeftRight },
  { href: "/admin/payments/disputas", label: "Disputas", icon: AlertTriangle },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  const currentLabel = navItems.find((i) => i.href === pathname)?.label ?? "Admin";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-[var(--foreground)] text-[var(--background)] flex flex-col transition-all duration-200 shrink-0
        fixed inset-y-0 left-0 z-40 md:relative md:z-auto
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--background)] shrink-0">
            <Shield className="w-4 h-4 text-[var(--foreground)]" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold leading-tight">Super Admin</h1>
              <p className="text-[10px] opacity-60 leading-tight">
                Panel de control
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
                    ? "bg-[var(--background)] text-[var(--foreground)]"
                    : "opacity-70 hover:opacity-100 hover:bg-[var(--sidebar-hover)]"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-[var(--sidebar-border)]">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm opacity-70 hover:opacity-100 hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer"
            title={collapsed ? (theme === "dark" ? "Modo claro" : "Modo oscuro") : undefined}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            {!collapsed && (
              <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
            )}
          </button>
        </div>

        <div className="px-2 py-3 border-t border-[var(--sidebar-border)]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full px-3 py-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="px-2 py-3 border-t border-[var(--sidebar-border)]">
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm opacity-70 hover:opacity-100 hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="fixed top-0 left-0 right-0 z-20 md:hidden flex items-center gap-3 h-14 px-4 bg-[var(--background)] border-b border-[var(--border)] shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-[var(--muted)] transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            <PanelLeft className="w-5 h-5 text-[var(--foreground)]" />
          </button>
          <span className="text-sm font-medium opacity-80">{currentLabel}</span>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-14 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
