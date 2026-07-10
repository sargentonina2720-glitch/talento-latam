// components/BotonPostular.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { postularAProyecto, type EstadoPostular } from "@/lib/actions/postular";

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="h-9 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors">
      {pending ? "Enviando..." : "Aplicar a este proyecto"}
    </button>
  );
}

interface BotonPostularProps {
  proyectoId: string;
  yaPostulado?: boolean; // true si ya existe una fila en postulaciones para este freelancer + proyecto
}

export default function BotonPostular({ proyectoId, yaPostulado = false }: BotonPostularProps) {
  const estadoInicial: EstadoPostular = {};
  const postularConId = postularAProyecto.bind(null, proyectoId);
  const [estado, formAction] = useFormState(postularConId, estadoInicial);

  // Si ya se postuló antes (venía de la base de datos) o si la acción acaba de tener éxito
  if (yaPostulado || estado.exito) {
    return <p className="text-sm text-success-600 font-medium">✓ Ya postulaste a este proyecto</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}
      <BotonEnviar />
    </form>
  );
}