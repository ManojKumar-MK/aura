import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json() as {
    name?: string;
    email: string;
    message?: string;
  };

  if (!email?.trim()) {
    return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name:    name?.trim()    ?? "",
    email:   email.trim(),
    message: message?.trim() ?? "",
    is_read: false,
  });

  if (error) {
    console.error("contact submission error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
