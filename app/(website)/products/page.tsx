"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useEnquiry } from "../context/EnquiryContext";

import { Check, Star, Search, Filter, X, SlidersHorizontal, GlassWater, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BubbleBackground from "@/components/BubbleBackground";
import ScrollReveal from "@/components/ScrollReveal";

type ColourOption = {
  name: string;
  colorHex: string;
};

export default function ProductsPage() {
  const { openEnquiry } = useEnquiry();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedColour, setSelectedColour] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeVariants, setActiveVariants] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/admin/api/product"),
          fetch("/admin/api/product?type=categories")
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodRes.ok) setProducts(prodData.filter((p: any) => p.is_active !== false));
        if (catRes.ok) setCategories(["All Categories", ...catData.map((c: any) => c.name)]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (!cat) return;
      const decodedCategory = decodeURIComponent(cat);
      if (decodedCategory === "All Categories") {
        setSelectedCategory("All Categories");
        return;
      }
      if (categories.includes(decodedCategory)) {
        setSelectedCategory(decodedCategory);
      }
    }
  }, [categories]);

  const colourOptions = useMemo<ColourOption[]>(() => {
    const productsForCategory = products.filter((product) => (
      selectedCategory === "All Categories" || product.product_categories?.name === selectedCategory
    ));

    const options = new Map<string, ColourOption>();
    productsForCategory.forEach((product: any) => {
      product.product_variants?.forEach((variant: any) => {
        if (variant.color_hex && !options.has(variant.color_hex)) {
          options.set(variant.color_hex, {
            name: variant.name,
            colorHex: variant.color_hex,
          });
        }
      });
    });

    return Array.from(options.values());
  }, [selectedCategory, products]);

  const activeSelectedColour = (mounted && colourOptions.some((option) => option.colorHex === selectedColour))
    ? selectedColour
    : "";

  // Filter products based on search, category, and colour
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.product_categories?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.product_categories?.name === selectedCategory;

      const matchesColour =
        !activeSelectedColour ||
        product.product_variants?.some((variant: any) => variant.color_hex === activeSelectedColour);

      return matchesSearch && matchesCategory && matchesColour;
    });
  }, [searchTerm, selectedCategory, activeSelectedColour, products]);

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedColour("");
  };

  if (loading || !mounted) return <div className="min-h-screen flex items-center justify-center">Loading Products...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 overflow-hidden">
      {/* Header Banner */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-25 sm:pb-16  md:pb-20 text-slate-800 text-center border-b border-slate-200 overflow-hidden bg-white">
        <BubbleBackground />
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[15%] right-[10%] animate-float-3d ">
            <div className="w-25 h-25 border border-blue-500/60 rounded-full" />
            <div className="absolute inset-3 border border-blue-500/40 rounded-full" />
            <div className="absolute inset-6 border border-blue-500/20 rounded-full" />
          </div>
          <div className="absolute top-[20%] left-[5%] text-cyan-600/10 animate-float-3d">
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
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 animate-float-3d">Water Treatment Products Catalog</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
              Explore our state-of-the-art RO water purifiers, softeners, alkaline ionizers, gas geysers, and genuine accessories.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Search & Mobile Filter Toggle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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

        <ScrollReveal variant="fadeInUp" duration={500}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-xl shadow-sky-900/5">
            {/* Search bar */}
            <div className="relative w-full sm:max-w-md flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white text-slate-800 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 p-1 rounded hover:bg-slate-200 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex lg:hidden w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              <span>Filters ({activeSelectedColour ? `${selectedCategory}, Colour` : selectedCategory})</span>
            </button>

            <div className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 ">

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[-5%] left-[8%] text-cyan-600/10 animate-float-3d">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <path
                d="M75 15
      L120 35
      V75
      C120 110 95 125 75 135
      C55 125 30 110 30 75
      V35 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M75 45
      C55 65 55 95 75 115
      C95 95 95 65 75 45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

        </div>

        {/* Left Side: Desktop Sidebar Category Filter */}
        <div className="hidden lg:block space-y-4">
          <ScrollReveal variant="fadeInLeft" duration={700}>
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 shadow-xl shadow-sky-900/5 space-y-4 sticky top-24">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Filter className="w-4 h-4 text-sky-500" />
                <span>Categories</span>
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedColour("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${isSelected
                        ? "bg-sky-500 text-white shadow"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {colourOptions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Filter className="w-4 h-4 text-sky-500" />
                      <span>Colours</span>
                    </h3>
                    {activeSelectedColour && (
                      <button
                        onClick={() => setSelectedColour("")}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colourOptions.map((option) => {
                      const isSelected = activeSelectedColour === option.colorHex;
                      return (
                        <button
                          key={option.colorHex}
                          type="button"
                          title={option.name}
                          aria-label={`Filter by ${option.name}`}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedColour((current) => current === option.colorHex ? "" : option.colorHex)}
                          className={`relative h-7 w-7 rounded-md border shadow-sm transition-all cursor-pointer ${isSelected
                            ? "border-sky-500 ring-2 ring-sky-500 ring-offset-2"
                            : "border-slate-200 hover:scale-105 hover:border-slate-300"
                            }`}
                          style={{ backgroundColor: option.colorHex }}
                        >
                          {isSelected && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side: Products Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <ScrollReveal variant="scaleUp" duration={600}>
              <div className="bg-white rounded-xl border border-slate-100 p-16 text-center shadow-sm space-y-3">
                <span className="block text-4xl">🔍</span>
                <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  We couldn&apos;t find any products matching &quot;{searchTerm}&quot; in &quot;{selectedCategory}&quot;. Try clearing your filters or changing search keywords.
                </p>
                <button
                  onClick={() => {
                    resetAllFilters();
                  }}
                  className="mt-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                const activeIndex = activeVariants[product.id] || 0;
                const selectedColourVariantIndex = activeSelectedColour
                  ? product.product_variants?.findIndex((variant: any) => variant.color_hex === activeSelectedColour)
                  : -1;
                const visibleActiveIndex = selectedColourVariantIndex >= 0 ? selectedColourVariantIndex : activeIndex;
                const currentImages = product.product_variants?.[visibleActiveIndex]?.images || [];
                const defaultImages = product.product_variants?.[0]?.images || [];
                const currentImage = currentImages[0] || defaultImages[0] || null;

                return (
                  <ScrollReveal
                    key={product.id}
                    variant="fadeInUp"
                    delay={(index % 3) * 100}
                    duration={600}
                  >
                    <div className="relative bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 overflow-hidden group flex flex-col justify-between h-full hover:shadow-[0_20px_50px_rgba(14,165,233,0.12)] hover:border-sky-200 hover:-translate-y-2">
                      {/* Image container */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-sky-50/30 border-b border-slate-100 overflow-hidden">
                        {currentImage ? <Image
                          src={currentImage}
                          alt={product.name}
                          fill
                          className="object-contain p-4 object-center group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        /> : <div className="flex items-center justify-center w-full h-full text-slate-300"><ImageIcon size={32} /></div>}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[9px] font-extrabold text-white uppercase tracking-widest shadow-sm transition-all duration-300 group-hover:bg-sky-600">
                          {product.product_categories?.name}
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-4 relative">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1.5">
                            <h3 className="text-sm font-bold text-slate-800 tracking-wide line-clamp-1 group-hover:text-sky-500 transition-colors">
                              {product.name}
                            </h3>
                            {/* Color circles directly on the card */}
                            {product.product_variants && product.product_variants.length > 1 && (
                              <div className="flex gap-1 items-center">
                                {product.product_variants.map((variant: any, vIdx: number) => {
                                  const isActive = visibleActiveIndex === vIdx;
                                  return (
                                    <button
                                      key={vIdx}
                                      title={variant.name}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveVariants((prev) => ({ ...prev, [product.id]: vIdx }));
                                      }}
                                      className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${isActive ? "ring-1 ring-sky-500 scale-110 border-white" : "border-slate-300 hover:scale-105"
                                        }`}
                                      style={{ backgroundColor: variant.color_hex }}
                                    />
                                  );
                                })}
                              </div>
                            )}

                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/products/${product.id}?variant=${visibleActiveIndex}`}
                              className="flex items-center justify-center py-2.5 bg-slate-50 hover:bg-sky-50 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 transition-all duration-300 border border-slate-100 hover:border-sky-100"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => openEnquiry(product.name, "product")}
                              className="flex items-center justify-center py-3 rounded-2xl text-xs font-bold bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 hover:shadow-sky-300 cursor-pointer"
                            >
                              Enquire
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Gradient Line (Unique Interaction Glow) */}
                      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-500 group-hover:w-full" />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>

      </section>

      {/* Mobile Filters Drawer modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 relative flex justify-end bg-black/50 backdrop-blur-sm lg:hidden transition-all duration-300">


          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-sky-500" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedColour("");
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${isSelected
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {colourOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Colour
                    </h4>
                    {activeSelectedColour && (
                      <button
                        onClick={() => setSelectedColour("")}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colourOptions.map((option) => {
                      const isSelected = activeSelectedColour === option.colorHex;
                      return (
                        <button
                          key={option.colorHex}
                          type="button"
                          title={option.name}
                          aria-label={`Filter by ${option.name}`}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedColour((current) => current === option.colorHex ? "" : option.colorHex)}
                          className={`relative h-8 w-8 rounded-md border shadow-sm transition-all cursor-pointer ${isSelected
                            ? "border-sky-500 ring-2 ring-sky-500 ring-offset-2"
                            : "border-slate-200 hover:scale-105 hover:border-slate-300"
                            }`}
                          style={{ backgroundColor: option.colorHex }}
                        >
                          {isSelected && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                resetAllFilters();
                setShowMobileFilters(false);
              }}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 text-center cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
