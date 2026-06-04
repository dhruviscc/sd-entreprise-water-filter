'use client';

import { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/modules/auth/sessionService';
import { Menu, Droplet } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (!result.user) {
          router.replace('/login');
          return;
        }
        setLoading(false);
      } catch (error) {
        router.replace('/login');
      }
    };

    checkAuth();
    interval = setInterval(checkAuth, 15000);
    return () => clearInterval(interval);
  }, [router]);

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
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

        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
