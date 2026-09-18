# Cómo conectar la interfaz del cuidador con esta

Referencia para cuando construyas la app del cuidador (en otro repo, otro
proyecto de Vercel) y quede lista para conectarla con esta.

## El mecanismo: una base de datos, no una API

No hay sincronización entre las dos apps. Ambas leen y escriben **las mismas
tablas de Postgres**, en el mismo proyecto de Supabase (`klzbkiqfxobfgsinqabp`,
región `aws-0-us-east-1`). Cuando el cuidador guarda un cambio, es una fila
que cambió en la base; la próxima vez que el adulto mayor abra su app, la
lee ya cambiada. Conectar las dos apps es, literalmente, poner las mismas
`DATABASE_URL` y `DIRECT_URL` en el proyecto nuevo — nada más.

**Antes de apuntar tu app nueva a esta base de datos real**, te recomiendo
crear un proyecto de Supabase aparte (gratis) para desarrollar contra datos
de prueba tuyos. Cuando esté lista para conectar de verdad, cambias esas dos
variables en Vercel por las de este proyecto y ya. Así no hay riesgo de que
un `drizzle-kit push` a medio construir toque las tablas que ya tienen datos
reales.

## El esquema existente (tal cual está en la base ahora mismo)

```
patients
  id            serial primary key
  name          text not null
  pin           text not null unique      -- 4 dígitos, login del adulto mayor
  created_at    timestamp

-- Las 8 tablas de abajo llevan TODAS patient_id integer not null
-- references patients(id). Esa columna es el aislamiento: toda consulta
-- del cuidador también debe filtrar por ella.

medications          (name, dose, time, image_emoji, color)
medication_logs      (medication_id → medications.id, date, taken, taken_at)
water_logs           (date, glasses)
meal_logs            (meal_id, date, eaten, eaten_at)
routine_activities   (title, description, time_of_day, scheduled_time, emoji, is_recurring)
routine_logs         (activity_id → routine_activities.id, date, completed, completed_at)
daily_notes          (date, note)          -- lo que escribió en "¿Cómo te encuentras hoy?"
exercise_logs        (exercise_name, date, duration_seconds, completed)
```

**Importante si usas Drizzle en el proyecto nuevo:** no redefinas estas
tablas a mano ahí. Copia `src/db/schema.ts` de este repo tal cual. Si las
vuelves a escribir de memoria y difieren aunque sea en un tipo o una
columna opcional, un `drizzle-kit push` desde tu proyecto puede intentar
"corregir" las tablas compartidas — y ahí sí se puede perder algo real.

## Lo que falta: quién cuida a quién

Estas tablas no existen todavía — las dejé pendientes a propósito, para
diseñarlas cuando tengamos claro qué necesita ver y editar tu interfaz:

```
caregivers            -- una fila por cuidador
patient_caregivers    -- relación muchos a muchos: qué cuidador ve qué paciente
```

Cuando conectemos, las creamos juntos (mismo patrón de migración segura que
usé para `patients`: nullable primero, backfill, luego NOT NULL).

## Login del cuidador: recomendado Supabase Auth

El adulto mayor usa una clave de 4 dígitos hecha a mano (`src/lib/auth.ts`,
`src/middleware.ts`) — proporcional para un teléfono compartido por una sola
persona durante meses. Para el cuidador, que entra desde su propio
dispositivo y puede haber más de uno por paciente, tiene más sentido usar
**Supabase Auth** (correo + contraseña, incluido gratis en el mismo proyecto
de Supabase): maneja el hash de contraseñas, verificación de correo y
recuperación de clave sin reinventarlo a mano.

## Al desplegar en Vercel

Mismas dos variables que este proyecto, apuntando al mismo Supabase:

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database → Transaction pooler (puerto 6543) |
| `DIRECT_URL` | Supabase → Project Settings → Database → Session pooler (puerto 5432) |

Si usas Supabase Auth para el cuidador, no necesitas nada parecido a
`SESSION_SECRET` de este proyecto — Supabase Auth maneja su propia sesión.
