// Tipos que reflejan exactamente el esquema SQL ya creado en Supabase

export type CategoriaProyecto =
  | "desarrollo_web"
  | "diseno_grafico"
  | "marketing_digital";

export type EstadoVerificacion = "pendiente" | "aprobado" | "rechazado";

export type EstadoProyecto =
  | "publicado"
  | "en_progreso"
  | "entregado"
  | "aprobado"
  | "disputado";

export type TipoUsuario = "freelancer" | "empresa";

export interface Perfil {
  id: string;
  nombre_completo: string;
  telefono: string | null;
  tipo_usuario: TipoUsuario;
  creado_en: string;
}

export interface Freelancer {
  id: string;
  categoria: CategoriaProyecto;
  habilidades: string[];
  tarifa_hora: number;
  portafolio_url: string | null;
  respuestas_validacion: Record<string, string> | null;
  estado_verificado: EstadoVerificacion;
  sello_calidad: boolean;
  // Datos combinados desde "perfiles" cuando se hace el join
  perfil?: Perfil;
}

export interface Empresa {
  id: string;
  nombre_empresa: string;
  sector: string;
  sitio_web: string | null;
  perfil?: Perfil;
}

export interface Proyecto {
  id: string;
  empresa_id: string;
  freelancer_id: string | null;
  titulo: string;
  descripcion: string;
  presupuesto: number;
  categoria: CategoriaProyecto;
  estado: EstadoProyecto;
  creado_en: string;
  empresa?: Empresa;
}

// Etiquetas legibles para mostrar en la UI en vez de los valores crudos del enum
export const CATEGORIA_LABELS: Record<CategoriaProyecto, string> = {
  desarrollo_web: "Desarrollo web",
  diseno_grafico: "Diseño gráfico",
  marketing_digital: "Marketing digital",
};

export const ESTADO_PROYECTO_LABELS: Record<EstadoProyecto, string> = {
  publicado: "Publicado",
  en_progreso: "En progreso",
  entregado: "Entregado",
  aprobado: "Aprobado",
  disputado: "En disputa",
};
