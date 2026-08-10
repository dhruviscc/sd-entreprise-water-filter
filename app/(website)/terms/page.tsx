import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { FileText, ShieldCheck, UserCheck, AlertCircle, Scale } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className=" py-16 border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <ScrollReveal variant="fadeInDown">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
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
                                <FileText className="w-6 h-6 text-sky-600" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-800">1. Acceptance of Terms</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    By accessing and using the services provided by SD Enterprise, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or website.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp">
                        <div className="flex gap-4 items-start">
                            <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                                <ShieldCheck className="w-6 h-6 text-sky-600" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-800">2. Services Provided</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    SD Enterprise provides water purification solutions, including RO system installation, maintenance water softener setup, and repair services. All services are subject to availability and specific service contracts.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp">
                        <div className="flex gap-4 items-start">
                            <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                                <UserCheck className="w-6 h-6 text-sky-600" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-800">3. User Responsibilities</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Users are responsible for providing accurate information for installation and service requests. You must ensure that our technicians have safe access to the equipment at the scheduled appointment times.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp">
                        <div className="flex gap-4 items-start">
                            <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                                <AlertCircle className="w-6 h-6 text-sky-600" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-800">4. Limitation of Liability</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    SD Enterprise shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services, or any performance issues related to source water quality fluctuations.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp">
                        <div className="flex gap-4 items-start">
                            <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                                <Scale className="w-6 h-6 text-sky-600" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-800">5. Governing Law</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    These terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white">
                            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
                            <p className="text-slate-300 mb-6">
                                If you have any questions regarding our Terms of Service, please contact us:
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