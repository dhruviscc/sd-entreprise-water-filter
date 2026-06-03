import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/modules/auth/authCookie";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  clearAuthCookies(response);
  return response;
}
