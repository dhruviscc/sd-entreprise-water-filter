import { heroSliderService } from "@/modules/hero-slider/hero-sliderService";
import { NextResponse } from "next/server";

// Public API - fetches only active sliders for the website
export async function GET() {
  try {
    const sliders = await heroSliderService.getActiveSliders();
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hero sliders" },
      { status: 500 }
    );
  }
}
