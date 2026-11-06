import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityPosts, communityPostImages } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, listarPostsForo, LARGO_MAXIMO_TEXTO } from "@/lib/comunidad";
import { leerFotoDelCuerpo } from "@/lib/imagenes";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No está en la comunidad" }, { status: 403 });
    }

    return NextResponse.json(await listarPostsForo());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No está en la comunidad" }, { status: 403 });
    }

    const body = (await req.json()) as { content?: string; imagen?: unknown };
    const content = (body.content ?? "").trim().slice(0, LARGO_MAXIMO_TEXTO);

    // Una foto sola es un post válido (no todo el mundo quiere escribir), y
    // un texto solo también. Lo que no vale es un post vacío.
    const resultadoFoto = body.imagen == null ? null : leerFotoDelCuerpo(body.imagen);
    if (resultadoFoto && "error" in resultadoFoto) {
      return NextResponse.json({ error: resultadoFoto.error }, { status: 400 });
    }
    const foto = resultadoFoto?.foto ?? null;

    if (!content && !foto) {
      return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 });
    }

    // En una transacción para que no quede nunca un post sin su foto: si el
    // insert de la imagen falla (pesa de más para la base, se cae la
    // conexión), el post tampoco se guarda y la persona puede reintentar.
    const id = await db.transaction(async (tx) => {
      const [creado] = await tx
        .insert(communityPosts)
        .values({ patientId, content })
        .returning({ id: communityPosts.id });

      if (foto) {
        await tx.insert(communityPostImages).values({
          postId: creado.id,
          mime: foto.mime,
          data: foto.data,
          width: foto.width,
          height: foto.height,
        });
      }

      return creado.id;
    });

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
