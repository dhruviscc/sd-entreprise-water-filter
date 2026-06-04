import { NextResponse } from "next/server";
import { contactService } from "@/modules/contact/contactService";



export async function GET() {
  try {
    const data = await contactService.getAllEnquiries();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admin Contact GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { id, ...input } = body;
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updated = await contactService.updateEnquiryStatus(id, input);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Admin Contact PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await contactService.deleteEnquiry(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Contact DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}
