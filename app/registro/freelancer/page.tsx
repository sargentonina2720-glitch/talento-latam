import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import FormularioRegistroFreelancer from "@/components/FormularioRegistroFreelancer";

export default async function RegistroFreelancerPage() {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles").select("tipo_usuario").eq("id", user.id).single();
    redirect(perfil?.tipo_usuario === "empresa" ? "/dashboard/empresa" : "/dashboard/freelancer");
  }

  return <FormularioRegistroFreelancer />;
}