"use client";

import { useFormState, useFormStatus } from "react-dom";
import CampoFormulario from "@/components/CampoFormulario";
import { registrarFreelancer } from "@/lib/actions/registro-freelancer";
import type { EstadoRegistroFreelancer } from "@/lib/actions/registro-freelancer";

const estadoInicial: EstadoRegistroFreelancer = {};

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full h-11 rounded-lg bg-brand-600 font-medium text-white text-sm
        hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm">
      {pending ? "Creando tu cuenta..." : "Crear cuenta de freelancer"}
    </button>
  );
}

export default function FormularioRegistroFreelancer() {
  const [estado, formAction] = useFormState(registrarFreelancer, estadoInicial);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs
            font-medium text-success-600 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-success-600"></span>
            Verificación 100% gratuita
          </div>
          <h1 className="font-display text-2xl font-semibold text-slate-900">Regístrate como freelancer</h1>
          <p className="mt-1.5 text-sm text-slate-500">Nunca vas a pagar para que tu perfil sea revisado.</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-6 sm:p-8">
          <form action={formAction} className="flex flex-col gap-5">
            <CampoFormulario label="Nombre completo" name="nombre_completo" required placeholder="María Fernanda López" />
            <CampoFormulario label="Correo electrónico" name="email" type="email" required placeholder="maria@correo.com" />
            <CampoFormulario label="Contraseña" name="password" type="password" required helpText="Mínimo 8 caracteres." placeholder="••••••••" />
            <CampoFormulario label="Teléfono / WhatsApp" name="telefono" type="tel" placeholder="+593 9XX XXX XXX" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="categoria" className="text-sm font-medium text-slate-700">
                Categoría principal <span className="text-red-500">*</span>
              </label>
              <select id="categoria" name="categoria" required
                className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900
                  focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all">
                <option value="">Selecciona una categoría</option>
                <option value="desarrollo_web">Desarrollo web</option>
                <option value="diseno_grafico">Diseño gráfico</option>
                <option value="marketing_digital">Marketing digital</option>
              </select>
            </div>

            <CampoFormulario label="Habilidades" name="habilidades" required placeholder="React, Node.js, PostgreSQL" helpText="Sepáralas con comas." />
            <CampoFormulario label="Tarifa por hora (USD)" name="tarifa_hora" type="number" required placeholder="15" />
            <CampoFormulario label="Link de portafolio" name="portafolio_url" type="url" placeholder="https://tuportafolio.com" />

            {estado.error && (
              <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">{estado.error}</p>
            )}
            <BotonEnviar />
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta? <a href="/login" className="text-brand-600 font-medium hover:underline">Inicia sesión</a>
        </p>
      </div>
    </main>
  );
}