// components/CampanaNotificaciones.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { marcarNotificacionLeida } from "@/lib/actions/notificaciones";

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string | null;
  leida: boolean;
  creado_en: string;
}

export default function CampanaNotificaciones({ freelancerId }: { freelancerId: string }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = crearClienteNavegador();

  useEffect(() => {
    supabase
      .from("notificaciones")
      .select("*")
      .eq("freelancer_id", freelancerId)
      .order("creado_en", { ascending: false })
      .then(({ data }) => setNotificaciones(data || []));

    // Escucha notificaciones nuevas en tiempo real
    const canal = supabase
      .channel("notificaciones-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notificaciones", filter: `freelancer_id=eq.${freelancerId}` },
        (payload) => {
          setNotificaciones((prev) => [payload.new as Notificacion, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [freelancerId]);

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  async function abrirYMarcar() {
    setAbierto((v) => !v);
    if (!abierto && noLeidas > 0) {
      await marcarNotificacionLeida(freelancerId);
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={abrirYMarcar} className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <span className="text-lg">🔔</span>
        {noLeidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-100 font-semibold text-sm text-slate-900">
            Notificaciones
          </div>
          {notificaciones.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-400 text-center">No tienes notificaciones.</p>
          )}
          {notificaciones.map((n) => (
            <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 ${!n.leida ? "bg-brand-50" : ""}`}>
              <p className="text-sm font-medium text-slate-900">{n.titulo}</p>
              {n.mensaje && <p className="text-xs text-slate-500 mt-0.5">{n.mensaje}</p>}
              <p className="text-[11px] text-slate-400 mt-1">
                {new Date(n.creado_en).toLocaleDateString("es-EC", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}