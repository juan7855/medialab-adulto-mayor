import { NextResponse } from "next/server";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, listarMiembrosParaChat } from "@/lib/comunidad";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await esMiembroComunidad(patientId))) {
      return NextResponse.json({ error: "No está en la comunidad" }, { status: 403 });
    }

    return NextResponse.json(await listarMiembrosParaChat(patientId));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
