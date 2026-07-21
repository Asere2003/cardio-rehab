# Bootstrap del primer administrador

## Finalidad

El primer administrador no se crea desde una pantalla pública. El script `npm run bootstrap:admin` prepara manualmente una organización, una unidad y una identidad `ADMIN` con perfil profesional y membresía de administración.

No crea contraseñas, sesiones, invitaciones ni credenciales. La identidad resultante no puede iniciar sesión hasta que se implemente la autenticación aprobada.

## Requisitos

1. Aplicar previamente las migraciones aprobadas en una rama aislada de Neon.
2. Ejecutar solo en desarrollo. El script se niega a ejecutarse con `NODE_ENV=production`.
3. Proporcionar valores mediante el entorno local o seguro, nunca en Git:

```text
ALLOW_ADMIN_BOOTSTRAP=true
BOOTSTRAP_ORGANIZATION_NAME=
BOOTSTRAP_ORGANIZATION_SLUG=
BOOTSTRAP_CARE_UNIT_NAME=
BOOTSTRAP_CARE_UNIT_SLUG=
BOOTSTRAP_ADMIN_EMAIL=
BOOTSTRAP_ADMIN_FIRST_NAME=
BOOTSTRAP_ADMIN_LAST_NAME=
```

Para desarrollo, utilizar nombres y correo claramente ficticios. Para una instalación real, una persona autorizada debe introducir los valores en un entorno seguro y registrar el procedimiento fuera del repositorio.

## Comportamiento

- Reutiliza la organización por `slug`.
- Reutiliza la unidad por organización y `slug`.
- Crea el usuario `ADMIN` únicamente si no existe.
- Rechaza un correo que ya pertenezca a otra clase de identidad.
- Reutiliza la membresía si ya existe.
- Asigna solo `PROFESSIONAL_MANAGE` y `AUDIT_VIEW` a esa membresía inicial.

La operación se ejecuta en una transacción y no crea datos clínicos. No debe automatizarse en CI, Preview ni producción.

## Riesgos y límites

El rol base `ADMIN` no autoriza globalmente por sí mismo. La membresía y sus permisos serán la base de la autorización real cuando exista sesión. Hasta entonces, `/admin` está excluido de producción, pero Preview no debe recibir datos reales ni considerarse protegido por autenticación.
