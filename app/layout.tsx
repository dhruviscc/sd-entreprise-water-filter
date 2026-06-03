import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SD Enterprise | Pure Water Filters & Professional RO Services",
  description: "SD Enterprise is Gujarat's premier provider of Domestic Filters, Industrial RO Systems, Water Softeners, Gas Geysers, and Kangan Water systems. Get instant installation, quick repair, and AMC services.",
  keywords: "water filter, RO system, Ahmedabad water filter, domestic RO service, industrial RO, water softener, gas geyser, Kangan water, AMC contract",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white flex flex-col">
        <AppShell>{children}</AppShell>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
