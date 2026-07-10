"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function cerrarSesion() {
  const supabase = crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/");
}