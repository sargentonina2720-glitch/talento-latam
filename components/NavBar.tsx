import Link from "next/link";
import { cerrarSesion } from "@/lib/actions/logout";
import CampanaNotificaciones from "./CampanaNotificaciones";

interface NavBarProps {
  sesionActiva: boolean;
  nombreCompleto?: string | null;
  tipoUsuario?: "freelancer" | "empresa" | "admin" | null;
  userId?: string | null;
}

export default function NavBar({ sesionActiva, nombreCompleto, tipoUsuario, userId }: NavBarProps) {
  const esEmpresa = tipoUsuario === "empresa";
  const esFreelancer = tipoUsuario === "freelancer";
  const esAdmin = tipoUsuario === "admin";
  const linkDashboard = esEmpresa ? "/dashboard/empresa" : "/dashboard/freelancer";

  const linkProyectos = esEmpresa ? "/dashboard/empresa" : "/proyectos";
  const labelProyectos = esEmpresa ? "Mis proyectos" : "Ver proyectos";

  if (esAdmin) {
    return (
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-1">
            <span className="font-display text-xl font-semibold text-slate-900">Talento</span>
            <span className="font-display text-xl font-semibold text-brand-600">LATAM</span>
          </Link>
          <form action={cerrarSesion}>
            <button type="submit"
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-display text-xl font-semibold text-slate-900">Talento</span>
          <span className="font-display text-xl font-semibold text-brand-600">LATAM</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link href={linkProyectos}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            {labelProyectos}
          </Link>

          {sesionActiva ? (
            <>
              {esFreelancer && userId && <CampanaNotificaciones freelancerId={userId} />}

              <Link href={linkDashboard}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                {nombreCompleto ? `Hola, ${nombreCompleto.split(" ")[0]}` : "Mi panel"}
              </Link>
              <form action={cerrarSesion}>
                <button type="submit"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/registro/freelancer"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                Soy freelancer
              </Link>
              <Link href="/registro/empresa"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                Soy empresa
              </Link>
              <Link href="/login"
                className="px-5 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}