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

## El esquema existente

**No lo retipees a mano.** Copia `src/db/schema.ts` de este repo tal cual a
tu proyecto. Ya pasó una vez que este archivo se desactualizó frente a la
base real (alguien agregó columnas directo en Supabase sin tocar este
archivo) y casi provoca que un `drizzle-kit push` borrara columnas con datos
reales — el archivo es hoy la fuente de verdad exacta de lo que hay en la
base, tabla por tabla y columna por columna. Si vuelves a escribirlo de
memoria y difiere aunque sea en un tipo o una columna opcional, tu propio
`drizzle-kit push` puede intentar "corregir" las tablas compartidas.

Si tu app agrega columnas nuevas a una tabla existente (como ya pasó con
`patients`, `medications`, `meals`, etc.), avísame o actualiza tú mismo el
`schema.ts` de este repo con esas columnas — si no, el próximo `db:push`
desde acá corre el mismo riesgo al revés.

## Quién cuida a quién (`caregivers`, `patient_caregivers`)

Esto ya no está pendiente — se creó junto con lo de Comunidad (ver abajo):

```
caregivers
  id            serial primary key
  name          text not null
  email         text not null unique
  created_at    timestamp

patient_caregivers      -- muchos a muchos
  id            serial primary key
  patient_id    integer not null references patients(id)
  caregiver_id  integer not null references caregivers(id)
  created_at    timestamp
```

Tu app decide cómo llenar `caregivers`: lo natural es una fila por cada
persona que se autentique con Supabase Auth (ver más abajo), usando su
correo. Cuando un cuidador se hace cargo de un paciente, esa relación es una
fila en `patient_caregivers` — un paciente puede tener más de un cuidador
(ej. dos hijos) y un cuidador puede tener varios pacientes.

## Comunidad: foro y mensajes entre pacientes

Los adultos mayores ya tienen una sección "Comunidad" (foro general + DM)
donde pueden verse y escribirse entre sí — pero **cerrada**: sólo entran los
pacientes que un cuidador agregue explícitamente. Ahora mismo esa lista está
vacía a propósito (la usé para probar y la dejé limpia), así que ningún
paciente ve nada todavía hasta que tu app haga esto:

```
community_members       -- la lista blanca de la comunidad
  id                     serial primary key
  patient_id             integer not null unique references patients(id)
  added_by_caregiver_id  integer references caregivers(id)
  created_at             timestamp
```

**Lo único que tu app necesita para "activar" a un paciente en la
comunidad** es insertar una fila acá:

```sql
insert into community_members (patient_id, added_by_caregiver_id)
values ($1, $2);
```

En cuanto esa fila existe, ese paciente ya ve el foro y puede mandar DM a
cualquier otro paciente que también esté en la lista. No hay nada más que
configurar de tu lado para esa parte — el resto (publicar, comentar,
conversar) lo maneja la app del paciente sola.

### Lo que sí necesita una pantalla en tu app: moderación

Hay reportes y ocultar contenido, pero **la revisión es manual, tu app es la
que decide** — la app del paciente sólo deja reportar y respeta lo que
quede oculto:

```
community_posts / community_comments / community_messages
  ... (contenido; ver schema.ts para todas las columnas)
  hidden          boolean not null default false   -- solo en posts/comments

community_reports
  id                        serial primary key
  reporter_patient_id       integer not null references patients(id)
  target_type               text not null   -- "post" | "comment" | "message"
  target_id                 integer not null
  reason                    text
  created_at                timestamp
  resolved                  boolean not null default false
  resolved_by_caregiver_id  integer references caregivers(id)
  resolved_at               timestamp
```

Para tu pantalla de reportes:

1. Lista los pendientes: `select * from community_reports where resolved = false`.
2. Para mostrar qué se reportó, según `target_type` consulta la tabla
   correspondiente (`community_posts`, `community_comments` o
   `community_messages`) filtrando por `id = target_id`.
3. Si decides ocultarlo (sólo aplica a post/comment — los mensajes de DM no
   tienen `hidden`, ya que son privados entre dos personas):
   ```sql
   update community_posts set hidden = true where id = $1;
   -- o community_comments
   ```
4. Marca el reporte resuelto:
   ```sql
   update community_reports
   set resolved = true, resolved_by_caregiver_id = $1, resolved_at = now()
   where id = $2;
   ```

No hay moderación automática de contenido — es intencional, para la primera
versión. Tampoco hay manera de "expulsar" a un paciente de la comunidad
todavía; si hace falta, es borrar su fila de `community_members` (vuelve a
ver el mensaje de "tu cuidador no te agregó").

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
