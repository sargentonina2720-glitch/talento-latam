"use server";

import { crearClienteServidor } from "@/lib/supabase/server";
import { esAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function verificarFreelancer(
  freelancerId: string,
  nuevoEstado: "aprobado" | "rechazado"
) {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  if (!esAdmin(user?.email)) {
    return { error: "No autorizado." };
  }

  const { error } = await supabase
    .from("freelancers")
    .update({ estado_verificado: nuevoEstado })
    .eq("id", freelancerId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/verificaciones");
  return { exito: true };
}