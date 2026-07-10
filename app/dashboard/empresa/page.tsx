import { redirect } from "next/navigation";
import Link from "next/link";
import FormularioProyecto from "@/components/FormularioProyecto";
import { crearClienteServidor } from "@/lib/supabase/server";
import { CATEGORIA_LABELS, ESTADO_PROYECTO_LABELS } from "@/types/database";

export default async function DashboardEmpresaPage() {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: empresa } = await supabase
    .from("empresas").select("*, perfil:perfiles(*)").eq("id", user!.id).single();
  if (!empresa) redirect("/registro/empresa");

  const { data: proyectos, error: errorProyectos } = await supabase
    .from("proyectos")
    .select("*")
    .eq("empresa_id", user!.id)
    .order("creado_en", { ascending: false });

  if (errorProyectos) {
    console.error("Error cargando proyectos:", errorProyectos.message);
  }

  // Cuenta postulaciones pendientes por proyecto, para mostrar el badge en cada tarjeta
  const proyectoIds = (proyectos || []).map((p) => p.id);
  let conteoPostulantes: Record<string, number> = {};

  if (proyectoIds.length > 0) {
    const { data: postulaciones } = await supabase
      .from("postulaciones")
      .select("proyecto_id")
      .in("proyecto_id", proyectoIds)
      .eq("estado", "pendiente");

    (postulaciones || []).forEach((p) => {
      conteoPostulantes[p.proyecto_id] = (conteoPostulantes[p.proyecto_id] || 0) + 1;
    });
  }

  const total = proyectos?.length ?? 0;
  const activos = proyectos?.filter((p) => p.estado === "publicado" || p.estado === "en_progreso").length ?? 0;
  const presupuestoTotal = proyectos?.reduce((sum, p) => sum + Number(p.presupuesto), 0) ?? 0;
  const necesitanAtencion = proyectos?.filter((p) => p.estado === "entregado") ?? [];

  const estiloEstado: Record<string, string> = {
    publicado: "bg-brand-50 text-brand-700",
    en_progreso: "bg-warn-50 text-warn-600",
    entregado: "bg-warn-50 text-warn-600",
    aprobado: "bg-success-50 text-success-600",
    disputado: "bg-red-50 text-red-600",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1.5">
            {empresa.sector}
          </p>
          <h1 className="font-display text-2xl font-semibold text-slate-900">
            {empresa.nombre_empresa}
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-white border border-slate-200 shadow-card px-5 py-4">
            <p className="text-2xl font-display font-semibold text-slate-900">{total}</p>
            <p className="text-xs text-slate-400 mt-0.5">Proyectos totales</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 shadow-card px-5 py-4">
            <p className="text-2xl font-display font-semibold text-brand-600">{activos}</p>
            <p className="text-xs text-slate-400 mt-0.5">Activos ahora</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 shadow-card px-5 py-4">
            <p className="text-2xl font-display font-semibold text-success-600">${presupuestoTotal}</p>
            <p className="text-xs text-slate-400 mt-0.5">Invertido en total</p>
          </div>
        </div>

        {necesitanAtencion.length > 0 && (
          <section className="mb-8">
            <div className="rounded-2xl bg-warn-50 border border-warn-100 p-5">
              <p className="text-sm font-semibold text-warn-600 mb-3">
                Necesita tu atención ({necesitanAtencion.length})
              </p>
              <div className="flex flex-col gap-2">
                {necesitanAtencion.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.titulo}</p>
                      <p className="text-xs text-slate-400">Entregado — esperando tu revisión</p>
                    </div>
                    <span className="text-xs text-warn-600 font-medium">Revisar →</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl bg-white border border-slate-200 shadow-card p-6 sm:p-8 mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-5">
            Publicar nuevo proyecto
          </p>
          <FormularioProyecto />
        </section>

        <section>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-4">
            Tus proyectos ({total})
          </p>
          <div className="flex flex-col gap-3">
            {total === 0 && (
              <div className="rounded-2xl bg-white border border-slate-200 border-dashed p-10 text-center">
                <p className="text-sm text-slate-400">
                  Aún no has publicado ningún proyecto. Usa el formulario de arriba para crear el primero.
                </p>
              </div>
            )}
            {proyectos?.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/empresa/proyecto/${p.id}/postulantes`}
                className="block rounded-xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-shadow px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-slate-900 text-sm">{p.titulo}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {CATEGORIA_LABELS[p.categoria as keyof typeof CATEGORIA_LABELS]} · ${p.presupuesto}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {conteoPostulantes[p.id] > 0 && (
                      <span className="rounded-full bg-brand-600 text-white text-xs font-medium px-2.5 py-1">
                        {conteoPostulantes[p.id]} {conteoPostulantes[p.id] === 1 ? "postulante" : "postulantes"}
                      </span>
                    )}
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${estiloEstado[p.estado]}`}>
                      {ESTADO_PROYECTO_LABELS[p.estado as keyof typeof ESTADO_PROYECTO_LABELS]}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">{p.descripcion}</p>
                <p className="mt-2 text-xs text-brand-600 font-medium">Ver postulantes →</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}