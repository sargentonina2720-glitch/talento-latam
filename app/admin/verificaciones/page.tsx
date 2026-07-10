// app/admin/verificaciones/page.tsx
import { crearClienteServidor } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminVerificaciones() {
  const supabase = crearClienteServidor();

  const { data: pendientes } = await supabase
    .from("freelancers")
    .select(`
      id,
      categoria,
      habilidades,
      tarifa_hora,
      portafolio_url,
      estado_verificado,
      perfiles ( nombre_completo )
    `)
    .eq("estado_verificado", "pendiente");

  async function aprobar(id: string) {
    "use server";
    const supabase = crearClienteServidor();
    await supabase.from("freelancers").update({ estado_verificado: "aprobado", sello_calidad: true }).eq("id", id);
    revalidatePath("/admin/verificaciones");
    revalidatePath("/admin");
  }

  async function rechazar(id: string) {
    "use server";
    const supabase = crearClienteServidor();
    await supabase.from("freelancers").update({ estado_verificado: "rechazado" }).eq("id", id);
    revalidatePath("/admin/verificaciones");
    revalidatePath("/admin");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Verificaciones pendientes</h1>
      <p className="text-slate-500 mb-8">
        {pendientes?.length ?? 0} {pendientes?.length === 1 ? "perfil esperando" : "perfiles esperando"} revisión.
      </p>

      {pendientes?.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          No hay nadie pendiente ahora mismo. 🎉
        </div>
      )}

      <div className="flex flex-col gap-3">
        {pendientes?.map((f: any) => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-start">
            <div>
              <p className="font-semibold text-slate-900">{f.perfiles?.nombre_completo}</p>
              <p className="text-sm text-slate-500">{f.categoria} · ${f.tarifa_hora}/hora</p>
              {f.habilidades && f.habilidades.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {f.habilidades.map((s: string, i: number) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {f.portafolio_url && (
                <a href={f.portafolio_url} target="_blank" className="text-sm text-brand-600 underline mt-2 inline-block">
                  Ver portafolio
                </a>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <form action={aprobar.bind(null, f.id)}>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  Aprobar
                </button>
              </form>
              <form action={rechazar.bind(null, f.id)}>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  Rechazar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}