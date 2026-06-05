import { supabaseAdmin as supabase } from "@/lib/server";

export const PRODUCT_CATEGORY_NAMES = [
    "Domestic Filter",
    "Industrial Filter",
    "RO Systems",
    "Water Softener",
    "Gas Geyser",
    "Kangan Water",
    "RO + Water Cooler",
    "Accessories",
] as const;

export interface ProductCategory {
    id?: string;
    name: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
}

export interface ProductVariant {
    id?: string;
    product_id?: string;
    name: string;
    color_hex: string;
    images: string[];
    is_default?: boolean;
    is_active?: boolean;

}

export interface ProductEnquiry {
    id?: string;
    product_id?: string | null;
    variant_id?: string | null;
    product_name: string;
    name: string;
    email?: string | null;
    mobile?: string | null;
    message?: string | null;
    status?: "new" | "contacted" | "closed";
    created_at?: string;
}

export interface Product {
    id?: string;
    category_id: string;
    name: string;
    slug?: string;
    description?: string;
    long_description?: string;
    specifications: Record<string, string>;
    features: string[];
    is_active?: boolean;
 
    product_categories?: ProductCategory;
    product_variants?: ProductVariant[];
}

type ProductRow = Product & {
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const normalizeProduct = (product: Product) => ({
    category_id: product.category_id,
    name: product.name,
    slug: product.slug || slugify(product.name),
    description: product.description || "",
    long_description: product.long_description || "",
    specifications: product.specifications || {},
    features: product.features || [],
    is_active: product.is_active ?? true,
});

const normalizeCategory = (category: ProductCategory) => ({
    name: category.name,
    slug: category.slug || slugify(category.name),
    description: category.description || "",
    is_active: category.is_active ?? true,
    sort_order: category.sort_order ?? 0,
});

const normalizeVariant = (variant: ProductVariant, index: number) => ({
    name: variant.name || "Default",
    color_hex: variant.color_hex || "#ffffff",
    images: variant.images || [],
    is_default: variant.is_default ?? index === 0,
    is_active: variant.is_active ?? true,

});

export const productService = {
    async getCategories(onlyActive = false) {
        let query = supabase
            .from("product_categories")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true });

        if (onlyActive) {
            query = query.eq("is_active", true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as ProductCategory[];
    },

    async createCategory(category: ProductCategory) {
        const { data, error } = await supabase
            .from("product_categories")
            .insert([normalizeCategory(category)])
            .select()
            .single();
        if (error) throw error;
        return data as ProductCategory;
    },

    async updateCategory(id: string, category: Partial<ProductCategory>) {
        const payload = {
            ...category,
            ...(category.name && !category.slug ? { slug: slugify(category.name) } : {}),
        };
        const { data, error } = await supabase
            .from("product_categories")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data as ProductCategory;
    },

    async deleteCategory(id: string) {
        const { error } = await supabase.from("product_categories").delete().eq("id", id);
        if (error) throw error;
        return true;
    },

    async getAll(onlyActive = false) {
        let query = supabase
            .from("products")
            .select(`
                *,
                product_categories (*),
                product_variants (*)
            `)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

        if (onlyActive) {
            query = query.eq("is_active", true);
        }

        const { data, error } = await query;
        if (error) throw error;

        return ((data || []) as ProductRow[]).map((product) => ({
            ...product,
            product_variants: (product.product_variants || []),
        })) as Product[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from("products")
            .select(`
                *,
                product_categories (*),
                product_variants (*)
            `)
            .eq("id", id)
            .single();
        if (error) throw error;
        return {
            ...data,
            product_variants: (data.product_variants || []),
        } as Product;
    },

    async create(product: Product) {
        const { product_variants = [],...productData } = product;
        const { data, error } = await supabase
            .from("products")
            .insert([normalizeProduct(productData as Product)])
            .select()
            .single();
        if (error) throw error;

        await this.replaceVariants(data.id, product_variants);
        return this.getById(data.id);
    },

    async update(id: string, product: Partial<Product>) {
        const { product_variants, ...productData } = product;
        delete productData.product_categories;
        const payload = {
            ...productData,
            ...(productData.name && !productData.slug ? { slug: slugify(productData.name) } : {}),
        };

        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;

        if (product_variants) {
            await this.replaceVariants(id, product_variants);
        }

        return this.getById(id);
    },

    async delete(id: string) {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        return true;
    },

    async replaceVariants(productId: string, variants: ProductVariant[]) {
        await supabase.from("product_variants").delete().eq("product_id", productId);

        if (!variants.length) return true;

        const defaultIndex = Math.max(0, variants.findIndex((variant) => variant.is_default));
        const payload = variants.map((variant, index) => ({
            product_id: productId,
            ...normalizeVariant({ ...variant, is_default: index === defaultIndex }, index),
        }));

        const { error } = await supabase.from("product_variants").insert(payload);
        if (error) throw error;
        return true;
    },



    async getEnquiries() {
        const { data, error } = await supabase
            .from("product_enquiries")
            .select("*, products (name), product_variants (name, color_hex)")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data as ProductEnquiry[];
    },

    async createEnquiry(enquiry: ProductEnquiry) {
        const { data, error } = await supabase
            .from("product_enquiries")
            .insert([enquiry])
            .select()
            .single();
        if (error) throw error;
        return data as ProductEnquiry;
    },

    async updateEnquiry(id: string, enquiry: Partial<ProductEnquiry>) {
        const { data, error } = await supabase
            .from("product_enquiries")
            .update(enquiry)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data as ProductEnquiry;
    },

    async deleteEnquiry(id: string) {
        const { error } = await supabase.from("product_enquiries").delete().eq("id", id);
        if (error) throw error;
        return true;
    },
};
