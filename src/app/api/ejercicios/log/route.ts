import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { exerciseLogs } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { exerciseName: string; exerciseId: string };
    const today = new Date().toISOString().split("T")[0];

    await db.insert(exerciseLogs).values({
      exerciseName: body.exerciseName,
      date: today,
      durationSeconds: null,
      completed: true,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
