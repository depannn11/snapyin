import { NextRequest, NextResponse } from "next/server";
import { loginUser, createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });

    const result = await loginUser(username, password);
    if (!result.success)
      return NextResponse.json({ error: result.error }, { status: 401 });

    const token = await createSession(result.user!);
    const res   = NextResponse.json({ success: true, user: result.user });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   true,
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 30,
      path:     "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
