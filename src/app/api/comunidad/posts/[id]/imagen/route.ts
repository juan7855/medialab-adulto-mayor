import { NextResponse } from "next/server";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, obtenerImagenDePost } from "@/lib/comunidad";

/**
 * La foto de un post. No está en /public ni en un bucket abierto a propósito:
 * el foro es cerrado (sólo pacientes que el cuidador agregó a la comunidad),
 * así que la imagen pasa por la misma puerta que el texto. Si el post se
 * oculta por moderación, esto deja de servirla.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No está en la comunidad" }, { status: 403 });
    }

    const postId = Number((await params).id);
    if (!Number.isInteger(postId)) {
      return NextResponse.json({ error: "Post inválido" }, { status: 400 });
    }

    const imagen = await obtenerImagenDePost(postId);
    if (!imagen) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(imagen.bytes), {
      headers: {
        "Content-Type": imagen.mime,
        "Content-Length": String(imagen.bytes.byteLength),
        // La foto de un post nunca cambia, así que el teléfono la guarda y no
        // la vuelve a bajar al volver al feed. Privada: nunca en una caché
        // compartida, porque detrás hay sesión.
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
