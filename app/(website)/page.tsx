"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  productsData,
  blogPostsData,
  reviewsData,
} from "@/app/(website)/data/mockData";
import { Service } from "@/modules/services/servicesService";

import {
  Home,
  Wrench,
  Building2,
  Droplets,
  Flame,
  Sparkles,
  IceCream,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  MessageCircle,
  Clock,
  MapPin,
  Mail,
  CheckCircle,
  PhoneCall,
  Settings,
  Zap,
  Search,
  Circle,
  Cylinder,
} from "lucide-react";
import BubbleBackground from "@/components/BubbleBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useEnquiry } from "./context/EnquiryContext";

const iconMap: Record<string, React.ComponentType<any>> = {
  Home: Home,
  Wrench: Wrench,
  Building2: Building2,
  Droplets: Droplets,
  Flame: Flame,
  Sparkles: Sparkles,
  IceCream: IceCream,
  ShieldCheck: ShieldCheck,
  Settings: Settings,
  Zap: Zap,
  Search: Search,
};

// Type for hero banner data
interface HeroBanner {
  image: string;
  title: string;
  subtitle: string;
  primaryText: string;
  primaryUrl: string;
  secondaryText: string;
  secondaryInterest: string;
  secondaryType: "service" | "product" | "general";
}

// Fallback data used when the database is empty or API call fails
const fallbackBanners: HeroBanner[] = [
  {
    image: "/water-filter.png",
    title: "Trusted RO Solutions for Clean & Safe Drinking Water",
    subtitle: "From domestic RO systems to complete water purification services, we provide reliable solutions for healthier homes and businesses.",
    primaryText: "Explore Products",
    primaryUrl: "/products",
    secondaryText: "Book RO Service",
    secondaryInterest: "All Types of RO and Services",
    secondaryType: "service",
  },
  {
    image: "/filter-3.png",
    title: "Complete Water Filter Care & Expert RO Services",
    subtitle: "Keep your filtration system performing at its best with professional installation, maintenance, cartridge replacement, and repair services.",
    primaryText: "View AMC Plans",
    primaryUrl: "/services",
    secondaryText: "Request Service",
    secondaryInterest: "All Types of RO and Services",
    secondaryType: "service",
  },
  {
    image: "/industrial.png",
    title: "Complete Water Treatment Solutions for Industrial Applications",
    subtitle: "From pre-treatment to advanced RO purification, we deliver customized systems that ensure high-quality water for every industrial requirement.",
    primaryText: "View Solutions",
    primaryUrl: "/industrial-ro",
    secondaryText: "Get Free Quote",
    secondaryInterest: "Industrial RO Plant",
    secondaryType: "service",
  }
];

export default function HomePage() {
  const { openEnquiry } = useEnquiry();

  // --- Hero Slider: Dynamic data from admin ---
  const [heroBanners, setHeroBanners] = useState(fallbackBanners);
  const [isBannersLoading, setIsBannersLoading] = useState(true);

  // --- Services: Dynamic data from admin ---
  const [services, setServices] = useState<Service[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(true);

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  const normalizeAdminProduct = (product: any) => ({
    id: product.id,
    name: product.name || product.title || "Product",
    description: product.description || product.short_description || "",
    long_description: product.long_description || product.description || "",
    category: product.product_categories?.name || product.category || "Product",
    images: product.product_variants?.[0]?.images || product.images || [],
    features: product.features || [],
    specifications: product.specifications || {},
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data
            .filter((s: any) => s.is_active !== false)
            .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((s: any) => ({
              ...s,
              short_description: s.short_description || s.shortDescription || s.description || "",
              features: s.features || [],
              faqs: s.faqs || [],
            }));
          setServices(mapped);
        }
      } catch (err) {
        // Fallback to mockData (already in state)
      } finally {
        setIsServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const res = await fetch("/api/hero-sliders");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((s: any) => ({
            image: s.desktopImage || "",
            title: s.title || "",
            subtitle: s.subtitle || "",
            primaryText: s.primaryCtaText || "Learn More",
            primaryUrl: s.primaryCtaLink || "/",
            secondaryText: s.secondaryCtaText || "Enquiry",
            secondaryInterest: s.secondaryInterest || "General Enquiry",
            secondaryType: (s.secondaryType || "service") as "service" | "product" | "general",
          }));
          setHeroBanners(mapped);
        }
        // If data is empty, keep fallback banners
      } catch {
        // On error, keep fallback banners
      } finally {
        setIsBannersLoading(false);
      }
    };
    fetchHeroBanners();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/admin/api/product?active=true");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data
            .filter((p: any) => p.is_active !== false)
            .slice(0, 4)
            .map(normalizeAdminProduct);
          setFeaturedProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Hero Slider State & Logics ---
  const [slideIndex, setSlideIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Reset slider when banners data changes (e.g., API data arrives)
  useEffect(() => {
    setSlideIndex(1);
    setIsTransitioning(true);
    setIsAnimating(false);
  }, [heroBanners]);

  const extendedBanners = [
    heroBanners[heroBanners.length - 1],
    ...heroBanners,
    heroBanners[0],
  ];

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 1100);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 1100);
  };

  const goToSlide = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsTransitioning(true);
    setSlideIndex(idx + 1);
    setTimeout(() => setIsAnimating(false), 1100);
  };

  // Touch handlers for mobile swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (slideIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(heroBanners.length);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (slideIndex === heroBanners.length + 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [slideIndex, heroBanners.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (isPaused || isAnimating) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slideIndex, isPaused, isAnimating]);

  const currentSlide = (() => {
    if (slideIndex === 0) return heroBanners.length - 1;
    if (slideIndex === heroBanners.length + 1) return 0;
    return slideIndex - 1;
  })();

  // --- Video Reviews Slider State ---
  const videoReviews = useMemo(() => [
    { id: "v1", videoUrl: "https://www.shutterstock.com/shutterstock/videos/3521349219/preview/stock-footage-woman-on-her-kitchen-floor-assembling-the-reverse-osmosis-water-filter.mp4", rating: 5, client: "Anita Sharma" },
    { id: "v2", videoUrl: "https://www.shutterstock.com/shutterstock/videos/4031391119/preview/stock-footage-interior-of-water-treatment-plant-facility-for-purification-of-drinking-water.mp4", rating: 5, client: "Rajesh Patel" },
    { id: "v3", videoUrl: "https://www.shutterstock.com/shutterstock/videos/1101915055/preview/stock-footage-industrial-equipment-for-water-purification-water-purification-system-equipment-interior-of-water.mp4", rating: 5, client: "Suresh Mehta" },
    { id: "v4", videoUrl: "https://www.shutterstock.com/shutterstock/videos/1104243637/preview/stock-footage-plumber-repairing-sink-in-kitchen.mp4", rating: 5, client: "Meera Shah" },
    { id: "v5", videoUrl: "https://www.shutterstock.com/shutterstock/videos/1100695963/preview/stock-footage-water-purifier-filter-tube-ultra-filtration-filter-workflow-system.mp4", rating: 5, client: "Vikram Gohil" },
  ], []);

  const [videoIdx, setVideoIdx] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(1);
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(true);

  const extendedVideoReviews = useMemo(() => [
    ...videoReviews,
    ...videoReviews.slice(0, itemsVisible)
  ], [videoReviews, itemsVisible]);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 768) setItemsVisible(1);
      else if (window.innerWidth < 1024) setItemsVisible(2);
      else setItemsVisible(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVideoTransitioning(true);
      setVideoIdx((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (videoIdx >= videoReviews.length) {
      const timer = setTimeout(() => {
        setIsVideoTransitioning(false);
        setVideoIdx(0);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [videoIdx, videoReviews.length]);

  useEffect(() => {
    if (!isVideoTransitioning) {
      const timer = setTimeout(() => setIsVideoTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isVideoTransitioning]);

  // --- Customer Reviews Slider State ---
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviewsData.length);
  };

  useEffect(() => {
    if (isReviewPaused) return;
    const timer = setInterval(() => {
      nextReview();
    }, 5000); 

    return () => clearInterval(timer);
  }, [isReviewPaused]);

  // --- Contact Form State ---
  const [contactForm, setContactForm] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    serviceInterest: "General Enquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/admin/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enquiry",
          name: contactForm.fullName,
          mobile: contactForm.mobileNumber,
          email: contactForm.emailAddress,
          product_name: contactForm.serviceInterest,
          message: contactForm.message,
          status: "new"
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit enquiry");
      }

      setSubmitSuccess(true);
      setContactForm({
        fullName: "",
        mobileNumber: "",
        emailAddress: "",
        serviceInterest: "General Enquiry",
        message: "",
      });
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error("Enquiry submission error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-[85vh] min-h-[500px] sm:h-[700px] lg:h-[890px] overflow-hidden bg-slate-100 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slider Track */}
        <div
          className="absolute inset-0 flex h-full"
          style={{
            transform: `translateX(-${slideIndex * (100 / extendedBanners.length)}%)`,
            transition: isTransitioning ? "transform 1000ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            width: `${extendedBanners.length * 100}%`
          }}
        >
          {extendedBanners.map((banner, index) => {
            const isVisuallyActive =
              (index === slideIndex) ||
              (slideIndex === 0 && index === heroBanners.length) ||
              (slideIndex === heroBanners.length + 1 && index === 1);

            return (
              <div
                key={index}
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / extendedBanners.length}%` }}
              >
                {/* Light gradient overlay for text readability over images */}
                <div className="absolute inset-0 bg-slate-900/50 sm:bg-white/20 backdrop-blur-[0.2px] z-10" />

                {/* Background image container with scale animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="relative w-full h-full"
                    animate={isVisuallyActive ? { scale: 1.08 } : { scale: 1 }}
                    transition={{
                      duration: isVisuallyActive ? 5 : 0.3,
                      ease: isVisuallyActive ? "linear" : "easeIn"
                    }}
                  >
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      priority={index === 1}
                    />
                  </motion.div>
                </div>

                {/* Slide Content */}
                <div className="absolute inset-0 flex items-center justify-center sm:justify-start z-20">
                  {/* Changed from mx-auto max-w-7xl to full width with custom left padding to push content left */}
                  <div className="w-full px-6 sm:px-12 lg:px-24 xl:px-32 pt-12 sm:pt-0">
                    <motion.div
                      className="max-w-xl md:max-w-2xl space-y-5 sm:space-y-6 text-center sm:text-left"
                      initial="hidden"
                      animate={isVisuallyActive ? "visible" : "hidden"}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1], // easeOutExpo
                            staggerChildren: 0.12,
                            delayChildren: 0.1
                          }
                        }
                      }}
                    >


                      <motion.h1
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="text-4xl sm:text-5xl lg:text-5xl font-black text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-slate-900 sm:to-slate-700 leading-[1.1]"
                      >
                        {banner.title}
                      </motion.h1>

                      <motion.p
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="text-sm sm:text-md text-slate-200 sm:text-slate-700 font-semibold leading-relaxed max-w-lg mx-auto sm:mx-0 px-4 sm:px-0"
                      >
                        {banner.subtitle}
                      </motion.p>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="flex flex-wrap gap-3 pt-2 justify-center sm:justify-start"
                      >
                        <Link
                          href={banner.primaryUrl}
                          className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-1"
                        >
                          {banner.primaryText}
                        </Link>
                        <button
                          className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-1"
                          onClick={() =>
                            openEnquiry(banner.secondaryInterest, banner.secondaryType)
                          }
                        >
                          {banner.secondaryText}
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/40 hover:bg-slate-950/75 text-white transition-colors focus:outline-none cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/40 hover:bg-slate-950/75 text-white transition-colors focus:outline-none cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Slide Indicators */}
        <div className="absolute bottom-16 sm:bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? "bg-sky-500 w-8" : "bg-white/40"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 transform translate-y-1">
          <svg className="relative block w-[300%] max-w-none h-[10px] sm:h-[15px] lg:h-[50px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-sky-50"></path>
          </svg>
        </div>
      </section>


      {/* ================= SERVICES SECTION ================= */}
      <section className="w-full bg-sky-50 pt-20 sm:pt-24 lg:pt-20 relative">
        {/* Decorative background vectors */}
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

          <div className="absolute bottom-[8%] left-[4%] text-cyan-600/10 animate-float-3d">
            <Droplets className="w-20 h-20 sm:w-32 sm:h-32 lg:w-30 lg:h-40" strokeWidth={1.2} />
          </div>

        </div>

        <div className="relative z-30 -mt-40 sm:-mt-30 lg:-mt-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto ">
            <ScrollReveal variant="scaleUp" duration={800}>
              <motion.div

                className="grid grid-cols-2 md:grid-cols-4 gap-y-8 sm:gap-6 bg-sky-200/60 backdrop-blur-xl py-6 px-4 sm:py-8 sm:px-6 md:py-10 md:px-8 rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] border border-sky-100/60 text-center relative hover:shadow-[0_40px_70px_-12px_rgba(14,165,233,0.25)] transition-shadow duration-500 group cursor-pointer"

              >
                <div className="space-y-2 border-r border-slate-100 last:border-0 md:px-4" style={{ transform: "translateZ(30px)" }}>
                  <span className="block text-3xl sm:text-5xl font-black text-sky-600 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(14,165,233,0.15)]">10+</span>
                  <span className="block text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-[0.2em]">Years Experience</span>
                </div>
                <div className="space-y-2 md:border-r border-slate-100 last:border-0 md:px-4" style={{ transform: "translateZ(30px)" }}>
                  <span className="block text-3xl sm:text-5xl font-black text-sky-600 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(14,165,233,0.15)]">5000+</span>
                  <span className="block text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-[0.2em]">Happy Families</span>
                </div>
                <div className="space-y-2 border-r border-slate-100 last:border-0 md:px-4" style={{ transform: "translateZ(30px)" }}>
                  <span className="block text-3xl sm:text-5xl font-black text-sky-600 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(14,165,233,0.15)]">100%</span>
                  <span className="block text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-[0.2em]">Genuine Spares</span>
                </div>
                <div className="space-y-2 md:px-4" style={{ transform: "translateZ(30px)" }}>
                  <span className="block text-3xl sm:text-5xl font-black text-sky-600 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(14,165,233,0.15)]">2 Hour</span>
                  <span className="block text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-[0.2em]">Quick Response</span>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 sm:p-16 px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest">
                Our Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
                Professional Water Filtration Services
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium">
                From household purifiers to industrial plants, we provide 24/7 comprehensive installation, repair, and expert AMC contracts.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => {
              // Fallback to Settings icon if service.icon is missing or not in the map
              const IconComponent = (service.icon && iconMap[service.icon]) || Settings;
              return (
                <ScrollReveal key={service.id} variant="fadeInUp" delay={index * 100}>
                  <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 sm:hover:-translate-y-2 flex flex-col h-full overflow-hidden">
                    {/* 3D Hover Decorative Layer */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-50 rounded-full transition-all duration-700 group-hover:bg-sky-500/10 group-hover:scale-[3] z-0 opacity-50 group-hover:opacity-100" />

                    <div className="relative z-10 space-y-6 flex-grow">
                      {/* Service Icon */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500 shadow-inner">
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">
                          {service.name}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium">
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    {/* <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-50">
                      <Link
                        href={`/services#${service.id}`}
                        className="flex items-center justify-center py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => openEnquiry(service.name, "service")}
                        className="flex items-center justify-center py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 hover:shadow-sky-300 cursor-pointer"
                      >
                        Enquiry
                      </button>
                    </div> */}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal variant="fadeIn" delay={300}>
            <div className="text-center pt-2 pb-8">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-blue-700 group"
              >
                <span>View All Detailed Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
        {/* Bottom Wave (Sky-50 to White) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[35px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
      </section>



      {/* ================= FEATURED PRODUCTS SECTION ================= */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-0">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <div className="absolute bottom-[8%] right-[4%] text-cyan-600/10 animate-float-3d">
            <Droplets size={80} />
          </div>

          <div className="absolute top-[15%] left-[5%] text-sky-500/10 animate-float-3d">
            <Cylinder size={100} strokeWidth={1} />
          </div>

        </div>

        <BubbleBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative">
          <ScrollReveal variant="fadeInUp">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs sm:text-sm font-bold text-sky-600 uppercase tracking-widest">Our Catalog</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">Water Purifiers</h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-all shadow-sm"
              >
                Browse Full Catalog
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {(featuredProducts.length > 0 ? featuredProducts : productsData.slice(0, 4)).map((product, index) => (
              <ScrollReveal key={product.id} variant="fadeInUp" delay={index * 100}>
                <div className="card-3d-wrapper">
                  <div className="glass-3d rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-xl sm:hover:-translate-y-2 transition-all group card-3d-inner animate-float-3d relative z-10">

                    {/* Product Image */}
                    <div className="relative aspect-square sm:aspect-[4/3] bg-white/50 border-b border-slate-200 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill

                        className="object-contain p-4 object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded glass-3d text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-sm animate-float-3d">
                        {product.category}
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">

                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-slate-100">

                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="flex items-center justify-center py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] sm:text-xs font-bold text-slate-700 transition-colors"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => openEnquiry(product.name, "product")}
                            className="py-1.5 sm:py-2 bg-sky-500 hover:bg-sky-600 rounded-lg text-[10px] sm:text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
                          >
                            Enquire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>


      </section>

      {/* ================= CUSTOMER REVIEWS SECTION ================= */}

      <section className="w-full bg-sky-50 py-10 relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <div className="absolute top-[15%] right-[10%] animate-float-3d ">
            <div className="w-25 h-25 border border-blue-500/60 rounded-full" />
            <div className="absolute inset-3 border border-blue-500/40 rounded-full" />
            <div className="absolute inset-6 border border-blue-500/20 rounded-full" />
          </div>
          <div className="absolute bottom-[20%] left-[5%] text-cyan-600/10 animate-float-3d">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="35" r="12" fill="currentColor" />
              <circle cx="35" cy="75" r="10" fill="currentColor" />
              <circle cx="85" cy="75" r="10" fill="currentColor" />

              <line x1="60" y1="35" x2="35" y2="75" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="35" x2="85" y2="75" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

        </div>
        {/* Top Wave (White to Slate-50) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[25px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
        <AnimatedTestimonials
          testimonials={reviewsData.map((r: any) => ({
            id: Number(r.id.replace('rev-', '')) || 0,
            name: r.name,
            role: r.location,
            company: '',
            content: r.text,
            rating: r.rating,
            avatar: "/placeholder-avatar.png",
          }))}
          className="max-w-7xl mx-auto"
        />
        {/* Bottom Wave (Sky-50 to White) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[35px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* ================= VIDEO REVIEWS SECTION ================= */}
      <section className="w-full py-32 px-4 sm:px-6 lg:px-8 relative min-h-[400px]">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <div className="absolute top-[10%] left-[32%] text-cyan-500/20 ">
            <svg width="140" height="140" viewBox="0 0 140 140">
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
        <BubbleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 ">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs sm:text-sm font-bold text-sky-600 uppercase tracking-widest">Visual Feedback</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">What Our Clients Say on Camera</h2>
              <p className="text-sm text-slate-500 font-medium">
                Real stories and experiences shared by our happy customers across Gujarat.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative overflow-hidden group/slider">

            <motion.div
              className="flex"
              animate={{ x: `-${videoIdx * (100 / itemsVisible)}%` }}
              transition={isVideoTransitioning ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
            >
              {extendedVideoReviews.map((review, i) => (
                <div
                  key={`${review.id}-${i}`}
                  className="shrink-0 transition-all duration-500"
                  style={{ width: `${100 / itemsVisible}%`, }}
                >
                  <div className="group  rounded-2xl p-4">
                    <div className="relative  rounded-xl overflow-hidden shadow-md w-full  h-[450px]">
                      <video
                        src={review.videoUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay

                      />
                    </div>

                  </div>
                </div>
              ))}
            </motion.div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-10">
              {videoReviews.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  onClick={() => {
                    setIsVideoTransitioning(true);
                    setVideoIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === (videoIdx % videoReviews.length) ? "bg-sky-500 w-6" : "bg-slate-200 w-2"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ================= BLOG PREVIEW SECTION ================= */}
      <section className="relative bg-sky-50 py-12 sm:py-16 lg:py-20 px-0">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[15%] text-sky-600/70 animate-float-3d">
            <svg width="100" height="100" viewBox="0 0 180 180">
              <path
                d="M90 20
         C130 20 160 50 160 90
         C160 130 130 160 90 160
         C50 160 20 130 20 90
         C20 50 50 20 90 20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>
        </div>
        {/* Top Wave (White to Slate-50) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[25px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-20">
          <ScrollReveal variant="fadeInUp">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs sm:text-sm font-bold text-sky-600 uppercase tracking-widest">Read & Learn</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Latest from the Blog</h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all shadow-sm"
              >
                Explore Blogs
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {blogPostsData.map((post, index) => (
              <ScrollReveal key={post.id} variant="fadeInUp" delay={index * 150}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-md transition-all group">
                  {/* Blog Image */}
                  <div className="relative h-40 sm:h-48 bg-slate-100 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Bottom Wave (Slate-50 to White) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[25px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* ================= CONTACT CTA & QUICK ENQUIRY ================= */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-0  relative isolate overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">


          <div className="absolute bottom-[8%] left-[4%] text-cyan-600/10 animate-float-3d">
            <Droplets className="w-20 h-20 sm:w-32 sm:h-32 lg:w-30 lg:h-40" strokeWidth={1.2} />
          </div>
          <div className="absolute top-[18%] right-[50%] hidden md:block text-blue-600/10 animate-float-3d animation-delay-[2000ms]">
            <Circle className="w-20 h-20 lg:w-28 lg:h-28" strokeWidth={1.1} />
          </div>
        </div>
        <BubbleBackground zIndex={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-sky-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

            {/* Column 1: Info & CTAs */}
            <ScrollReveal variant="fadeInLeft" duration={900}>
              <div className="p-8 sm:p-12 glass-3d border-r border-slate-200 text-slate-800 flex flex-col justify-between space-y-8 h-full relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-200 rounded-full blur-3xl animate-blobFloat1" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-300 rounded-full blur-3xl animate-blobFloat2" />

                <div className="space-y-4 relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/50 border border-slate-300 text-xs font-bold uppercase tracking-wider shadow-sm animate-float-3d">
                    Support & Sales
                  </span>
                  <h2 className="text-3xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
                    Ready to upgrade your water quality?
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-md font-medium">
                    Contact SD Enterprise today. Get a free water hardness and TDS test at your doorstep, along with professional advice.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sky-200 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Plot No. 12, GIDC Phase 3, Naroda, Ahmedabad, Gujarat - 382330
                    </span>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-sky-200 shrink-0" />
                    <span className="text-sm">info@sdenterprise.com</span>
                  </div>
                </div>

                {/* Direct Connect Buttons */}
                <div className="flex flex-wrap gap-3 pt-2 relative z-10">
                  <a
                    href="tel:+919999999999"
                    className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 text-white font-bold text-sm shadow hover:bg-slate-900 transition-colors transform hover:-translate-y-1"
                  >
                    <PhoneCall className="w-4 h-4 text-white animate-bounce" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="https://wa.me/919999999999?text=Hello%20SD%20Enterprise,%20I%20want%20to%20enquire%20about%20water%20filter%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-lg glass-3d text-slate-800 border-slate-300 font-bold text-sm shadow transition-colors transform hover:-translate-y-1"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Column 2: Quick Enquiry Form */}
            <ScrollReveal variant="fadeInRight" duration={900}>
              <div className="p-8 sm:p-12 space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Send an Enquiry</h3>
                {submitSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
                    <h4 className="text-lg font-bold text-slate-800">Submitted!</h4>
                    <p className="text-sm text-slate-600 max-w-xs">
                      Your details were saved. Our executive will call you within 2 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          placeholder="10 digit number"
                          value={contactForm.mobileNumber}
                          onChange={(e) => setContactForm({ ...contactForm, mobileNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="Enter email"
                          value={contactForm.emailAddress}
                          onChange={(e) => setContactForm({ ...contactForm, emailAddress: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Service Interest
                      </label>
                      <select
                        value={contactForm.serviceInterest}
                        onChange={(e) => setContactForm({ ...contactForm, serviceInterest: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.name}>{service.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter message or address details"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm rounded-lg shadow cursor-pointer"
                    >
                      {isSubmitting ? "Sending..." : "Submit Enquiry"}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

      </section>
    </div>
  );
}
