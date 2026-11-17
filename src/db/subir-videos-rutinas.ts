import "./load-env";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./index";
import { routines, routineExercises } from "./schema";
import { eq, and } from "drizzle-orm";

/**
 * Sube a Supabase Storage los videos de demostración de Rutina 4 y Rutina 5
 * (las únicas grabadas por ahora, ver recursos/videos/) y guarda la URL
 * pública de cada uno en routine_exercises.video_url.
 *
 * Necesita en .env.local:
 *   SUPABASE_URL=https://<proyecto>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role, Project Settings > API>
 * (la service_role key es secreta: solo vive en .env.local, nunca se sube al repo)
 *
 * Idempotente: vuelve a subir y sobrescribe cada archivo (upsert), así que
 * correrlo de nuevo con videos nuevos de R1–R3 agregados abajo también sirve.
 *
 * Uso: npx tsx src/db/subir-videos-rutinas.ts
 */

const BUCKET = "rutinas";
const CARPETA_LOCAL = path.resolve(
  __dirname,
  "../../videos/R5. Integración Neuromuscular y Coordinación",
);

interface VideoAsignado {
  archivo: string;
  routineNumber: number;
  orderIndex: number;
}

const VIDEOS: VideoAsignado[] = [
  { archivo: "Ej1.2R4.mp4", routineNumber: 4, orderIndex: 1 },
  { archivo: "Ej2R4.mp4", routineNumber: 4, orderIndex: 2 },
  { archivo: "Ej3R4.mp4", routineNumber: 4, orderIndex: 3 },
  { archivo: "Ej4R4.mp4", routineNumber: 4, orderIndex: 4 },
  { archivo: "Ej5R4.mp4", routineNumber: 4, orderIndex: 5 },
  { archivo: "Ej6R4.mp4", routineNumber: 4, orderIndex: 6 },
  { archivo: "Ej1R5.mp4", routineNumber: 5, orderIndex: 1 },
  { archivo: "Ej2R5.mp4", routineNumber: 5, orderIndex: 2 },
  { archivo: "Ej3R5.mp4", routineNumber: 5, orderIndex: 3 },
  { archivo: "Ej4R5.mp4", routineNumber: 5, orderIndex: 4 },
  { archivo: "Ej5R5.mp4", routineNumber: 5, orderIndex: 5 },
  { archivo: "Ej6R5.mp4", routineNumber: 5, orderIndex: 6 },
];

async function asegurarBucket(supabaseUrl: string, serviceKey: string) {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (res.ok) {
    console.log(`+ bucket "${BUCKET}" creado`);
    return;
  }
  const texto = await res.text();
  if (res.status === 409 || texto.includes("already exists")) {
    console.log(`  bucket "${BUCKET}" ya existía`);
    return;
  }
  throw new Error(`No se pudo crear el bucket: ${res.status} ${texto}`);
}

async function subirArchivo(
  supabaseUrl: string,
  serviceKey: string,
  destino: string,
  bytes: Buffer,
): Promise<string> {
  const res = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${destino}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "video/mp4",
      "x-upsert": "true",
    },
    body: new Uint8Array(bytes),
  });
  if (!res.ok) {
    throw new Error(`Falló la subida de ${destino}: ${res.status} ${await res.text()}`);
  }
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${destino}`;
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }

  await asegurarBucket(supabaseUrl, serviceKey);

  for (const video of VIDEOS) {
    const rutaLocal = path.join(CARPETA_LOCAL, video.archivo);
    const bytes = await readFile(rutaLocal);
    const destino = `R${video.routineNumber}/${video.archivo}`;

    console.log(`Subiendo ${destino} (${(bytes.length / 1_000_000).toFixed(1)} MB)...`);
    const url = await subirArchivo(supabaseUrl, serviceKey, destino, bytes);

    const [rutina] = await db.select().from(routines).where(eq(routines.number, video.routineNumber));
    if (!rutina) throw new Error(`No existe Rutina ${video.routineNumber} en la base — corre seed-rutinas.ts primero`);

    await db
      .update(routineExercises)
      .set({ videoUrl: url })
      .where(and(eq(routineExercises.routineId, rutina.id), eq(routineExercises.orderIndex, video.orderIndex)));

    console.log(`  -> Rutina ${video.routineNumber}, ejercicio ${video.orderIndex}: ${url}`);
  }

  console.log("✅ Listo");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
