import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityConversations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, hayBloqueoEntre, listarConversaciones } from "@/lib/comunidad";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    return NextResponse.json(await listarConversaciones(patientId));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

/** Crea (o reusa) la conversación con otro paciente. */
export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No estás en la comunidad" }, { status: 403 });
    }

    const body = (await req.json()) as { patientId?: number };
    const otroId = Number(body.patientId);
    if (!Number.isInteger(otroId) || otroId === patientId) {
      return NextResponse.json({ error: "Destinatario inválido" }, { status: 400 });
    }
    if (!(await esMiembroComunidad(otroId))) {
      return NextResponse.json({ error: "Ese paciente no está en la comunidad" }, { status: 400 });
    }
    if (await hayBloqueoEntre(patientId, otroId)) {
      return NextResponse.json({ error: "No se puede escribir a esta persona" }, { status: 403 });
    }

    const patientAId = Math.min(patientId, otroId);
    const patientBId = Math.max(patientId, otroId);

    const existente = await db
      .select({ id: communityConversations.id })
      .from(communityConversations)
      .where(
        and(
          eq(communityConversations.patientAId, patientAId),
          eq(communityConversations.patientBId, patientBId),
        ),
      )
      .limit(1);

    if (existente.length > 0) {
      return NextResponse.json({ ok: true, id: existente[0].id });
    }

    const [creada] = await db
      .insert(communityConversations)
      .values({ patientAId, patientBId })
      .returning({ id: communityConversations.id });

    return NextResponse.json({ ok: true, id: creada.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
