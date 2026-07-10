"use client";

import { useFormState, useFormStatus } from "react-dom";
import NavBar from "@/components/NavBar";
import CampoFormulario from "@/components/CampoFormulario";
import { iniciarSesion } from "@/lib/actions/login";
import type { EstadoLogin } from "@/lib/actions/login";

const estadoInicial: EstadoLogin = {};

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full h-11 rounded-lg bg-brand-600 font-medium text-white text-sm
        hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm">
      {pending ? "Ingresando..." : "Iniciar sesión"}
    </button>
  );
}

export default function LoginPage() {
  const [estado, formAction] = useFormState(iniciarSesion, estadoInicial);

  return (
    
      
      <main className="min-h-screen bg-slate-50 flex items-start justify-center">
        <div className="w-full max-w-sm px-6 py-16">
          <h1 className="font-display text-2xl font-semibold text-slate-900 mb-1.5">
            Iniciar sesión
          </h1>
          <p className="text-sm text-slate-500 mb-8">Accede a tu cuenta de TalentoLATAM.</p>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-6 sm:p-8">
            <form action={formAction} className="flex flex-col gap-5">
              <CampoFormulario label="Correo electrónico" name="email" type="email" required
                placeholder="tu@correo.com" />
              <CampoFormulario label="Contraseña" name="password" type="password" required
                placeholder="••••••••" />

              {estado.error && (
                <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
                  {estado.error}
                </p>
              )}

              <BotonEnviar />
            </form>
          </div>
        </div>
      </main>
    
  );
}
