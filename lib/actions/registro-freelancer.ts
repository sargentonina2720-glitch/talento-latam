"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { CategoriaProyecto } from "@/types/database";

export interface EstadoRegistroFreelancer {
  error?: string;
}

// Server Action: crea el usuario en auth.users, el registro en "perfiles"
// y el registro en "freelancers" en un solo flujo.
export async function registrarFreelancer(
  _estadoPrevio: EstadoRegistroFreelancer,
  formData: FormData
): Promise<EstadoRegistroFreelancer> {
  const nombreCompleto = String(formData.get("nombre_completo") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const telefono = String(formData.get("telefono") || "").trim();
  const categoria = String(formData.get("categoria") || "") as CategoriaProyecto;
  const tarifaHora = Number(formData.get("tarifa_hora") || 0);
  const portafolioUrl = String(formData.get("portafolio_url") || "").trim();
  const habilidadesRaw = String(formData.get("habilidades") || "");

  if (!nombreCompleto || !email || !password || !categoria || !tarifaHora) {
    return { error: "Completa todos los campos obligatorios." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const habilidades = habilidadesRaw
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  if (habilidades.length === 0) {
    return { error: "Agrega al menos una habilidad, separada por comas." };
  }

  const supabase = crearClienteServidor();

  // 1. Crear el usuario de autenticación
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "No se pudo crear la cuenta." };
  }

  const userId = authData.user.id;

  // 2. Crear el perfil compartido
  const { error: perfilError } = await supabase.from("perfiles").insert({
    id: userId,
    nombre_completo: nombreCompleto,
    telefono: telefono || null,
    tipo_usuario: "freelancer",
  });

  if (perfilError) {
    return { error: `Error creando el perfil: ${perfilError.message}` };
  }

  // 3. Crear el registro específico de freelancer
  const { error: freelancerError } = await supabase.from("freelancers").insert({
    id: userId,
    categoria,
    habilidades,
    tarifa_hora: tarifaHora,
    portafolio_url: portafolioUrl || null,
    estado_verificado: "pendiente",
    sello_calidad: false,
  });

  if (freelancerError) {
    return { error: `Error creando el perfil de freelancer: ${freelancerError.message}` };
  }

  redirect("/dashboard/freelancer");
}
