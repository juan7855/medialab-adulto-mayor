import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dailyNotes } from "@/db/schema";
import { eq } from "drizzle-orm";

const LARGO_MAXIMO = 500;

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "Falta la fecha" }, { status: 400 });
    }

    const filas = await db
      .select()
      .from(dailyNotes)
      .where(eq(dailyNotes.date, date))
      .limit(1);

    return NextResponse.json({ note: filas[0]?.note ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { date: string; note: string };
    const date = body.date;
    // Se recorta en el servidor: el límite del textarea es una comodidad,
    // no una garantía.
    const note = (body.note ?? "").trim().slice(0, LARGO_MAXIMO);

    if (!date) {
      return NextResponse.json({ error: "Falta la fecha" }, { status: 400 });
    }

    const existente = await db
      .select()
      .from(dailyNotes)
      .where(eq(dailyNotes.date, date))
      .limit(1);

    if (existente.length > 0) {
      await db.update(dailyNotes).set({ note }).where(eq(dailyNotes.date, date));
    } else {
      await db.insert(dailyNotes).values({ date, note });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
