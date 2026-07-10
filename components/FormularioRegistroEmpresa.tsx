"use client";

import { useFormState, useFormStatus } from "react-dom";
import NavBar from "@/components/NavBar";
import CampoFormulario from "@/components/CampoFormulario";
import { registrarEmpresa } from "@/lib/actions/registro-empresa";
import type { EstadoRegistroEmpresa } from "@/lib/actions/registro-empresa";

const estadoInicial: EstadoRegistroEmpresa = {};

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full h-11 rounded-lg bg-brand-600 font-medium text-white text-sm
        hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm">
      {pending ? "Creando tu cuenta..." : "Crear cuenta de empresa"}
    </button>
  );
}

export default function RegistroEmpresaPage() {
  const [estado, formAction] = useFormState(registrarEmpresa, estadoInicial);

  return (
    <>
     
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-md px-6 py-16">

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs
              font-medium text-brand-700 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
              Primer proyecto sin comisión
            </div>
            <h1 className="font-display text-2xl font-semibold text-slate-900">
              Registra tu empresa
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Publica tu primer proyecto y conecta con freelancers ya verificados.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-6 sm:p-8">
            <form action={formAction} className="flex flex-col gap-5">
              <CampoFormulario label="Nombre de contacto" name="nombre_completo" required
                placeholder="Carlos Andrade" />
              <CampoFormulario label="Correo electrónico" name="email" type="email" required
                placeholder="carlos@empresa.com" />
              <CampoFormulario label="Contraseña" name="password" type="password" required
                helpText="Mínimo 8 caracteres." placeholder="••••••••" />
              <CampoFormulario label="Teléfono / WhatsApp" name="telefono" type="tel"
                placeholder="+593 9XX XXX XXX" />
              <CampoFormulario label="Nombre de la empresa" name="nombre_empresa" required
                placeholder="Andrade Studio" />
              <CampoFormulario label="Sector" name="sector" required
                placeholder="E-commerce, Salud, Educación..." />
              <CampoFormulario label="Sitio web" name="sitio_web" type="url"
                placeholder="https://tuempresa.com" />

              {estado.error && (
                <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
                  {estado.error}
                </p>
              )}

              <BotonEnviar />
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-brand-600 font-medium hover:underline">Inicia sesión</a>
          </p>
        </div>
      </main>
    </>
  );
}
