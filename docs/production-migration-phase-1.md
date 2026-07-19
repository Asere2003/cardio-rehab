# Runbook de producción: fase 1 de organización e inscripciones

> Estado: preparado para revisión. Este documento **no autoriza** cambios en producción.

## 1. Objetivo

Aplicar de forma controlada la base de datos necesaria para organizaciones, unidades asistenciales, membresías profesionales e inscripciones de pacientes. La fase es aditiva y no activa todavía autenticación, invitaciones ni funcionalidad clínica nueva.

## 2. Alcance

Migración exacta:

```text
20260719080210_authentication_foundation_phase_1
```

Commit previsto:

```text
88ae563 — feat: add organization and enrollment data foundation
```

La migración crea `Organization`, `CareUnit`, `ProfessionalMembership` y `PatientEnrollment`; añade los enums `PatientProgramStatus` y `Permission`; y realiza cambios compatibles en `Patient` y `Professional`.

Queda fuera de alcance: invitaciones, auditoría, estados de cuenta, credenciales, sesiones, recuperación, datos clínicos nuevos y backfill automático.

## 3. Requisitos previos obligatorios

1. Aprobación explícita del responsable técnico, responsable de la base de datos y responsable clínico o de datos designado.
2. Confirmar en Neon que la conexión usada es la rama **Production**, sin revelar su cadena de conexión.
3. Confirmar un snapshot, punto de restauración, PITR o rama de respaldo de Neon y registrar su identificador o fecha de forma segura.
4. Confirmar que Preview de `feat/authentication-foundation` usa una rama Neon aislada y ha pasado `prisma validate`, TypeScript, lint y build.
5. Confirmar que el commit objetivo es `88ae563`, que la migración no se ha modificado y que la rama de trabajo publicada coincide con él.
6. Asegurar una ventana controlada y un canal de comunicación para el resultado y cualquier incidencia.
7. No usar datos reales de pacientes para pruebas manuales durante este procedimiento.

## 4. Verificaciones previas de solo lectura

En un entorno autorizado que disponga de la variable de producción:

```bash
git rev-parse HEAD
npx prisma migrate status
npx prisma validate
```

Antes de continuar, confirmar manualmente:

- que el endpoint de Neon pertenece a Production;
- que la URL de conexión no se ha mostrado ni registrado en logs;
- que el historial de migraciones no indica drift ni migraciones modificadas;
- que existe la copia de respaldo verificable;
- que `Patient.professionalId` existe y que los recuentos de `User`, `Professional` y `Patient` se han anotado de forma segura.

La aplicación puede ejecutar consultas agregadas de solo lectura para registrar recuentos y relaciones inválidas, sin imprimir datos personales.

## 5. Comando de producción previsto

Solo después de completar los requisitos y recibir autorización explícita:

```bash
npx prisma migrate deploy
```

No usar:

- `prisma migrate dev`: es para desarrollo y puede crear migraciones.
- `prisma db push`: no deja historial revisable de migraciones.
- `prisma migrate reset`: destruye datos y no es aceptable en producción.

## 6. Orden de migración y despliegue recomendado

Recomendación: **migrar primero y desplegar después**.

La migración es aditiva y el código actual no depende de las tablas nuevas, por lo que la aplicación existente continúa siendo compatible una vez ampliado el esquema. Aplicar la migración justo antes del merge reduce el tiempo de desincronización y evita desplegar código que pudiera llegar a depender de estructuras aún ausentes.

Orden:

1. Confirmar backup, Preview y commit exacto.
2. Ejecutar `prisma migrate deploy` durante la ventana controlada.
3. Ejecutar las comprobaciones posteriores de base de datos.
4. Hacer merge de la Pull Request a `main` solo si la migración es correcta.
5. Esperar el deployment de producción de Vercel y ejecutar smoke tests.

Si Vercel despliega automáticamente `main`, no hacer merge hasta que la migración haya terminado y sus comprobaciones hayan pasado. Si el despliegue de `main` se produjera antes por un mecanismo externo, detener la promoción y verificar que el código desplegado sigue siendo compatible antes de reanudar.

## 7. Comprobaciones posteriores

Después de `prisma migrate deploy`:

```bash
npx prisma migrate status
npx prisma generate
npx prisma validate
npm run build
```

Comprobar de forma segura, sin exponer datos personales:

- que la migración figura como aplicada;
- que siguen existiendo `User`, `Professional` y `Patient`, con los recuentos esperados;
- que `Patient.professionalId` y sus relaciones se conservan;
- que `Patient.userId` permite `null` sin alterar valores existentes;
- que existen `Organization`, `CareUnit`, `ProfessionalMembership` y `PatientEnrollment`;
- que landing, `/access` y la consulta de prueba de Prisma responden correctamente;
- que el health check y los logs de Vercel no muestran errores de base de datos.

## 8. Rollback y criterios de aborto

### Abortar antes de aplicar

No ejecutar la migración si falta una aprobación, backup verificable, confirmación del entorno Production, estado limpio de migraciones, Preview válido o identificación del commit exacto.

### Tras una migración fallida

1. No ejecutar `reset`, `db push` ni editar el SQL aplicado.
2. Detener el despliegue y conservar logs y estado de `prisma migrate status`.
3. Restaurar desde el snapshot/PITR o rama de respaldo únicamente con autorización del responsable de base de datos.
4. Investigar la causa antes de reintentar.

### Tras una migración correcta pero un despliegue fallido

Revertir el despliegue de aplicación al último artefacto compatible. Como esta migración es aditiva, no eliminar automáticamente las tablas, enums ni columnas nuevas: el esquema ampliado es compatible con el código anterior. Cualquier rollback de esquema requiere una decisión independiente, evaluación de datos nuevos y aprobación explícita.

## 9. Matriz de autorizaciones

| Acción | Aprobación requerida |
| --- | --- |
| Publicar el commit de la rama | Responsable técnico |
| Verificar Preview | Responsable técnico y QA/designado |
| Confirmar backup o PITR | Responsable de Neon/base de datos |
| Ejecutar `prisma migrate deploy` | Responsable técnico + base de datos + autorización de datos/clínica designada |
| Hacer merge a `main` | Revisor de Pull Request + responsable técnico |
| Promover o verificar Production | Responsable técnico + responsable de despliegue |

## 10. Registro de ejecución

Completar durante la ventana de cambio, sin incluir secretos ni datos de pacientes:

| Campo | Valor |
| --- | --- |
| Fecha y hora | Pendiente |
| Commit desplegado | `88ae563` |
| Migración | `20260719080210_authentication_foundation_phase_1` |
| Snapshot/PITR confirmado | Pendiente |
| Operador | Pendiente |
| Resultado de `migrate deploy` | Pendiente |
| Recuentos antes/después | Pendiente |
| Smoke tests | Pendiente |
| Incidencias y decisión final | Pendiente |
