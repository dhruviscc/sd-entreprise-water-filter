"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { Clock, ArrowLeft, Calendar, User, Tag, ChevronRight, ArrowRight, Droplets, Cylinder, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  category: string;
  slug: string;
  status: string;
  created_at: string;
  image: string;
  summary: string;
  content: string;
  published_at?: string | null;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await fetch(`/admin/api/blog?id=${id}`);
        const postData = await postRes.json();

        if (postRes.ok) {
          setPost(postData);

          
          const relatedRes = await fetch("/admin/api/blog?active=true");
          const allBlogs = await relatedRes.json();
          if (Array.isArray(allBlogs)) {
            setRelatedPosts(allBlogs.filter((p: Blog) => p.id !== id).slice(0, 2));
          }
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const renderedContent = useMemo(() => {
    if (!post?.content) return null;

    return post.content.split("\n\n").map((block: string, idx: number) => {
      if (block.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3 tracking-wide">
            {block.replace("### ", "")}
          </h3>
        );
      }
      if (block.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4 tracking-wide pb-1.5 border-b border-slate-100">
            {block.replace("## ", "")}
          </h2>
        );
      }
      if (block.startsWith("- ")) {
        const listItems = block.split("\n").map((item: string, itemIdx: number) => {
          const rawItem = item.replace("- ", "");
          const isBold = rawItem.includes("**");

          if (isBold) {
            const parts = rawItem.split("**");
            return (
              <li key={itemIdx} className="ml-5 list-disc mb-1.5 text-sm sm:text-base text-slate-600">
                <strong className="text-slate-800">{parts[1]}</strong>
                {parts[2]}
              </li>
            );
          }
          return (
            <li key={itemIdx} className="ml-5 list-disc mb-1.5 text-sm sm:text-base text-slate-600">
              {rawItem}
            </li>
          );
        });
        return <ul key={idx} className="space-y-1.5 my-4">{listItems}</ul>;
      }

      return (
        <p key={idx} className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
          {block}
        </p>
      );
    });
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Article not found</h2>
          <p className="text-slate-500">The blog post you are looking for does not exist.</p>
        </div>
        <Link href="/blog" className="text-sky-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 overflow-hidden">
      {/* Breadcrumb and Back link */}
      <div className="flex items-center gap-3  animate-in fade-in duration-500 pt-16 ">

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[40%] right-[5%] text-blue-500/10 animate-spin-slow">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <path
                d="M90 90
      m-10 0
      a10 10 0 1 1 20 0
      a20 20 0 1 1 -40 0
      a30 30 0 1 1 60 0
      a40 40 0 1 1 -80 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
          <span>Blog</span>
          <ChevronRight className="w-3 h-3" />
          <span>{post.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 max-w-[120px] sm:max-w-xs truncate">{post.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        {/* Left Column: Full Blog Content */}
        <div className="lg:col-span-2">
          {/* Decorative background vectors */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

            <div className="absolute bottom-[-2%] right-[4%] text-cyan-600/10 animate-float-3d">
              <Droplets size={80} />
            </div>

            <div className="absolute top-[15%] left-[5%] text-sky-500/10 animate-float-3d">
              <Cylinder size={100} strokeWidth={1} />
            </div>
          </div>
          <ScrollReveal variant="fadeInLeft" duration={800}>
            <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">

              {/* Category, Date & Read Time */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1 bg-sky-50 text-sky-600 px-2.5 py-1 rounded-md uppercase tracking-wider font-bold">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </span>

              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide leading-snug">
                {post.title}
              </h1>

              {/* Hero Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 border-y border-slate-100 py-3.5">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-extrabold text-sm border border-sky-200">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400 uppercase font-semibold">Written by</span>

                </div>
              </div>

              {/* Rendered post paragraphs */}
              <div className="prose prose-slate max-w-none pt-2">
                {renderedContent}
              </div>

            </article>
          </ScrollReveal>
        </div>

        {/* Right Column: Related Articles sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <ScrollReveal variant="fadeInRight" duration={800}>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide pb-2.5 border-b border-slate-100">
                Related Articles
              </h3>
              <div className="space-y-5">
                {relatedPosts.map((rPost) => (
                  <div key={rPost.id} className="space-y-2 group">
                    <Link href={`/blog/${rPost.id}`} className="relative block aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                      <Image
                        src={rPost.image}
                        alt={rPost.title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-[1.03] transition-transform"
                      />
                    </Link>
                    <div className="space-y-1">

                      <Link
                        href={`/blog/${rPost.id}`}
                        className="block text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                      >
                        {rPost.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Call Out Banner */}
          <ScrollReveal variant="scaleUp" duration={800} delay={150}>
            <div className="bg-gradient-to-br from-blue-700 to-sky-500 rounded-2xl p-6 text-white text-center space-y-4 shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-white/20">
                Free Service Check
              </span>
              <h4 className="text-base font-black">Get Free Water Testing</h4>
              <p className="text-xs text-sky-100 leading-relaxed">
                We check TDS, pH levels, and hardness of water at your home or factory for free. Book an appointment now.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white text-blue-700 font-bold text-xs rounded hover:bg-slate-50 transition-colors"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </div>
  );
}
