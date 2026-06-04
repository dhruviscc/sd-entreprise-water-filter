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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Banner */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-44 md:pb-20 text-center  border-slate-200 overflow-hidden bg-white">
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




      <section className="relative w-full bg-sky-100 py-16 lg:py-24 overflow-hidden">

        {/* Top Wave (White to Sky-50) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180 transform -translate-y-1">
          <svg className="relative block w-[200%] max-w-none h-[25px] sm:h-[45px] animate-[waveAnimation_30s_linear_infinite]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z" className="fill-white"></path>
          </svg>
        </div>


        {/* Main Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* LEFT PANEL */}
            <div>
              <ScrollReveal variant="fadeInLeft" duration={800}>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 lg:p-8 h-full">

                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide pb-3 border-b border-slate-200 mb-6">
                    Customer Support Desk
                  </h2>



                  <div className="mt-5 space-y-4">

                    {/* Phone */}
                    <a
                      href="tel:+919999999999"
                      className="flex gap-4 p-2 rounded-xl border  border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-sky-600" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Call Support
                        </p>
                        <p className="font-bold text-slate-800 text-sm">
                          +91 99999 99999
                        </p>
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 p-2 rounded-xl border items-center border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
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
                    <div className="flex gap-4 p-2 items-center rounded-xl border border-slate-200">
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
                    </div>

                    {/* Address */}
                    <div className="flex gap-4 p-2 items-center rounded-xl border border-slate-200">
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
                    </div>

                    {/* Hours */}
                    <div className="flex gap-4 px-2 py-4 items-center rounded-xl border border-slate-200">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-sky-600" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Business Hours
                        </p>
                        <p className="text-slate-800 text-sm">
                          Mon - Sat : 9:00 AM - 7:00 PM
                        </p>
                      </div>
                    </div>

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

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg
            className="block w-[200%] max-w-none h-[40px] sm:h-[60px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2400 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C37.5,120 112.5,0 150,60 C187.5,120 262.5,0 300,60 C337.5,120 412.5,0 450,60 C487.5,120 562.5,0 600,60 C637.5,120 712.5,0 750,60 C787.5,120 862.5,0 900,60 C937.5,120 1012.5,0 1050,60 C1087.5,120 1162.5,0 1200,60 C1237.5,120 1312.5,0 1350,60 C1387.5,120 1462.5,0 1500,60 C1537.5,120 1612.5,0 1650,60 C1687.5,120 1762.5,0 1800,60 C1837.5,120 1912.5,0 1950,60 C1987.5,120 2062.5,0 2100,60 C2137.5,120 2212.5,0 2250,60 C2287.5,120 2362.5,0 2400,60 L2400,120 L0,120 Z"
              className="fill-white"
            />
          </svg>
        </div>

      </section>

      {/* Google Maps embed */}
      <section className="max-w-7xl mx-auto p-20 sm:px-6 lg:px-8 space-y-4 ">
        <ScrollReveal variant="fadeInUp" duration={800}>
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            Our Geographic Location (Ahmedabad, Gujarat)
          </h3>
          <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.1895781498616!2d72.64834887606622!3d23.053531315809796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d1131.0664!2d72.649622!3d23.053787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
