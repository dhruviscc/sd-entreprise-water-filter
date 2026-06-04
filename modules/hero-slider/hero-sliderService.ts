import { supabaseAdmin as supabase } from '@/lib/server';

export interface HeroSlider {
  id: string;
  title: string;
  subtitle: string;
  desktopImage: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  secondaryInterest: string;
  secondaryType: 'service' | 'product' | 'general';
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export const heroSliderService = {
  async getAllSliders(onlyActive = false) {
    let query = supabase.
    from('hero_sliders')
    .select('*');
    if (onlyActive) {
      query = query.eq('isActive', true);
    }
    const { data, error } = await query .order('order', { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data as HeroSlider[];
  },

  async getActiveSliders(): Promise<HeroSlider[]> {
    const { data, error } = await supabase
      .from('hero_sliders')
      .select('*')
      .eq('isActive', true)
      
    if (error) {
      throw new Error(error.message);
    }
    return (data as HeroSlider[]) || [];
  },

  async getSliderById(id: string) {
    const { data, error } = await supabase
      .from('hero_sliders')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async createSlider(data: any) {
    const { data: lastSlider, error: lastSliderError } = await supabase
      .from('hero_sliders')
      .select('order')
    
      .limit(1)
      .single();

    if (lastSliderError && lastSliderError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for initial creation
      throw new Error(lastSliderError.message);
    }

    const nextOrder = lastSlider ? lastSlider.order + 1 : 0; // Assuming 'order' is a number

    const { data: newSlider, error } = await supabase
      .from('hero_sliders')
      .insert({ ...data, order: nextOrder })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return newSlider;
  },

  async updateSlider(id: string, data: any) {
    const { data: updatedSlider, error } = await supabase
      .from('hero_sliders')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return updatedSlider;
  },

  async deleteSlider(id: string) {
    const { error } = await supabase
      .from('hero_sliders')
      .delete()
      .eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    return { success: true }; // Supabase delete doesn't return the deleted item by default
  },

  async updateOrder(items: { id: string; order: number }[]) {
    const updates = items.map(async (item) => {
      const { error } = await supabase.from('hero_sliders').update({ order: item.order }).eq('id', item.id);
      if (error) {
        throw new Error(error.message);
      }
      return item;
    });
    await Promise.all(updates);
    return { success: true };
  },

  async toggleStatus(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('hero_sliders')
      .update({ isActive })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
};
