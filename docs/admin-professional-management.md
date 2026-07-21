# Gestión de profesionales

## Objetivo

Este módulo permite preparar el equipo profesional de una unidad asistencial sin crear credenciales, sesiones, invitaciones ni acceso público. Está pensado para una persona responsable que necesita dar de alta a otra persona con calma y con los permisos mínimos necesarios.

## Rutas

- `/admin`: entrada mínima al área administrativa.
- `/admin/professionals`: listado adaptable a móvil, tablet y escritorio.
- `/admin/professionals/new`: alta guiada en cuatro secciones.
- `/admin/professionals/[professionalId]`: detalle de identidad, unidades, permisos y estado derivado.

Mientras no haya autenticación, estas rutas solo se sirven en desarrollo y en Preview de Vercel. En un despliegue de producción devuelven `notFound` desde servidor. Esta medida excluye la superficie de producción; no es una autorización y no convierte Preview en un entorno seguro para datos reales.

## Flujo de alta

1. Se validan nombre, apellidos, correo profesional, categoría, organización, unidad y permisos.
2. El servidor confirma que la organización y la unidad siguen activas y que la unidad pertenece a esa organización.
3. Se rechazan correos ya existentes y permisos que no pertenecen al enum `Permission`.
4. En una única transacción se crean `User` con rol base `PROFESSIONAL` y sin contraseña, `Professional` y `ProfessionalMembership`.
5. Se devuelve únicamente el identificador del profesional y se redirige a su detalle.

La categoría se guarda temporalmente como `Professional.professionalCategory String?`. Sus valores se controlan en TypeScript, no en un enum de Prisma: Enfermería, Medicina, Fisioterapia, Administración, Coordinación y Otra función. Es obligatoria para nuevas altas, pero opcional en base de datos para mantener compatibilidad con perfiles previos.

## Estados mostrados

La pantalla no inventa un estado de cuenta. Muestra tres hechos independientes:

- Perfil creado.
- Membresía activa, cuando `endedAt` es nulo.
- Acceso digital pendiente.

Las invitaciones, credenciales, sesiones, activación y recuperación se incorporarán solo tras decidir el proveedor y el método de acceso.

## Permisos

Los permisos proceden del enum `Permission` existente y se aplican a una `ProfessionalMembership`, no a `User.role`. La interfaz presenta nombre, descripción y grupo comprensibles. No hay presets clínicos rígidos: la selección es explícita.

## Datos y migración

La migración `20260721054426_admin_professional_foundation` es aditiva y compatible hacia atrás:

- permite `User.password` nulo para identidades sin método de acceso todavía;
- añade `Professional.professionalCategory` nullable.

Se generó con Prisma `migrate dev --create-only`. No se debe aplicar con `db push`, reset ni directamente en producción. Debe revisarse y aplicarse primero sobre la rama aislada de Neon mediante el flujo de migración aprobado.

## Arquitectura

- Server Components para páginas y consultas.
- Client Component reducido al formulario para usar `useActionState`.
- Server Action para validar y crear.
- `lib/admin/professionals.ts` contiene la operación transaccional y DTOs limitados.
- Prisma solo se importa desde servidor.

## Pruebas

La base mínima es Vitest, React Testing Library y Zod. Se cubren la normalización de correo, las entradas inválidas, los permisos desconocidos y los estados del formulario. Las pruebas de integración con transacción requieren una base aislada y nunca se ejecutarán contra producción.

## Pendiente

- autenticación y autorización real en cada mutación;
- invitaciones y activación;
- edición o finalización de membresías;
- gestión de organizaciones y unidades;
- una posible categoría configurable por organización;
- decidir si Preview necesita una capa de protección externa adicional antes de usar datos no ficticios.
