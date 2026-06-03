"use client";

import { usePathname } from "next/navigation";

import BubbleCursor from "./BubbleCursor";
import EnquiryModal from "./EnquiryModal";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Footer from "./Footer";
import Header from "./Header";
import { EnquiryProvider } from "@/app/(website)/context/EnquiryContext";


export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname === "/login" || pathname.startsWith("/admin");

  if (isAdminArea) {
    return (
      <main className="min-h-screen bg-white">
        {children}
      </main>
    );
  }

  return (
    <>
      <BubbleCursor />
      <EnquiryProvider>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <EnquiryModal />
        <FloatingWhatsApp />
      </EnquiryProvider>
    </>
  );
}
