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

## 2. Subir a GitHub

```bash
gh repo create salud-medialab --private --source=. --push
```

O sin `gh`: crea el repo vacío en github.com/new (sin README) y luego:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## 3. Conectar Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import** el repo de GitHub.
2. Vercel detecta Next.js solo. No cambies nada del build.
3. Antes de dar Deploy, abre **Environment Variables** y añade las **mismas dos**
   variables de `.env.local` (`DATABASE_URL` y `DIRECT_URL`) para los tres
   entornos: Production, Preview y Development.
4. **Deploy**.

Desde ahí, cada `git push` a `main` despliega automáticamente.

## 4. Verificar

```
https://TU-APP.vercel.app/api/health
```

Debe responder `{"ok":true}`. Si devuelve `{"ok":false}`, la `DATABASE_URL` en
Vercel está mal o le falta la contraseña.

## Notas

- Si cambias el schema en `src/db/schema.ts`, corre `npm run db:push` de nuevo.
  Vercel no ejecuta migraciones en el build.
- `next build` funciona sin `DATABASE_URL`; la conexión se abre en la primera
  consulta real. Pero sin la variable en Vercel, las rutas `/api/*` fallarán en
  runtime.
