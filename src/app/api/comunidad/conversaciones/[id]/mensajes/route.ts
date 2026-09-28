import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityMessages } from "@/db/schema";
import { eq, and, asc, ne, isNull } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";
import { LARGO_MAXIMO_TEXTO, hayBloqueoEntre, obtenerConversacionParaPaciente } from "@/lib/comunidad";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const conversationId = Number((await params).id);
    const conversacion = await obtenerConversacionParaPaciente(conversationId, patientId);
    if (!conversacion) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const mensajes = await db
      .select()
      .from(communityMessages)
      .where(eq(communityMessages.conversationId, conversationId))
      .orderBy(asc(communityMessages.createdAt));

    // Al abrir/refrescar el hilo, lo que el otro mandó queda marcado como leído.
    await db
      .update(communityMessages)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(communityMessages.conversationId, conversationId),
          ne(communityMessages.senderPatientId, patientId),
          isNull(communityMessages.readAt),
        ),
      );

    return NextResponse.json(mensajes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const conversationId = Number((await params).id);
    const conversacion = await obtenerConversacionParaPaciente(conversationId, patientId);
    if (!conversacion) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    if (await hayBloqueoEntre(patientId, conversacion.otroPacienteId)) {
      return NextResponse.json({ error: "No se puede escribir a esta persona" }, { status: 403 });
    }

    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim().slice(0, LARGO_MAXIMO_TEXTO);
    if (!content) {
      return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 });
    }

    const [creado] = await db
      .insert(communityMessages)
      .values({ conversationId, senderPatientId: patientId, content })
      .returning({ id: communityMessages.id });

    return NextResponse.json({ ok: true, id: creado.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
