"use client";

import React, { useState, useEffect } from "react";
import { servicesData } from "../data/mockData";
import { useEnquiry } from "../context/EnquiryContext";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Home,
  Wrench,
  Building2,
  Droplets,
  Flame,
  Sparkles,
  IceCream,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  CheckCircle,
  Cylinder,
  Circle,
  GlassWater,
} from "lucide-react";
import Image from "next/image";
import BubbleBackground from "@/components/BubbleBackground";

const iconMap: Record<string, React.ComponentType<any>> = {
  Home: Home,
  Wrench: Wrench,
  Building2: Building2,
  Droplets: Droplets,
  Flame: Flame,
  Sparkles: Sparkles,
  IceCream: IceCream,
  ShieldCheck: ShieldCheck,
};

export default function ServicesPage() {
  const { openEnquiry } = useEnquiry();
  const [selectedServiceId, setSelectedServiceId] = useState(servicesData[0].id);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      const exists = servicesData.some((s) => s.id === id);
      if (exists) {
        setSelectedServiceId(id);
        const element = document.getElementById("details-view");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, []);

  const selectedService =
    servicesData.find((s) => s.id === selectedServiceId) || servicesData[0];

  const SelectedIcon = iconMap[selectedService.icon] || Droplets;

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full">

      {/* Banner */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-25 sm:pb-16  md:pb-20 text-slate-800 text-center border-b border-slate-200 overflow-hidden bg-white">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[10%] text-sky-500/10 animate-float-3d scale-75 sm:scale-100">
            <svg width="120" height="120" viewBox="0 0 180 180" className="w-24 h-24 sm:w-32 sm:h-32">
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

          <div className="absolute bottom-[8%] left-[15%] text-cyan-600/10 animate-float-3d">
            <Droplets className="w-20 h-20 sm:w-32 sm:h-32 lg:w-30 lg:h-40" strokeWidth={1.2} />
          </div>

        </div>
        <BubbleBackground />


        <ScrollReveal variant="fadeInDown" duration={600}>
          <div className="max-w-4xl mx-auto px-4 space-y-4 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 animate-float-3d">Our Water Treatment Services</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We provide fast, reliable, and affordable services for all types of water purification systems, gas geysers, and softeners.
            </p>

          </div>
        </ScrollReveal>
      </section>



      {/* Main Panel */}
      <section className="relative w-full bg-white py-16 lg:py-20 overflow-hidden">

        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <div className="absolute bottom-[30%] right-[-5%] sm:right-[4%] text-cyan-600/10 animate-float-3d opacity-40 sm:opacity-100">
            <Droplets className="w-20 h-20 sm:w-28 sm:h-28" />
          </div>

          <div className="absolute bottom-[15%] left-[-5%] sm:left-[5%] text-sky-500/10 animate-float-3d opacity-40 sm:opacity-100">
            <Cylinder className="w-20 h-20 sm:w-28 sm:h-28" strokeWidth={1} />
          </div>
          <div className="absolute top-[2%] left-[10%] text-cyan-500/10 animate-float-3d rotate-120">
            <svg width="100" height="100" viewBox="0 0 150 150" className="w-24 h-24 sm:w-32 sm:h-32">
              <path
                d="M25 30 H125 L90 80 V120 H60 V80 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="75" cy="50" r="5" fill="currentColor" />
              <circle cx="75" cy="65" r="4" fill="currentColor" />
              <circle cx="75" cy="80" r="3" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">

            {/* LEFT SIDEBAR */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[3px] text-slate-500">
                Select a Service
              </h3>

              <div className="space-y-3">

                <ScrollReveal variant="fadeInLeft" duration={800}>
                  <div className="space-y-2">
                    {servicesData.map((service) => {
                      const Icon = iconMap[service.icon] || Droplets;
                      const isSelected = service.id === selectedServiceId;

                      return (
                        <button
                          key={service.id}
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setExpandedFaqIndex(null);

                            const element = document.getElementById("details-view");
                            if (element && window.innerWidth < 1024) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className={`
  w-full text-left p-4 rounded-xl border transition-all duration-300
  flex items-center gap-4 cursor-pointer

  ${isSelected
                              ? "bg-gradient-to-r from-sky-400 to-cyan-600 text-white shadow-xl scale-[1.02] border-transparent"
                              : "bg-white/60 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
                            }
`}
                        >
                          {/* Icon Box */}
                          <div
                            className={`
              w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
              ${isSelected
                                ? "bg-white text-sky-600 shadow-md"
                                : "bg-sky-100 text-sky-500"
                              }
            `}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Text */}
                          <div className="flex-1">
                            <span className="block text-sm sm:text-base font-medium leading-tight">
                              {service.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollReveal>

              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div id="details-view">
              <div id="details-view" className="lg:col-span-2 space-y-8 scroll-mt-24 card-3d-wrapper">
                <ScrollReveal variant="fadeInRight" duration={800}>
                  <div className="glass-3d bg-white/70 rounded-2xl p-6 sm:p-8 space-y-6 card-3d-inner">

                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner animate-float-3d">
                          <SelectedIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
                            {selectedService.name}
                          </h2>
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                            SD Enterprise Certified Service
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => openEnquiry(selectedService.name, "service")}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-center"
                      >
                        Book Now / Enquiry
                      </button>
                    </div>

                    {/* Content & Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                        <Image
                          src={selectedService.image}
                          alt={selectedService.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-sky-800 uppercase tracking-wider">
                          Service Overview
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {selectedService.description}
                        </p>
                      </div>
                    </div>

                    {/* Key Service Highlights */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-sky-800 uppercase tracking-wider">
                        What is Included
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedService.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service FAQ */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-sky-800 uppercase tracking-wider">
                        Frequently Asked Questions
                      </h4>
                      <div className="space-y-2">
                        {selectedService.faqs.map((faq, index) => {
                          const isOpen = expandedFaqIndex === index;
                          return (
                            <div
                              key={index}
                              className="border border-slate-100 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-left transition-colors cursor-pointer"
                              >
                                <span className="text-sm font-bold text-sky-700">{faq.question}</span>
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              </div>

            </div>

          </div>

        </div>


      </section>

      {/* Corporate Call To Action */}
      <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8   relative  overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[0%] left-[10%] sm:left-[30%] text-cyan-500/30 sm:text-cyan-500/50 ">
            <svg width="150" height="150" viewBox="0 0 190 190" className="w-32 h-32 sm:w-44 sm:h-44">
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
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[25px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
        <BubbleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <ScrollReveal variant="scaleUp" duration={800}>
            <div className="glass-3d bg-white/60  rounded-2xl p-8 sm:p-12 text-center text-slate-800 space-y-6 relative overflow-hidden border border-slate-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 rounded-full blur-3xl -z-0 animate-blobFloat1" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-300/50 rounded-full blur-3xl -z-0 animate-blobFloat2" />

              <div className="max-w-2xl mx-auto space-y-4 relative z-10">

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-blue-900">
                  Get Doorstep Service in 2 Hours
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Facing filter blockages, water leakage, changes in taste, or need urgent gas geyser servicing? Talk directly to our technical desk.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <a
                    href="tel:+919999999999"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800 hover:bg-slate-50 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    <PhoneCall className="w-4 h-4 text-slate-600" />
                    <span>Call: +91 98792 16149</span>
                  </a>
                  <button
                    onClick={() => openEnquiry("Emergency RO Service", "service")}
                    className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                  >
                    Book RO Service
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Bottom Wave (Slate-50 to White) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[15px] sm:h-[25px] animate-[waveAnimation_60s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
      </section>
    </div>
  );
}
