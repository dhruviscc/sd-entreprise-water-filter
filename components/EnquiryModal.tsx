"use client";

import React, { useState, useEffect } from "react";

import { X, Send, CheckCircle2 } from "lucide-react";
import { useEnquiry } from "@/app/(website)/context/EnquiryContext";
import { Service } from "@/modules/services/servicesService";

export default function EnquiryModal() {
  const { isOpen, interestName, interestType, closeEnquiry } = useEnquiry();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    serviceInterest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/admin/api/product?active=true")
        ]);

        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setServices(Array.isArray(data) ? data.filter((s: any) => s.is_active !== false) : []);
        }

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch enquiry data:", err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  // Sync interest name with context
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        serviceInterest: interestName || "General Enquiry",
      }));
      setIsSuccess(false);
    }
  }, [isOpen, interestName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/admin/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "enquiry",
          name: formData.fullName,
          mobile: formData.mobileNumber,
          email: formData.emailAddress,
          product_name: formData.serviceInterest,
          message: formData.message,
          status: "new",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit enquiry");
      }

      setIsSuccess(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        emailAddress: "",
        serviceInterest: interestName || "General Enquiry",
        message: "",
      });

      setTimeout(() => closeEnquiry(), 3000);
    } catch (err) {
      console.error("Enquiry submission error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r  from-sky-200  text-blue-550 ">
          <button
            onClick={closeEnquiry}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-blue hover:bg-white/30 hover:scale-105 transition-all focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">Quick Enquiry Form</h3>
          <p className="text-blue text-sm mt-1 ">
            Fill out the details below and our filtration expert will get back to you shortly.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
              <h4 className="text-2xl font-bold text-slate-800">Thank You!</h4>
              <p className="text-slate-600 mt-2">
                Your enquiry for <span className="font-semibold text-sky-600">"{interestName || "General Enquiry"}"</span> has been submitted successfully.
              </p>
              <p className="text-slate-400 text-xs mt-4">
                We will contact you on your mobile number within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 text-sm bg-slate-50 hover:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 text-sm bg-slate-50 hover:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    placeholder="Enter email address"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 text-sm bg-slate-50 hover:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Service / Product Interest <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceInterest"
                  required
                  value={formData.serviceInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 text-sm bg-slate-50 hover:bg-white transition-all"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <optgroup label="Services">
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>{service.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Products">
                    {products.map((product) => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Requirements
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Specify any details, e.g. location, timing, water issues..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 text-sm bg-slate-50 hover:bg-white transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r via-sky-300  text-blue-950 font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Enquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-blue" />
                      Submit Enquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
