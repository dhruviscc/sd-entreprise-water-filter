"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";


export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

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
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1">
        <svg className="relative block w-[300%] max-w-none h-[25px] sm:h-[35px] animate-[waveAnimation_30s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
        </svg>
      </div>
      {/* Upper Footer section */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16  ">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Column 1: Company Profile */}
          <motion.div variants={containerVariants} className="space-y-4 col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center group shrink-0">
              <Image
                src="/logo.png"
                alt="SD Enterprise"
                width={180}
                height={60}
                priority
                className="object-contain transition-all duration-500 group-hover:scale-105 h-15 sm:h-13 md:h-14 lg:h-20 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leading water purification experts in Gujarat. Dedicated to delivering state-of-the-art domestic, commercial, and industrial RO systems, water softeners, and annual maintenance services.
            </p>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Working Hours:
              <span className="block text-slate-400 normal-case mt-1 font-normal">
                Monday - Saturday: 9:00 AM - 7:00 PM
              </span>
              <span className="block text-slate-400 normal-case font-normal">
                Sunday: Emergency Support Only
              </span>
            </div>
          </motion.div>


          {/* Column 2: Quick Directory Links */}
          {/* <motion.div variants={containerVariants} className="space-y-4 ">
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-sky-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-sky-400 transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-sky-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div> */}
    <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Quick Links
            </h4>

            <ul className="space-y-3 mt-4 ">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'Products', href: '/products' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Blog', href: '/blog' },
              
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-500 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-3 ml-[-30%]" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          {/* Column 3: Contact details */}
          <motion.div variants={containerVariants} className="space-y-4">
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Get In Touch
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span>
                  Plot No. 12, GIDC Phase 3,
                  <br />
                  Naroda, Ahmedabad, Gujarat - 382330
                </span>
              </li>
              <li>
                <a href="tel:+919999999999" className="flex items-center gap-2.5 hover:text-sky-400 transition-colors">
                  <Phone className="w-4 h-4 text-sky-500" />
                  <span>+91 99999 99999</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@sdenterprise.com" className="flex items-center gap-2.5 hover:text-sky-400 transition-colors">
                  <Mail className="w-4 h-4 text-sky-500" />
                  <span>info@sdenterprise.com</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Legal Information */}
          <motion.div variants={containerVariants} className="space-y-4 col-span-2 lg:col-span-1">
            <h4 className="text-white text-base font-bold tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-sky-500">
              Legal Information
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-sky-400 transition-colors ">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>

          </motion.div>
        </motion.div>


      </div>

      {/* Lower Copyright section */}
      <div className="border-t border-slate-800 bg-slate-250  py-6 text-center text-xs text-slate-500">
        <div className="max-w-full mx-auto px-4 sm:px-6 text-slate-300 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-2">
          <p>© {new Date().getFullYear()} SD Enterprise. All rights reserved.</p>

        </div>
      </div>

    </footer>
  );
}
