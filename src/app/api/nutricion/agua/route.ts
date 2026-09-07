import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { waterLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const result = await db
      .select()
      .from(waterLogs)
      .where(eq(waterLogs.date, date))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ glasses: 0 });
    }

    return NextResponse.json({ glasses: result[0].glasses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { date: string; glasses: number };
    const { date, glasses } = body;

    const existing = await db
      .select()
      .from(waterLogs)
      .where(eq(waterLogs.date, date))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(waterLogs)
        .set({ glasses })
        .where(eq(waterLogs.date, date));
    } else {
      await db.insert(waterLogs).values({ date, glasses });
    }

    return NextResponse.json({ ok: true, glasses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
