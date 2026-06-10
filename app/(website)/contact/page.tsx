"use client";

import React, { useState } from "react";
import BubbleBackground from "@/components/BubbleBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { Phone, Mail, MapPin, MessageSquare, Clock, CheckCircle } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    serviceInterest: "General Enquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile_number: formData.mobileNumber,
          email_address: formData.emailAddress,
          service_interest: formData.serviceInterest,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({
          fullName: "",
          mobileNumber: "",
          emailAddress: "",
          serviceInterest: "General Enquiry",
          message: "",
        });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send request");
      }
    } catch (err: any) {
      console.error("Contact Form Error:", err);
      // You could add a toast here if you have a toast provider
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-digits
      setFormData((prev) => ({ ...prev, [name]: numericValue.slice(0, 10) })); // Limit to 10 digits
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Banner */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-25 sm:pb-16  md:pb-20 text-slate-800 text-center border-b border-slate-200 overflow-hidden bg-white">
        <BubbleBackground />

        <ScrollReveal variant="fadeInDown" duration={600}>
          <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 animate-float-3d">Contact SD Enterprise</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
              Get in touch for new filter installations, water quality testing, urgent maintenance, or annual AMC contract renewals.
            </p>
          </div>
        </ScrollReveal>
      </section>




      <section className="relative w-full bg-white py-16 lg:py-24 overflow-hidden">


        {/* Main Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* LEFT PANEL */}
            <div>
              <ScrollReveal variant="fadeInLeft" duration={800}>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 lg:p-8 h-[550px]">

                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide pb-3 border-b border-slate-200 mb-6">
                    Customer Support Desk
                  </h2>



                  <div className="mt-5 space-y-4">

                    {/* Phone */}
                    <a
                      href="tel:+919879216149"
                      className="flex gap-4 p-4 rounded-xl border items-center border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-sky-600" />
                      </div>

                      <div >
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Call Support
                        </p>
                        <p className="font-bold text-slate-800 text-sm">
                          +91 98792 16149
                        </p>
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/919879216149"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 p-4 rounded-xl border items-center border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          WhatsApp Support
                        </p>
                        <p className="font-bold text-emerald-600 text-sm">
                          Chat with Service Team
                        </p>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href="mailto:info@sdenterprise.com"
                      className="flex gap-4 p-4 items-center rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-sky-600" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Email Desk
                        </p>
                        <p className="font-bold text-slate-800 text-sm">
                          info@sdenterprise.com
                        </p>
                      </div>
                    </a>

                    {/* Address */}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Plot+No.+12,+GIDC+Phase+3,+Naroda,+Ahmedabad,+Gujarat+-+382330"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 p-4 py-3 items-center rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-sky-600" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Office Address
                        </p>
                        <p className=" text-slate-800 text-sm">
                          Plot No. 12, GIDC Phase 3,
                          Naroda, Ahmedabad,
                          Gujarat - 382330
                        </p>
                      </div>
                    </a>


                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT PANEL */}
            <div>
              <ScrollReveal  >
                <div className=" bg-white/70 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm card-3d-inner">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide pb-3 border-b border-slate-200 mb-6">
                    Send Message / Service Request
                  </h2>

                  {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 animate-in fade-in duration-300">
                      <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
                      <h3 className="text-2xl font-bold text-slate-800">Message Received!</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Your service interest details have been registered successfully. A service representative will call you in a moment.
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
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50 focus:bg-white transition-all text-slate-800"
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
                            maxLength={10}
                            placeholder="10 digit number"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50 focus:bg-white transition-all text-slate-800"
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
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50 focus:bg-white transition-all text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Service <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="serviceInterest"
                          required
                          value={formData.serviceInterest}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50 focus:bg-white transition-all text-slate-800"
                        >
                          <option value="General Enquiry">General Enquiry</option>
                          <option value="Domestic Filter Service">Domestic Filter Service</option>
                          <option value="All Types of RO & Services">All Types of RO & Services</option>
                          <option value="Industrial Filter Service">Industrial Filter Service</option>
                          <option value="Water Softener Installation">Water Softener Installation</option>
                          <option value="Gas Geyser Repair & Sale">Gas Geyser Repair & Sale</option>
                          <option value="Kangan Water Ionizer">Kangan Water Ionizer</option>
                          <option value="RO + Water Cooler Installation">RO + Water Cooler Installation</option>
                          <option value="AMC RO Contract">AMC RO Contract</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Message / Requirements Details
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          placeholder="Tell us about your requirements, water issues, or address..."
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50 focus:bg-white transition-all text-slate-800 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                      >
                        {isSubmitting ? "Sending Request..." : "Send Service Request"}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

          </div>

        </div>


      </section>

      {/* Google Maps embed */}
      <section className="max-w-7xl mx-auto p-5 sm:px-6 lg:px-8 space-y-4 ">
        <ScrollReveal variant="fadeInUp" duration={800}>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            Our Geographic Location (Ahmedabad, Gujarat)
          </h3>
          <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
     
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12398368.556847932!2d-0.05976507024788251!3d0.1443693565530188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa5f922de066fd38f%3A0x3578557376eb320b!2sSD%20Enterprise%20Water%20Filter%20Sales%20Service!5e0!3m2!1sen!2sin!4v1781064901243!5m2!1sen!2sin"
              className="w-full h-[360px] md:h-[560px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen

            />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
