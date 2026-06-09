"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";


export default function Footer() {

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  return (
    <footer className="bg-slate-900 text-slate-300 relative  border-t border-slate-800">

      {/* Top Wave (White to Slate-50) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1 pointer-events-none">
        <svg className="relative block w-[300%] max-w-none h-[25px] sm:h-[35px] animate-[waveAnimation_30s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
        </svg>
      </div>
      {/* Upper Footer section */}
      <div className="relative z-20 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Column 1: Company Profile */}
          <motion.div variants={containerVariants} className="space-y-6">
            <Link href="/" className="flex items-center group shrink-0">
              <Image
                src="/logo.png"
                alt="SD Enterprise"
                width={180}
                height={60}
                priority
                className="object-contain transition-all duration-500 group-hover:scale-105 h-14 sm:h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Leading water purification experts in Gujarat. Dedicated to delivering state-of-the-art domestic, commercial, and industrial RO systems, water softeners, and annual maintenance services.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Working Hours</div>
              <p className="text-sm text-slate-400">Mon - Sat: 9:00 AM - 7:00 PM</p>
              <p className="text-sm text-slate-400">Sun: Emergency Support Only</p>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={containerVariants} className="space-y-6">
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Quick Navigation
            </h4>
            <ul className="space-y-3 mt-4 list-none ml-0">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: 'services' },
                { name: 'Products', href: '/products' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Blog', href: '/blog' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-sky-400 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500/40 group-hover:bg-sky-500 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact details */}
          <motion.div variants={containerVariants} className="space-y-6">
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Get In Touch
            </h4>
            <ul className="space-y-4 text-sm text-slate-400 list-none ml-0">
            <li>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=SD+Enterprise+Plot+No.+12,+GIDC+Phase+3,+Naroda,+Ahmedabad,+Gujarat+-+382330"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-sky-400 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-sky-500/30">
                  <MapPin className="w-4 h-4 text-sky-500" />
                </div>
                <span>
                  Plot No. 12, GIDC Phase 3,<br />
                  Naroda, Ahmedabad, Gujarat - 382330
                </span>
              </a>
              </li>
              <li>
              <a href="tel:+919879216149" className="flex items-center gap-3 hover:text-sky-400 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-sky-500/30">
                    <Phone className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="font-medium">+91 98792 16149</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@sdenterprise.com" className="flex items-center gap-3 hover:text-sky-400 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-sky-500/30">
                    <Mail className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="font-medium">info@sdenterprise.com</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Legal & Newsletter */}
          <motion.div variants={containerVariants} className="space-y-6">
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Legal Info
            </h4>
            <ul className="space-y-3 text-sm list-none ml-0">
              <li>
                <Link href="#" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-[1px] bg-slate-600" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-[1px] bg-slate-600" />
                  Terms of Service
                </Link>
              </li>
            </ul>


          </motion.div>
        </motion.div>
      </div>

      {/* Lower Copyright section */}
      <div className="border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} SD Enterprise. Built for excellence in water treatment.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <span>All Rights Reserved</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Gujarat, India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>

  );
}
