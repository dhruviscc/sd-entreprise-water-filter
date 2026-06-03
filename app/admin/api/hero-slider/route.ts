import { heroSliderService } from "@/modules/hero-slider/hero-sliderService";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const sliders = await heroSliderService.getAllSliders();
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sliders", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation to ensure "proper" error reporting
    if (!body.title || !body.desktopImage || !body.mobileImage) {
      return NextResponse.json({ error: "Missing required fields: title, desktopImage, or mobileImage" }, { status: 400 });
    }

    // Ensure optional fields have defaults if missing in body
    const sliderData = {
      ...body,
      secondaryInterest: body.secondaryInterest || '',
      secondaryType: body.secondaryType || 'service'
    };

    const slider = await heroSliderService.createSlider(sliderData);

    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create slider", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { action, id, isActive, items } = await request.json();

    if (action === "reorder") {
      await heroSliderService.updateOrder(items);
      return NextResponse.json({ success: true });
    }

    if (action === "toggle") {
      const updated = await heroSliderService.toggleStatus(id, isActive);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Operation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing slider ID for update" }, { status: 400 });
    }

    const updatedSlider = await heroSliderService.updateSlider(id, updateData);

    return NextResponse.json(updatedSlider);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update slider", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE (request : Request ){
   try {
    const {id} = await request.json();
    await heroSliderService.deleteSlider(id);
    return NextResponse.json({success : true});
   } catch (error) {
    return NextResponse.json(
        { error: "Failed to delete slider", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
    );
   } 
}
