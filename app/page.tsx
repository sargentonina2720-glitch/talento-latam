import Link from "next/link";
import ComoFunciona from "@/components/ComoFunciona";
import CategoriasGrid from "@/components/CategoriasGrid";
import FaqAcordeon from "@/components/FaqAcordeon";
import BotAyuda from "@/components/BotAyuda";

// dentro del <body>, después de {children}:
<BotAyuda />
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-sm text-brand-700 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
          Ahora en Ecuador · Pronto en toda Latinoamérica
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight">
          Freelancers verificados
          <br />
          <span className="text-brand-600">de verdad.</span>
        </h1>

        <p className="mt-6 text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          No solo identidad confirmada. Validamos habilidades técnicas reales y garantizamos pagos —
          sin costos ocultos ni soporte detrás de un paywall.
        </p>

        <ul className="mb-2 mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <li className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-600">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Verificación gratis
          </li>
          <li className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Pagos protegidos
          </li>
          <li className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-600">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Soporte en 24h
          </li>
        </ul>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/registro/empresa"
            className="h-11 px-6 rounded-lg bg-brand-600 text-white text-sm font-medium flex items-center hover:bg-brand-700 transition-colors shadow-sm"
          >
            Publicar un proyecto gratis
          </Link>
          <Link
            href="/registro/freelancer"
            className="h-11 px-6 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50 transition-colors"
          >
            Registrarme como freelancer
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="rounded-xl border border-slate-200 px-4 py-5">
            <p className="font-display text-2xl font-semibold text-slate-900">100%</p>
            <p className="text-xs text-slate-400 mt-1">Verificación gratuita</p>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-5">
            <p className="font-display text-2xl font-semibold text-slate-900">8–12%</p>
            <p className="text-xs text-slate-400 mt-1">Comisión por transacción</p>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-5">
            <p className="font-display text-2xl font-semibold text-slate-900">24h</p>
            <p className="text-xs text-slate-400 mt-1">Soporte en español</p>
          </div>
        </div>
      </div>

      <ComoFunciona />
      <CategoriasGrid />

      <div className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Por qué no somos Workana
          </p>
        </div>
      </div>

      <FaqAcordeon />
    </main>
  );
}