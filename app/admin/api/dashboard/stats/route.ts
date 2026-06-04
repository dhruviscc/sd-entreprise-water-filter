import { NextResponse } from "next/server";
import { dashboardService } from "@/modules/dashboard/dashboardService";

export async function GET() {
  try {
    const stats = await dashboardService.getStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
