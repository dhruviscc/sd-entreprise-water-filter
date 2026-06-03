"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { getCurrentUser } from '@/modules/auth/sessionService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          router.push("/admin/dashboard");
        }
      } catch {
        // not signed in
      }
    };
    checkSession();
  }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  from-blue-50 to-indigo-100 p-4">
            <div className="text-center max-w-md">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to SD Enterprise</h1>
                <p className="text-xl text-gray-600 mb-8">Manage your business efficiently</p>
                <div className="space-y-4">
                    <Link href="/login">
                        <button className="w-64">Sign in</button>
                    </Link>

                </div>
            </div>
        </div>
    );


}
