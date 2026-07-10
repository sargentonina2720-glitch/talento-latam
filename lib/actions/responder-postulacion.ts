"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EstadoResponderPostulacion {
  error?: string;
}

export async function aceptarPostulacion(
  postulacionId: string,
  freelancerId: string,
  tituloProyecto: string
): Promise<EstadoResponderPostulacion> {
  const supabase = crearClienteServidor();

  const { error } = await supabase
    .from("postulaciones")
    .update({ estado: "aceptado", respuesta_empresa: "¡Felicidades! Fuiste seleccionado para este proyecto." })
    .eq("id", postulacionId);

  if (error) return { error: error.message };

  // Marcar el proyecto como en progreso y asignarlo a este freelancer
  const { data: postulacion } = await supabase
    .from("postulaciones")
    .select("proyecto_id")
    .eq("id", postulacionId)
    .single();

  if (postulacion) {
    await supabase
      .from("proyectos")
      .update({ estado: "en_progreso", freelancer_id: freelancerId })
      .eq("id", postulacion.proyecto_id)
      .eq("estado", "publicado");
  }

  await supabase.from("notificaciones").insert({
    freelancer_id: freelancerId,
    titulo: "¡Fuiste aceptado!",
    mensaje: `La empresa te seleccionó para el proyecto "${tituloProyecto}".`,
  });

  revalidatePath("/dashboard/empresa");
  return {};
}

export async function rechazarPostulacion(
  postulacionId: string,
  freelancerId: string,
  tituloProyecto: string,
  motivo: string
): Promise<EstadoResponderPostulacion> {
  const supabase = crearClienteServidor();

  const { error } = await supabase
    .from("postulaciones")
    .update({ estado: "rechazado", respuesta_empresa: motivo })
    .eq("id", postulacionId);

  if (error) return { error: error.message };

  await supabase.from("notificaciones").insert({
    freelancer_id: freelancerId,
    titulo: "Postulación no seleccionada",
    mensaje: `Para el proyecto "${tituloProyecto}": ${motivo || "La empresa decidió avanzar con otro perfil."}`,
  });

  revalidatePath("/dashboard/empresa");
  return {};
}