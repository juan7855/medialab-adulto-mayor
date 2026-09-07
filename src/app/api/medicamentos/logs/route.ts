import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { medicationLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const logs = await db
      .select()
      .from(medicationLogs)
      .where(eq(medicationLogs.date, date));

    return NextResponse.json(
      logs.map((l) => ({
        medicationId: l.medicationId,
        taken: l.taken,
        takenAt: l.takenAt?.toISOString() ?? null,
      }))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { medicationId: number; date: string; taken: boolean };
    const { medicationId, date, taken } = body;

    const existing = await db
      .select()
      .from(medicationLogs)
      .where(
        and(
          eq(medicationLogs.medicationId, medicationId),
          eq(medicationLogs.date, date)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(medicationLogs)
        .set({
          taken,
          takenAt: taken ? new Date() : null,
        })
        .where(
          and(
            eq(medicationLogs.medicationId, medicationId),
            eq(medicationLogs.date, date)
          )
        );
    } else {
      await db.insert(medicationLogs).values({
        medicationId,
        date,
        taken,
        takenAt: taken ? new Date() : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
