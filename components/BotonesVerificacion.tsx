"use client";

import { verificarFreelancer } from "@/lib/actions/verificar-freelancer";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BotonesVerificacion({ freelancerId }: { freelancerId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const manejarClick = (estado: "aprobado" | "rechazado") => {
    startTransition(async () => {
      await verificarFreelancer(freelancerId, estado);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => manejarClick("aprobado")}
        className="h-9 rounded-lg bg-success-600 px-4 text-sm font-medium text-white hover:bg-success-700 disabled:opacity-50 transition-colors"
      >
        Aprobar
      </button>
      <button
        disabled={isPending}
        onClick={() => manejarClick("rechazado")}
        className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        Rechazar
      </button>
    </div>
  );
}