"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEnquiry } from "../../context/EnquiryContext";

import ScrollReveal from "@/components/ScrollReveal";
import { MessageCircle, ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, Droplets, Cylinder, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { openEnquiry } = useEnquiry();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    async function fetchProductData() {
      try {

        const res = await fetch(`/admin/api/product?id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Product not found");

        setProduct(data);

        // Fetch all products to filter related ones by category
        const allRes = await fetch("/admin/api/product");
        const allData = await allRes.json();
        if (allRes.ok) {
          setRelatedProducts(allData.filter((p: any) => 
            p.category_id === data.category_id && p.id !== data.id
          ));
        }

        const defaultIdx = data.product_variants?.findIndex((v: any) => v.is_default);
        if (defaultIdx !== -1) setActiveVariantIndex(defaultIdx);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProductData();
  }, [id]);

  // Sync initial variant index from query string if available
  useEffect(() => {
    if (mounted && product) {
      const params = new URLSearchParams(window.location.search);
      const varParam = params.get("variant");
      if (varParam) {
        const parsed = parseInt(varParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < (product.product_variants?.length || 0)) {
          setActiveVariantIndex(parsed);
        }
      }
    }
  }, [mounted, product]);

  // Calculate current image array based on active variant
  const currentImages = useMemo(() => {
    if (!product) return [];

    const selectedImages = product.product_variants?.[activeVariantIndex]?.images;
    if (Array.isArray(selectedImages) && selectedImages.length > 0) {
      return selectedImages;
    }

    const anyVariantWithImages = product.product_variants?.find((v: any) => v.images?.length > 0);
    return anyVariantWithImages?.images || [];
  }, [product, activeVariantIndex]);

  // Safely fallback active image index if currentImages array length changes
  const safeActiveImageIndex = Math.min(activeImageIndex, currentImages.length - 1);
  const currentMainImage = currentImages[safeActiveImageIndex] || null;

  if (loading || !mounted) return <div className="min-h-screen flex items-center justify-center">Loading Product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 overflow-hidden pt-10">
        {/* Breadcrumb & Back button */}
        <div className="flex items-center gap-3 animate-in fade-in duration-500">
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>{product.product_categories?.name || product.category || "Product"}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 max-w-[150px] truncate">{product.name}</span>
          </div>
        </div>

        {/* Main product presentation */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] right-[10%] text-sky-500/10 animate-float-3d">
              <svg width="150" height="150" viewBox="0 0 180 180">
                <polygon
                  points="90,20 140,50 140,110 90,140 40,110 40,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="90" cy="20" r="5" fill="currentColor" />
                <circle cx="140" cy="50" r="5" fill="currentColor" />
                <circle cx="140" cy="110" r="5" fill="currentColor" />
                <circle cx="90" cy="140" r="5" fill="currentColor" />
                <circle cx="40" cy="110" r="5" fill="currentColor" />
                <circle cx="40" cy="50" r="5" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute bottom-[20%] left-[10%] text-cyan-600/10 animate-float-3d">
              <Droplets className="w-20 h-20 sm:w-32 sm:h-32 lg:w-30 lg:h-40" strokeWidth={1.2} />
            </div>
            <div className="absolute bottom-[-5%] right-[5%] text-sky-500/10 animate-float-3d">
              <Cylinder size={100} strokeWidth={1} />
            </div>
          </div>
          {/* Left Column: Multi-Image Gallery & Variant Switch */}
          <ScrollReveal variant="fadeInLeft" duration={800}>
            <div className="space-y-4">
              <motion.div
                className="relative aspect-[4/3] w-full rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {currentMainImage ? (
                  <Image
                    src={currentMainImage}
                    alt={product.name}
                    fill
                    className="object-contain p-6 object-center"
                    priority
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                )}
              </motion.div>

              {/* Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                  {currentImages.map((img: string, idx: number) => {
                    const isActive = idx === safeActiveImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-16 rounded-lg border bg-white overflow-hidden shrink-0 transition-all cursor-pointer ${isActive ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} Thumbnail ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-contain p-2"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Right Column: Details, Variants Selector, CTA Buttons */}
          <ScrollReveal variant="fadeInRight" duration={800}>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider">
                  {product.product_categories?.name || product.category || "Product"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide leading-tight">
                  {product.name}
                </h1>



              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">{product.description}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{product.long_description}</p>

              {/* Color Variants selector */}
              {product.product_variants?.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Color Variant:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {product.product_variants.map((variant: any, index: number) => {
                      const isActive = index === activeVariantIndex;
                      return (
                        <button
                          key={variant.name}
                          onClick={() => {
                            setActiveVariantIndex(index);
                            setActiveImageIndex(0); // Reset gallery index
                          }}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${isActive
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                            }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
                            style={{ backgroundColor: variant.color_hex }}
                          />
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Buttons CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => openEnquiry(product.name, "product")}
                  className="py-3.5 px-6 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm sm:text-base shadow hover:shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enquire & Get Price Offer</span>
                </button>
                <a
                  href={`https://wa.me/919999999999?text=Hello%20SD%20Enterprise,%20I%20am%20interested%20in%20the%20product:%20${encodeURIComponent(
                    product.name
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base shadow hover:shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 animate-pulse" />
                  <span>1 Year Warranty Cover</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
                  <span>100% Genuine Certified</span>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>

        {/* Specifications & Features Tabbed Section */}
        <ScrollReveal variant="fadeInUp" duration={800}>
          <section className="bg-white rounded-2xl relative border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">

            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              Product Specifications & Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Bullet Features */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Key Features
                </h4>
                <ul className="space-y-2.5">
                  {product.features?.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs Table */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Technical Specifications
                </h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      {Object.entries(product.specifications || {}).map(([key, val]: any, idx: number) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}
                        >
                          <td className="px-4 py-2.5 font-bold text-slate-600 border-b border-slate-100 w-1/2">
                            {key}
                          </td>
                          <td className="px-4 py-2.5 text-slate-500 border-b border-slate-100 w-1/2">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 relative">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute bottom-[40%] right-[10%] text-cyan-500/50 ">
                <svg width="190" height="190" viewBox="0 0 190 190">
                  <path
                    d="M10 70 Q35 40 70 70 T130 70"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M10 90 Q35 60 70 90 T130 90"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

            </div>
            <ScrollReveal variant="fadeInUp">
              <h3 className="text-lg font-bold text-slate-800 tracking-wide">
                Related Water Treatment Products
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, index) => (
                <ScrollReveal
                  key={p.id}
                  variant="fadeInUp"
                  delay={index * 100}
                  duration={600}
                >
                  {/* Logic to get image from variants */}
                  {(() => {
                    const defaultVariant = p.product_variants?.find((v: any) => v.is_default) || p.product_variants?.[0];
                    const displayImage = defaultVariant?.images?.[0] || (p.product_variants?.find((v: any) => v.images?.length > 0)?.images?.[0]);
                    return (
                      <motion.div
                        whileHover={{
                          y: -8,
                          scale: 1.02,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-full hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-200 transition-all duration-300 ease-out"
                      >
                        <div className="flex gap-5">
                          <div className="relative w-24 h-24 bg-slate-50 rounded-xl border border-slate-50 overflow-hidden shrink-0 flex items-center justify-center group-hover:bg-white transition-all duration-500">
                            {displayImage && <Image
                              src={displayImage}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-contain p-3 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            />}
                            {/* Subtle overlay glow */}
                            <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="space-y-2 py-1">
                            <span className="text-[10px] text-sky-600 font-black uppercase tracking-[0.15em]">
                              {p.product_categories?.name || p.category}
                            </span>
                            <h4 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
                              {p.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                              {p.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3">
                          <div className="flex gap-1.5">
                            <Link
                              href={`/products/${p.id}`}
                              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-transparent hover:border-slate-200"
                            >
                              Details
                            </Link>
                            <button
                              onClick={() => openEnquiry(p.name, "product")}
                              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-sky-200 transition-all cursor-pointer active:scale-95"
                            >
                              Get Quote
                            </button>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </motion.div>
                    );
                  })()}
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
