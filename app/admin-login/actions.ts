"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function isAllowedEmail(email: string) {
  const allowed = process.env.ADMIN_ALLOWED_EMAILS || "hello@leora.design";
  return email.toLowerCase() === allowed.toLowerCase();
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!isAllowedEmail(email)) {
    return { error: "Invalid email or password." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Check if error is related to email confirmation
    if (error.message.toLowerCase().includes("email not confirmed")) {
       return { error: "Please verify your email before signing in." };
    }
    return { error: "Invalid email or password." };
  }

  redirect("/admin");
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!isAllowedEmail(email)) {
    return { error: "This email is not authorised for LEORA admin access." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Registration successful. Please verify your email before signing in." };
}
