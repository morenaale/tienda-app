"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  Users,
  Camera,
  User,
  Sun,
  Moon,
  Menu,
  Search,
  Bell,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { clsx } from "clsx";

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/calendar", icon: Calendar, label: "Calendario" },
  { href: "/groups", icon: Users, label: "Grupos" },
  { href: "/memories", icon: Camera, label: "Memories" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col h-screen sticky top-0 border-r border-[var(--border-color)] bg-[var(--surface)] z-40"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[var(--border-color)]">
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            animate={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-chambray to-terracotta flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-serif text-xl font-bold text-[var(--foreground)] whitespace-nowrap"
                >
                  Nido
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative overflow-hidden",
                    isActive
                      ? "text-white"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-chambray to-chambray-dark rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={20} className="relative z-10 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[var(--border-color)] space-y-1">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {resolvedTheme === "dark" ? "Modo claro" : "Modo oscuro"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <Menu size={20} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Colapsar
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--glass-border)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={clsx(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative",
                  isActive ? "text-chambray" : "text-[var(--foreground)] opacity-60"
                )}
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute -top-1 w-8 h-1 bg-chambray rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-chambray to-terracotta flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[var(--surface-hover)] rounded-xl px-3 py-2 w-64">
          <Search size={16} className="text-[var(--foreground)] opacity-50" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm flex-1 text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-40"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors relative">
          <Bell size={20} className="text-[var(--foreground)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full" />
        </button>
        <button
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          className="md:hidden p-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
        >
          {resolvedTheme === "dark" ? (
            <Sun size={20} className="text-[var(--foreground)]" />
          ) : (
            <Moon size={20} className="text-[var(--foreground)]" />
          )}
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-chambray flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
      </div>
    </header>
  );
}
