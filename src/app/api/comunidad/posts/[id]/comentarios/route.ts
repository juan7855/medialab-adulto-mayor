import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityPosts, communityComments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, LARGO_MAXIMO_TEXTO } from "@/lib/comunidad";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const [post] = await db
      .select({ id: communityPosts.id })
      .from(communityPosts)
      .where(and(eq(communityPosts.id, postId), eq(communityPosts.hidden, false)))
      .limit(1);
    if (!post) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim().slice(0, LARGO_MAXIMO_TEXTO);
    if (!content) {
      return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 });
    }

    const [creado] = await db
      .insert(communityComments)
      .values({ postId, patientId, content })
      .returning({ id: communityComments.id });

    return NextResponse.json({ ok: true, id: creado.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
