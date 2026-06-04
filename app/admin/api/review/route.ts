import { NextResponse } from "next/server";
import { reviewService } from "@/modules/review/reviewService";

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
        const onlyActive = searchParams.get("active") === "true";

        if (id) {
            return NextResponse.json(await reviewService.getById(id));
        }

        return NextResponse.json(await reviewService.getAll(onlyActive));
    } catch (error) {
        console.error("Error in GET /admin/api/review:", error);
        return NextResponse.json(
            { error: "Failed to fetch review data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        return NextResponse.json(await reviewService.create(body));
    } catch (error) {
        console.error("Error in POST /admin/api/review:", error);
        return NextResponse.json(
            { error: "Failed to create review", details: getErrorMessage(error) },
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
        return NextResponse.json(await reviewService.update(id, dataToUpdate));
    } catch (error) {
        console.error("Error in PUT /admin/api/review:", error);
        return NextResponse.json(
            { error: "Failed to update review", details: getErrorMessage(error) },
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

        await reviewService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /admin/api/review:", error);
        return NextResponse.json(
            { error: "Failed to delete review", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
