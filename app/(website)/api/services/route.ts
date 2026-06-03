import { servicesService } from "@/modules/services/servicesService";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const services = await servicesService.getAll(true);
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
