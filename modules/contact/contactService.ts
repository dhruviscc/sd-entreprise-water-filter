import { supabaseAdmin } from "@/lib/server";

export interface Contact {
  id: string;
  full_name: string;
  email_address: string | null;
  mobile_number: string;
  service_interest: string;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateContactInput = Omit<Contact, 'id' | 'status' | 'notes' | 'created_at' | 'updated_at'>;
export type UpdateContactInput = Partial<Pick<Contact, 'status' | 'notes'>>;

export const contactService = {
  // Public action: submit from website
  async submitEnquiry(input: CreateContactInput) {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data as Contact;
  },

  // Admin actions: Now combines general contacts and product enquiries
  async getAllEnquiries() {
    // 1. Fetch general contacts
    const { data: contacts, error: contactError } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch product enquiries (from migration 4 table)
    const { data: productLeads, error: productError } = await supabaseAdmin
      .from('product_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (contactError) throw contactError;
    
    // Normalize and combine
    const normalizedContacts = (contacts || []).map(c => ({
      ...c,
      source: 'Contact Form'
    }));

    const normalizedProductLeads = (productLeads || []).map(p => ({
      id: p.id,
      full_name: p.name,
      email_address: p.email,
      mobile_number: p.mobile,
      service_interest: `Product: ${p.product_name}`,
      message: p.message,
      status: p.status,
      notes: null,
      created_at: p.created_at,
      updated_at: p.created_at,
      source: 'Product Enquiry'
    }));

    // Combine and sort by date
    return [...normalizedContacts, ...normalizedProductLeads].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async updateEnquiryStatus(id: string, input: UpdateContactInput) {
    // Try updating in contacts first
    const { data: cData, error: cError } = await supabaseAdmin
      .from('contacts')
      .update(input)
      .eq('id', id)
      .select();

    if (cData && cData.length > 0) return cData[0] as Contact;

    // If not found, try product_enquiries
    const { data: pData, error: pError } = await supabaseAdmin
      .from('product_enquiries')
      .update(input)
      .eq('id', id)
      .select();

    if (pData && pData.length > 0) return pData[0] as Contact;

    throw new Error("Record not found in either table");
  },

  async deleteEnquiry(id: string) {
    // Try in contacts
    const { error: cError } = await supabaseAdmin.from('contacts').delete().eq('id', id);
    // Try in product_enquiries
    const { error: pError } = await supabaseAdmin.from('product_enquiries').delete().eq('id', id);
    
    return true;
  }
};

