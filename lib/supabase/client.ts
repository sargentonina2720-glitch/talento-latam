"use client";

import { createBrowserClient } from "@supabase/ssr";

// Cliente para usar dentro de componentes "use client" (formularios, botones interactivos)
export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
