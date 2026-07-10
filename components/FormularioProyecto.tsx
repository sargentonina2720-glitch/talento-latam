"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { publicarProyecto } from "@/lib/actions/publicar-proyecto";
import type { EstadoPublicarProyecto } from "@/lib/actions/publicar-proyecto";

const estadoInicial: EstadoPublicarProyecto = {};

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="h-10 rounded-lg bg-brand-600 px-5 text-sm font-medium text-white
        hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm">
      {pending ? "Publicando..." : "Publicar proyecto"}
    </button>
  );
}

export default function FormularioProyecto() {
  const [estado, formAction] = useFormState(publicarProyecto, estadoInicial);
  const [tipoPresupuesto, setTipoPresupuesto] = useState<"hora" | "fijo">("hora");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="titulo" placeholder="Título del proyecto" required
        className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900
          placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
      <textarea name="descripcion" placeholder="Describe el proyecto, entregables esperados y plazos" required rows={4}
        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900
          placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none" />

      <select name="categoria" required
        className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900
          focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
        <option value="">Categoría</option>
        <option value="desarrollo_web">Desarrollo web</option>
        <option value="diseno_grafico">Diseño gráfico</option>
        <option value="marketing_digital">Marketing digital</option>
      </select>

      {/* Selector de tipo de presupuesto */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Tipo de presupuesto</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTipoPresupuesto("hora")}
            className={`h-9 flex-1 rounded-lg border text-sm font-medium transition-colors ${
              tipoPresupuesto === "hora"
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Por hora
          </button>
          <button
            type="button"
            onClick={() => setTipoPresupuesto("fijo")}
            className={`h-9 flex-1 rounded-lg border text-sm font-medium transition-colors ${
              tipoPresupuesto === "fijo"
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Proyecto completo
          </button>
        </div>
        {/* Este hidden input es el que realmente viaja en el FormData al server action */}
        <input type="hidden" name="tipo_presupuesto" value={tipoPresupuesto} />
      </div>

      <input
        name="presupuesto"
        type="number"
        placeholder={tipoPresupuesto === "hora" ? "Tarifa por hora (USD)" : "Presupuesto total del proyecto (USD)"}
        required
        className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900
          placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />

      {estado.error && (
        <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">{estado.error}</p>
      )}

      <BotonEnviar />
    </form>
  );
}
