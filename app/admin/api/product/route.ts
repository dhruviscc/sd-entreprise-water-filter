import { NextResponse } from "next/server";
import { productService } from "@/modules/product/productService";

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null) {
        const item = error as { message?: string; details?: string; hint?: string };
        return item.message || item.details || item.hint || JSON.stringify(error);
    }
    return String(error);
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type") || "products";
        const onlyActive = searchParams.get("active") === "true";

        if (type === "categories") {
            return NextResponse.json(await productService.getCategories(onlyActive));
        }

        if (type === "enquiries") {
            return NextResponse.json(await productService.getEnquiries());
        }

        if (id) {
            const product = await productService.getById(id);
            return NextResponse.json(product);
        }

        return NextResponse.json(await productService.getAll(onlyActive));
    } catch (error) {
        console.error("Error in GET /admin/api/product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.type === "category") {
            const category = { ...body };
            delete category.type;
            return NextResponse.json(await productService.createCategory(category));
        }

        if (body.type === "enquiry") {
            const enquiry = { ...body };
            delete enquiry.type;
            return NextResponse.json(await productService.createEnquiry(enquiry));
        }

        return NextResponse.json(await productService.create(body));
    } catch (error) {
        console.error("Error in POST /admin/api/product:", error);
        return NextResponse.json(
            { error: "Failed to create product data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, type, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        if (type === "category") {
            return NextResponse.json(await productService.updateCategory(id, data));
        }

        if (type === "enquiry") {
            return NextResponse.json(await productService.updateEnquiry(id, data));
        }

        return NextResponse.json(await productService.update(id, data));
    } catch (error) {
        console.error("Error in PUT /admin/api/product:", error);
        return NextResponse.json(
            { error: "Failed to update product data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type") || "product";

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        if (type === "category") {
            await productService.deleteCategory(id);
        } else if (type === "enquiry") {
            await productService.deleteEnquiry(id);
        } else {
            await productService.delete(id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /admin/api/product:", error);
        return NextResponse.json(
            { error: "Failed to delete product data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
