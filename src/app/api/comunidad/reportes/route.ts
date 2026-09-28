import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityReports } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad } from "@/lib/comunidad";

const TIPOS_VALIDOS = ["post", "comment", "message"] as const;
type TargetType = (typeof TIPOS_VALIDOS)[number];

/** Reportar un post, comentario o mensaje. No oculta nada por sí solo — la
 *  revisión y el "ocultar" los hace un cuidador desde su propia app, leyendo
 *  esta misma tabla. */
export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No estás en la comunidad" }, { status: 403 });
    }

    const body = (await req.json()) as { targetType?: string; targetId?: number; reason?: string };
    const targetType = body.targetType as TargetType;
    const targetId = Number(body.targetId);
    const reason = (body.reason ?? "").trim().slice(0, 300) || null;

    if (!TIPOS_VALIDOS.includes(targetType) || !Number.isInteger(targetId)) {
      return NextResponse.json({ error: "Reporte inválido" }, { status: 400 });
    }

    await db.insert(communityReports).values({
      reporterPatientId: patientId,
      targetType,
      targetId,
      reason,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
