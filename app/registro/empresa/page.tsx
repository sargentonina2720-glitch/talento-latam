import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import FormularioRegistroEmpresa from "@/components/FormularioRegistroEmpresa";

export default async function RegistroEmpresaPage() {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles").select("tipo_usuario").eq("id", user.id).single();

    if (perfil?.tipo_usuario === "empresa") {
      // Verificamos que la fila de empresa exista de verdad, no solo el perfil
      const { data: empresa } = await supabase
        .from("empresas").select("id").eq("id", user.id).single();

      if (empresa) {
        redirect("/dashboard/empresa");
      }
      // Perfil existe pero falta la fila de empresa: es una cuenta a medias.
      // La borramos para que el formulario de abajo la pueda recrear limpia.
      await supabase.from("perfiles").delete().eq("id", user.id);
    } else if (perfil?.tipo_usuario === "freelancer") {
      redirect("/dashboard/freelancer");
    }
  }

  return <FormularioRegistroEmpresa />;
}