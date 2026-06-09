import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server";
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  clearAuthCookies,
} from "@/modules/auth/authCookie";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const USER_ENDPOINT = `${SUPABASE_URL}/auth/v1/user`;

async function fetchSupabaseUser(accessToken: string) {
  const response = await fetch(USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_ANON_KEY || "",
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}


export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  let user: any = null;
  let response: NextResponse | null = null;

  user = await fetchSupabaseUser(accessToken);

  if (!user || !user.id) {
    response = NextResponse.json({ user: null });
    if (accessToken || refreshToken) {
      clearAuthCookies(response);
    }
    return response;
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const mergedUser = {
    ...user,
    ...profile,
    role: profile?.role || user.user_metadata?.role || "user",
  };

  return NextResponse.json({ user: mergedUser });
}

