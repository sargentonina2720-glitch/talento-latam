import { crearClienteServidor } from "@/lib/supabase/server";
import { CATEGORIA_LABELS } from "@/types/database";
import BotonPostular from "@/components/BotonPostular";

export default async function ProyectosPage() {
  const supabase = crearClienteServidor();

  const { data: { user } } = await supabase.auth.getUser();
  let estaVerificado = false;

  // Mapa proyecto_id -> estado de la postulación de ESTE freelancer ("pendiente" | "aceptado" | "rechazado")
  let misPostulaciones: Record<string, string> = {};

  if (user) {
    const { data: freelancer } = await supabase
      .from("freelancers")
      .select("estado_verificado")
      .eq("id", user.id)
      .single();
    estaVerificado = freelancer?.estado_verificado === "aprobado";

    const { data: postulaciones } = await supabase
      .from("postulaciones")
      .select("proyecto_id, estado")
      .eq("freelancer_id", user.id);

    (postulaciones || []).forEach((p) => {
      misPostulaciones[p.proyecto_id] = p.estado;
    });
  }

  // Trae todos los publicados
  const { data: todosLosProyectos } = await supabase
    .from("proyectos")
    .select("*, empresa:empresas(nombre_empresa)")
    .eq("estado", "publicado")
    .order("creado_en", { ascending: false });

  // Oculta los que este freelancer ya tiene marcados como "rechazado"
  const proyectos = (todosLosProyectos || []).filter((p) => misPostulaciones[p.id] !== "rechazado");

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-2xl font-semibold text-slate-900">
            Proyectos disponibles
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {proyectos.length} proyectos abiertos ahora mismo.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {proyectos.length === 0 && (
              <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
                <p className="text-sm text-slate-400">No hay proyectos publicados todavía. Vuelve pronto.</p>
              </div>
            )}
            {proyectos.map((p) => (
              <div key={p.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover
                  transition-shadow p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-900 text-[15px]">{p.titulo}</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {p.empresa?.nombre_empresa} · {CATEGORIA_LABELS[p.categoria as keyof typeof CATEGORIA_LABELS]}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-success-50 px-3 py-1 text-sm font-medium text-success-600">
                    ${p.presupuesto}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.descripcion}</p>

                {!user && (
                  <p className="mt-3 text-sm text-slate-500">
                    Inicia sesión como freelancer para postular.
                  </p>
                )}
                {user && !estaVerificado && (
                  <p className="mt-3 text-sm text-warn-600">
                    Tu perfil debe estar verificado para postular.
                  </p>
                )}
                {user && estaVerificado && (
                  <BotonPostular proyectoId={p.id} yaPostulado={!!misPostulaciones[p.id]} />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}