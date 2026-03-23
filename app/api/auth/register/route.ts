import { NextRequest, NextResponse } from "next/server";
import { registerUser, createSession, addToApiKeyIndex, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password)
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    if (username.length < 3 || username.length > 20)
      return NextResponse.json({ error: "Username harus 3-20 karakter." }, { status: 400 });
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return NextResponse.json({ error: "Username hanya boleh huruf, angka, dan underscore." }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });

    const result = await registerUser(username, email, password);
    if (!result.success)
      return NextResponse.json({ error: result.error }, { status: 400 });

    // Save to API key index
    await addToApiKeyIndex(result.user!.apikey, result.user!.username);

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
