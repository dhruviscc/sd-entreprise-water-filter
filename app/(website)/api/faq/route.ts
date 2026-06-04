import { NextResponse } from "next/server";
import { faqService } from "@/modules/faq/faqService";

export async function GET() {
    try {
        // Publicly we only want published FAQs
        const faqs = await faqService.getAll(true);
        return NextResponse.json(faqs);
    } catch (error) {
        console.error("Error in GET /api/faq:", error);
        return NextResponse.json(
            { error: "Failed to fetch FAQ data" },
            { status: 500 }
        );
    }
}
