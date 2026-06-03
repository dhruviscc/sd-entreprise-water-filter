"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    Check,
    Edit,
    Eye,
    Image as ImageIcon,
    Loader2,
    Plus,
    PlusCircle,
    Save,
    Search,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { toast } from "sonner";
import type {
    Product,
    ProductCategory,
    ProductEnquiry,
    ProductVariant,
} from "@/modules/product/productService";

const PRODUCT_CATEGORY_NAMES = [
    "Domestic Filter",
    "Industrial Filter",
    "RO Systems",
    "Water Softener",
    "Gas Geyser",
    "Kangan Water",
    "RO + Water Cooler",
    "Accessories",
];

type SpecRow = { key: string; value: string };

const emptyVariant = (): ProductVariant => ({
    name: "Default",
    color_hex: "#ffffff",
    images: [],
    is_default: true,
    is_active: true,
});

const emptyForm = () => ({
    category_id: "",
    name: "",
    description: "",
    long_description: "",
    features: [""],
    specifications: [{ key: "", value: "" }] as SpecRow[],
    product_variants: [emptyVariant()],
    related_product_ids: [] as string[],
    is_active: true,

});

export default function AdminProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [enquiries, setEnquiries] = useState<ProductEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [uploadingKey, setUploadingKey] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState<"products" | "enquiries">("products");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState(emptyForm());
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: string } | null>(null);

    async function fetchAll() {
        setLoading(true);
        try {
            const [productRes, categoryRes, enquiryRes] = await Promise.all([
                fetch("/admin/api/product"),
                fetch("/admin/api/product?type=categories"),
                fetch("/admin/api/product?type=enquiries"),
            ]);

            const [productData, categoryData, enquiryData] = await Promise.all([
                productRes.json(),
                categoryRes.json(),
                enquiryRes.json(),
            ]);

            if (!productRes.ok) throw new Error(productData.details || productData.error || "Failed to load products");
            if (!categoryRes.ok) throw new Error(categoryData.details || categoryData.error || "Failed to load categories");
            if (!enquiryRes.ok) throw new Error(enquiryData.details || enquiryData.error || "Failed to load enquiries");

            setProducts(productData);
            setCategories(categoryData);
            setEnquiries(enquiryData);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load product data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setMounted(true);
        const timer = window.setTimeout(() => {
            fetchAll();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const haystack = `${product.name} ${product.description || ""} ${product.long_description || ""} ${product.product_categories?.name || ""}`.toLowerCase();
            const matchesSearch = haystack.includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || String(product.is_active ?? true) === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [products, searchTerm, statusFilter]);

    const getCategoryIdByName = (name: string) => {
        return categories.find((category) => category.name === name)?.id || "";
    };

    const updateProductName = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            category_id: getCategoryIdByName(name) || prev.category_id,
        }));
    };

    const openProductModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                category_id: product.category_id,
                name: product.name,
                description: product.description || "",
                long_description: product.long_description || "",
                features: product.features?.length ? product.features : [""],
                specifications: Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value })) || [{ key: "", value: "" }],
                product_variants: product.product_variants?.length ? product.product_variants : [emptyVariant()],
                related_product_ids: product.related_product_ids || [],
                is_active: product.is_active ?? true,

            });
        } else {
            setEditingProduct(null);
            setFormData({
                ...emptyForm(),
                category_id: "",
            });
        }
        setIsModalOpen(true);
    };

    const buildPayload = () => {
        const specifications = formData.specifications.reduce<Record<string, string>>((acc, row) => {
            if (row.key.trim()) acc[row.key.trim()] = row.value.trim();
            return acc;
        }, {});

        return {
            ...formData,
            category_id: formData.category_id || getCategoryIdByName(formData.name),
            features: formData.features.map((feature) => feature.trim()).filter(Boolean),
            specifications,
            product_variants: formData.product_variants.map((variant, index) => ({
                ...variant,
                sort_order: index,
                images: (variant.images || []).filter(Boolean),
            })),
        };
    };

    const saveProduct = async () => {
        if (!formData.name.trim()) return toast.error("Product name is required");
        if (!formData.category_id) return toast.error("Please select a category");
        if (!formData.product_variants.some((variant) => variant.is_default)) return toast.error("Please select a default variant");

        setSaving(true);
        try {
            const res = await fetch("/admin/api/product", {
                method: editingProduct ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct ? { id: editingProduct.id, ...buildPayload() } : buildPayload()),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || "Failed to save product");

            toast.success(`Product ${editingProduct ? "updated" : "added"} successfully`);
            setIsModalOpen(false);
            fetchAll();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = (id: string, type = "product", name = "") => {
        setItemToDelete({ id, name, type });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/admin/api/product?id=${itemToDelete.id}&type=${itemToDelete.type}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || "Delete failed");

            toast.success("Deleted successfully");
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            fetchAll();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleProduct = async (product: Product) => {
        const res = await fetch("/admin/api/product", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: product.id, is_active: !(product.is_active ?? true) }),
        });
        if (res.ok) {
            toast.success("Product status updated");
            fetchAll();
        } else {
            toast.error("Failed to update product status");
        }
    };

    const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
        setFormData((prev) => ({
            ...prev,
            product_variants: prev.product_variants.map((variant, idx) => idx === index ? { ...variant, ...patch } : variant),
        }));
    };

    const selectDefaultVariant = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            product_variants: prev.product_variants.map((variant, idx) => ({ ...variant, is_default: idx === index })),
        }));
    };

    const uploadVariantImage = async (file: File | undefined, variantIndex: number) => {
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) return toast.error("Image size must be less than 4MB");

        const key = `${variantIndex}-${file.name}`;
        setUploadingKey(key);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/admin/api/upload", { method: "POST", body: uploadData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");

            const variant = formData.product_variants[variantIndex];
            const currentImages = Array.isArray(variant.images) ? variant.images : [];
            updateVariant(variantIndex, { images: [...currentImages, data.url] });
            toast.success("Image uploaded");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Image upload failed");
        } finally {
            setUploadingKey("");
        }
    };

    const updateEnquiryStatus = async (enquiry: ProductEnquiry, status: ProductEnquiry["status"]) => {
        const res = await fetch("/admin/api/product", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "enquiry", id: enquiry.id, status }),
        });
        if (res.ok) {
            toast.success("Enquiry status updated");
            fetchAll();
        } else {
            toast.error("Failed to update enquiry");
        }
    };

    if (loading) return <div className="p-8 text-slate-600">Loading product data...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-[10px] text-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                    {(["products", "enquiries"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 text-sm font-bold capitalize rounded-md transition-all ${activeTab === tab ? "bg-sky-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "products" && (
                    <button
                        onClick={() => openProductModal(null)}
                        className="flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                )}
            </div>

            {activeTab === "products" && (
                <>
                    <div className="flex flex-wrap gap-3 rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="relative w-fit">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search products..."
                                className="w-[320px] rounded-lg border border-gray-200 py-[11px] pl-10 pr-3 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 bg-white"
                            />
                        </div>
                        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-[11px] text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 bg-white">
                            <option value="all">All Status</option>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>

                    <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                                <tr>
                                    {["#", "Image", "Product", "Variants", "Status", "Actions"].map((head) => (
                                        <th key={head} className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map((product, index) => {
                                    const defaultVariant = product.product_variants?.find((variant) => variant.is_default) || product.product_variants?.[0];
                                    const firstImage = defaultVariant?.images?.[0];
                                    return (
                                        <tr key={product.id} className="hover:bg-[#f1f5f9] transition-colors">
                                            <td className="px-4 py-4 text-sm text-slate-400">{index + 1}</td>
                                            <td className="px-4 py-4">
                                                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner">
                                                    {firstImage ? <Image src={firstImage} alt={product.name} fill className="object-cover" unoptimized /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-bold text-[#1e293b]">{product.name}</div>
                                                <div className="max-w-[280px] truncate text-[11px] text-slate-500 uppercase font-sm tracking-wide">
                                                    {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600">{product.product_variants?.length || 0}</td>
                                            <td className="px-4 py-4">
                                                <button onClick={() => toggleProduct(product)} className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${product.is_active ?? true ? "bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]" : "bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]"}`}>
                                                    {product.is_active ?? true ? "Enabled" : "Disabled"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => setDetailProduct(product)} title="View" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8fafc] text-slate-700 hover:bg-[#e2e8f0] transition-all"><Eye size={16} /></button>
                                                    <button onClick={() => openProductModal(product)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-sky-600 hover:bg-[#dbeafe] transition-all"><Edit size={16} /></button>
                                                    <button onClick={() => product.id && deleteItem(product.id, "product", product.name)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef2f2] text-red-500 hover:bg-[#fee2e2] transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === "enquiries" && (
                <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                            <tr>
                                {["Product", "Customer", "Message", "Status", "Date", "Actions"].map((head) => (
                                    <th key={head} className="px-4 py-[14px] text-left text-[12px] font-semibold text-sky-600 uppercase tracking-wider whitespace-nowrap">{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {enquiries.map((enquiry) => (
                                <tr key={enquiry.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">{enquiry.product_name}</td>
                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        <div>{enquiry.name}</div>
                                        <div className="text-xs text-slate-400">{enquiry.mobile || enquiry.email || "-"}</div>
                                    </td>
                                    <td className="px-4 py-4 max-w-[320px] truncate text-sm text-slate-600">{enquiry.message || "-"}</td>
                                    <td className="px-4 py-4">
                                        <select value={enquiry.status || "new"} onChange={(event) => updateEnquiryStatus(enquiry, event.target.value as ProductEnquiry["status"])} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold capitalize">
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-500">{(mounted && enquiry.created_at) ? new Date(enquiry.created_at).toLocaleDateString() : "-"}</td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => enquiry.id && deleteItem(enquiry.id, "enquiry", enquiry.product_name)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[4px] animate-in fade-in duration-200">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-600">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-xs font-bold uppercase tracking-wider text-sky-600">Product Name *</label>
                                <select value={formData.name} onChange={(event) => updateProductName(event.target.value)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10">
                                    <option value="">Select product name</option>
                                    {PRODUCT_CATEGORY_NAMES.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                    {formData.name && !PRODUCT_CATEGORY_NAMES.includes(formData.name) && (
                                        <option value={formData.name}>{formData.name}</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-xs font-bold uppercase tracking-wider text-sky-600">Category *</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(event) => setFormData({ ...formData, category_id: event.target.value })}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-sky-600">Short Description</label>
                                <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="rounded-lg border border-slate-200 p-3 text-sm outline-none min-h-[6rem] focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10" placeholder="A brief catchphrase..." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-sky-600">Full Description</label>
                                <textarea value={formData.long_description} onChange={(event) => setFormData({ ...formData, long_description: event.target.value })} className="rounded-lg border border-slate-200 p-3 text-sm outline-none min-h-[6rem] focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10" placeholder="Detailed product info..." />
                            </div>
                        </div>


                        <SectionTitle title="Features" onAdd={() => setFormData({ ...formData, features: [...formData.features, ""] })} />
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <input value={feature} onChange={(event) => setFormData({ ...formData, features: formData.features.map((item, idx) => idx === index ? event.target.value : item) })} className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10" placeholder={`Feature ${index + 1}`} />
                                    <button onClick={() => setFormData({ ...formData, features: formData.features.filter((_, idx) => idx !== index) })} className="rounded-lg px-3 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>

                        <SectionTitle
                            title="Specifications"
                            onAdd={() =>
                                setFormData({
                                    ...formData,
                                    specifications: [
                                        ...formData.specifications,
                                        { key: "", value: "" }
                                    ]
                                })
                            }
                        />

                        <div className="mb-3 space-y-3">
                            {formData.specifications.map((spec, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        value={spec.key}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                specifications: formData.specifications.map((item, idx) =>
                                                    idx === index
                                                        ? { ...item, key: event.target.value }
                                                        : item
                                                ),
                                            })
                                        }
                                        className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-sky-600"
                                        placeholder="Spec Name"
                                    />

                                    <input
                                        value={spec.value}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                specifications: formData.specifications.map((item, idx) =>
                                                    idx === index
                                                        ? { ...item, value: event.target.value }
                                                        : item
                                                ),
                                            })
                                        }
                                        className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-sky-600"
                                        placeholder="Value"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                specifications: formData.specifications.filter(
                                                    (_, idx) => idx !== index
                                                ),
                                            })
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <SectionTitle title="Colour Variants" onAdd={() => setFormData({ ...formData, product_variants: [...formData.product_variants, { ...emptyVariant(), is_default: false, name: "" }] })} />
                        <div className="space-y-4">
                            {formData.product_variants.map((variant, index) => (
                                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="grid gap-3 md:grid-cols-[1fr_140px_auto_auto]">
                                        <input value={variant.name} onChange={(event) => updateVariant(index, { name: event.target.value })} className="rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-sky-600" placeholder="Variant name, e.g. White" />
                                        <input type="color" value={variant.color_hex} onChange={(event) => updateVariant(index, { color_hex: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 cursor-pointer" />
                                        <button type="button" onClick={() => selectDefaultVariant(index)} className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${variant.is_default ? "bg-green-100 text-green-700 ring-1 ring-green-600/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
                                            <Check size={16} /> Default
                                        </button>
                                        <button type="button" onClick={() => setFormData({ ...formData, product_variants: formData.product_variants.filter((_, idx) => idx !== index) })} className="rounded-lg bg-white border border-slate-200 px-3 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Variant Images</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Paste Image URL and press Enter"
                                                className="flex-1 px-3.5 py-[11px] rounded-[10px] border border-[#e2e8f0] bg-white text-sm focus:outline-none focus:border-[#083574] transition-all"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const input = e.target as HTMLInputElement;
                                                        const val = input.value.trim();
                                                        if (val && !variant.images?.includes(val)) {
                                                            const v = formData.product_variants[index];
                                                            const currentImages = Array.isArray(v.images) ? v.images : [];
                                                            updateVariant(index, { images: [...currentImages, val] });
                                                            input.value = '';
                                                            toast.success("Image URL added");
                                                        }
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    const val = input.value.trim();
                                                    if (val && !variant.images?.includes(val)) {
                                                        const v = formData.product_variants[index];
                                                        const currentImages = Array.isArray(v.images) ? v.images : [];
                                                        updateVariant(index, { images: [...currentImages, val] });
                                                        input.value = '';
                                                        toast.success("Image URL added");
                                                    }
                                                }}
                                            />
                                            <label className="flex items-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg cursor-pointer hover:bg-sky-100 whitespace-nowrap">
                                                {uploadingKey.startsWith(`${index}-`) ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                <span className="text-xs font-bold">Upload</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => uploadVariantImage(e.target.files?.[0], index)}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            {(variant.images || []).map((image, imageIndex) => (
                                                <div key={`${image}-${imageIndex}`} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-400">
                                                    <img
                                                        src={image}
                                                        alt={variant.name || "Variant"}
                                                        className="h-full w-full object-contain p-1"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=Broken+Link";
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateVariant(index, { images: variant.images.filter((_, idx) => idx !== imageIndex) })}
                                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                                    >
                                                        <X size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ))}
                                            {variant.images?.length === 0 && !uploadingKey.startsWith(`${index}-`) && (
                                                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 text-slate-300 bg-slate-50/50">
                                                    <ImageIcon size={20} />
                                                    <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <SectionTitle title="Related Products" />
                        <div className="grid max-h-40 gap-2 overflow-y-auto rounded-xl border border-slate-200 p-3 md:grid-cols-3 bg-slate-50/50">
                            {products.filter((product) => product.id !== editingProduct?.id).map((product) => (
                                <label key={product.id} className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-white hover:shadow-sm cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.related_product_ids.includes(product.id || "")}
                                        onChange={(event) => {
                                            const id = product.id || "";
                                            setFormData({
                                                ...formData,
                                                related_product_ids: event.target.checked
                                                    ? [...formData.related_product_ids, id]
                                                    : formData.related_product_ids.filter((item) => item !== id),
                                            });
                                        }}
                                    />
                                    <span className="truncate">{product.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData({ ...formData, is_active: event.target.checked })} />
                                Enable product
                            </label>
                            <div className="flex gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
                                <button onClick={saveProduct} disabled={saving} className="flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition-all disabled:opacity-60">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                                    Save Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {detailProduct && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setDetailProduct(null)}>
                    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-sky-600">{detailProduct.name}</h3>
                            <button onClick={() => setDetailProduct(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{detailProduct.description || "No description added."}</p>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Features</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    {(detailProduct.features || []).map((feature) => <li key={feature}>- {feature}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Specifications</h4>
                                <div className="space-y-2 text-sm text-slate-600">
                                    {Object.entries(detailProduct.specifications || {}).map(([key, value]) => <div key={key}><b>{key}:</b> {value}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-in fade-in duration-200">
                    <div className="bg-white p-[28px] rounded-[16px] w-full max-w-[350px] max-h-[90vh] overflow-y-auto shadow-lg animate-in slide-in-from-bottom-2 duration-200 text-center">
                        <div style={{ marginBottom: "20px" }}>
                            <div className="w-[60px] h-[60px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={30} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2">Delete {itemToDelete?.type === 'product' ? 'Product' : 'Enquiry'}?</h3>
                            <p className="text-[#584c79] text-[14px] m-0">
                                Are you sure you want to delete <b>{itemToDelete?.name}</b>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-gray-50 disabled:opacity-50" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                                No, Keep it
                            </button>
                            <button className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm text-white border-none bg-red-600 hover:bg-red-700 transition-all disabled:bg-red-400" onClick={confirmDeleteItem} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Yes, Delete!"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



function SectionTitle({ title, onAdd }: { title: string; onAdd?: () => void }) {
    return (
        <div className="mb-3 mt-6 flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h4>
            {onAdd && (
                <button type="button" onClick={onAdd} className="flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-xs font-bold text-sky-600">
                    <PlusCircle size={14} /> Add
                </button>
            )}
        </div>
    );
}
