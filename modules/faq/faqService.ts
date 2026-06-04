import { supabaseAdmin as supabase } from "@/lib/server";

export type FAQStatus = "draft" | "published" | "archived";
export type FAQCategory = 'General' | 'Products' | 'Services' | 'AMC' | 'Technical Questions';

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category: FAQCategory;
  status?: FAQStatus;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

const normalizeFAQ = (faq: FAQ) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  status: faq.status || "published",
  display_order: faq.display_order || 0,
});

export const faqService = {
  async getAll(onlyPublished = false) {
    let query = supabase
      .from("faqs")
      .select("*");

    if (onlyPublished) {
      query = query.eq("status", "published").order("display_order", { ascending: true });
    } else {
      query = query.order("display_order", { ascending: true }).order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as FAQ[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as FAQ;
  },

  async create(faq: FAQ) {
    const { data, error } = await supabase
      .from("faqs")
      .insert([normalizeFAQ(faq)])
      .select()
      .single();

    if (error) throw error;
    return data as FAQ;
  },

  async update(id: string, faq: Partial<FAQ>) {
    const { data, error } = await supabase
      .from("faqs")
      .update(faq)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as FAQ;
  },

  async delete(id: string) {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
