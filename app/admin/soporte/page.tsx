// app/admin/soporte/page.tsx
import { crearClienteServidor } from "@/lib/supabase/server";
import { responderComoAdmin } from "@/lib/actions/soporte";

export default async function AdminSoporte() {
  const supabase = crearClienteServidor();

  const { data: conversaciones } = await supabase
    .from("soporte_conversaciones")
    .select("*, soporte_mensajes(*)")
    .order("creado_en", { ascending: false });

  const pendientes = (conversaciones || []).filter((c) => c.estado === "pendiente");
  const otras = (conversaciones || []).filter((c) => c.estado !== "pendiente");

  async function responder(formData: FormData) {
    "use server";
    const conversacionId = String(formData.get("conversacionId"));
    const mensaje = String(formData.get("mensaje") || "").trim();
    if (!mensaje) return;
    await responderComoAdmin(conversacionId, mensaje);
  }

  function renderConversacion(c: any) {
    const mensajes = (c.soporte_mensajes || []).sort(
      (a: any, b: any) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime()
    );
    return (
      <div key={c.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div>
            <p className="font-semibold text-slate-900 text-sm">{c.nombre}</p>
            {c.correo && <p className="text-xs text-slate-500">{c.correo}</p>}
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              c.estado === "pendiente" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
            }`}
          >
            {c.estado}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4 max-h-72 overflow-y-auto">
          {mensajes.map((m: any) => (
            <div
              key={m.id}
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                m.remitente === "usuario"
                  ? "bg-slate-100 text-slate-800 self-start rounded-bl-sm"
                  : "bg-brand-600 text-white self-end rounded-br-sm"
              }`}
            >
              {m.mensaje}
            </div>
          ))}
        </div>

        <form action={responder} className="flex items-center gap-2 border-t border-slate-100 p-3">
          <input type="hidden" name="conversacionId" value={c.id} />
          <input
            name="mensaje"
            placeholder="Responder..."
            className="flex-1 h-9 rounded-lg border border-slate-200 px-3 text-sm"
          />
          <button className="h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors">
            Enviar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Soporte</h1>
      <p className="text-slate-500 mb-8">
        {pendientes.length} {pendientes.length === 1 ? "conversación pendiente" : "conversaciones pendientes"}
      </p>

      <h2 className="text-sm font-semibold text-slate-700 mb-3">Pendientes</h2>
      {pendientes.length === 0 && <p className="text-sm text-slate-400 mb-8">No hay conversaciones pendientes.</p>}
      <div className="flex flex-col gap-4 mb-10">{pendientes.map(renderConversacion)}</div>

      <h2 className="text-sm font-semibold text-slate-700 mb-3">Otras conversaciones</h2>
      <div className="flex flex-col gap-4">{otras.map(renderConversacion)}</div>
    </div>
  );
}