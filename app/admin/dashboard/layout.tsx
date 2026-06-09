'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Menu, Droplet, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutAction();
    } catch {
      // redirect() throws internally – navigation is happening
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogoutRequest={() => setLogoutDialogOpen(true)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Topbar */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-cyan-600 shadow-md">
              <Droplet size={18} className="text-white" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-slate-800 uppercase">SD Enterprise</h1>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 ">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {logoutDialogOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setLogoutDialogOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <LogOut size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Confirm Logout</h2>
              <p className="text-sm text-slate-600">
                Are you sure you want to sign out? You will be redirected to the login page.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setLogoutDialogOpen(false)}
                  disabled={logoutLoading}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {logoutLoading ? 'Signing out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
