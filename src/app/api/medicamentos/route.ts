import { NextResponse } from "next/server";
import { db } from "@/db";
import { medications } from "@/db/schema";

export async function GET() {
  try {
    const meds = await db.select().from(medications).orderBy(medications.time);
    return NextResponse.json(meds);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
