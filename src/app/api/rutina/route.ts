import { NextResponse } from "next/server";
import { db } from "@/db";
import { routineActivities } from "@/db/schema";

export async function GET() {
  try {
    const activities = await db
      .select()
      .from(routineActivities)
      .orderBy(routineActivities.timeOfDay, routineActivities.scheduledTime);
    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
