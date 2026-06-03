import { NextResponse } from "next/server";
import { productService } from "@/modules/product/productService";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "products";

        if (type === "categories") {
            return NextResponse.json(await productService.getCategories(true));
        }

        return NextResponse.json(await productService.getAll(true));
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const enquiry = await productService.createEnquiry({
            product_id: body.product_id || null,
            variant_id: body.variant_id || null,
            product_name: body.product_name || body.interestName || "General Product Enquiry",
            name: body.name,
            email: body.email || null,
            mobile: body.mobile || body.phone || null,
            message: body.message || null,
            status: "new",
        });

        return NextResponse.json(enquiry);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit enquiry", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
