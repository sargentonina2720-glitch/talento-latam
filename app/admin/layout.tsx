// app/admin/layout.tsx
import Link from "next/link";
import { crearClienteServidor } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
  if (!user || !adminEmails.includes(user.email || "")) {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "Resumen", icon: "📊" },
    { href: "/admin/verificaciones", label: "Verificaciones", icon: "✅" },
    { href: "/admin/freelancers", label: "Freelancers", icon: "👤" },
    { href: "/admin/empresas", label: "Empresas", icon: "🏢" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <span className="font-bold text-slate-900">Talento <span className="text-brand-600">LATAM</span></span>
        </div>
        <div className="px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">
          Panel de administración
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-200 text-xs text-slate-400">
          {user.email}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}