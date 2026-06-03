'use client';

import { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/modules/auth/sessionService';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
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
        <div className="layout">

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />


            {/* Main content area with padding for topbar/sidebar */}
            <main className="content" style={{ paddingLeft: '20px' }}>
                {children}
            </main>
        </div>
    );
}
