// app/admin/freelancers/page.tsx
import { crearClienteServidor } from "@/lib/supabase/server";

const estadoStyles: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

export default async function AdminFreelancers() {
  const supabase = crearClienteServidor();

  const { data: freelancers } = await supabase
    .from("freelancers")
    .select(`
      id,
      categoria,
      habilidades,
      tarifa_hora,
      portafolio_url,
      estado_verificado,
      sello_calidad,
      perfiles ( nombre_completo, telefono )
    `)
    .order("estado_verificado", { ascending: true });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Freelancers</h1>
      <p className="text-slate-500 mb-8">{freelancers?.length ?? 0} freelancers registrados en total.</p>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Teléfono</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Categoría</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Tarifa</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Habilidades</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Sello</th>
            </tr>
          </thead>
          <tbody>
            {freelancers?.map((f: any) => (
              <tr key={f.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{f.perfiles?.nombre_completo}</td>
                <td className="px-4 py-3 text-slate-500">
                  {f.perfiles?.telefono || "—"}
                </td>
                <td className="px-4 py-3 text-slate-700">{f.categoria}</td>
                <td className="px-4 py-3 text-slate-700">${f.tarifa_hora}/h</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(f.habilidades || []).map((s: string, i: number) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${estadoStyles[f.estado_verificado] || ""}`}>
                    {f.estado_verificado}
                  </span>
                </td>
                <td className="px-4 py-3">{f.sello_calidad ? "✅" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}