"use server";
import { crearClienteServidor } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface EstadoLogin {
  error?: string;
}

export async function iniciarSesion(_estadoPrevio: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const supabase = crearClienteServidor();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
  if (adminEmails.includes(email)) {
    redirect("/admin/verificaciones");
  }

  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (freelancer) {
    redirect("/dashboard/freelancer");
  }

  redirect("/dashboard/empresa");
}