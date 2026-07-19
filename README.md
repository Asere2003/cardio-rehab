# Volver a Latir

Aplicación web para acompañar a personas durante y después de su programa de rehabilitación cardíaca. El proyecto se diseña con enfoque mobile first, lenguaje claro y una experiencia tranquila y accesible para pacientes y profesionales.

## Estado actual

- Landing pública y selección de perfil en `/access`.
- Conexión de prueba con PostgreSQL/Neon en `/test`.
- Base de datos gestionada con Prisma Migrate.
- La autenticación y las áreas privadas están en fase de diseño; no existe registro público.

## Tecnologías instaladas

| Tecnología | Versión instalada |
| --- | --- |
| Next.js | 16.2.10 |
| React y React DOM | 19.2.4 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.2 |
| shadcn | 4.13.0 |
| Prisma y Prisma Client | 7.8.0 |
| PostgreSQL | mediante Neon |

## Desarrollo

1. Crea un archivo `.env` local con `DATABASE_URL`. No incluyas secretos en el repositorio.
2. Instala dependencias con `npm install`.
3. Inicia el entorno local con `npm run dev`.

Comandos disponibles:

```bash
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Actualmente no hay una infraestructura de tests instalada. La propuesta para incorporarla y la arquitectura de autenticación están documentadas en [docs/authentication-architecture.md](docs/authentication-architecture.md).

## Datos y seguridad

No se deben introducir datos reales de pacientes, credenciales, tokens ni secretos en código, commits, capturas o documentación. Cualquier cambio de modelo se realizará mediante migraciones revisadas y no destructivas.
