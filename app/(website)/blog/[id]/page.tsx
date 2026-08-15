"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, Loader2, AlertTriangle, ArrowRight, Tag } from "lucide-react";

interface Blog {
    id: string;
    title: string;
    category: string;
    content: string;
    image: string;
    created_at: string;
    published_at?: string | null;
    summary: string;
}

export default function BlogDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchBlogDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/admin/api/blog?id=${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch blog post. It may not exist or is not published.");
                }
                const data = await res.json();
                setBlog(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        const fetchRecentBlogs = async () => {
            try {
                const res = await fetch('/admin/api/blog?active=true');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter out the current blog and take the 3 most recent
                    setRecentBlogs(data.filter(p => p.id !== id).slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching recent blogs:", error);
            }
        };

        fetchBlogDetails();
        fetchRecentBlogs();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-xl border border-slate-100 p-12 shadow-sm space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-800">Oops! Article Not Found</h2>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">{error || "The blog post you are looking for could not be found."}</p>
                    <Link href="/blog" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const displayDate = blog.published_at || blog.created_at;

    const formattedDate = new Date(displayDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-semibold">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
                    </Link>
                    <span className="text-slate-300">|</span>
                    <Link href="/blog" className="text-slate-400 hover:text-sky-600">Blog</Link>
                    <span className="text-slate-300">›</span>
                    <span className="max-w-28 truncate text-slate-400 sm:max-w-44">{blog.category}</span>
                    <span className="text-slate-300">›</span>
                    <span className="max-w-44 truncate text-slate-700 sm:max-w-72">{blog.title}</span>
                </nav>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_285px] xl:grid-cols-[minmax(0,1fr)_300px]">
                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="p-5 sm:p-7 lg:p-8">
                            <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wide">
                                <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-1 text-sky-600">
                                    <Tag className="h-3 w-3" /> {blog.category}
                                </span>
                                <span className="inline-flex items-center gap-1 text-slate-400">
                                    <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                                </span>
                            </div>

                            <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-slate-800 sm:text-3xl lg:text-[32px]">
                                {blog.title}
                            </h1>

                            <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 sm:mt-6">
                                <Image src={blog.image} alt={blog.title} fill unoptimized priority className="object-cover" />
                            </div>

                            {blog.summary && <p className="mt-6 text-sm leading-6 text-slate-600 sm:text-[15px]">{blog.summary}</p>}

                            <div className="mt-5 border-t border-slate-100 pt-5">
                                <div
                                    className="blog-article-content text-sm leading-6 text-slate-600 sm:text-[15px]"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>
                        </div>
                    </article>

                    <aside className="space-y-5 lg:sticky lg:top-24">
                        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <h2 className="border-b border-slate-200 pb-3 text-base font-bold text-slate-800">Related Articles</h2>
                            <div className="mt-4 space-y-4">
                                {recentBlogs.length > 0 ? recentBlogs.slice(0, 2).map((post) => (
                                    <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                                        <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-slate-100">
                                            <Image src={post.image} alt={post.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <h3 className="mt-2 text-xs font-bold leading-tight text-slate-700 transition-colors group-hover:text-sky-600">{post.title}</h3>
                                    </Link>
                                )) : <p className="text-sm text-slate-500">No related articles available.</p>}
                            </div>
                        </section>

                        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 px-5 py-6 text-center text-white shadow-md">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                            <p className="relative inline-block rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">Free service check</p>
                            <h2 className="relative mt-1 text-base font-bold">Get Free Water Testing</h2>
                            <p className="relative mx-auto mt-3 max-w-xs text-[11px] leading-relaxed text-blue-50">We check TDS, pH levels, and hardness of water at your home or factory for free.</p>
                            <Link href="/contact" className="relative mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-2 text-[11px] font-bold text-blue-600 transition hover:bg-blue-50">
                                Book Appointment <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
