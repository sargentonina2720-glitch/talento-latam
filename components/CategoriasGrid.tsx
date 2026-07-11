// components/CategoriasGrid.tsx
import Link from "next/link";

const categorias = [
  {
    slug: "desarrollo_web",
    nombre: "Desarrollo web",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    slug: "diseno_grafico",
    nombre: "Diseño gráfico",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="13.5" cy="6.5" r=".5" />
        <circle cx="17.5" cy="10.5" r=".5" />
        <circle cx="8.5" cy="7.5" r=".5" />
        <circle cx="6.5" cy="12.5" r=".5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    slug: "marketing_digital",
    nombre: "Marketing digital",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
      </svg>
    ),
  },
  {
    slug: "redaccion_traduccion",
    nombre: "Redacción y traducción",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    slug: "soporte_administrativo",
    nombre: "Soporte administrativo",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 20h8M12 18v2" />
      </svg>
    ),
  },
  {
    slug: "finanzas_negocios",
    nombre: "Finanzas y negocios",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

export default function CategoriasGrid() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-3">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-600 mb-2">
            Categorías
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            ¿Qué necesitas para tu proyecto?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Elige una categoría y publica en menos de 2 minutos.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/registro/empresa?categoria=${cat.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-slate-200 p-5 hover:border-brand-300 hover:bg-brand-50/50 transition-colors"
            >
              <span className="text-brand-600">{cat.icon}</span>
              <span className="text-sm font-medium text-slate-800 group-hover:text-brand-700">
                {cat.nombre}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}