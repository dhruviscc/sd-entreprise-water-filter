import { NextResponse } from "next/server";
import { contactService, CreateContactInput } from "@/modules/contact/contactService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Minimal validation
    if (!body.full_name || !body.mobile_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const input: CreateContactInput = {
      full_name: body.full_name,
      mobile_number: body.mobile_number,
      email_address: body.email_address || null,
      service_interest: body.service_interest || "General Enquiry",
      message: body.message || null,
    };

    const contact = await contactService.submitEnquiry(input);
    return NextResponse.json(contact);
  } catch (error: any) {
    console.error("Public Contact API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
