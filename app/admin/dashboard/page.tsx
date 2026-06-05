'use client';

import { useState, useEffect } from 'react';
import {
    Package,
    Cog,
    BookOpen,
    MessageSquare,
    Star,
    Clock,
    ArrowRight,
    Loader2,
    TrendingUp,
    // Users, // Not used in this file
    LayoutDashboard, // Added for dashboard icon
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    productsCount: number;
    servicesCount: number;
    blogCount: number;
    enquiriesCount: number;
    reviewsCount: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const [statsRes, enquiriesRes] = await Promise.all([
                    fetch('/admin/api/dashboard/stats'),
                    fetch('/admin/api/contact')
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (enquiriesRes.ok) {
                    const enquiries = await enquiriesRes.json();
                    setRecentEnquiries(Array.isArray(enquiries) ? enquiries.slice(0, 5) : []);
                }
            } catch (error) {
                console.error("Dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Products', value: stats?.productsCount || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/dashboard/product' },
        { label: 'Total Blogs', value: stats?.blogCount || 0, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/dashboard/blog' },
        { label: 'Total Enquiries', value: stats?.enquiriesCount || 0, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/dashboard/contact' },
        { label: 'Total Reviews', value: stats?.reviewsCount || 0, icon: Star, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/dashboard/review' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-8 bg-slate-50 min-h-screen">

          
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
                {statCards.map((card, idx) => (
                    <Link key={idx} href={card.link} className="group ">
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-sky-200 group-hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${card.bg} p-3 rounded-2xl transition-colors group-hover:scale-110 duration-500`}>
                                    <card.icon size={24} className={card.color} />
                                </div>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 mb-1">{card.value}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Bottom Section: Recent Enquiries & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Enquiries */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-sky-500 rounded-full" />
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Enquiries</h2>
                        </div>
                        <Link href="/admin/dashboard/contact" className="text-sm font-bold text-sky-600 hover:underline flex items-center gap-1 group">
                            View All <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interest</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentEnquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                                No recent enquiries found
                                            </td>
                                        </tr>
                                    ) : (
                                        recentEnquiries.map((enquiry) => (
                                            <tr key={enquiry.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 text-sm">{enquiry.full_name}</span>
                                                        <span className="text-[10px] text-slate-500">{enquiry.mobile_number}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-wider border border-sky-100/50">
                                                        {enquiry.service_interest}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                        <Clock size={12} className="text-slate-300" />
                                                        {new Date(enquiry.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${enquiry.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                enquiry.status === 'contacted' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            }`}>
                                                            {enquiry.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-purple-500 rounded-full" />
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Actions</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-3">
                        <Link href="/admin/dashboard/product" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <Package size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">Add New Product</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                        </Link>

                        <Link href="/admin/dashboard/blog" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    <BookOpen size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">Write Blog Post</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                        </Link>

                        <Link href="/admin/dashboard/review" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                                    <Star size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">Manage Reviews</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}