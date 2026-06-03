"use client";

import React, { useState, useMemo } from "react";
import { faqsData } from "../data/mockData";
import BubbleBackground from "@/components/BubbleBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { Search, ChevronDown, ChevronUp, HelpCircle, X, Droplets, Cylinder } from "lucide-react";
import Link from "next/link";


const categories = ["All FAQs", "General", "Products", "Services", "AMC", "Technical Questions"];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All FAQs");
  const [openFaqIds, setOpenFaqIds] = useState<string[]>([]);

  // Toggle single FAQ accordion panel
  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Expand all active questions
  const expandAll = (faqsToExpand: typeof faqsData) => {
    setOpenFaqIds(faqsToExpand.map((faq) => faq.id));
  };

  // Collapse all questions
  const collapseAll = () => {
    setOpenFaqIds([]);
  };

  // Filter FAQs based on search input and active category
  const filteredFaqs = useMemo(() => {
    return faqsData.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All FAQs" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Banner */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-44 md:pb-20 text-center border-b border-slate-200 overflow-hidden bg-white">
        <BubbleBackground />
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[10%] right-[5%] sm:right-[10%] text-sky-500/10 animate-float-3d scale-75 sm:scale-100">
            <svg width="120" height="120" viewBox="0 0 180 180" className="w-24 h-24 sm:w-36 sm:h-36">
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

          <div className="absolute top-[8%] left-[15%] text-cyan-600/10 animate-float-3d">
            <Droplets className="w-20 h-20 sm:w-32 sm:h-32 lg:w-30 lg:h-40" strokeWidth={1.2} />
          </div>

        </div>

        <ScrollReveal variant="fadeInDown" duration={600}>
          <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 animate-float-3d">Frequently Asked Questions</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
              Find answers to common questions about water TDS limits, installation processes, maintenance cycles, and repair coverage.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Live search box & quick control buttons */}
      <section className="max-w-full bg-white relative  mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-12">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          <div className="absolute bottom-[30%] right-[-5%] sm:right-[4%] text-cyan-600/10 animate-float-3d opacity-40 sm:opacity-100">
            <Droplets className="w-16 h-16 sm:w-28 sm:h-28" />
          </div>

          <div className="absolute bottom-[15%] left-[-5%] sm:left-[5%] text-sky-500/10 animate-float-3d opacity-40 sm:opacity-100">
            <Cylinder className="w-16 h-16 sm:w-28 sm:h-28" strokeWidth={1} />
          </div>
          <div className="absolute top-[2%] left-[10%] text-cyan-500/10 animate-float-3d rotate-120">
            <svg width="100" height="100" viewBox="0 0 150 150" className="w-24 h-24 sm:w-36 sm:h-36">
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
        <ScrollReveal variant="fadeInUp" duration={500}>
          <div className="flex flex-col  max-w-7xl mx-auto sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            {/* Search bar */}
            <div className="relative w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-slate-50 text-slate-800"
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

            {/* Quick actions */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => expandAll(filteredFaqs)}
                className="flex-grow sm:flex-grow-0 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="flex-grow sm:flex-grow-0 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter Pills */}
        <ScrollReveal variant="fadeInUp" duration={500} delay={100}>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenFaqIds([]); // Reset open items
                  }}
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
        </ScrollReveal>


        {/* Accordion Lists */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filteredFaqs.length === 0 ? (
            <ScrollReveal variant="scaleUp" duration={500}>
              <div className="bg-white rounded-xl border border-slate-100 p-16 text-center shadow-sm space-y-3">
                <span className="block text-4xl">❓</span>
                <h3 className="text-lg font-bold text-slate-800">No Answers Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  We couldn't find any FAQs answering "{searchTerm}". Please contact our service desk directly.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-block px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Contact Support Desk
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIds.includes(faq.id);
                return (
                  <ScrollReveal
                    key={faq.id}
                    variant="fadeInUp"
                    delay={Math.min(index * 60, 400)}
                    duration={600}
                  >
                    <div className="glass-3d rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-start justify-between p-5 text-left transition-colors cursor-pointer hover:bg-slate-50/50"
                      >
                        <div className="flex gap-3">
                          <HelpCircle className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base font-bold text-slate-700 leading-snug">
                            {faq.question}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1.5 bg-white border-t border-slate-50 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                          <p className="pl-8">{faq.answer}</p>
                          <span className="inline-block mt-3 ml-8 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Category: {faq.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </section>

      </section>


      {/* Direct support call out */}
      <section className="relative  pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[4%] left-[10%] sm:left-[20%] text-cyan-500/30 sm:text-cyan-500/50 ">
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
        {/* Top Wave (White to Sky-50) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[30px] sm:h-[60px] animate-[waveAnimation_30s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>
        <BubbleBackground />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative ">
          <ScrollReveal variant="scaleUp" duration={700}>
            <div className="glass-3d bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl shadow-sky-900/5">
              <div className="flex items-center gap-5 text-left">
                <div className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200 shrink-0 animate-float-3d">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Still have questions?</h4>
                  <p className="text-sm text-slate-500 max-w-md mt-1 leading-relaxed font-medium">
                    Our support team is online. Get clear answers about custom flow rate requirements or local water hardness queries.
                  </p>
                </div>
              </div>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-sky-100 transition-all hover:-translate-y-1 whitespace-nowrap active:scale-95"
              >
                Ask Us Directly
              </Link>
            </div>
          </ScrollReveal>
        </div>
        {/* Bottom Wave (Sky-50 to White) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[30px] sm:h-[60px] animate-[waveAnimation_30s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>

      </section>
    </div>
  );
}
