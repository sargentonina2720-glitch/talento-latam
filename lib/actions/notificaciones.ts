"use server";

import { crearClienteServidor } from "@/lib/supabase/server";

export async function marcarNotificacionLeida(freelancerId: string) {
  const supabase = crearClienteServidor();
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("freelancer_id", freelancerId)
    .eq("leida", false);
}