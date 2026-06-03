import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SD Enterprise | Pure Water Filters & Professional RO Services",
  description: "SD Enterprise is Gujarat's premier provider of Domestic Filters, Industrial RO Systems, Water Softeners, Gas Geysers, and Kangan Water systems. Get instant installation, quick repair, and AMC services.",
  keywords: "water filter, RO system, Ahmedabad water filter, domestic RO service, industrial RO, water softener, gas geyser, Kangan water, AMC contract",
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
