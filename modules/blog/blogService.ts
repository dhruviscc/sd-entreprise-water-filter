import { supabaseAdmin as supabase } from "@/lib/server";

export type BlogStatus = "draft" | "published" | "archived";

export interface Blog {
    id?: string;
    title: string;
    slug?: string;
    content: string; // 'content' is used for the full blog post
    summary?: string; // 'summary' is used for the excerpt
    featured_image_url?: string;
    status?: BlogStatus;
    author_id?: string;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
}

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, "-");

const normalizeBlog = (blog: Blog) => ({
    ...blog,
    slug: blog.slug || slugify(blog.title),
    status: blog.status || "draft", // Default status to 'draft'
    summary: blog.summary || blog.content.substring(0, 150), // Generate summary if not provided
});

export const blogService = {
    async getAll(onlyPublished = false) {
        let query = supabase.from("blogs").select("*");

        if (onlyPublished) {
            query = query.eq("status", "published");
        }

        const { data, error } = await query.order("published_at", { ascending: false });
        if (error) throw error;
        return data as Blog[];
    },

    async getById(id: string) {
        const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single();
        if (error) throw error;
        return data as Blog;
    },

    async create(blog: Blog) {
        const { data, error } = await supabase
            .from("blogs")
            .insert([normalizeBlog(blog)])
            .select()
            .single();
        if (error) throw error;
        return data as Blog;
    },

    async update(id: string, blog: Partial<Blog>) {
        const payload = {
            ...blog,
            ...(blog.title && !blog.slug ? { slug: slugify(blog.title) } : {}),
        };
        const { data, error } = await supabase
            .from("blogs")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data as Blog;
    },

    async delete(id: string) {
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) throw error;
        return true;
    },
};