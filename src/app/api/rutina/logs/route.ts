import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { routineLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const logs = await db
      .select()
      .from(routineLogs)
      .where(eq(routineLogs.date, date));

    return NextResponse.json(
      logs.map((l) => ({
        activityId: l.activityId,
        completed: l.completed,
        completedAt: l.completedAt?.toISOString() ?? null,
      }))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { activityId: number; date: string; completed: boolean };
    const { activityId, date, completed } = body;

    const existing = await db
      .select()
      .from(routineLogs)
      .where(
        and(
          eq(routineLogs.activityId, activityId),
          eq(routineLogs.date, date)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(routineLogs)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
        })
        .where(
          and(
            eq(routineLogs.activityId, activityId),
            eq(routineLogs.date, date)
          )
        );
    } else {
      await db.insert(routineLogs).values({
        activityId,
        date,
        completed,
        completedAt: completed ? new Date() : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
