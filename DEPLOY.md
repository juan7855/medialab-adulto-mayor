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

## 5. Avisos por Telegram

Dos cosas van al chat de Telegram: el **informe diario** de cada paciente y una
**alerta inmediata** cuando alguien pide ayuda desde la pantalla de Emergencia.
Sin las variables de abajo la app funciona exactamente igual, sólo no manda
nada — nunca falla una llamada al 123 porque Telegram no esté configurado.

### Crear el bot (una sola vez)

1. En Telegram, hable con **@BotFather** → `/newbot` → le pide un nombre y un
   usuario que termine en `bot`. Al final le entrega el **token**.
2. Escríbale cualquier mensaje al bot recién creado (si no, Telegram no deja
   que el bot le escriba primero).
3. Abra en el navegador `https://api.telegram.org/bot<TOKEN>/getUpdates`: en el
   JSON está `"chat":{"id":123456789,...}`. Ese número es el **chat id**.

Si prefiere que los avisos lleguen a un grupo con varios cuidadores, cree el
grupo, agregue el bot, escriba un mensaje ahí y repita el paso 3: el id del
grupo es negativo (`-1001234567890`).

### Las tres variables

| Variable | Qué es |
|---|---|
| `TELEGRAM_BOT_TOKEN` | El token de @BotFather |
| `TELEGRAM_CHAT_ID` | El chat o grupo de destino |
| `CRON_SECRET` | Clave propia que protege `/api/cron/informe` |

Genere `CRON_SECRET` con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Van en `.env.local` para desarrollo y en Vercel para producción:

```bash
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production
vercel env add CRON_SECRET production
vercel deploy --prod
```

`CRON_SECRET` es especial: Vercel la reconoce por nombre y la manda sola como
`Authorization: Bearer ...` en cada ejecución del cron. No hay que escribir
nada para que eso pase.

### El informe diario

Lo agenda `vercel.json`: `/api/cron/informe` a las **23:00 UTC = 6:00 p. m. en
Colombia**. En plan Hobby, Vercel permite 2 crons y los dispara una vez al día
dentro de esa hora, no al minuto exacto.

Para probarlo sin esperar, con la misma clave:

```bash
curl "https://salud-medialab.vercel.app/api/cron/informe?secret=SU_CRON_SECRET"
```

Responde `{"ok":true,"fecha":"...","pacientes":N,"enviados":N}` y manda un
mensaje por paciente. Acepta `&date=2026-11-10` para reenviar otro día. Ese
`?secret=` queda en los logs de acceso de Vercel: sirve para probar, pero el
cron real usa el header.

### La alerta de emergencia

Se dispara desde el navegador ([src/app/emergencia/LlamadaAvisada.tsx](src/app/emergencia/LlamadaAvisada.tsx))
hacia `/api/emergencia`, sin esperar la respuesta: el teléfono abre la
marcación igual de rápido que antes. No guarda nada en la base de datos — no
hay tabla de emergencias, y crearla implicaría un `db:push` sobre la base que
comparte con la app del cuidador. Si hace falta historial, esa tabla se acuerda
primero con esa app (ver `INTEGRACION-CUIDADOR.md`).

### Qué sale y qué no

Estos mensajes salen hacia un servidor que no es nuestro, con datos de salud de
personas reales. Va sólo el nombre de pila y el dato del día: nada de teléfono,
dirección, EPS ni perfil clínico. Use un chat privado o un grupo cerrado, nunca
un canal público.

## Notas

- Las fotos de la comunidad viven en `community_post_images`. Esa tabla se
  crea con SQL directo, no con `db:push` (que podría tocar columnas que la
  plataforma del cuidador agregó a mano):

  ```bash
  npx tsx src/db/crear-tabla-fotos.ts
  ```

  Es idempotente, y hay que correrlo **antes** de desplegar el foro con fotos:
  sin esa tabla, la pantalla de comunidad falla al consultar.
- Si cambias el schema en `src/db/schema.ts`, corre `npm run db:push` de nuevo.
  Vercel no ejecuta migraciones en el build.
- `next build` funciona sin `DATABASE_URL`; la conexión se abre en la primera
  consulta real.
- La URL propia de cada deployment (`salud-medialab-xxxx.vercel.app`) está
  protegida por Vercel Authentication y devuelve 302 a quien no esté logueado.
  El dominio `salud-medialab.vercel.app` es el público.
