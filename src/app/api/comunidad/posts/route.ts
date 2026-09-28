import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityPosts } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, listarPostsForo, LARGO_MAXIMO_TEXTO } from "@/lib/comunidad";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No estás en la comunidad" }, { status: 403 });
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
      return NextResponse.json({ error: "No estás en la comunidad" }, { status: 403 });
    }

    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim().slice(0, LARGO_MAXIMO_TEXTO);
    if (!content) {
      return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 });
    }

    const [creado] = await db
      .insert(communityPosts)
      .values({ patientId, content })
      .returning({ id: communityPosts.id });

    return NextResponse.json({ ok: true, id: creado.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
