export const professionalCategories = [
  "NURSING",
  "MEDICINE",
  "PHYSIOTHERAPY",
  "ADMINISTRATION",
  "COORDINATION",
  "OTHER",
] as const;

export type ProfessionalCategory = (typeof professionalCategories)[number];

export const professionalCategoryLabels: Record<ProfessionalCategory, string> = {
  NURSING: "Enfermería",
  MEDICINE: "Medicina",
  PHYSIOTHERAPY: "Fisioterapia",
  ADMINISTRATION: "Administración",
  COORDINATION: "Coordinación",
  OTHER: "Otra función",
};

export const permissionValues = [
  "PATIENT_CREATE",
  "PATIENT_VIEW",
  "PATIENT_EDIT",
  "PLAN_ASSIGN",
  "PLAN_EDIT",
  "SESSION_VIEW",
  "REPORT_GENERATE",
  "PROFESSIONAL_MANAGE",
  "AUDIT_VIEW",
] as const;

export type PermissionValue = (typeof permissionValues)[number];

export const permissionDetails: Record<
  PermissionValue,
  { label: string; description: string; group: string }
> = {
  PATIENT_CREATE: {
    label: "Crear pacientes",
    description: "Dar de alta perfiles de pacientes.",
    group: "Pacientes",
  },
  PATIENT_VIEW: {
    label: "Consultar pacientes",
    description: "Ver la información asignada a su unidad.",
    group: "Pacientes",
  },
  PATIENT_EDIT: {
    label: "Actualizar pacientes",
    description: "Modificar datos autorizados de pacientes.",
    group: "Pacientes",
  },
  PLAN_ASSIGN: {
    label: "Asignar planes",
    description: "Asignar planes de rehabilitación.",
    group: "Rehabilitación",
  },
  PLAN_EDIT: {
    label: "Editar planes",
    description: "Actualizar el contenido de los planes.",
    group: "Rehabilitación",
  },
  SESSION_VIEW: {
    label: "Consultar sesiones",
    description: "Revisar sesiones y registros de seguimiento.",
    group: "Seguimiento",
  },
  REPORT_GENERATE: {
    label: "Generar informes",
    description: "Preparar informes autorizados.",
    group: "Seguimiento",
  },
  PROFESSIONAL_MANAGE: {
    label: "Gestionar profesionales",
    description: "Crear y consultar profesionales de la unidad.",
    group: "Administración",
  },
  AUDIT_VIEW: {
    label: "Consultar auditoría",
    description: "Revisar los registros de actividad autorizados.",
    group: "Administración",
  },
};
