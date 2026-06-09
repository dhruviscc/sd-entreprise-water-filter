"use client";

import {
  BarChart3,
  Users,
  LogOut,
  Package,
  Inbox,
  ChevronLeft,
  List,
  Droplet,
  BookOpen,
  MessageCircle,
  Star,
  Menu,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/client";

type UserProfile = {
  name?: string;
  role?: string;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onLogoutRequest,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
  onLogoutRequest?: () => void;
}) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const meta = data.user.user_metadata;
        setUserProfile({
          name: meta?.name || meta?.full_name || data.user.email?.split("@")[0] || "Admin",
          role: meta?.role || "Administrator",
        });
      }
    });
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", Icon: BarChart3, href: "/admin/dashboard" },
    { id: "hero-slider", label: "Hero Slider", Icon: List, href: "/admin/dashboard/hero-slider" },
    { id: "product", label: "Products", Icon: Package, href: "/admin/dashboard/product" },
    { id: "blog", label: "Blog", Icon: BookOpen, href: "/admin/dashboard/blog" },
    { id: "faq", label: "FAQ", Icon: MessageCircle, href: "/admin/dashboard/faq" },
    { id: "review", label: "Review", Icon: Star, href: "/admin/dashboard/review" },
    { id: "contact", label: "Contact", Icon: Inbox, href: "/admin/dashboard/contact" },
    
    { id: "users", label: "Users", Icon: Users, href: "/admin/dashboard/users" },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-[100] bg-slate-950/50 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen?.(false)}
      />

      <aside
        className={`fixed lg:sticky top-0 left-0 z-[110] rounded-r-4xl bg-gradient-to-br from-sky-900 via-sky-900 to-slate-900 text-white flex h-screen flex-col border-r border-slate-200 shadow-xl transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-20 overflow-visible" : "w-72 overflow-y-auto"}`}
      >
        {/* ===== HEADER ===== */}
        <div
          className={`h-16 border-b border-white/10 flex items-center ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-cyan-600 shadow-lg shadow-sky-500/20">
                <Droplet size={22} className="text-white" />
              </div>
              <div className="transition-all duration-300">
                <h2 className="truncate text-lg font-extrabold tracking-tight text-white">
                  SD ENTERPRISE
                </h2>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
                  Admin Dashboard
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <Droplet size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav
          className={`flex-1 space-y-2 px-3 py-6 no-scrollbar ${
            collapsed ? "overflow-visible" : ""
          }`}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <div key={item.id} className="group relative">
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-xl border-b-3 px-4 py-4 transition-all duration-200 ${
                    isActive
                      ? "border-cyan-400 bg-white/5 text-cyan-500"
                      : "border-transparent text-slate-100 hover:border-cyan-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <item.Icon
                      size={20}
                      className={`shrink-0 transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate text-sm font-semibold tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>

                {/* ===== TOOLTIP ===== */}
                {collapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#18bcf3] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    {item.label}
                    <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#18bcf3]" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ===== USER SECTION ===== */}
        <div className="border-t border-white/10 p-3">
          {/* ===== LOGOUT BUTTON ===== */}
          <div
            className={`overflow-hidden transition-all pb-4 duration-300 ease-in-out ${
              showLogout ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <button
              onClick={() => (onLogoutRequest ? onLogoutRequest() : undefined)}
              className={`flex w-full items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:text-red-300 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={18} className="shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>

          {/* PROFILE */}
          <div
            onClick={() => setShowLogout(!showLogout)}
            className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2 transition-all duration-300 hover:bg-white/10 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-sky-500/30">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-white">
                  {userProfile?.name || "Loading..."}
                </h4>
                <p className="truncate text-xs font-medium text-sky-300">
                  {userProfile?.role || "Administrator"}
                </p>
              </div>
            )}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 z-[999] ml-4 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-2xl transition-all duration-200 group-hover:opacity-100">
                {userProfile?.name || "Profile"}
                <div className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-white/10 bg-slate-900" />
              </div>
            )}
          </div>

        
        </div>
      </aside>
    </>
  );
}
