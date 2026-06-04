import { NextResponse } from "next/server";
import { reviewService } from "@/modules/review/reviewService";

export async function GET() {
    try {
        const reviews = await reviewService.getAll(true);
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error in GET /api/review:", error);
        return NextResponse.json(
            { error: "Failed to fetch review data" },
            { status: 500 }
        );
    }
}
