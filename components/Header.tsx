"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { useEnquiry } from "@/app/(website)/context/EnquiryContext";


interface Burst {
  id: number;
  x: number;
  y: number;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now();

    setBursts((prev) => [...prev, { id, x, y }]);

  
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 600);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* GLOBAL CLICK WATER SPLASH EFFECT */}
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed z-[9999] pointer-events-none"
          style={{ left: burst.x, top: burst.y }}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const distance = Math.random() * 30 + 30; // 30px to 60px distance
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const size = Math.random() * 15 + 5;
            const colors = ["#38bdf8", "#0284c7", "#bae6fd", "#ffffff"];
            const color = colors[Math.floor(Math.random() * colors.length)];

            return (
              <div
                key={i}
                className="absolute rounded-full shadow-sm"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `waterBurst 3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards`,
                  ["--tx" as string]: `${tx}px`,
                  ["--ty" as string]: `${ty}px`,
                }}
              />
            );
          })}
        </div>
      ))}

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-sky-100   ${isScrolled
          ? "py-4 bg-sky-100/100"
          : "py-5 bg-sky-80/100"
          }`}
      >

        {/* HEADER CONTENT */}
        <div className="relative z-20 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center group shrink-0">
              <Image
                src="/logo.png"
                alt="SD Enterprise"
                width={180}
                height={60}
                priority
                className="object-contain transition-all duration-500 group-hover:scale-105 h-10 sm:h-12 md:h-14 lg:h-14 w-auto"
              />
            </Link>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  link.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      handleMenuClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
                      setIsOpen(false);
                    }}
                    className={`px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${isActive
                      ? "text-sky-700"
                      : "text-slate-800 hover:text-sky-600 hover:bg-sky-50"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      >
                        {/* Floating Bubbles from the underline */}
                        <div className="absolute bottom-0 left-0 w-full flex justify-around items-end h-8 pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 bg-sky-400 rounded-full"
                              animate={{
                                y: [0, -20],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.2, 0.5],
                              }}
                              transition={{
                                duration: 1.2,
                                delay: i * 0.1,
                                ease: "easeOut",
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <span className="relative z-10">{link.name}</span>
                    {/* Hover subtle effect */}
                    {!isActive && (
                      <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 rounded-xl transition-all duration-300 ease-out z-0"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* BUTTON */}
            <div className="hidden lg:flex">
              <button
                onClick={(e) => {
                  const syntheticEvent = e as unknown as React.MouseEvent<HTMLAnchorElement>;
                  handleMenuClick(syntheticEvent);
                  openEnquiry("Free Consultation", "general");
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg ${isScrolled
                  ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-200"
                  : "bg-slate-800 text-white hover:bg-slate-900"
                  }`}
              >
                Get Free Quote
              </button>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={(e) => {
                  const syntheticEvent = e as unknown as React.MouseEvent<HTMLAnchorElement>;
                  handleMenuClick(syntheticEvent);
                  setIsOpen(!isOpen);
                }}
                className="p-2 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-all focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <div
          className={`fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 md:hidden z-10 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* MOBILE MENU PANEL */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top overflow-hidden z-20 ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <div className="px-6 py-8 space-y-2">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.path);

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    handleMenuClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
                    setTimeout(() => setIsOpen(false), 200);
                  }}
                  className={`block px-4 py-3.5 rounded-xl text-lg font-bold transition-all border relative overflow-hidden ${isActive
                    ? "text-sky-700 border-sky-100"
                    : "text-slate-700 hover:bg-slate-50 "
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavMobile"
                      className="absolute left-0 top-2 bottom-2 w-1.5 bg-sky-600 rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    >
                      {/* Bubbles for mobile vertical bar */}
                      <div className="absolute top-0 left-0 h-full flex flex-col justify-around items-start w-8 pointer-events-none">
                        {[...Array(2)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 bg-sky-400 rounded-full"
                            animate={{
                              x: [0, 15],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1.2, 0.5],
                            }}
                            transition={{
                              duration: 1.2,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={(e) => {
                  const syntheticEvent = e as unknown as React.MouseEvent<HTMLAnchorElement>;
                  handleMenuClick(syntheticEvent);
                  openEnquiry("Free Consultation", "general");
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold shadow-lg transition-all active:scale-95 text-lg"
              >
                <PhoneCall className="w-6 h-6" />
                Get Free Quote
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CSS */}
      <style>{`
        @keyframes waterBurst {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}