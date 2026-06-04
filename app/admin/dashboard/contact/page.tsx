'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Calendar,
    Phone,
    Mail,
    Trash2,
    Eye,
    X,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Contact } from '@/modules/contact/contactService';

export default function EnquiryPage() {
    const [enquiries, setEnquiries] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

    // UI States
    const [selectedEnquiry, setSelectedEnquiry] = useState<Contact | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch('/admin/api/contact');
            const data = await res.json();
            if (Array.isArray(data)) {
                setEnquiries(data);
            }
        } catch (error) {
            toast.error("Failed to fetch enquiries");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
        setIsUpdatingStatus(true);
        try {
            const res = await fetch('/admin/api/contact', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                toast.success(`Status updated to ${newStatus}`);
                setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
                if (selectedEnquiry?.id === id) {
                    setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!enquiryToDelete) return;
        try {
            const res = await fetch(`/admin/api/contact?id=${enquiryToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Enquiry deleted successfully");
                setEnquiries(prev => prev.filter(e => e.id !== enquiryToDelete));
                setIsDeleteModalOpen(false);
                setEnquiryToDelete(null);
            } else {
                toast.error("Failed to delete enquiry");
            }
        } catch (error) {
            toast.error("Error deleting enquiry");
        }
    };

    const handleExport = () => {
        if (enquiries.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["Date", "Source", "Name", "Mobile", "Email", "Interest", "Status", "Message"];
        const csvData = (enquiries as any[]).map(e => [
            new Date(e.created_at).toLocaleDateString(),
            e.source || 'Lead',
            e.full_name,
            e.mobile_number,
            e.email_address || 'N/A',
            e.service_interest,
            e.status,
            e.message?.replace(/"/g, '""') || ''

        ]);


        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `enquiries_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Enquiries exported successfully");
    };

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch =
            enquiry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.mobile_number.includes(searchTerm) ||
            enquiry.service_interest.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'closed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };


    return (
        <div className="space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <input
                            className="w-full py-2.5 pr-[40px] pl-[10px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                onClick={() => setSearchTerm("")}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">


                    <div className="flex gap-2">
                        <select
                            className="flex-1 sm:flex-none px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/10 bg-white shadow-sm font-bold text-slate-600"
                            value={statusFilter}
                            onChange={(e: any) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                        </select>

                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">

                
             <table className="w-full border-collapse">
                            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                            <tr>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                    #</th>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                    Type</th>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                    Customer</th>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                    Interest</th>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                    Date</th>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                    Status</th>
                                <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap ">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
                                        <p className="mt-2 text-sm text-slate-500">Loading enquiries...</p>
                                    </td>
                                </tr>
                            ) : filteredEnquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <p>No enquiries found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEnquiries.map((enquiry, index) => (
                                    <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center text-slate-400 font-mono text-xs">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span className={`text-[13px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${(enquiry as any).source === 'Product Enquiry'
                                                    ? 'bg-purple-50 text-purple-600 border border-purple-100'
                                                    : 'bg-sky-50 text-sky-600 border border-sky-100'
                                                    }`}>
                                                    {(enquiry as any).source || 'Lead'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">

                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800 text-sm">{enquiry.full_name}</span>

                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <Phone size={10} /> {enquiry.mobile_number}
                                                    </span>
                                                    {enquiry.email_address && (
                                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                            <Mail size={10} /> {enquiry.email_address}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-sky-50 text-sky-700 text-[11px] font-bold uppercase tracking-wider border border-sky-100">
                                                {enquiry.service_interest}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Calendar size={12} />
                                                {new Date(enquiry.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex">
                                                <button

                                                    className={`px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 cursor-pointer transition-all ${getStatusStyles(enquiry.status)}`}
                                                >

                                                    {enquiry.status}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedEnquiry(enquiry);
                                                        setIsDetailsModalOpen(true);
                                                    }}
className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8fafc] text-slate-700 hover:bg-[#e2e8f0] transition-all"                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEnquiryToDelete(enquiry.id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef2f2] text-red-500 hover:bg-[#fee2e2] transition-all"                                                    title="Delete Enquiry"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
               
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Enquiry Details</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Reference ID: {selectedEnquiry.id.slice(0, 8)}</p>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            {/* Customer Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-sky-500 transition-colors">Customer Name</span>
                                        <span className="text-sm font-bold text-slate-800">{selectedEnquiry.full_name}</span>
                                    </div>
                                    <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-sky-500 transition-colors">Mobile Number</span>
                                        <a href={`tel:${selectedEnquiry.mobile_number}`} className="text-sm font-bold text-sky-600 hover:underline flex items-center gap-2">
                                            {selectedEnquiry.mobile_number} <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-sky-500 transition-colors">Email Address</span>
                                        <span className="text-sm font-bold text-slate-800">{selectedEnquiry.email_address || 'Not Provided'}</span>
                                    </div>
                                    <div className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-sky-500 transition-colors">Service Interest</span>
                                        <span className="text-sm font-bold text-slate-800">{selectedEnquiry.service_interest}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Customer Message</span>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "{selectedEnquiry.message || 'No message provided by customer.'}"
                                </p>
                            </div>

                            {/* Status and Submission Info */}
                            <div className="flex justify-between items-center py-4 border-t border-slate-100">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Submitted on {new Date(selectedEnquiry.created_at).toLocaleString()}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={isUpdatingStatus}
                                        onClick={() => handleUpdateStatus(selectedEnquiry.id, 'contacted')}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedEnquiry.status === 'contacted'
                                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                                            : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100'
                                            }`}
                                    >

                                        Mark Contacted
                                    </button>
                                    <button
                                        disabled={isUpdatingStatus}
                                        onClick={() => handleUpdateStatus(selectedEnquiry.id, 'closed')}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedEnquiry.status === 'closed'
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                                            }`}
                                    >
                                        Mark Closed
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Trash2 size={32} />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Delete Enquiry?</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                This action cannot be undone. This enquiry will be permanently removed from your history.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
