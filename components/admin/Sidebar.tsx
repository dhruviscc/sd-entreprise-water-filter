"use client";

import {
  Menu,
  BarChart3,
  Users,

  LogOut,
  Shield,
  UserCog,
  Building2,
  Package,
  Receipt,
  ShoppingCart,
  Inbox,
  DollarSign,
  ChevronLeft,
  List,
  Banknote,
  Droplet,
  Cog,
  BookOpen,
} from "lucide-react";


import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from '@/modules/auth/sessionService';




type UserProfile = {
  name?: string;
  role?: string;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          return;
        }

        setUserProfile({
          name: user.name || user.email?.split('@')[0],
          role: user.role || user.user_metadata?.role || 'Guest',
        });
        const role = (user.role || user.user_metadata?.role || '').toLowerCase();
        setIsAdmin(["admin", "manager"].includes(role));
      } catch (error) {
        console.error("Sidebar: Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }

    setIsLogoutDialogOpen(false);
    setShowLogout(false);
    router.push("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", Icon: BarChart3, href: "/admin/dashboard" },
    { id: "hero-slider", label: "Hero Slider", Icon: List, href: "/admin/dashboard/hero-slider" },
    { id: "services", label: "Services", Icon: Cog, href: "/admin/dashboard/services" },
    { id: "product", label: "Products", Icon: Package, href: "/admin/dashboard/product" },
    { id: "blog", label: "Blog", Icon: BookOpen, href: "/admin/dashboard/blog" },
    { id: "users", label: "Users", Icon: Users, href: "/admin/dashboard/users" },



  ];

  return (
    <aside
      className={`sticky top-0 rounded-r-4xl bg-gradient-to-br from-sky-900 via-sky-900 to-slate-900 text-white flex h-screen flex-col border-r border-slate-200 shadow-xl transition-all duration-300 ease-in-out ${collapsed ? "w-20 overflow-visible" : "w-72 overflow-y-auto"
        }`}
    >
      {/* ===== HEADER ===== */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-2">
        <div className="flex items-center gap- 3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg  bg-gradient-to-br from-sky-600 to-cyan-600 shadow-lg shadow-sky-500/20">
            <Droplet size={22} className="text-white" />
          </div>

          {!collapsed && (
            <div className="transition-all duration-300 ">
              <h2 className="truncate text-lg font-extrabold tracking-tight text-white pl-3">
                SD ENTERPRISE
              </h2>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 pl-3">
                Admin Dashboard
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-9 items-center m-1 justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav
        className={`flex-1 space-y-2  px-3 py-6 no-scrollbar ${collapsed ? "overflow-visible" : ""
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
                className={`relative flex items-center gap-3 rounded-xl border-b-3 px-4 py-4 transition-all duration-200 ${isActive
                  ? "border-cyan-400 bg-white/5 text-cyan-500"
                  : "border-transparent text-slate-100 hover:border-cyan-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <item.Icon
                    size={20}
                    className={`shrink-0 transition-colors duration-300 ${isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-white"
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
        {/* PROFILE */}
        <div
          onClick={() => setShowLogout(!showLogout)}
          className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2 transition-all duration-300 hover:bg-white/10 ${collapsed ? "justify-center" : ""
            }`}
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-sky-500/30">
            {userProfile?.name?.charAt(0).toUpperCase() || "U"}
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

          {/* Tooltip */}
          {collapsed && (
            <div className="pointer-events-none absolute left-full top-1/2 z-[999] ml-4 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-2xl transition-all duration-200 group-hover:opacity-100">
              Profile

              <div className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-white/10 bg-slate-900" />
            </div>
          )}
        </div>

        {/* ===== LOGOUT BUTTON ===== */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showLogout ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
        >
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className={`flex w-full items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:text-red-300 ${collapsed ? "justify-center" : ""
              }`}
          >
            <LogOut size={18} className="shrink-0" />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ===== LOGOUT MODAL ===== */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/10 "
            onClick={() => setIsLogoutDialogOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
                <LogOut size={34} strokeWidth={2.5} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900">
                Logout Confirmation
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Are you sure you want to logout from your account?
                You’ll need to sign in again to access the admin dashboard.
              </p>

              {/* Actions */}
              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:from-red-600 hover:to-rose-600"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
