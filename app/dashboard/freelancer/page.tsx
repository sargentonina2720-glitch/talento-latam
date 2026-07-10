import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { CATEGORIA_LABELS } from "@/types/database";

export default async function DashboardFreelancerPage() {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: freelancer } = await supabase
    .from("freelancers").select("*, perfil:perfiles(*)").eq("id", user!.id).single();
  if (!freelancer) redirect("/registro/freelancer");

  const estadoTexto = { pendiente: "En revisión", aprobado: "Verificado", rechazado: "No aprobado" }[freelancer.estado_verificado];
  const estadoEstilo = {
    pendiente: "bg-warn-50 text-warn-600",
    aprobado: "bg-success-50 text-success-600",
    rechazado: "bg-red-50 text-red-600",
  }[freelancer.estado_verificado];

  return (
    <>
      
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-2xl font-semibold text-slate-900">
              Hola, {freelancer.perfil?.nombre_completo}
            </h1>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${estadoEstilo}`}>{estadoTexto}</span>
          </div>

          {freelancer.estado_verificado === "pendiente" && (
            <div className="mb-6 rounded-xl bg-warn-50 border border-warn-100 px-4 py-3">
              <p className="text-sm text-warn-600">
                Tu perfil está en revisión. Te avisaremos por correo cuando termine — este proceso es gratuito.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-5">Tu perfil</p>
            <dl className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <dt className="text-slate-400 text-xs mb-1">Categoría</dt>
                <dd className="text-slate-900 font-medium">{CATEGORIA_LABELS[freelancer.categoria]}</dd>
              </div>
              <div>
                <dt className="text-slate-400 text-xs mb-1">Tarifa por hora</dt>
                <dd className="text-slate-900 font-medium">${freelancer.tarifa_hora}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-400 text-xs mb-2">Habilidades</dt>
                <dd className="flex flex-wrap gap-2">
                  {freelancer.habilidades.map((h: string) => (
                    <span key={h} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{h}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </>
  );
}
