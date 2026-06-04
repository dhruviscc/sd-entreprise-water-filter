import { NextResponse } from "next/server";
import { faqService } from "@/modules/faq/faqService";

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
        const onlyPublished = searchParams.get("published") === "true";

        if (id) {
            return NextResponse.json(await faqService.getById(id));
        }

        return NextResponse.json(await faqService.getAll(onlyPublished));
    } catch (error) {
        console.error("Error in GET /admin/api/faq:", error);
        return NextResponse.json(
            { error: "Failed to fetch FAQ data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        return NextResponse.json(await faqService.create(body));
    } catch (error) {
        console.error("Error in POST /admin/api/faq:", error);
        return NextResponse.json(
            { error: "Failed to create FAQ", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const { id: bodyId, ...dataToUpdate } = body;
        return NextResponse.json(await faqService.update(id, dataToUpdate));
    } catch (error) {
        console.error("Error in PUT /admin/api/faq:", error);
        return NextResponse.json(
            { error: "Failed to update FAQ", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        await faqService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /admin/api/faq:", error);
        return NextResponse.json(
            { error: "Failed to delete FAQ", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
