// components/ComoFunciona.tsx

const pasosEmpresa = [
  {
    numero: "1",
    titulo: "Publica tu proyecto gratis",
    descripcion: "Describe qué necesitas, elige categoría y presupuesto (por hora o proyecto completo). Sin costo por publicar.",
  },
  {
    numero: "2",
    titulo: "Recibe postulantes ya verificados",
    descripcion: "Solo freelancers que aprobaron nuestro cuestionario técnico pueden postular. Revisa su perfil, portafolio y tarifa antes de decidir.",
  },
  {
    numero: "3",
    titulo: "Acepta y empieza a trabajar",
    descripcion: "Elige al freelancer, tu pago queda protegido hasta que apruebes el entregable. Soporte humano si algo sale mal — nunca detrás de un paywall.",
  },
];

const pasosFreelancer = [
  {
    numero: "1",
    titulo: "Regístrate y valida tus habilidades",
    descripcion: "Completa un cuestionario técnico corto de tu categoría. La verificación es 100% gratuita, siempre.",
  },
  {
    numero: "2",
    titulo: "Postula a proyectos reales",
    descripcion: "Una vez verificado, ves proyectos publicados por empresas y envías tu propuesta con un mensaje.",
  },
  {
    numero: "3",
    titulo: "Cobra seguro por tu trabajo",
    descripcion: "El pago de la empresa queda protegido desde el inicio. Recibes notificación apenas te aceptan — sin vueltas.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="bg-white py-20 border-t border-slate-100">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-600 mb-2">
            Cómo funciona
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            Simple para ambos lados
          </h2>
        </div>

        {/* Para empresas */}
        <div className="mb-16">
          <p className="text-sm font-medium text-slate-500 mb-6 text-center">Si buscas contratar</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {pasosEmpresa.map((paso) => (
              <div key={paso.numero} className="relative">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-display font-semibold text-sm mb-4">
                  {paso.numero}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{paso.titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Para freelancers */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-6 text-center">Si buscas trabajar</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {pasosFreelancer.map((paso) => (
              <div key={paso.numero} className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-display font-semibold text-sm mb-4">
                  {paso.numero}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{paso.titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}