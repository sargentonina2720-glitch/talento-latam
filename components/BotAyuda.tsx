// components/BotAyuda.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { iniciarConversacion, enviarMensajeUsuario, type EstadoSoporte } from "@/lib/actions/soporte";

const preguntasFrecuentes = [
  {
    pregunta: "¿Cuánto cuesta publicar un proyecto?",
    respuesta: "Publicar es 100% gratis. Solo pagas una comisión del 8-12% cuando contratas y apruebas el trabajo.",
  },
  {
    pregunta: "¿Cómo verifican a los freelancers?",
    respuesta: "Cada freelancer responde un cuestionario técnico de su categoría antes de poder postular. Verificamos habilidad real, no solo identidad.",
  },
  {
    pregunta: "¿Cómo me registro como freelancer?",
    respuesta: "Ve a 'Registrarme como freelancer', completa tus datos y el cuestionario de tu categoría. La verificación es gratuita.",
  },
  {
    pregunta: "¿Qué pasa si no quedo conforme con el trabajo?",
    respuesta: "Tu pago queda protegido hasta que apruebes el entregable. Si hay una disputa, un humano evalúa el trabajo real.",
  },
];

interface Mensaje {
  id: string;
  remitente: "usuario" | "admin";
  mensaje: string;
  creado_en: string;
}

const STORAGE_KEY = "talentolatam_soporte_id";

function ChatSoporte() {
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const finRef = useRef<HTMLDivElement>(null);
  const supabase = crearClienteNavegador();

  // Al montar, revisa si ya existe una conversación guardada
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      setConversacionId(guardado);
    }
  }, []);

  // Carga mensajes y se suscribe a nuevos en tiempo real
  useEffect(() => {
    if (!conversacionId) return;

    supabase
      .from("soporte_mensajes")
      .select("*")
      .eq("conversacion_id", conversacionId)
      .order("creado_en", { ascending: true })
      .then(({ data }) => setMensajes(data || []));

    const canal = supabase
      .channel(`soporte-${conversacionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "soporte_mensajes", filter: `conversacion_id=eq.${conversacionId}` },
        (payload) => {
          setMensajes((prev) => [...prev, payload.new as Mensaje]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [conversacionId]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function handleIniciar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !texto.trim()) {
      setError("Completa tu nombre y el mensaje.");
      return;
    }
    setCargando(true);
    setError("");

    const formData = new FormData();
    formData.set("nombre", nombre);
    formData.set("correo", correo);
    formData.set("mensaje", texto);

    const resultado: EstadoSoporte = await iniciarConversacion({}, formData);

    setCargando(false);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    if (resultado.conversacionId) {
      localStorage.setItem(STORAGE_KEY, resultado.conversacionId);
      setConversacionId(resultado.conversacionId);
      setTexto("");
    }
  }

  async function handleContinuar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim() || !conversacionId) return;
    const mensajeEnviado = texto;
    setTexto("");
    await enviarMensajeUsuario(conversacionId, mensajeEnviado);
  }

  // Vista: todavía no hay conversación iniciada
  if (!conversacionId) {
    return (
      <form onSubmit={handleIniciar} className="flex flex-col gap-3 p-4">
        <p className="text-sm text-slate-500">
          Cuéntanos qué necesitas. Un humano de nuestro equipo te responde, no un bot.
        </p>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <input
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          type="email"
          placeholder="Tu correo (opcional)"
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="¿En qué te ayudamos?"
          rows={3}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="w-full h-10 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {cargando ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    );
  }

  // Vista: conversación activa (chat)
  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              m.remitente === "usuario"
                ? "bg-brand-600 text-white self-end rounded-br-sm"
                : "bg-slate-100 text-slate-800 self-start rounded-bl-sm"
            }`}
          >
            {m.mensaje}
          </div>
        ))}
        <div ref={finRef} />
      </div>
      <form onSubmit={handleContinuar} className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 h-9 rounded-lg border border-slate-200 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          className="h-9 w-9 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default function BotAyuda() {
  const [abierto, setAbierto] = useState(false);
  const [vista, setVista] = useState<"faq" | "soporte">("faq");
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(null);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {abierto && (
        <div className="mb-3 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Centro de ayuda</p>
              <p className="text-xs text-brand-100">Talento LATAM</p>
            </div>
            <button onClick={() => setAbierto(false)} className="text-white/80 hover:text-white text-lg leading-none">
              ✕
            </button>
          </div>

          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setVista("faq")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                vista === "faq" ? "text-brand-600 border-b-2 border-brand-600" : "text-slate-400"
              }`}
            >
              Preguntas frecuentes
            </button>
            <button
              onClick={() => setVista("soporte")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                vista === "soporte" ? "text-brand-600 border-b-2 border-brand-600" : "text-slate-400"
              }`}
            >
              Soporte real
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {vista === "faq" ? (
              <div className="p-2">
                {preguntasFrecuentes.map((faq, i) => {
                  const isOpen = preguntaAbierta === i;
                  return (
                    <div key={i} className="border-b border-slate-50 last:border-0">
                      <button
                        onClick={() => setPreguntaAbierta(isOpen ? null : i)}
                        className="w-full text-left px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {faq.pregunta}
                      </button>
                      {isOpen && (
                        <p className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">{faq.respuesta}</p>
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={() => setVista("soporte")}
                  className="w-full mt-2 text-center text-sm text-brand-600 font-medium py-2 hover:underline"
                >
                  ¿No encontraste tu respuesta? Habla con soporte real →
                </button>
              </div>
            ) : (
              <ChatSoporte />
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setAbierto(!abierto)}
        className="w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 transition-colors flex items-center justify-center"
        aria-label="Abrir ayuda"
      >
        {abierto ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}