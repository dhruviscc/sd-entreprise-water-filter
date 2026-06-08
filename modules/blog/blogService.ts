import { supabaseAdmin as supabase } from "@/lib/server";

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  category: string; // Added category field
  status?: BlogStatus;
  author_id?: string;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

const normalizePost = (post: BlogPost) => ({
  title: post.title,
  slug: post.slug,
  summary: post.summary || "",
  content: post.content || "",
  category: post.category, // Added category to normalization
  image: post.image,
  status: post.status || "draft",
  author_id: post.author_id,
  published_at: post.published_at,
  updated_at: post.updated_at,
});

export const blogService = {

  async getAll(onlyActive = false) {
    let query = supabase
      .from('blog_posts')
      .select("*");

    if (onlyActive) {
     
      query = query.eq("status", "published").order("published_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as BlogPost[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async create(blog: BlogPost) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([normalizePost(blog)])
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async update(id: string, blog: Partial<BlogPost>) {
    const payload = {
      ...blog,
    } as Partial<BlogPost>;

    const { data, error } = await supabase
      .from("blog_posts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async delete(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
