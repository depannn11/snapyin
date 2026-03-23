"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayCircle, Loader2, Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Password tidak cocok."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      setSuccess(true);
      setTimeout(() => router.push("/docs"), 1500);
    } catch { setError("Terjadi kesalahan. Coba lagi."); }
    finally   { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Akun berhasil dibuat!</h2>
        <p className="text-muted-foreground text-sm">Mengarahkan ke Docs...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <PlayCircle className="h-8 w-8 text-primary" />
            <span>Snap<span className="text-muted-foreground">-Tok</span></span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Buat akun untuk akses API</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Daftar</CardTitle>
            <CardDescription>Buat akun Snaptok API gratis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Username</label>
                <Input value={form.username} onChange={set("username")}
                  placeholder="min 3 karakter, hanya huruf/angka/_"
                  autoComplete="username" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={form.email} onChange={set("email")}
                  placeholder="email@example.com"
                  autoComplete="email" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                    placeholder="min 6 karakter" autoComplete="new-password" required className="pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Konfirmasi Password</label>
                <Input type="password" value={form.confirm} onChange={set("confirm")}
                  placeholder="ulangi password" autoComplete="new-password" required />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendaftarkan...</> : "Daftar Sekarang"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">Login</Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">← Kembali ke Snaptok</Link>
        </p>
      </div>
    </div>
  );
}
