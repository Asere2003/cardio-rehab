# Arquitectura de autenticación y propuesta de datos

## Alcance y estado

Este documento define los cimientos para una aplicación cerrada y basada en invitaciones. No implementa un proveedor de autenticación, formularios definitivos, reglas de invitación ni cambios en Prisma.

La versión instalada del proyecto es Next.js 16.2.10, React 19.2.4, Prisma 7.8.0, Tailwind CSS 4.3.2 y shadcn 4.13.0. Las decisiones posteriores deben validarse contra la documentación oficial de esas versiones.

Principios:

- No hay registro público para pacientes ni profesionales.
- La interfaz visible está en español; rutas y nombres internos, en inglés.
- La autenticación, autorización, perfiles clínico-administrativos y estado del programa son responsabilidades separadas.
- Los secretos se almacenan solo como hashes o con el material criptográfico estrictamente necesario.
- La solución no queda ligada a un único hospital.

## Flujos previstos

### Profesional

1. Un administrador autorizado crea el `User` y su `Professional`.
2. La cuenta se crea con estado `INVITED` y una invitación de activación.
3. El profesional activa el método de acceso decidido por la organización.
4. La cuenta pasa a `ACTIVE`; sus permisos dependen de sus membresías, no solo de `UserRole`.

### Paciente

1. Un profesional autorizado crea el perfil clínico-administrativo mínimo de `Patient`, sin crear todavía una cuenta digital.
2. Se vincula al paciente a una unidad y a su episodio de programa mediante `PatientEnrollment`.
3. Cuando el equipo habilita el acceso digital, crea un `User` con estado inicial de invitación.
4. Se vincula `Patient.userId` a ese `User` y se crea una `Invitation` temporal, revocable y de un solo uso.
5. El paciente activa su cuenta tras una comprobación adicional aún pendiente de decidir.
6. El paciente utiliza su método habitual de acceso y puede continuar tras el alta presencial si su cuenta sigue activa.

La admisión clínica y el acceso digital son procesos independientes: un paciente puede participar en rehabilitación sin correo, teléfono personal o cuenta. La relación opcional `Patient.userId` solo aparece cuando el equipo decide habilitar acceso digital.

### Acceso y recuperación

Se documentan las rutas `/login/patient`, `/login/professional`, `/activate` y `/recover-access`; no se implementarán campos ni comportamientos definitivos antes de decidir el identificador del paciente, el método de acceso, la comprobación de activación y el primer método profesional.

La recuperación debe responder de forma neutral, sin confirmar que una cuenta existe. Debe generar un reto o token de duración limitada, con hash, revocación y registro de auditoría.

## Separación de estados

| Ámbito | Pregunta que responde | Ejemplo |
| --- | --- | --- |
| `UserStatus` | ¿Puede utilizarse la cuenta? | `ACTIVE` |
| `PatientProgramStatus` | ¿En qué punto está el programa en una unidad? | `FOLLOW_UP` |
| `InvitationStatus` | ¿Se puede usar la invitación? | `PENDING` |

Un alta clínica no desactiva por sí misma la cuenta: un paciente puede ser `ACTIVE` y estar en `FOLLOW_UP` o `DISCHARGED`, según la política clínica validada.

## Roles, membresías y autorización contextual

`User.role` conserva su función de **rol base de identidad**: permite distinguir el flujo principal de una cuenta (`PATIENT`, `PROFESSIONAL` o `ADMIN`) y dirigirla a su experiencia inicial. No concede por sí solo acceso a una unidad, a un paciente concreto ni a una operación sensible.

La autorización se decidirá de forma contextual:

1. Se autentica la identidad (`User`) y se comprueba `User.status`.
2. Se identifica la unidad y el recurso solicitado.
3. Para operaciones profesionales, se resuelve una `ProfessionalMembership` activa en esa `CareUnit`.
4. Se evalúa el permiso asociado a la membresía y la relación con el recurso, por ejemplo si el paciente pertenece a esa unidad.
5. La operación sensible registra un `AuditEvent`.

Este diseño evita que un profesional con el rol base `PROFESSIONAL` pueda acceder automáticamente a todos los pacientes. También permite una futura identidad con más de una función: `User.role` se mantendría como rol principal o de entrada, mientras que los perfiles y las membresías representan las funciones efectivas. Si en el futuro una misma identidad necesita ser paciente y profesional, se añadirá una relación explícita de roles o perfiles; no se forzará esa posibilidad mediante un enum único ni se asumirá ahora sin un caso real aprobado.

### Permisos: array frente a tabla de asignación

| Alternativa | Ventajas | Límites |
| --- | --- | --- |
| `ProfessionalMembership.permissions Permission[]` | Modelo pequeño, una lectura directa de la membresía, sin joins extra y adecuado para el conjunto estable de permisos inicial. | No permite atribuir metadatos por permiso (quién lo concedió, expiración, motivo) ni delegación compleja. |
| `MembershipPermission` como tabla | Trazabilidad y fechas por permiso, revocación granular, delegaciones y futuras políticas complejas. | Más tablas, consultas y reglas desde el primer día, sin aportar valor inmediato a la primera unidad. |

**Recomendación para la primera versión:** usar `Permission[]` en `ProfessionalMembership`, porque la aplicación empieza con un conjunto pequeño de permisos por unidad y necesita una administración comprensible. El acceso se centralizará en una capa de autorización para que una futura migración a `MembershipPermission` no afecte a las rutas ni a la interfaz. Si el hospital exige trazabilidad de cada concesión, expiración por permiso o delegación, se adelantará la tabla de asignación antes de poner permisos en producción.

## Modelo de datos propuesto

Los nombres y tipos siguientes son una propuesta para el próximo cambio de `schema.prisma`; no están implementados.

### Enums

| Enum | Valores propuestos | Fase | Finalidad |
| --- | --- | --- | --- |
| `UserRole` | `ADMIN`, `PROFESSIONAL`, `PATIENT` | Existente | Rol base actual; no sustituye permisos. |
| `UserStatus` | `INVITED`, `ACTIVE`, `LOCKED`, `SUSPENDED`, `DISABLED` | 3 | Estado de acceso de la cuenta. |
| `PatientProgramStatus` | `PENDING`, `ACTIVE`, `PAUSED`, `DISCHARGED`, `FOLLOW_UP`, `WITHDRAWN` | 1 | Estado de una inscripción concreta. |
| `Permission` | `PATIENT_CREATE`, `PATIENT_VIEW`, `PATIENT_EDIT`, `PLAN_ASSIGN`, `PLAN_EDIT`, `SESSION_VIEW`, `REPORT_GENERATE`, `PROFESSIONAL_MANAGE`, `AUDIT_VIEW` | 1 | Permisos asignables a una membresía. |
| `InvitationPurpose` | `PATIENT_ACTIVATION`, `PROFESSIONAL_ACTIVATION` | 3 | Motivo y audiencia de una invitación. |
| `InvitationStatus` | `PENDING`, `CONSUMED`, `REVOKED`, `LOCKED` | 3 | Estado administrado; la caducidad se deriva de `expiresAt`. |
| `CredentialType` | `PASSWORD`, `PIN`, `PASSKEY`, `ONE_TIME_CODE`, `MAGIC_LINK`, `ASSISTED_ACCESS` | 4, aplazado | Se añadirá solo al decidir autenticación. |
| `RecoveryStatus` | `PENDING`, `CONSUMED`, `REVOKED`, `EXPIRED`, `LOCKED` | 4, aplazado | Estado de un proceso de recuperación. |

### Entidades de organización y acceso

| Modelo | Campos propuestos | Relaciones y restricciones |
| --- | --- | --- |
| `Organization` | `id String @id @default(cuid())`; `name String`; `slug String @unique`; `createdAt DateTime @default(now())`; `updatedAt DateTime @updatedAt`; `disabledAt DateTime?` | Tiene muchas `CareUnit`. No contiene datos de pacientes. |
| `CareUnit` | `id String @id @default(cuid())`; `organizationId String`; `name String`; `slug String`; `createdAt`; `updatedAt`; `disabledAt DateTime?` | Pertenece a `Organization`; tiene membresías e inscripciones. Restricción única `@@unique([organizationId, slug])`. |
| `User` | `id String @id @default(cuid())`; `email String? @unique`; `phone String?`; `role UserRole`; `status UserStatus @default(INVITED)`; `createdAt`; `updatedAt`; `activatedAt DateTime?`; `disabledAt DateTime?` | Tiene un perfil de paciente o profesional, futuras credenciales/sesiones, invitaciones recibidas y eventos de auditoría. Índices `@@index([status])` y `@@index([phone])`. `phone` no tendrá `@unique` ni será identificador de acceso por sí solo mientras se permitan números compartidos. |
| `Professional` | `id String @id @default(cuid())`; `userId String @unique`; `firstName String`; `lastName String`; `createdAt`; `updatedAt` | Perfil profesional asociado uno a uno a `User`; tiene muchas `ProfessionalMembership`. |
| `ProfessionalMembership` | `id String @id @default(cuid())`; `professionalId String`; `careUnitId String`; `permissions Permission[] @default([])`; `createdAt`; `updatedAt`; `endedAt DateTime?` | Une profesional y unidad. `@@unique([professionalId, careUnitId])`, índices por `careUnitId` y `endedAt`. Es el punto de autorización futuro. |
| `Patient` | `id String @id @default(cuid())`; `userId String? @unique`; `firstName String`; `lastName String`; `birthDate DateTime?`; `createdAt`; `updatedAt` | Perfil del paciente; la relación con `User` pasa a ser opcional para permitir la creación controlada antes de la activación. Tiene muchas `PatientEnrollment`. |
| `PatientEnrollment` | `id String @id @default(cuid())`; `patientId String`; `careUnitId String`; `responsibleMembershipId String?`; `status PatientProgramStatus @default(PENDING)`; `internalReference String?`; `startedAt DateTime?`; `endedAt DateTime?`; `createdAt`; `updatedAt` | Relaciona paciente, unidad y episodio de programa. Índices por `[careUnitId, status]`, `[patientId, status]` y `responsibleMembershipId`; `@@unique([careUnitId, internalReference])` si `internalReference` existe. Permite reingresos con registros distintos. |

### Entidades de invitación y auditoría incluidas en la segunda fase

| Modelo | Campos propuestos | Relaciones y restricciones |
| --- | --- | --- |
| `Invitation` | `id String @id @default(cuid())`; `userId String`; `purpose InvitationPurpose`; `tokenHash String @unique`; `status InvitationStatus @default(PENDING)`; `attemptCount Int @default(0)`; `maxAttempts Int`; `expiresAt DateTime`; `createdAt`; `consumedAt DateTime?`; `revokedAt DateTime?`; `createdById String` | Está vinculada a una única cuenta, se crea por un usuario autorizado y no guarda el código en claro. Índices `[userId, purpose, status]`, `[expiresAt]`, `[createdById]`. La regla de una invitación activa por propósito se reforzará en la capa de dominio y, tras validación, con un índice parcial de PostgreSQL. |
| `AuditEvent` | `id String @id @default(cuid())`; `actorId String?`; `action String`; `entityType String`; `entityId String`; `metadata Json?`; `createdAt DateTime @default(now())` | Registra operaciones sensibles. Índices `[actorId, createdAt]` y `[entityType, entityId, createdAt]`. `action` se valida contra constantes TypeScript controladas. `metadata` excluye secretos, datos de salud y contenido clínico. |

### Entidades de autenticación pospuestas

| Modelo futuro | Campos orientativos | Motivo para aplazarlo |
| --- | --- | --- |
| `UserCredential` | `id`, `userId`, `type`, `secretHash?`, `credentialId?`, `publicKey?`, `label?`, fechas de verificación/uso/desactivación | Su forma correcta depende del proveedor y del método inicial: contraseña, PIN, passkey, código o acceso asistido no almacenan el mismo material. |
| `AccountSession` | `id`, `userId`, `tokenHash`, `expiresAt`, `lastSeenAt?`, `invalidatedAt?` | Puede pertenecer al proveedor seleccionado; crearla ahora duplicaría o condicionaría su modelo de sesión. |
| `RecoveryRequest` | `id`, `userId`, `tokenHash`, `status`, contadores, `expiresAt`, fechas de consumo/revocación | Depende del canal y método de recuperación aprobados. |

`CredentialType` y `RecoveryStatus` quedan también pospuestos hasta la migración que introduzca esas entidades.

### Caducidad de invitaciones

`expiresAt` es la fuente de verdad. Una invitación está caducada cuando `expiresAt <= now()`, independientemente de que `status` siga siendo `PENDING`. Por tanto, `EXPIRED` no forma parte de `InvitationStatus` en la primera versión y no puede desincronizarse.

La capa de dominio calculará un estado efectivo para la interfaz y las operaciones: `EXPIRED` si ha vencido; en otro caso, el valor materializado de `status`. El consumo, la revocación y el bloqueo se realizarán en una transacción con una condición temporal (`expiresAt > now()`), evitando que una invitación venza entre la comprobación y la escritura. Solo si una necesidad analítica futura exige materializar `EXPIRED` se añadirá un proceso transaccional y auditable que actualice el estado, sin usar ese valor como fuente de autorización.

### Acción de auditoría: enum frente a identificadores controlados

| Alternativa | Ventajas | Límites |
| --- | --- | --- |
| Enum Prisma `AuditAction` | Integridad referencial a nivel de base de datos y consultas homogéneas. | Cada acción nueva exige cambiar schema, generar migración y desplegarla; ralentiza la evolución de una auditoría que crecerá con cada módulo. |
| `action String` validado por constantes TypeScript | Permite añadir acciones de aplicación sin una migración de datos, mantiene nombres versionados y facilita la evolución gradual. | La base de datos no impide por sí sola valores arbitrarios; requiere validación de dominio y pruebas. |

**Recomendación:** `AuditEvent.action String` con un catálogo de constantes TypeScript centralizado y pruebas que impidan valores desconocidos en las operaciones de dominio. Se registrará un identificador estable como `patient.created` o `invitation.revoked`, no texto visible. Este enfoque equilibra mantenimiento y trazabilidad; si el hospital necesita una lista inmutable garantizada por la base de datos, se podrá migrar a enum cuando el catálogo se estabilice.

`ConsentRecord` y `CaregiverRelationship` quedan deliberadamente pospuestos. No aportan valor a los cimientos de acceso sin requisitos clínicos, legales y de autorización validados.

## Relaciones

```text
Organization 1 ── * CareUnit
CareUnit 1 ── * ProfessionalMembership * ── 1 Professional ── 1 User
CareUnit 1 ── * PatientEnrollment * ── 1 Patient ── 0..1 User
ProfessionalMembership 1 ── * PatientEnrollment (responsible membership)
User 1 ── * UserCredential
User 1 ── * AccountSession
User 1 ── * Invitation (recipient)
User 1 ── * Invitation (creator)
User 1 ── * RecoveryRequest
User 0..1 ── * AuditEvent (actor)
```

Las relaciones de `UserCredential`, `AccountSession` y `RecoveryRequest` pertenecen a una fase posterior; no se incluirán en las primeras migraciones. Esta estructura permite que un paciente tenga varios episodios, que un profesional participe en varias unidades y que las autorizaciones se decidan dentro de una unidad concreta.

## Compatibilidad con el esquema existente

| Modelo actual | Estrategia propuesta | Preservación |
| --- | --- | --- |
| `User` | Se conserva la tabla y sus identificadores. Se añaden `status` y fechas de estado; `email` se vuelve opcional para no asumir que todo paciente dispone de correo. `password` se sustituirá progresivamente por `UserCredential` solo después de decidir el proveedor y validar su formato actual. | Todos los `id`, roles, correos y fechas existentes se conservan. No se debe copiar una contraseña que pueda estar en claro a un nuevo campo de hash. |
| `Professional` | Se conserva como perfil profesional y se añaden fechas. La relación directa `Professional -> Patient[]` se sustituye gradualmente por `ProfessionalMembership` y `PatientEnrollment.responsibleMembershipId`. | Se conservan perfiles y el profesional responsable actual se transforma en una membresía/enrolamiento tras crear una unidad inicial controlada. |
| `Patient` | Se conserva como perfil; `userId` pasa a ser opcional, se añade `updatedAt` y se mueve la pertenencia a un profesional a `PatientEnrollment`. | Se conservan nombre, apellidos, fecha de nacimiento y relación actual. Ningún dato clínico se añade. |

### Datos con riesgo o que requieren revisión humana

- El campo actual `User.password` no puede considerarse seguro ni migrarse automáticamente sin saber si contiene un hash compatible. Si estuviera en claro, debe eliminarse mediante un plan de restablecimiento controlado, no reutilizarse.
- Convertir `User.email` a opcional no borra correos, pero obliga a validar duplicados y el identificador de acceso elegido.
- La relación obligatoria actual `Patient.professionalId` debe conservarse temporalmente mientras se crea la primera `Organization`, `CareUnit`, membresía e inscripción. La operación debe revisarse en una copia de desarrollo con datos ficticios.
- No hay evidencia de datos reales o de producción en el repositorio; no se asumirá que la base de Neon está vacía.

## Estrategia de migración no destructiva

### Orden exacto propuesto

0. **Preparación, sin migración.** Hacer snapshot verificable de la base de desarrollo, inspeccionar el historial de `_prisma_migrations`, confirmar si existen datos reales y decidir la organización/unidad inicial.
1. **Organización, unidades, membresías e inscripciones.** Añadir `Organization`, `CareUnit`, `ProfessionalMembership`, `PatientEnrollment`, `PatientProgramStatus` y `Permission`. En modelos actuales: `User` no recibe campos escalares en esta fase; `Professional` recibe `createdAt`, `updatedAt` y la relación `memberships`; `Patient` recibe `updatedAt`, la relación `enrollments` y cambia `userId` a opcional sin eliminar valores existentes. Conservar la relación `Patient.professionalId` mientras se crean y verifican los nuevos vínculos.
2. **Transición y endurecimiento de relaciones.** Crear la primera organización/unidad y las membresías/inscripciones equivalentes en un proceso de datos revisado; verificar recuentos. Solo tras la validación, hacer opcional la relación directa heredada y planificar su retirada en una migración posterior, nunca en el mismo paso que crea las tablas.
3. **Invitaciones, activación y auditoría mínima.** Añadir `UserStatus`, `User.activatedAt`, `User.disabledAt`, `InvitationPurpose`, `InvitationStatus`, `Invitation` y `AuditEvent`; hacer `User.email` opcional sin eliminar los correos existentes. La activación se limitará a invitaciones y estados; no añade credenciales ni sesiones.
4. **Credenciales, sesiones y recuperación.** Solo después de elegir proveedor y métodos de acceso. Añadir `UserCredential`, `AccountSession`, `RecoveryRequest` y sus enums únicamente si no los proporciona el adaptador elegido.

En cada fase: modificar el esquema, generar con `npx prisma migrate dev --name <phase_name> --create-only`, revisar el SQL y no aplicarlo hasta aprobarlo. Prisma 7 no ejecuta `prisma generate` automáticamente; se ejecutará de forma explícita solo después de aprobar y aplicar cada cambio. Producción usará el proceso aprobado y `prisma migrate deploy`; nunca `db push` ni una migración destructiva.

Prisma 7 permite `--create-only` para revisar la migración antes de aplicarla. Si el CLI detecta *schema drift*, no se aceptará ninguna sugerencia de reset sobre una base compartida sin revisión humana.

## Infraestructura de pruebas propuesta

No hay pruebas configuradas. Antes de implementar cualquier regla sensible se propone instalar, previa aprobación:

- `vitest` como ejecutor de pruebas.
- `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom` y `vite-tsconfig-paths`, siguiendo la guía oficial actual de Next.js.
- Scripts `test` y `test:run`; una configuración `vitest.config.mts` con entorno `jsdom` solo para componentes síncronos.

Las reglas de dominio de invitaciones se probarán como funciones de servidor independientes del navegador y de Prisma cuando sea posible. Los componentes asíncronos de servidor se cubrirán más adelante con pruebas E2E, porque la guía de Next advierte que Vitest no los admite directamente.

No se instalarán estas dependencias hasta que se apruebe esta decisión.

## Rutas y compatibilidad de navegación

Rutas futuras documentadas, no implementadas: `/login/patient`, `/login/professional`, `/activate`, `/recover-access`.

La ruta actual `/desing-system` contiene una errata. La corrección propuesta es:

1. Mover su página a `app/design-system/page.tsx`.
2. Añadir en `next.config.ts` una redirección temporal `307` de `/desing-system` a `/design-system` con `permanent: false`.
3. Comprobar los enlaces internos y la ruta desplegada antes de convertir la redirección en permanente o retirarla.

No se ejecutará esta corrección hasta que se apruebe una fase de implementación de interfaz/configuración.

## Decisiones pendientes

- Método inicial de acceso del paciente e identificador habitual.
- Comprobación adicional de identidad para activación.
- Método profesional inicial, MFA y duración de sesiones.
- Proveedor o librería de autenticación, incluyendo propiedad de datos y estrategia de rate limiting.
- Política de contraseñas existentes y posible restablecimiento.
- Unidad, organización y permisos iniciales para datos existentes.
- Requisitos legales, clínicos, de auditoría, retención y protección de datos del hospital.
- Canal de entrega de invitaciones y recuperación.
- Si `/design-system` debe estar disponible en producción, protegido para personal interno o excluido del despliegue de producción. Hasta decidirlo, no se debe exponer como una herramienta administrativa implícita.
