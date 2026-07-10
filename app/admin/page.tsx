// app/admin/page.tsx
import { crearClienteServidor } from "@/lib/supabase/server";

async function StatCard({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneClasses = {
    default: "text-slate-900",
    success: "text-green-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}

export default async function AdminResumen() {
  const supabase = crearClienteServidor();

  const [
    { count: pendientes },
    { count: aprobados },
    { count: totalEmpresas },
    { count: proyectosPublicados },
    { count: proyectosActivos },
    { data: proyectosPresupuesto },
  ] = await Promise.all([
    supabase.from("freelancers").select("*", { count: "exact", head: true }).eq("estado_verificado", "pendiente"),
    supabase.from("freelancers").select("*", { count: "exact", head: true }).eq("estado_verificado", "aprobado"),
    supabase.from("empresas").select("*", { count: "exact", head: true }),
    supabase.from("proyectos").select("*", { count: "exact", head: true }).eq("estado", "publicado"),
    supabase.from("proyectos").select("*", { count: "exact", head: true }).eq("estado", "en_progreso"),
    supabase.from("proyectos").select("presupuesto"),
  ]);

  const volumenTotal = (proyectosPresupuesto || []).reduce(
    (sum, p) => sum + (Number(p.presupuesto) || 0),
    0
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Resumen general</h1>
      <p className="text-slate-500 mb-8">Estado actual de la plataforma en tiempo real.</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Pendientes de revisión" value={pendientes ?? 0} tone="warning" />
        <StatCard label="Freelancers aprobados" value={aprobados ?? 0} tone="success" />
        <StatCard label="Empresas registradas" value={totalEmpresas ?? 0} />
        <StatCard label="Volumen total (USD)" value={`$${volumenTotal.toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Proyectos publicados (abiertos)" value={proyectosPublicados ?? 0} />
        <StatCard label="Proyectos en progreso" value={proyectosActivos ?? 0} />
      </div>
    </div>
  );
}