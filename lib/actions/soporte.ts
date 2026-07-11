"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EstadoSoporte {
  error?: string;
  conversacionId?: string;
}

export async function iniciarConversacion(
  _estadoPrevio: EstadoSoporte,
  formData: FormData
): Promise<EstadoSoporte> {
  const supabase = crearClienteServidor();

  const nombre = String(formData.get("nombre") || "").trim();
  const correo = String(formData.get("correo") || "").trim();
  const mensaje = String(formData.get("mensaje") || "").trim();

  if (!nombre || !mensaje) {
    return { error: "Completa tu nombre y el mensaje." };
  }

  const { data: conversacion, error } = await supabase
    .from("soporte_conversaciones")
    .insert({ nombre, correo: correo || null })
    .select()
    .single();

  if (error || !conversacion) {
    return { error: "No se pudo enviar el mensaje. Intenta de nuevo." };
  }

  await supabase.from("soporte_mensajes").insert({
    conversacion_id: conversacion.id,
    remitente: "usuario",
    mensaje,
  });

  return { conversacionId: conversacion.id };
}

export async function enviarMensajeUsuario(conversacionId: string, mensaje: string) {
  const supabase = crearClienteServidor();
  await supabase.from("soporte_mensajes").insert({
    conversacion_id: conversacionId,
    remitente: "usuario",
    mensaje,
  });
  // Si el admin ya había respondido y el usuario vuelve a escribir, reabre como pendiente
  await supabase
    .from("soporte_conversaciones")
    .update({ estado: "pendiente" })
    .eq("id", conversacionId);
}

export async function responderComoAdmin(conversacionId: string, mensaje: string) {
  const supabase = crearClienteServidor();
  await supabase.from("soporte_mensajes").insert({
    conversacion_id: conversacionId,
    remitente: "admin",
    mensaje,
  });
  await supabase
    .from("soporte_conversaciones")
    .update({ estado: "respondido" })
    .eq("id", conversacionId);
  revalidatePath("/admin/soporte");
}