"use client";

import React, { useState, useMemo, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import BubbleBackground from "@/components/BubbleBackground";
import { Search, Clock, ArrowRight, BookOpen, X, Droplets, Cylinder, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = ["All Topics", "Health", "Water Quality", "Maintenance"];

export default function BlogListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/admin/api/blog?active=true");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter blogs based on search term & category selection
  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Topics" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, blogs]);

  return (
    <div className="space-y-10 pb-16 overflow-hidden">
      {/* Banner */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-44 md:pb-20 text-slate-800 text-center border-b border-slate-200 overflow-hidden bg-white">
        <BubbleBackground />
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">


          <div className="absolute bottom-[10%] left-[10%]">
            <div className="w-6 h-6 rounded-full border border-blue-500/70 animate-bounce" />
            <div className="w-10 h-10 rounded-full border border-cyan-500/60 ml-10 mt-4 animate-pulse" />
            <div className="w-4 h-4 rounded-full bg-blue-500/30 ml-20 -mt-4 animate-bounce delay-300" />
          </div>
          <div className="absolute top-[45%] right-[5%] text-cyan-600/10 animate-float-3d">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="35" r="12" fill="currentColor" />
              <circle cx="35" cy="75" r="10" fill="currentColor" />
              <circle cx="85" cy="75" r="10" fill="currentColor" />

              <line x1="60" y1="35" x2="35" y2="75" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="35" x2="85" y2="75" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

        </div>
        <ScrollReveal variant="fadeInDown" duration={600}>
          <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 animate-float-3d">Water Health & RO Maintenance Blog</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">slate-80
              Stay updated with expert tips on water testing, filter replacements, household health, and water treatment technologies.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Filter and Search controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fadeInUp" duration={500}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${isSelected
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search input */}
            <div className="relative w-full md:max-w-xs flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs bg-white text-slate-800"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 p-0.5 rounded hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Listing Grid */}
      <section className="w-full mx-auto relative px-4 sm:px-6 lg:px-8">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <div className="absolute bottom-[6%] right-[10%] text-cyan-600/10 animate-float-3d">
            <Droplets size={80} />
          </div>

          <div className="absolute top-[15%] left-[8%] text-sky-500/10 animate-float-3d">
            <Cylinder size={100} strokeWidth={1} />
          </div>

        </div>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <ScrollReveal variant="scaleUp" duration={600}>
              <div className="bg-white rounded-xl border border-slate-100 p-16 text-center shadow-sm space-y-3">
                <span className="block text-4xl">📚</span>
                <h3 className="text-lg font-bold text-slate-800">No Articles Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  We couldn't find any blog posts matching your search. Try resetting filters or using simpler keywords.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Topics");
                  }}
                  className="mt-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post, index) => (
                <ScrollReveal
                  key={post.id}
                  variant="fadeInUp"
                  delay={(index % 3) * 120}
                  duration={700}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-slate-200 hover:border-sky-200 overflow-hidden flex flex-col justify-between h-full transition-all duration-300 group cursor-pointer">
                    {/* Blog Image */}
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-extrabold text-sky-700 uppercase tracking-wider shadow-sm">
                        {post.category}
                      </div>
                    </div>

                    {/* Content area */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4 relative z-10 bg-white">
                      <div className="space-y-3">

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                          {post.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-100">

                        <Link
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700 transition-colors bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
