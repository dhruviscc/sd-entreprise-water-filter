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
    is_active: true,

});

export default function AdminProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);

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
        uploadData.append("bucket", "products");

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


    return (
        <div className="space-y-4 sm:space-y-6 bg-slate-50 ">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <input
                            className="w-full py-2.5 pr-[40px] pl-[10px] rounded-xl border border-slate-200 outline-none bg-white text-sm transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 shadow-sm"
                            placeholder="Search Products..."
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
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full sm:w-auto rounded-lg border border-gray-200 px-3 py-[11px] text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 bg-white">
                        <option value="all">All Status</option>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                    <button
                        onClick={() => openProductModal(null)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={18} /> <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {filteredProducts.map((product, index) => {
                    const defaultVariant =
                        product.product_variants?.find((v) => v.is_default) ||
                        product.product_variants?.[0];

                    const firstImage = defaultVariant?.images?.[0];

                    return (
                        <div
                            key={product.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex gap-4">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                    {firstImage ? (
                                        <Image
                                            src={firstImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ImageIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-800 truncate">
                                        {product.name}
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        {categories.find(
                                            (c) => c.id === product.category_id
                                        )?.name || "Uncategorized"}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">

                                        <span className="text-sm font-medium">
                                            {product.product_variants?.length || 0} Variants
                                        </span>
                                    </div>


                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="mt-3">
                                    <button
                                        onClick={() => toggleProduct(product)}
                                        className={`rounded-lg px-3 py-1 text-xs font-medium ${product.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {product.is_active ? "Enabled" : "Disabled"}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={() => setDetailProduct(product)}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                                    >
                                        <Eye size={16} className="mx-auto" />
                                    </button>

                                    <button
                                        onClick={() => openProductModal(product)}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                    >
                                        <Edit size={16} className="mx-auto" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            product.id &&
                                            deleteItem(product.id, "product", product.name)
                                        }
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                    >
                                        <Trash2 size={16} className="mx-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sky-600">
                                    #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sky-600">
                                    Image
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sky-600">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sky-600">
                                    Variants
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sky-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sky-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((product, index) => {
                                const defaultVariant =
                                    product.product_variants?.find((v) => v.is_default) ||
                                    product.product_variants?.[0];

                                const firstImage = defaultVariant?.images?.[0];

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                                                {firstImage ? (
                                                    <Image
                                                        src={firstImage}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <ImageIcon className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <h4 className="text-sm font-bold text-slate-800">
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                {categories.find(
                                                    (c) => c.id === product.category_id
                                                )?.name || "Uncategorized"}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            {product.product_variants?.length || 0}
                                        </td>

                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleProduct(product)}
                                                className={`rounded-lg px-3 py-1 text-xs font-medium ${product.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product.is_active ? "Enabled" : "Disabled"}
                                            </button>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setDetailProduct(product)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openProductModal(product)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        product.id &&
                                                        deleteItem(product.id, "product", product.name)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>


            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[4px] animate-in fade-in duration-200">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-600">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

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
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-xs font-bold uppercase tracking-wider text-sky-600">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(event) => updateProductName(event.target.value)}
                                    placeholder="Enter product name"
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10 bg-white"
                                />
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

                                        <button type="button" onClick={() => setFormData({ ...formData, product_variants: formData.product_variants.filter((_, idx) => idx !== index) })} className="rounded-lg bg-white border border-slate-200 px-3 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <label className="text-[12px] font-semibold text-sky-600 uppercase tracking-wider">Variant Images</label>
                                        <div className="flex">
                                            <label
                                                className="
                                                      w-25 h-25
                                                      border-2 border-dashed border-sky-300
                                                      rounded-2xl
                                                      bg-slate-100
                                                      flex flex-col items-center justify-center
                                                      gap-3
                                                      cursor-pointer
                                                      transition-all duration-200
                                                      hover:border-sky-500
                                                      hover:bg-sky-50
                                                    "
                                            >
                                                {uploadingKey.startsWith(`${index}-`) ? (
                                                    <Loader2 size={24} className="animate-spin text-sky-600" />

                                                ) : (
                                                    <>
                                                        <Upload size={24} className="text-sky-600 mb-2" />
                                                        <span className="text-xs font-bold text-sky-600 text-center px-2">
                                                            Upload Image
                                                        </span>
                                                    </>
                                                )}

                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        uploadVariantImage(e.target.files?.[0], index)
                                                    }
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

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-white border border-[#e2e8f0] text-[#1e293b]"                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveProduct}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold cursor-pointer text-sm bg-gradient-to-br from-sky-600 via-sky-600 to-slate-600 text-white border-none disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {detailProduct && (
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                    onClick={() => setDetailProduct(null)}
                >
                    <div
                        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-xl">
                            <div>
                                <h3 className="text-2xl font-bold text-sky-600">
                                    {detailProduct.name}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Product Information
                                </p>
                            </div>

                            <button
                                onClick={() => setDetailProduct(null)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all "
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[calc(90vh-90px)] overflow-y-auto px-6 py-6">
                            {/* Description */}
                            <div className="mb-6 rounded-2xl bg-slate-50 p-5">
                                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                                    Description
                                </h4>

                                <p className="whitespace-pre-wrap leading-7 text-slate-600">
                                    {detailProduct.description || "No description added."}
                                </p>
                            </div>

                            {/* Features + Specifications */}
                            <div className="grid gap-5 md:grid-cols-2">
                                {/* Features */}
                                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                    <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-sky-600">
                                        Features
                                    </h4>

                                    <ul className="space-y-3">
                                        {(detailProduct.features || []).map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-3 text-sm text-slate-600"
                                            >
                                                <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Specifications */}
                                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                    <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-sky-600">
                                        Specifications
                                    </h4>

                                    <div className="space-y-3">
                                        {Object.entries(
                                            detailProduct.specifications || {}
                                        ).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between gap-4 border-b border-slate-100 pb-2"
                                            >
                                                <span className="font-medium text-slate-500">
                                                    {key}
                                                </span>

                                                <span className="text-right text-slate-700">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Variants */}

                            <div className="mt-6">
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-sky-600">
                                    Product Variants ({detailProduct.product_variants?.length})
                                </h4>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {detailProduct.product_variants?.map((variant) => (
                                        <div
                                            key={variant.id}
                                            className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-3 transition-all hover:border-sky-200 hover:bg-sky-50/50 hover:shadow-md"
                                        >
                                            <img
                                                src={variant.images?.[0]}
                                                alt={variant.name}
                                                className="h-16 w-16 rounded-xl object-cover"
                                            />

                                            <div>
                                                <h5 className="font-semibold text-slate-800 group-hover:text-sky-600">
                                                    {variant.name}
                                                </h5>

                                                <p className="text-xs text-slate-500">
                                                    Available Variant
                                                </p>
                                            </div>
                                        </div>
                                    ))}
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