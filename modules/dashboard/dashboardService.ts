import { supabaseAdmin as supabase } from "@/lib/server";

export interface DashboardStats {
  productsCount: number;

  blogsCount: number;
  enquiriesCount: number;
  reviewsCount: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [
      { count: productsCount },
      { count: servicesCount }, // Added to match the order of queries
      { count: blogsCount },
      { count: contactsCount },
      { count: productEnquiriesCount },
      { count: reviewsCount },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("blogs").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("product_enquiries").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
    ]);

    return {
      productsCount: productsCount || 0,
      blogsCount: blogsCount || 0,
      enquiriesCount: (contactsCount || 0) + (productEnquiriesCount || 0),
      reviewsCount: reviewsCount || 0,
    };
  }
};
