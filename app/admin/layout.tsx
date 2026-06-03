
import type { Metadata } from "next";
import './dashboard/dashboard.css'

export const metadata: Metadata = {
    title: "Admin Dashboard | SD Enterprise",
    description: "SD Enterprise Admin Panel",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <> 
    {children}
    </>;
}
