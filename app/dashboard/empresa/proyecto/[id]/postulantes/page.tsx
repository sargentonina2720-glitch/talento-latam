// app/dashboard/empresa/proyecto/[id]/postulantes/page.tsx
import { crearClienteServidor } from "@/lib/supabase/server";
import { aceptarPostulacion, rechazarPostulacion } from "@/lib/actions/responder-postulacion";
import { redirect } from "next/navigation";

const estadoStyles: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aceptado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

export default async function Postulantes({ params }: { params: { id: string } }) {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: proyecto } = await supabase
    .from("proyectos")
    .select("id, titulo, empresa_id")
    .eq("id", params.id)
    .single();

  if (!proyecto || proyecto.empresa_id !== user.id) {
    redirect("/dashboard/empresa");
  }

  const { data: postulaciones } = await supabase
    .from("postulaciones")
    .select(`
      id,
      mensaje,
      estado,
      creado_en,
      freelancer_id,
      freelancers (
        categoria,
        habilidades,
        tarifa_hora,
        portafolio_url,
        perfiles ( nombre_completo, telefono )
      )
    `)
    .eq("proyecto_id", params.id)
    .order("creado_en", { ascending: true });

  async function aceptar(postulacionId: string, freelancerId: string) {
    "use server";
    await aceptarPostulacion(postulacionId, freelancerId, proyecto!.titulo);
  }

  async function rechazar(formData: FormData) {
    "use server";
    const postulacionId = String(formData.get("postulacionId"));
    const freelancerId = String(formData.get("freelancerId"));
    const motivo = String(formData.get("motivo") || "");
    await rechazarPostulacion(postulacionId, freelancerId, proyecto!.titulo, motivo);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Postulantes</h1>
      <p className="text-slate-500 mb-8">Proyecto: {proyecto.titulo}</p>

      {postulaciones?.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          Nadie ha postulado a este proyecto todavía.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {postulaciones?.map((p: any) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-slate-900">{p.freelancers?.perfiles?.nombre_completo}</p>
                <p className="text-sm text-slate-500">
                  {p.freelancers?.categoria} · ${p.freelancers?.tarifa_hora}/h
                </p>
                {p.freelancers?.habilidades && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.freelancers.habilidades.map((s: string, i: number) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {p.freelancers?.portafolio_url && (
                  <a href={p.freelancers.portafolio_url} target="_blank" className="text-sm text-brand-600 underline mt-2 inline-block">
                    Ver portafolio
                  </a>
                )}
                {p.mensaje && (
                  <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg p-3">{p.mensaje}</p>
                )}
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${estadoStyles[p.estado]}`}>
                {p.estado}
              </span>
            </div>

            {p.estado === "pendiente" && (
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center gap-2">
                <form action={aceptar.bind(null, p.id, p.freelancer_id)}>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    Aceptar
                  </button>
                </form>
                <form action={rechazar} className="flex items-center gap-2 flex-1">
                  <input type="hidden" name="postulacionId" value={p.id} />
                  <input type="hidden" name="freelancerId" value={p.freelancer_id} />
                  <input
                    name="motivo"
                    placeholder="Motivo breve (opcional)"
                    className="flex-1 h-9 rounded-lg border border-slate-200 px-3 text-sm"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    Rechazar
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}