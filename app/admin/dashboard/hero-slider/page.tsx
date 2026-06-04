"use client";

import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Plus, Pencil, Trash2, X, AlertCircle, CheckCircle, CheckCircle2, MoveVertical, Edit, Info, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";


export default function HeroSliderAdmin() {
    const [sliders, setSliders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentSlider, setCurrentSlider] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sliderToDelete, setSliderToDelete] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSlider, setSelectedSlider] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Form state for the modal
    const [formState, setFormState] = useState({
        title: "",
        subtitle: "",
        desktopImage: "",
        mobileImage: "",
        primaryCtaText: "",
        primaryCtaLink: "",
        secondaryCtaText: "",
        secondaryCtaLink: "",
        secondaryInterest: "",
        secondaryType: "service" as "service" | "product" | "general",

        isActive: true,
    });

    useEffect(() => {
        if (currentSlider) {
            setFormState({
                title: currentSlider.title || "",
                subtitle: currentSlider.subtitle || "",
                desktopImage: currentSlider.desktopImage || "",
                mobileImage: currentSlider.mobileImage || "",
                primaryCtaText: currentSlider.primaryCtaText || "",
                primaryCtaLink: currentSlider.primaryCtaLink || "",
                secondaryCtaText: currentSlider.secondaryCtaText || "",
                secondaryCtaLink: currentSlider.secondaryCtaLink || "",
                secondaryInterest: currentSlider.secondaryInterest || "",
                secondaryType: currentSlider.secondaryType || "service",

                isActive: currentSlider.isActive,
            });
        } else {
            setFormState({
                title: "",
                subtitle: "",
                desktopImage: "",
                mobileImage: "",
                primaryCtaText: "",
                primaryCtaLink: "",
                secondaryCtaText: "",
                secondaryCtaLink: "",
                secondaryInterest: "",
                secondaryType: "service",
                isActive: true,
            });
        }
    }, [currentSlider, sliders.length]);

    const fetchSliders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/admin/api/hero-slider");
            const data = await res.json();
            setSliders(Array.isArray(data) ? data.sort((a: any, b: any) => a.order - b.order) : []);
        } catch (error) {
            toast.error("Failed to load sliders");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleToggle = useCallback(async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch("/admin/api/hero-slider", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: "toggle", id, isActive: !currentStatus }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to update status");
            }

            toast.success("Status updated successfully!");
            fetchSliders();
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    }, [fetchSliders]);

    const openDeleteModal = useCallback((slider: any) => {
        setSliderToDelete(slider);
        setIsDeleteModalOpen(true);
    }, []);

    const openEditModal = (slider: any) => {
        setCurrentSlider(slider);
        setFormState({
            title: slider.title || "",
            subtitle: slider.subtitle || "",
            desktopImage: slider.desktopImage || "",
            mobileImage: slider.mobileImage || "",
            primaryCtaText: slider.primaryCtaText || "",
            primaryCtaLink: slider.primaryCtaLink || "",
            secondaryCtaText: slider.secondaryCtaText || "",
            secondaryCtaLink: slider.secondaryCtaLink || "",
            secondaryInterest: slider.secondaryInterest || "",
            secondaryType: slider.secondaryType || "service",

            isActive: slider.isActive,
        });
        setIsModalOpen(true);
    };




    const handleDeleteSlider = async () => {
        if (!sliderToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/admin/api/hero-slider`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: sliderToDelete.id }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to delete slide.");
            }

            toast.success("Slide deleted successfully!");
            setIsDeleteModalOpen(false);
            setSliderToDelete(null);
            await fetchSliders();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete slide.");
            setIsDeleting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset the input value immediately to allow re-uploading the same file if needed
        e.target.value = '';

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPEG, PNG, GIF, and WebP images are allowed.");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image size must be less than 4MB");
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/admin/api/upload', { method: 'POST', body: uploadData });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed with status: ${res.status}`);
            }
            const data = await res.json();
            setFormState((prev) => ({ ...prev, [fieldName]: data.url }));
            toast.success("Image uploaded successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormState((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (name === "order") {
            setFormState((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormState((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = currentSlider ? "PUT" : "POST";
            const url = "/admin/api/hero-slider";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentSlider ? { ...formState, id: currentSlider.id } : formState),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to save slide");
            }

            toast.success(`Slide ${currentSlider ? "updated" : "added"} successfully!`);
            setIsModalOpen(false);

            // Reset form state after successful save
            setCurrentSlider(null);
            setFormState({
                title: "",
                subtitle: "",
                desktopImage: "",
                mobileImage: "",
                primaryCtaText: "",
                primaryCtaLink: "",
                secondaryCtaText: "",
                secondaryCtaLink: "",
                secondaryInterest: "",
                secondaryType: "service",

                isActive: true,
            });

            fetchSliders();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong while saving");
        } finally {
            setIsSaving(false);
        }
    }, [currentSlider, formState, fetchSliders, sliders.length]);



    const filteredSliders = sliders.filter(slider =>
        slider.title?.toLowerCase().includes(search.toLowerCase()) ||
        slider.subtitle?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-[10px] text-slate-800 bg-slate-50 min-h-screen space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className="search-center">
                    <div className="relative w-fit">
                        <input
                            className="py-[11px] pr-[40px] pl-[16px] w-[320px] rounded-lg border border-gray-200 outline-none bg-white text-sm transition-all focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                            placeholder="Search Slider..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-sky flex items-center justify-center p-1 rounded-full transition-all hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                                onClick={() => setSearch("")}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => { setCurrentSlider(null); setIsModalOpen(true); }}
                        className="px-4 py-2 text-sm border-none  rounded-[10px] bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-semibold cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap hover:bg-sky-700 hover:from-sky-700 via-sky-700 to-slate-700 transform transition duration-300 ease-in-out hover:scale-105"
                    >
                        <Plus size={18} /> Add New Slide
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">Loading sliders...</div>
            ) : (
                <div className="grid gap-4">
                    <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                                <tr>
                                    <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600  uppercase tracking-wider whitespace-nowrap">
                                        Image
                                    </th>
                                    <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                                        Title
                                    </th>
                                    <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                                        Subtitle
                                    </th>
                                    <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                                        Primary CTA
                                    </th>
                                    <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                                        Secondary CTA
                                    </th>
                                    <th scope="col" className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                                        Status
                                    </th>

                                    <th scope="col" className="px-4 py-[14px] text-right text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSliders.map((slider) => (
                                    <tr key={slider.id} className={`hover:bg-[#f1f5f9] ${!slider.isActive ? 'bg-slate-50 opacity-70' : ''}`}>
                                        <td className="px-4 py-[14px] whitespace-nowrap border-b border-[#e2e8f0]">
                                            <div className="relative w-20 h-12 rounded-md overflow-hidden bg-slate-100">
                                                <Image
                                                    src={slider.desktopImage}
                                                    alt={slider.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-[14px] border-b border-[#e2e8f0]">
                                            <div className="text-sm font-medium text-[#1e293b] line-clamp-1">{slider.title}</div>
                                        </td>
                                        <td className="px-4 py-[14px] border-b border-[#e2e8f0]">
                                            <div className="flex items-center gap-2">
                                                {/* <div className="text-sm text-[#475569] line-clamp-1 max-w-[150px]">{slider.subtitle}</div> */}
                                                {slider.subtitle && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSlider(slider);
                                                            setIsDetailModalOpen(true);
                                                        }}
                                                        className="p-1 rounded-full hover:bg-sky-50 text-sky-500 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                                                        title="View Subtitle Details"
                                                    >
                                                        <Info size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-[14px] whitespace-nowrap text-sm text-[#475569] border-b border-[#e2e8f0]">
                                            {slider.primaryCtaText}
                                        </td>
                                        <td className="px-4 py-[14px] whitespace-nowrap text-sm text-[#475569] border-b border-[#e2e8f0]">
                                            {slider.secondaryCtaText}
                                        </td>
                                        <td className="px-4 py-[14px] whitespace-nowrap border-b border-[#e2e8f0]">
                                            <button
                                                onClick={() => handleToggle(slider.id, slider.isActive)}
                                                className={`px-3 py-[5px] rounded-lg text-[12px] font-medium cursor-pointer border border-transparent transition-all ${slider.isActive ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}
                                                title={slider.isActive ? "Disable" : "Enable"}
                                            >
                                                {slider.isActive ? 'Enable' : 'Disable'}
                                            </button>
                                        </td>
                                     
                                        <td className="px-4 py-[14px] whitespace-nowrap text-right text-sm font-medium border-b border-[#e2e8f0]">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(slider)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#083574] text-sky-600 bg-[#eff6ff]  hover:bg-[#dbeafe] cursor-pointer transition-all"
                                                    title="Edit Slide"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(slider)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border-0 text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] cursor-pointer transition-all"
                                                    title="Delete Slide"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 className="text-lg font-bold mb-5 text-slate-700" style={{ marginBottom: 0 }}>{currentSlider ? "Edit Slide" : "Add New Slide"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
                        </div>
                        <form className="flex flex-col gap-3.5" onSubmit={handleSave}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="desktopImage" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Desktop Image URL *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="desktopImage"
                                            name="desktopImage"
                                            className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                            value={formState.desktopImage}
                                            onChange={handleFormChange}
                                            required
                                        />
                                        <label className="flex items-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg cursor-pointer hover:bg-sky-100 h-fit self-center">
                                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <span className="text-xs font-bold">Upload</span>
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'desktopImage')} accept="image/*" disabled={isUploading} />
                                        </label>
                                    </div>
                                    {formState.desktopImage && (
                                        <div className="mt-2 w-16 h-10 relative rounded border overflow-hidden">
                                            <Image src={formState.desktopImage} alt="Desktop Preview" fill className="object-cover" unoptimized />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="mobileImage" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Mobile Image URL *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="mobileImage"
                                            name="mobileImage"
                                            className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                            value={formState.mobileImage}
                                            onChange={handleFormChange}
                                            required
                                        />
                                        <label className="flex items-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg cursor-pointer hover:bg-sky-100 h-fit self-center">
                                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <span className="text-xs font-bold">Upload</span>
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'mobileImage')} accept="image/*" disabled={isUploading} />
                                        </label>
                                    </div>
                                    {formState.mobileImage && (
                                        <div className="mt-2 w-10 h-16 relative rounded border overflow-hidden mx-auto">
                                            <Image src={formState.mobileImage} alt="Mobile Preview" fill className="object-cover" unoptimized />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <label htmlFor="title" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                    value={formState.title}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <label htmlFor="subtitle" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                                    Subtitle
                                </label>
                                <textarea
                                    id="subtitle"
                                    name="subtitle"
                                    className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                    rows={2}
                                    value={formState.subtitle}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="primaryCtaText" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Primary CTA Text</label>
                                    <input
                                        type="text"
                                        id="primaryCtaText"
                                        name="primaryCtaText"
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        value={formState.primaryCtaText}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="primaryCtaLink" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Primary CTA Link</label>
                                    <input
                                        type="text"
                                        id="primaryCtaLink"
                                        name="primaryCtaLink"
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        value={formState.primaryCtaLink}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="secondaryCtaText" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Secondary CTA Text</label>
                                    <input
                                        type="text"
                                        id="secondaryCtaText"
                                        name="secondaryCtaText"
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        placeholder="e.g. Book RO Service"
                                        value={formState.secondaryCtaText}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="secondaryCtaLink" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Secondary CTA Link</label>
                                    <input
                                        type="text"
                                        id="secondaryCtaLink"
                                        name="secondaryCtaLink"
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        placeholder="Leave empty for popup"
                                        value={formState.secondaryCtaLink}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="secondaryInterest" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Enquiry Interest <span className="text-[#94a3b8] normal-case">(Prefill)</span></label>
                                    <input
                                        type="text"
                                        id="secondaryInterest"
                                        name="secondaryInterest"
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        placeholder="e.g. All Types of RO"
                                        value={formState.secondaryInterest}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px]">
                                    <label htmlFor="secondaryType" className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Enquiry Type</label>
                                    <select
                                        id="secondaryType"
                                        name="secondaryType"
                                        className="w-full px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm transition-all focus:outline-none focus:border-[#083574] focus:ring-2 focus:ring-[#083574]/10"
                                        value={formState.secondaryType}
                                        onChange={handleFormChange}
                                    >
                                        <option value="service">Service</option>
                                        <option value="product">Product</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none">
                                    {isSaving ? "Saving..." : currentSlider ? "Update Slide" : "Add Slide"}
                                </button>
                            </div>
                        </form>
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
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2">Delete Slide?</h3>
                            <p className="text-[#584c79] text-[14px] m-0">
                                Are you sure you want to delete <b>{sliderToDelete?.title}</b>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                className="flex-1 p-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-slate-200 text-slate-800 transition-colors hover:bg-slate-50"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSliderToDelete(null);
                                }}
                            >No, Keep it</button>
                            <button className="flex-1 p-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-red-500 text-white border-none transition-colors hover:bg-red-600" disabled={isDeleting} onClick={handleDeleteSlider}>
                                {isDeleting ? "Deleting..." : "Yes, Delete!"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Subtitle Detail Modal */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-sky-600">Subtitle Details</h3>
                            <button
                                onClick={() => { setIsDetailModalOpen(false); setSelectedSlider(null); }}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"                            >
                                <X size={20} />


                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedSlider?.subtitle || "No subtitle provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>



    );
}
