"use client";

import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { Shield, Lock, Eye, FileText, Info } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal variant="fadeInDown">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-600 text-lg">
              Last updated: June 09, 2026
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          
          <ScrollReveal variant="fadeInUp">
            <div className="flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <Info className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">1. Introduction</h2>
                <p className="text-slate-600 leading-relaxed">
                  Welcome to SD Enterprise. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services related to water purification systems.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeInUp">
            <div className="flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <Eye className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">2. Information We Collect</h2>
                <p className="text-slate-600 leading-relaxed">
                  We collect information that you provide directly to us, such as when you fill out a contact form, request a quote. This may include:
                </p>
                <ul className="list-disc ml-6 text-slate-600 space-y-2">
                  <li>Full Name and contact details.</li>
                  <li>Email address and mobile number.</li>
                  <li>Property address for installation or service requests.</li>
                  <li>Details about your current water purification setup.</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeInUp">
            <div className="flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <FileText className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">3. How We Use Your Information</h2>
                <p className="text-slate-600 leading-relaxed">
                  The information we collect is used to provide, operate, and maintain our services, schedule installation visits, and improve our customer service experience. We do not sell your personal information to third parties.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeInUp">
            <div className="flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <Lock className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">4. Data Security</h2>
                <p className="text-slate-600 leading-relaxed">
                  We implement appropriate technical and organizational measures to maintain the security of your personal information. However, please note that no method of transmission over the Internet is 100% secure.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeInUp">
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-slate-300 mb-6">
                If you have any questions about this Privacy Policy, please reach out to us:
              </p>
              <div className="space-y-2 text-slate-300">
                <p><strong>Email:</strong> info@sdenterprise.com</p>
                <p><strong>Phone:</strong> +91 98792 16149</p>
                <p><strong>Address:</strong> Plot No. 12, GIDC Phase 3, Naroda, Ahmedabad, Gujarat - 382330</p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </div>
  );
}
