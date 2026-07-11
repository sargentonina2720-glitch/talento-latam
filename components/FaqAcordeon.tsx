// components/FaqAcordeon.tsx
"use client";

import { useState } from "react";

const faqs = [
  {
    pregunta: "¿Cuánto cuesta publicar un proyecto?",
    respuesta: "Publicar es 100% gratis. Solo pagas una comisión del 8-12% cuando contratas y apruebas el trabajo — nunca antes.",
  },
  {
    pregunta: "¿Cómo verifican a los freelancers?",
    respuesta: "Cada freelancer responde un cuestionario técnico de su categoría antes de poder postular a proyectos. No verificamos solo identidad, como hacen otras plataformas — verificamos habilidad real.",
  },
  {
    pregunta: "¿Qué pasa si no quedo conforme con el trabajo?",
    respuesta: "Tu pago queda protegido hasta que apruebes el entregable. Si hay una disputa, un humano evalúa el trabajo real — no un sistema automático.",
  },
  {
    pregunta: "¿Puedo contratar por hora o por proyecto completo?",
    respuesta: "Ambas opciones están disponibles. Eliges el tipo de presupuesto que mejor se adapte a tu proyecto al momento de publicarlo.",
  },
  {
    pregunta: "¿En qué países está disponible TalentoLATAM?",
    respuesta: "Empezamos en Ecuador y estamos expandiéndonos a toda Latinoamérica. Los freelancers verificados ya trabajan con empresas de toda la región.",
  },
];

export default function FaqAcordeon() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-600 mb-2">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            ¿Aún con dudas?
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-slate-200 border-t border-b border-slate-200">
          {faqs.map((faq, i) => {
            const isOpen = abierto === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setAbierto(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-medium text-slate-900 text-sm pr-4">{faq.pregunta}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm text-slate-500 leading-relaxed pr-8">{faq.respuesta}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}