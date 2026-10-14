import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityBlocks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad } from "@/lib/comunidad";

/** A quién bloqueó este paciente (sólo su propia dirección: si a este
 *  paciente lo bloqueó otro, no tiene por qué saberlo). */
export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const filas = await db
      .select({ blockedPatientId: communityBlocks.blockedPatientId })
      .from(communityBlocks)
      .where(eq(communityBlocks.blockerPatientId, patientId));

    return NextResponse.json(filas.map((f) => f.blockedPatientId));
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

    const body = (await req.json()) as { patientId?: number };
    const blockedPatientId = Number(body.patientId);
    if (!Number.isInteger(blockedPatientId) || blockedPatientId === patientId) {
      return NextResponse.json({ error: "Bloqueo inválido" }, { status: 400 });
    }

    const yaExiste = await db
      .select({ id: communityBlocks.id })
      .from(communityBlocks)
      .where(
        and(
          eq(communityBlocks.blockerPatientId, patientId),
          eq(communityBlocks.blockedPatientId, blockedPatientId),
        ),
      )
      .limit(1);

    if (yaExiste.length === 0) {
      await db.insert(communityBlocks).values({ blockerPatientId: patientId, blockedPatientId });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const blockedPatientId = Number(req.nextUrl.searchParams.get("patientId"));
    if (!Number.isInteger(blockedPatientId)) {
      return NextResponse.json({ error: "Bloqueo inválido" }, { status: 400 });
    }

    await db
      .delete(communityBlocks)
      .where(
        and(
          eq(communityBlocks.blockerPatientId, patientId),
          eq(communityBlocks.blockedPatientId, blockedPatientId),
        ),
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
