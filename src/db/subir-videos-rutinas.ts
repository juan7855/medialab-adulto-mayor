import "./load-env";
import { spawn } from "node:child_process";
import { readFile, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { db } from "./index";
import { routines, routineExercises } from "./schema";
import { eq, and } from "drizzle-orm";

/**
 * Comprime y sube a Supabase Storage los 30 videos de demostración de las
 * 5 Rutinas (ver videos/), y guarda la URL pública de cada uno en
 * routine_exercises.video_url.
 *
 * Los clips originales son renders 1080p sin optimizar (hasta 55 MB cada
 * uno, ~800 MB en total: no caben cómodos en el plan gratis de Supabase,
 * 1 GB). Como es animación 3D sobre fondo liso comprimen altísimo sin
 * perder nada visible en una pantalla de celular: se reescalan a 720p y se
 * recodifican con ffmpeg antes de subir, quedando ~15-20 veces más
 * livianos (todo el set baja a unos 50-60 MB).
 *
 * Necesita en .env.local:
 *   SUPABASE_URL=https://<proyecto>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role, Project Settings > API>
 * (la service_role key es secreta: solo vive en .env.local, nunca se sube al repo)
 *
 * Necesita un binario de ffmpeg: por defecto usa `ffmpeg` del PATH; si no
 * está instalado, defina FFMPEG_PATH apuntando al ejecutable (por ejemplo
 * el que instala `npm install ffmpeg-static` en cualquier carpeta).
 *
 * Idempotente: vuelve a subir y sobrescribe cada archivo (upsert).
 *
 * Uso: npx tsx src/db/subir-videos-rutinas.ts
 */

const BUCKET = "rutinas";
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";

const RAIZ_VIDEOS = path.resolve(__dirname, "../../videos");
const CARPETA_R1 = path.join(RAIZ_VIDEOS, "R1. Equilibrio y Estabilidad al Caminar");
const CARPETA_R2 = path.join(RAIZ_VIDEOS, "R2. Fuerza Funcional para Extremidades e Independencia");
const CARPETA_R3 = path.join(RAIZ_VIDEOS, "R3. Movilidad, Flexibilidad y Coordinación");
const CARPETA_R4_R5 = path.join(RAIZ_VIDEOS, "R5. Integración Neuromuscular y Coordinación");

interface VideoAsignado {
  rutaLocal: string;
  routineNumber: number;
  orderIndex: number;
  nombreArchivo: string; // nombre con el que queda en Storage, siempre "ejN.mp4"
}

const VIDEOS: VideoAsignado[] = [
  // Rutina 1 — Ex2 y Ex5 tienen tres clips (posición 1, posición 2 y las dos
  // juntas); se usa el que trae las dos posiciones completas.
  { rutaLocal: path.join(CARPETA_R1, "R1.EJ1.mp4"), routineNumber: 1, orderIndex: 1, nombreArchivo: "ej1.mp4" },
  { rutaLocal: path.join(CARPETA_R1, "R1.EJ2.P1Y2.mp4"), routineNumber: 1, orderIndex: 2, nombreArchivo: "ej2.mp4" },
  { rutaLocal: path.join(CARPETA_R1, "R1.EJ3.mp4"), routineNumber: 1, orderIndex: 3, nombreArchivo: "ej3.mp4" },
  { rutaLocal: path.join(CARPETA_R1, "R1.EJ4.mp4"), routineNumber: 1, orderIndex: 4, nombreArchivo: "ej4.mp4" },
  { rutaLocal: path.join(CARPETA_R1, "R1.EJ5.P1Y2.mp4"), routineNumber: 1, orderIndex: 5, nombreArchivo: "ej5.mp4" },
  { rutaLocal: path.join(CARPETA_R1, "R1.EJ6.mp4"), routineNumber: 1, orderIndex: 6, nombreArchivo: "ej6.mp4" },

  // Rutina 2 — el ejercicio 3 vino en la carpeta de Rutina 2 pero con el
  // nombre "R1.EJ3.mp4" (archivo distinto al de Rutina 1, solo mal
  // nombrado); se usa por su carpeta, no por su nombre.
  { rutaLocal: path.join(CARPETA_R2, "R2.EJ1.mp4"), routineNumber: 2, orderIndex: 1, nombreArchivo: "ej1.mp4" },
  { rutaLocal: path.join(CARPETA_R2, "R2.EJ2.mp4"), routineNumber: 2, orderIndex: 2, nombreArchivo: "ej2.mp4" },
  { rutaLocal: path.join(CARPETA_R2, "R1.EJ3.mp4"), routineNumber: 2, orderIndex: 3, nombreArchivo: "ej3.mp4" },
  { rutaLocal: path.join(CARPETA_R2, "R2.EJ4.mp4"), routineNumber: 2, orderIndex: 4, nombreArchivo: "ej4.mp4" },
  { rutaLocal: path.join(CARPETA_R2, "R2.EJ5.mp4"), routineNumber: 2, orderIndex: 5, nombreArchivo: "ej5.mp4" },
  { rutaLocal: path.join(CARPETA_R2, "R2.EJ6.mp4"), routineNumber: 2, orderIndex: 6, nombreArchivo: "ej6.mp4" },

  // Rutina 3
  { rutaLocal: path.join(CARPETA_R3, "R3.EJ1.mp4"), routineNumber: 3, orderIndex: 1, nombreArchivo: "ej1.mp4" },
  { rutaLocal: path.join(CARPETA_R3, "R3.EJ2.mp4"), routineNumber: 3, orderIndex: 2, nombreArchivo: "ej2.mp4" },
  { rutaLocal: path.join(CARPETA_R3, "R3.EJ3.mp4"), routineNumber: 3, orderIndex: 3, nombreArchivo: "ej3.mp4" },
  { rutaLocal: path.join(CARPETA_R3, "R3.EJ4.mp4"), routineNumber: 3, orderIndex: 4, nombreArchivo: "ej4.mp4" },
  { rutaLocal: path.join(CARPETA_R3, "R3.EJ5.mp4"), routineNumber: 3, orderIndex: 5, nombreArchivo: "ej5.mp4" },
  { rutaLocal: path.join(CARPETA_R3, "R3.EJ6.mp4"), routineNumber: 3, orderIndex: 6, nombreArchivo: "ej6.mp4" },

  // Rutina 4 — el ejercicio 1 tiene dos clips (posición inicial y
  // movimiento); se usa el del movimiento.
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej1.2R4.mp4"), routineNumber: 4, orderIndex: 1, nombreArchivo: "ej1.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej2R4.mp4"), routineNumber: 4, orderIndex: 2, nombreArchivo: "ej2.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej3R4.mp4"), routineNumber: 4, orderIndex: 3, nombreArchivo: "ej3.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej4R4.mp4"), routineNumber: 4, orderIndex: 4, nombreArchivo: "ej4.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej5R4.mp4"), routineNumber: 4, orderIndex: 5, nombreArchivo: "ej5.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej6R4.mp4"), routineNumber: 4, orderIndex: 6, nombreArchivo: "ej6.mp4" },

  // Rutina 5
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej1R5.mp4"), routineNumber: 5, orderIndex: 1, nombreArchivo: "ej1.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej2R5.mp4"), routineNumber: 5, orderIndex: 2, nombreArchivo: "ej2.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej3R5.mp4"), routineNumber: 5, orderIndex: 3, nombreArchivo: "ej3.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej4R5.mp4"), routineNumber: 5, orderIndex: 4, nombreArchivo: "ej4.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej5R5.mp4"), routineNumber: 5, orderIndex: 5, nombreArchivo: "ej5.mp4" },
  { rutaLocal: path.join(CARPETA_R4_R5, "Ej6R5.mp4"), routineNumber: 5, orderIndex: 6, nombreArchivo: "ej6.mp4" },
];

async function comprimir(origen: string, destino: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const args = [
      "-y",
      "-i", origen,
      "-vf", "scale='min(1280,iw)':-2",
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "27",
      "-c:a", "aac",
      "-b:a", "64k",
      "-movflags", "+faststart",
      destino,
    ];
    const proceso = spawn(FFMPEG, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proceso.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    proceso.on("error", reject);
    proceso.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg salió con código ${code} comprimiendo ${origen}:\n${stderr.slice(-800)}`));
    });
  });
}

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
  const supabaseUrlRaw = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrlRaw || !serviceKey) {
    throw new Error("Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }
  // Por si quedó pegado el snippet de la API ("…supabase.co/rest/v1/") en
  // vez del campo "Project URL": sólo importa el origen (protocolo + host).
  const supabaseUrl = new URL(supabaseUrlRaw).origin;

  await asegurarBucket(supabaseUrl, serviceKey);

  const carpetaTemp = await mkdtemp(path.join(tmpdir(), "rutinas-comprimidas-"));
  let totalOriginal = 0;
  let totalComprimido = 0;

  try {
    for (const video of VIDEOS) {
      const comprimido = path.join(carpetaTemp, `${video.routineNumber}-${video.orderIndex}.mp4`);
      process.stdout.write(`Comprimiendo R${video.routineNumber} ej${video.orderIndex} (${path.basename(video.rutaLocal)})... `);
      await comprimir(video.rutaLocal, comprimido);

      const bytes = await readFile(comprimido);
      const pesoOriginal = (await readFile(video.rutaLocal)).length;
      totalOriginal += pesoOriginal;
      totalComprimido += bytes.length;
      console.log(`${(pesoOriginal / 1_000_000).toFixed(1)} MB -> ${(bytes.length / 1_000_000).toFixed(1)} MB`);

      const destino = `R${video.routineNumber}/${video.nombreArchivo}`;
      const url = await subirArchivo(supabaseUrl, serviceKey, destino, bytes);

      const [rutina] = await db.select().from(routines).where(eq(routines.number, video.routineNumber));
      if (!rutina) throw new Error(`No existe Rutina ${video.routineNumber} en la base — corre seed-rutinas.ts primero`);

      await db
        .update(routineExercises)
        .set({ videoUrl: url })
        .where(and(eq(routineExercises.routineId, rutina.id), eq(routineExercises.orderIndex, video.orderIndex)));

      await rm(comprimido, { force: true });
    }
  } finally {
    await rm(carpetaTemp, { recursive: true, force: true });
  }

  console.log(
    `\n✅ Listo — ${(totalOriginal / 1_000_000).toFixed(0)} MB originales subidos como ${(totalComprimido / 1_000_000).toFixed(0)} MB`,
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
