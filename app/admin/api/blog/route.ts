import { NextResponse } from "next/server";
import { blogService } from "@/modules/blog/blogService";

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
        // The 'type' parameter is not currently used by blogService.getAll
        const onlyActive = searchParams.get("active") === "true";


        if (id) {
            return NextResponse.json(await blogService.getById(id));
        }

        return NextResponse.json(await blogService.getAll(onlyActive));
    } catch (error) {
        console.error("Error in GET /admin/api/blog:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();


        return NextResponse.json(await blogService.create(body));
    } catch (error) {
        console.error("Error in POST /admin/api/blog:", error);
        return NextResponse.json(
            { error: "Failed to create blog data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id"); // Get ID from search params for the resource to update
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        
        const { id: bodyId, type: bodyType, ...dataToUpdate } = body;
        return NextResponse.json(await blogService.update(id, dataToUpdate));
    } catch (error) {
        console.error("Error in PUT /admin/api/blog:", error);
        return NextResponse.json(
            { error: "Failed to update blog data", details: getErrorMessage(error) },
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

        await blogService.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /admin/api/blog:", error);
        return NextResponse.json(
            { error: "Failed to delete blog data", details: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
