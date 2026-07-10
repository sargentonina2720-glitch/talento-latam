"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { CategoriaProyecto } from "@/types/database";

export interface EstadoPublicarProyecto {
  error?: string;
}

export async function publicarProyecto(
  _estadoPrevio: EstadoPublicarProyecto,
  formData: FormData
): Promise<EstadoPublicarProyecto> {
  const supabase = crearClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión como empresa para publicar." };
  }

  const titulo = String(formData.get("titulo") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const presupuesto = Number(formData.get("presupuesto") || 0);
  const categoria = String(formData.get("categoria") || "") as CategoriaProyecto;
  const tipoPresupuesto = String(formData.get("tipo_presupuesto") || "hora");

  if (!titulo || !descripcion || !presupuesto || !categoria) {
    return { error: "Completa todos los campos." };
  }

  const { error } = await supabase.from("proyectos").insert({
    empresa_id: user.id,
    titulo,
    descripcion,
    presupuesto,
    categoria,
    tipo_presupuesto: tipoPresupuesto,
    estado: "publicado",
  });

  if (error) {
    return { error: `No se pudo publicar el proyecto: ${error.message}` };
  }

  revalidatePath("/dashboard/empresa");
  return {};
}