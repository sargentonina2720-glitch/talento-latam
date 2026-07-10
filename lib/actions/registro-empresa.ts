"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface EstadoRegistroEmpresa {
  error?: string;
}

export async function registrarEmpresa(
  _estadoPrevio: EstadoRegistroEmpresa,
  formData: FormData
): Promise<EstadoRegistroEmpresa> {
  const nombreCompleto = String(formData.get("nombre_completo") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const telefono = String(formData.get("telefono") || "").trim();
  const nombreEmpresa = String(formData.get("nombre_empresa") || "").trim();
  const sector = String(formData.get("sector") || "").trim();
  const sitioWeb = String(formData.get("sitio_web") || "").trim();

  if (!nombreCompleto || !email || !password || !nombreEmpresa || !sector) {
    return { error: "Completa todos los campos obligatorios." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const supabase = crearClienteServidor();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "No se pudo crear la cuenta." };
  }

  const userId = authData.user.id;

  const { error: perfilError } = await supabase.from("perfiles").insert({
    id: userId,
    nombre_completo: nombreCompleto,
    telefono: telefono || null,
    tipo_usuario: "empresa",
  });

  if (perfilError) {
    return { error: `Error creando el perfil: ${perfilError.message}` };
  }

  const { error: empresaError } = await supabase.from("empresas").insert({
    id: userId,
    nombre_empresa: nombreEmpresa,
    sector,
    sitio_web: sitioWeb || null,
  });

  if (empresaError) {
    // Si esto falla, borramos el perfil que sí se creó para no dejar una cuenta a medias
    await supabase.from("perfiles").delete().eq("id", userId);
    return { error: `Error creando el perfil de empresa: ${empresaError.message}` };
  }
  redirect("/dashboard/empresa");
}
