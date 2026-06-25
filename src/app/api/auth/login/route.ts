import { NextResponse } from "next/server";

const ADMIN_KEY = process.env.ADMIN_KEY || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = (body.password as string) || "";

    if (!password || password !== ADMIN_KEY) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", ADMIN_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
