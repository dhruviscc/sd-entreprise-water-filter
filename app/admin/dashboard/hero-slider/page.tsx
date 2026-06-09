"use client";

import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Plus, Pencil, Trash2, X, Edit, Upload, Loader2 } from "lucide-react";
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

  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Form state for the modal
  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    desktopImage: "",

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
    uploadData.append('bucket', 'hero-slider');

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
    <div className="space-y-4 sm:space-y-6 bg-slate-50 ">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              className="w-full py-2.5 pr-[40px] pl-[16px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
              placeholder="Search Slider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            ) : (
              <X className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 hidden" />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">

          <button
            onClick={() => { setCurrentSlider(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} /> <span>Add Slide</span>
          </button>
        </div>
      </div>


      {isLoading ? (
        <div className="text-center py-20">Loading sliders...</div>
      ) : (
        <div className="space-y-4">

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredSliders.map((slider) => (
              <div
                key={slider.id}
                className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm ${!slider.isActive ? "opacity-70 bg-slate-50" : ""
                  }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={slider.desktopImage}
                      alt={slider.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">
                      {slider.title}
                    </h3>


                  </div>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-xs font-medium text-sky-600 uppercase">
                      Subtitle
                    </span>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-5">
                      {slider.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-medium text-sky-600 uppercase">
                        Primary CTA
                      </span>
                      <p className="text-sm text-slate-700 mt-1">
                        {slider.primaryCtaText}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-sky-600 uppercase">
                        Secondary CTA
                      </span>
                      <p className="text-sm text-slate-700 mt-1">
                        {slider.secondaryCtaText}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() =>
                        handleToggle(slider.id, slider.isActive)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${slider.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {slider.isActive ? "Enabled" : "Disabled"}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(slider)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(slider)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      Subtitle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      Primary CTA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      Secondary CTA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-sky-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSliders.map((slider, index) => (
                    <tr
                      key={slider.id}
                      className={`hover:bg-slate-50 ${!slider.isActive
                        ? "bg-slate-50 opacity-70"
                        : ""
                        }`}
                    >
                      <td className="px-6 py-4  text-sm text-slate-400 font-mono">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <div className="relative w-20 h-12 rounded-md overflow-hidden bg-slate-100">
                          <Image
                            src={slider.desktopImage}
                            alt={slider.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-800">
                        {slider.title}
                      </td>

                      <td className="px-4 py-4 text-slate-600 text-sm ">
                        <div className="line-clamp-2">
                          {slider.subtitle}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {slider.primaryCtaText}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {slider.secondaryCtaText}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <button
                          onClick={() =>
                            handleToggle(
                              slider.id,
                              slider.isActive
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${slider.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {slider.isActive
                            ? "Enabled"
                            : "Disabled"}
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditModal(slider)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() =>
                              openDeleteModal(slider)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
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
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-300">
          <div className="bg-white p-[28px] rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="text-lg font-bold mb-5 text-slate-700" style={{ marginBottom: 0 }}>{currentSlider ? "Edit Slide" : "Add Slide"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <form className="flex flex-col gap-3.5" onSubmit={handleSave}>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">
                  Desktop Image *
                </label>

                <label className="relative w-50 h-50 border-2 border-dashed border-sky-300 rounded-xl overflow-hidden cursor-pointer hover:border-sky-500 transition-all">

                  {formState.desktopImage ? (
                    <>
                      <Image
                        src={formState.desktopImage}
                        alt="Desktop Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-sky-50">
                      {isUploading ? (
                        <Loader2 size={24} className="animate-spin text-sky-600" />
                      ) : (
                        <>
                          <Upload size={24} className="text-sky-600 mb-2" />
                          <span className="text-xs font-bold text-sky-600">
                            Upload Image
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "desktopImage")}
                    disabled={isUploading}
                  />
                </label>
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
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving}
                  className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none">


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


    </div>



  );
}
