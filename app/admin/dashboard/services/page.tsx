"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Image as ImageIcon,
    Loader2,
    Info,
    Upload,
    PlusCircle,
    Home,
    Wrench,
    Building2,
    Droplets,
    Flame,
    Sparkles,
    IceCream,
    ShieldCheck,
    Cylinder,
} from 'lucide-react';
import { Service } from '@/modules/services/servicesService';
import { toast } from 'sonner';

const SERVICE_TITLES = [
    "Domestic Filter",
    "All Types of R.O. and Services",
    "Industrial Filter",
    "Water Softener",
    "Gas Geyser",
    "Kangan Water",
    "R.O. + Water Cooler",
    "AMC R.O Contract"
];

const ICON_OPTIONS = [
    { value: 'Home', label: 'Home', icon: Home },
    { value: 'Wrench', label: 'Wrench', icon: Wrench },
    { value: 'Building2', label: 'Building', icon: Building2 },
    { value: 'Droplets', label: 'Droplets', icon: Droplets },
    { value: 'Flame', label: 'Gas Geyser', icon: Flame },
    { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
    { value: 'IceCream', label: 'Ice Cream', icon: IceCream },
    { value: 'ShieldCheck', label: 'Shield', icon: ShieldCheck },
    { value: 'Cylinder', label: 'Cylinder', icon: Cylinder },
];

interface FAQ {
    question: string;
    answer: string;
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeShortService, setActiveShortService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        short_description: '',
        image: '',
        icon: '',
        features: [] as string[],
        faqs: [] as FAQ[],
        is_active: true,

    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/admin/api/services');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || `Server error: ${res.status}`);
            }

            setServices(data);
        } catch (err) {
            console.error("Failed to load services:", err);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (service: Service) => {
        try {
            const updated = await fetch('/admin/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: service.id, is_active: !service.is_active })
            });
            if (updated.ok) {
                toast.success(`Service ${!service.is_active ? 'activated' : 'deactivated'} successfully`);
                fetchServices();
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const openDeleteModal = (service: Service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!serviceToDelete?.id) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/admin/api/services?id=${serviceToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Service deleted successfully");
                fetchServices();
                setIsDeleteModalOpen(false);
                setServiceToDelete(null);
            } else {
                toast.error("Failed to delete service");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
        finally {
            setIsDeleting(false);
        }
    };

    const openModal = (service: Service | null = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || '',
                short_description: service.short_description || '',
                image: service.image || '',
                icon: service.icon,
                features: service.features || [],
                faqs: service.faqs || [],
                is_active: service.is_active ?? true,

            });
        } else {
            setEditingService(null);
            setFormData({
                name: '',
                description: '',
                short_description: '',
                image: '',
                icon: '',
                features: [''], // Default with one empty feature
                faqs: [{ question: '', answer: '' }], // Default with one empty FAQ
                is_active: true,

            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string = 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image size must be less than 4MB");
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/admin/api/upload', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || "Upload failed");
            }

            setFormData((prev: any) => ({ ...prev, [fieldName]: data.url }));
            toast.success("Image uploaded successfully");
        } catch (err: any) {
            toast.error(err?.message || "Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ""] });
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        setFormData({ ...formData, features: formData.features.filter((_: any, i: number) => i !== index) });
    };

    const addFAQ = () => {
        setFormData({ ...formData, faqs: [...formData.faqs, { question: "", answer: "" }] });
    };

    const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
        const newFaqs = [...formData.faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFormData({ ...formData, faqs: newFaqs });
    };

    const removeFAQ = (index: number) => {
        setFormData({ ...formData, faqs: formData.faqs.filter((_: any, i: number) => i !== index) });
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Please select or type a service title");
            return;
        }
        setIsSaving(true);
        const method = editingService ? 'PUT' : 'POST';
        const body = editingService ? { id: editingService.id, ...formData } : formData;

        try {
            const res = await fetch('/admin/api/services', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                toast.success(`Service ${editingService ? 'updated' : 'added'} successfully`);
                setIsModalOpen(false);
                fetchServices();
            } else {
                const data = await res.json();
                toast.error(data.error || data.details || "Failed to save service");
            }
        } catch (err) {
            toast.error("An error occurred while saving the service");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading services...</div>;

    return (
        <div className="p-[10px] text-slate-800 bg-slate-50 min-h-screen space-y-6">
            <div className="flex justify-between items-center mb-4">

                <div className="search-center">
                    <div className="relative w-fit">
                        <input
                            className="py-[11px] pr-[40px] pl-[16px] w-[320px] rounded-lg border border-gray-200 outline-none bg-white text-sm transition-all focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                            placeholder="Search Services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-sky flex items-center justify-center p-1 rounded-full transition-all hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                                onClick={() => setSearchTerm("")}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => { openModal(null); }}
                        className="px-4 py-2 text-sm border-none  rounded-[10px] bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-semibold cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap hover:bg-sky-700 hover:from-sky-700 via-sky-700 to-slate-700 transform transition duration-300 ease-in-out hover:scale-105"
                    >
                        <Plus size={18} /> Add Service
                    </button>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">#</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Service Image</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Service Name</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Short Description</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Description</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Status</th>
                            <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredServices.map((service, index) => (
                            <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                                    {index + 1}
                                </td>


                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                                        {service.image ? (
                                            <Image
                                                src={service.image}
                                                alt={service.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-800">
                                    {service.name}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate max-w-[150px]">{service.short_description}</span>
                                        {service.short_description && (
                                            <button
                                                onClick={() => setActiveShortService(service)}
                                                className="p-1 rounded-full hover:bg-sky-50 text-sky-500 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                                                title="View Short Description"
                                            >
                                                <Info size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {service.description && (
                                        <button
                                            onClick={() => {
                                                setSelectedServiceForDetail(service);
                                                setIsDetailModalOpen(true);
                                            }}
                                            className="p-1 rounded-full hover:bg-sky-50 text-sky-500 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                                            title="View Description Details"
                                        >
                                            <Info size={20} />
                                        </button>
                                    )}
                                </td>


                                <td className="px-4 py-[14px] whitespace-nowrap border-b border-[#e2e8f0]">
                                    <button
                                        onClick={() => handleToggleActive(service)}
                                        className={`px-3 py-[5px] rounded-lg text-[12px] font-medium cursor-pointer border border-transparent transition-all ${service.is_active ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}
                                        title={service.is_active ? "Disable" : "Enable"}
                                    >
                                        {service.is_active ? 'Enable' : 'Disable'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 ">
                                    <div className="flex gap-2">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#083574] text-sky-600 bg-[#eff6ff]  hover:bg-[#dbeafe] cursor-pointer transition-all"
                                            onClick={() => openModal(service)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(service)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] cursor-pointer transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 className="text-lg font-bold text-slate-700" style={{ marginBottom: 0 }}>
                                {editingService ? "Edit Service" : "Add New Service"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>

                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                                    Service Title *
                                </label>

                                <div className="relative">
                                    <select
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 shadow-sm transition-all duration-200 focus:border-[#083574] focus:ring-4 focus:ring-[#083574]/10 focus:outline-none hover:border-slate-300"
                                        required
                                    >
                                        <option value="">Select Service</option>

                                        {SERVICE_TITLES.map((title) => (
                                            <option key={title} value={title}>
                                                {title}
                                            </option>
                                        ))}
                                    </select>

                                    <svg
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Service Icon</label>
                                <div className="relative">
                                    <select
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 shadow-sm transition-all duration-200 focus:border-[#083574] focus:ring-4 focus:ring-[#083574]/10 focus:outline-none hover:border-slate-300"
                                    >
                                        <option value="">Select icon</option>
                                        {ICON_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    <svg
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                                {formData.icon && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                        {ICON_OPTIONS.find((option) => option.value === formData.icon)?.icon && (
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700">
                                                {React.createElement(
                                                    ICON_OPTIONS.find((option) => option.value === formData.icon)!.icon,
                                                    { className: 'w-4 h-4' }
                                                )}
                                            </span>
                                        )}
                                        <span>{formData.icon}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Service Image</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#083574]"
                                        placeholder="URL or Upload"
                                    />
                                    <label className="flex items-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg cursor-pointer hover:bg-sky-100">
                                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                        <span className="text-xs font-bold">Upload</span>
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} accept="image/*" disabled={isUploading} />
                                    </label>
                                </div>
                                {formData.image && (
                                    <div className="mt-2 w-16 h-16 relative rounded border overflow-hidden">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" unoptimized />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">

                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Short Description</label>
                                    <textarea
                                        value={formData.short_description}
                                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        rows={4}
                                        placeholder="Short description of the service..."
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        rows={4}
                                        placeholder="Detailed description of the service..."
                                    />
                                </div>
                            </div>

                            {/* Features Section */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Features</label>
                                    <button type="button" onClick={addFeature} className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded font-bold flex items-center gap-1"><PlusCircle size={14} /> Add</button>
                                </div>
                                {formData.features.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(idx, e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm"
                                            placeholder={`Feature ${idx + 1}`}
                                        />
                                        <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>

                            {/* FAQs Section */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">FAQs</label>
                                    <button type="button" onClick={addFAQ} className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded font-bold flex items-center gap-1"><PlusCircle size={14} /> Add</button>
                                </div>
                                {formData.faqs.map((faq: FAQ, idx: number) => (
                                    <div key={idx} className="p-3 border border-slate-100 rounded-lg space-y-2 bg-slate-50 relative">
                                        <button type="button" onClick={() => removeFAQ(idx)} className="absolute top-2 right-2 text-red-500"><X size={14} /></button>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => updateFAQ(idx, 'question', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[#e2e8f0] text-sm"
                                            placeholder="Question"
                                        />
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => updateFAQ(idx, 'answer', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[#e2e8f0] text-sm"
                                            placeholder="Answer"
                                            rows={2}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                                    {isSaving ? "Saving..." : "Save Service"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description Detail Modal */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-sky-600">Service Description</h3>
                            <button
                                onClick={() => { setIsDetailModalOpen(false); setSelectedServiceForDetail(null); }}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedServiceForDetail?.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-[350px] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-center">
                        <div style={{ marginBottom: "20px" }}>
                            <div className="w-[60px] h-[60px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={30} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2">Delete Service?</h3>
                            <p className="text-[#584c79] text-[14px] m-0">
                                Are you sure you want to delete <b>{serviceToDelete?.name}</b>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                className="flex-1 p-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-slate-200 text-slate-800 transition-colors hover:bg-slate-50"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setServiceToDelete(null);
                                }}
                                disabled={isDeleting}
                            >No, Keep it</button>
                            <button className="flex-1 p-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-red-500 text-white border-none transition-colors hover:bg-red-600 disabled:bg-red-400" disabled={isDeleting} onClick={confirmDelete}>
                                {isDeleting ? "Deleting..." : "Yes, Delete!"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Short Description Popup Modal */}
            {activeShortService && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setActiveShortService(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl  max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300 border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-sky-600 tracking-tight">{activeShortService.name}</h3>
                            <button onClick={() => setActiveShortService(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" >  <X size={18} /></button>


                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {activeShortService.short_description}
                            </p>
                        </div>


                    </div>
                </div>
            )}

        </div>
    );
}