import { supabaseAdmin as supabase } from "@/lib/server";

export interface Service {
    id?: string;
    name: string;
    short_description: string;
    description: string;
    image: string; // URL to the main image
    icon: string;
    features: string[];
    faqs: { question: string; answer: string }[];
    is_active?: boolean;

}

export const servicesService = {
    async getAll(onlyActive = true) {
        // Sort by sort_order first, then by name as a fallback
        let query = supabase
            .from('services')
            .select('*')
            .order('name', { ascending: true });

        if (onlyActive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async create(service: Omit<Service, 'id'>) {
        const { data, error } = await supabase.from('services').insert([service]).select();
        if (error) throw error;
        return data[0];
    },

    async update(id: string, service: Partial<Service>) {
        const { data, error } = await supabase
            .from('services')
            .update(service)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};