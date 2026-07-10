import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { crearClienteServidor } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "TalentoLATAM | Freelancers verificados",
  description:
    "Marketplace de freelancers verificados en Latinoamérica. Verificación gratuita, arbitraje justo, sin costos ocultos.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  let nombreCompleto: string | null = null;
  let tipoUsuario: "freelancer" | "empresa" | "admin" | null = null;

  if (user) {
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    const esAdmin = user.email ? adminEmails.includes(user.email) : false;

    if (esAdmin) {
      tipoUsuario = "admin";
      nombreCompleto = "Admin";
    } else {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre_completo, tipo_usuario")
        .eq("id", user.id)
        .single();
      nombreCompleto = perfil?.nombre_completo ?? null;
      tipoUsuario = (perfil?.tipo_usuario as "freelancer" | "empresa") ?? null;
    }
  }

  return (
    <html lang="es">
      <body className="font-body min-h-screen bg-white antialiased">
        <NavBar
          sesionActiva={!!user}
          nombreCompleto={nombreCompleto}
          tipoUsuario={tipoUsuario}
          userId={user?.id ?? null}
        />
        {children}
      </body>
    </html>
  );
}