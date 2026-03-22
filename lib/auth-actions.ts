"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "https://ssstiktok.soraa.my.id" : "http://localhost:3000"}/auth/callback`,
      data: {
        full_name: fullName,
        role: "user",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    return { success: true, message: "Registrasi berhasil! Silakan cek email untuk verifikasi." };
  }

  return { error: "Terjadi kesalahan" };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Check if user is admin
    const isAdmin = data.user.user_metadata?.role === "admin";
    
    if (isAdmin) {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return { error: "Terjadi kesalahan" };
}

export async function signInAdmin(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Check if user is admin
    const isAdmin = data.user.user_metadata?.role === "admin";
    
    if (!isAdmin) {
      await supabase.auth.signOut();
      return { error: "Anda tidak memiliki akses admin" };
    }
    
    redirect("/admin");
  }

  return { error: "Terjadi kesalahan" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}
