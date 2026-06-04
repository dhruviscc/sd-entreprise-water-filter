import { blogService } from "@/modules/blog/blogService";
import { NextResponse } from "next/server";

// Public API - fetches only active blogs for the website
export async function GET() {
  try {
    const blogs = await blogService.getAll(true);
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}