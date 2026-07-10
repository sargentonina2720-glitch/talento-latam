"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EstadoPostular {
  error?: string;
  exito?: boolean;
}

export async function postularAProyecto(
  proyectoId: string,
  _estadoPrevio: EstadoPostular,
  formData: FormData
): Promise<EstadoPostular> {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión como freelancer para postular." };
  }

  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("estado_verificado")
    .eq("id", user.id)
    .single();

  if (freelancer?.estado_verificado !== "aprobado") {
    return { error: "Tu perfil debe estar verificado y aprobado para postular." };
  }

  const mensaje = String(formData.get("mensaje") || "").trim();

  const { error } = await supabase.from("postulaciones").insert({
    proyecto_id: proyectoId,
    freelancer_id: user.id,
    mensaje,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya postulaste a este proyecto." };
    }
    return { error: `No se pudo enviar la postulación: ${error.message}` };
  }

  revalidatePath("/proyectos");
  return { exito: true };
}