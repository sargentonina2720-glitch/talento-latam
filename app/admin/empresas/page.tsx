// app/admin/empresas/page.tsx
import { crearClienteServidor } from "@/lib/supabase/server";

const estadoStyles: Record<string, string> = {
  publicado: "bg-blue-100 text-blue-700",
  en_progreso: "bg-amber-100 text-amber-700",
  entregado: "bg-purple-100 text-purple-700",
  aprobado: "bg-green-100 text-green-700",
  disputado: "bg-red-100 text-red-700",
};

export default async function AdminEmpresas() {
  const supabase = crearClienteServidor();

  const { data: empresas } = await supabase
    .from("empresas")
    .select(`
      id,
      nombre_empresa,
      sector,
      sitio_web,
      perfiles ( nombre_completo, telefono )
    `);

  const { data: proyectos } = await supabase
    .from("proyectos")
    .select("id, titulo, presupuesto, tipo_presupuesto, categoria, estado, empresa_id");

  const proyectosPorEmpresa = (empresas || []).map((e) => ({
    ...e,
    proyectos: (proyectos || []).filter((p) => p.empresa_id === e.id),
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Empresas</h1>
      <p className="text-slate-500 mb-8">{empresas?.length ?? 0} empresas registradas en total.</p>

      <div className="flex flex-col gap-4">
        {proyectosPorEmpresa.map((e: any) => (
          <div key={e.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-slate-900">{e.nombre_empresa}</p>
                <p className="text-sm text-slate-500">
                  {e.perfiles?.nombre_completo}
                  {e.perfiles?.telefono && ` · ${e.perfiles.telefono}`}
                </p>
                {e.sector && <p className="text-sm text-slate-400">{e.sector}</p>}
                {e.sitio_web && (
                  <a href={e.sitio_web} target="_blank" className="text-sm text-brand-600 underline">
                    {e.sitio_web}
                  </a>
                )}
              </div>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full shrink-0">
                {e.proyectos.length} {e.proyectos.length === 1 ? "proyecto" : "proyectos"}
              </span>
            </div>

            {e.proyectos.length > 0 && (
              <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2">
                {e.proyectos.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-slate-800">{p.titulo}</span>
                      <span className="text-slate-400"> · {p.categoria}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">
                        ${p.presupuesto} {p.tipo_presupuesto === "hora" ? "/hora" : "proyecto"}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estadoStyles[p.estado] || ""}`}>
                        {p.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}