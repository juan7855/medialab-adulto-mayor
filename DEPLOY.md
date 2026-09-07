# Despliegue: Vercel + Supabase

## 1. Base de datos (Supabase)

En tu proyecto de Supabase: **Project Settings → Database → Connection string**.

Copia **dos** strings distintas y pégalas en `.env.local` (ya creado, y está en
`.gitignore`, así que nunca se sube):

| Variable | Pestaña en Supabase | Puerto | Para qué |
|---|---|---|---|
| `DATABASE_URL` | Transaction pooler | `6543` | La app en runtime |
| `DIRECT_URL` | Session pooler | `5432` | Migraciones y seed |

Reemplaza `[YOUR-PASSWORD]` por la contraseña de la base de datos (si no la
recuerdas: **Database → Reset database password**).

> Por qué dos: en serverless cada invocación abre una conexión nueva, así que la
> app debe ir por el *transaction pooler*. Pero ese pooler no soporta bien el DDL
> de las migraciones, que necesitan el *session pooler*.

Después, crear las tablas y cargar los datos iniciales:

```bash
npm run db:push    # crea las 5 tablas del schema
npm run db:seed    # carga medicamentos y actividades de rutina
```

## 2. Vercel (ya desplegado)

El proyecto **`salud-medialab`** ya está creado y desplegado en producción:

- **App:** https://salud-medialab.vercel.app
- **Dashboard:** https://vercel.com/juansebastianv19-9369s-projects/salud-medialab

`DATABASE_URL` y `DIRECT_URL` ya están cargadas en Production, Preview y
Development. Para redesplegar tras un cambio:

```bash
vercel deploy --prod
```

## 3. Conectar GitHub (opcional, para auto-deploy)

El repo ya está commiteado localmente. Para que cada push despliegue solo:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Luego en el dashboard: **Settings → Git → Connect Git Repository**. Las
variables de entorno ya configuradas se conservan.

## 4. Verificar

```
https://salud-medialab.vercel.app/api/health
```

Debe responder `{"ok":true}`.

## Notas

- Si cambias el schema en `src/db/schema.ts`, corre `npm run db:push` de nuevo.
  Vercel no ejecuta migraciones en el build.
- `next build` funciona sin `DATABASE_URL`; la conexión se abre en la primera
  consulta real.
- La URL propia de cada deployment (`salud-medialab-xxxx.vercel.app`) está
  protegida por Vercel Authentication y devuelve 302 a quien no esté logueado.
  El dominio `salud-medialab.vercel.app` es el público.
