"use client";


import { MessageCircle } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

export default function FloatingWhatsApp() {
  const whatsappNumber = "919999999999"; // Default placeholder for SD Enterprise
  const message = "Hello SD Enterprise, I am visiting your website and want to enquire about your water filter products and services.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 right-3 z-40 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2"
      aria-label="Contact us on WhatsApp"
    >
      {/* Ripple/Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping group-hover:animate-none -z-10" />
      
      {/* Icon */}
      <BsWhatsapp className="w-7 h-7 fill-white stroke-none" />
      
      {/* Hover Tooltip */}
      <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
        Chat with us
      </span>
    </a>
 
);
}
