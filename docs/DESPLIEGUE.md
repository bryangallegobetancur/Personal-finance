# Instalación y despliegue

## Servicios del proyecto

- [Aplicación](https://personal-finance-taupe-psi.vercel.app/dashboard): requiere sesión y redirige a `/login` al acceder sin autenticar.
- [Demostración pública](https://personal-finance-taupe-psi.vercel.app/explore/dashboard): datos de ejemplo, sin persistencia.
- [Repositorio público](https://github.com/bryangallegobetancur/Personal-finance).

## Desarrollo local

Requisitos: Git, Node.js 22 con npm y un proyecto Supabase administrado por el equipo. El workflow utiliza Node.js 22.

```bash
git clone https://github.com/bryangallegobetancur/Personal-finance.git
cd Personal-finance
npm ci
```

Copiar `.env.example` a `.env`. En PowerShell:

```powershell
Copy-Item .env.example .env
```

En macOS/Linux:

```bash
cp .env.example .env
```

Completar localmente:

```dotenv
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU-CLAVE-ANON-PUBLICA
```

Usar la URL y la clave pública `anon` del proyecto. Nunca colocar `service_role`, contraseñas de PostgreSQL o tokens de administración en variables `VITE_*`: se incorporan al JavaScript del navegador. `.env` está ignorado por Git.

```bash
npm run dev
```

Abrir la URL que Vite imprima, habitualmente `http://localhost:5173`. Incluso el modo exploración necesita las dos variables porque el cliente Supabase se inicializa al cargar la aplicación.

## Base de datos

En un proyecto nuevo, ejecutar en el SQL Editor de Supabase estos archivos **en orden**:

1. [`0001_init.sql`](../supabase/migrations/0001_init.sql): tablas, restricciones, RLS, perfil automático, trigger de alertas y publicación Realtime.
2. [`0002_add_budget_dates.sql`](../supabase/migrations/0002_add_budget_dates.sql): fechas de vigencia y actualización del trigger.
3. [`0003_relax_date_constraint.sql`](../supabase/migrations/0003_relax_date_constraint.sql): margen de un día para la restricción de fecha.

En una base existente, revisar qué migraciones están aplicadas y ejecutar solo las pendientes, con respaldo previo. No ejecutar de nuevo `0001` como mecanismo de actualización: podría reemplazar definiciones posteriores. El repositorio incluye SQL, pero no un `supabase/config.toml` ni un entorno local de Supabase configurado.

Comprobar las cinco tablas, las políticas y la inclusión de `alerts_history` en la publicación `supabase_realtime`. La prueba de alerta debe hacerse con una cuenta y datos de prueba, no con información financiera real.

## Autenticación

En Supabase, configurar `Authentication > URL Configuration`:

- Site URL: `https://personal-finance-taupe-psi.vercel.app` para el proyecto actual.
- Redirect URL de recuperación: `https://personal-finance-taupe-psi.vercel.app/update-password`.
- Para desarrollo: `http://localhost:5173/update-password`, o el puerto realmente usado.

Si la confirmación de correo está activada, completar el enlace enviado antes del primer acceso. El registro usa el Site URL configurado en Supabase; la recuperación construye `/update-password` con el origen actual. Ver [URLs de redirección de Supabase](https://supabase.com/docs/guides/auth/redirect-urls).

## Frontend en Vercel

El responsable confirmó que Vercel ya está conectado al repositorio. Para reproducir el despliegue:

1. Importar el repositorio en Vercel y seleccionar Vite.
2. Usar la raíz del repositorio, instalación `npm ci`, compilación `npm run build` y salida `dist`.
3. Añadir las dos variables públicas de Supabase en los entornos requeridos. Reconstruir el despliegue después de cambiarlas.
4. Usar `master` como rama de producción del proyecto actual.
5. Verificar las rutas `/login`, `/explore/dashboard` y la recuperación de contraseña. `vercel.json` redirige las rutas de la SPA a `index.html` para permitir recargas directas.

La conexión Git publica el frontend. **No ejecuta las migraciones de Supabase**: son una operación separada. No se necesitan funciones serverless para esta implementación. [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Comprobaciones reproducibles

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

`build` incluye TypeScript y genera `dist`. `preview` sirve esa compilación localmente. El workflow [ci.yml](../.github/workflows/ci.yml) ejecuta instalación reproducible, lint y build al recibir cambios. No contiene credenciales ni ejecuta pruebas de integración contra la base de datos.

El bundle produce una advertencia de tamaño superior a 500 kB. No impide la compilación, pero queda como oportunidad de optimización. Una compilación correcta no certifica que el esquema, RLS o los correos funcionen en un proyecto Supabase particular.
