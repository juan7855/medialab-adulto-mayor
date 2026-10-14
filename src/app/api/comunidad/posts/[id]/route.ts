import { NextResponse } from "next/server";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, obtenerPostConComentarios } from "@/lib/comunidad";

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

    const resultado = await obtenerPostConComentarios(postId);
    if (!resultado) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
