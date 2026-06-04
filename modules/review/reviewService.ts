import { supabaseAdmin as supabase } from "@/lib/server";

export type ReviewType = 'text' | 'video';

export interface Review {
  id?: string;
  name: string;
  location?: string;
  rating: number;
  content?: string;
  type: ReviewType;
  video_url?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

const normalizeReview = (review: Review) => ({
  name: review.name,
  location: review.location || "",
  rating: review.rating || 5,
  content: review.content || "",
  type: review.type || 'text',
  video_url: review.video_url || "",

  is_active: review.is_active !== undefined ? review.is_active : true,
  display_order: review.display_order || 0,
});

export const reviewService = {
  async getAll(onlyActive = false) {
    let query = supabase
      .from("reviews")
      .select("*");

    if (onlyActive) {
      query = query.eq("is_active", true).order("display_order", { ascending: true });
    } else {
      query = query.order("display_order", { ascending: true }).order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Review[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Review;
  },

  async create(review: Review) {
    const { data, error } = await supabase
      .from("reviews")
      .insert([normalizeReview(review)])
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  async update(id: string, review: Partial<Review>) {
    const { data, error } = await supabase
      .from("reviews")
      .update(review)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  async delete(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
