import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { getUserData } from "@/lib/session";
import { eq, and } from "drizzle-orm";

// POST /api/applications - Apply to a training
export async function POST(request: NextRequest) {
  try {
    const user = await getUserData();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { trainingId } = await request.json();
    if (!trainingId) {
      return NextResponse.json({ error: "Missing trainingId" }, { status: 400 });
    }
    // Check if already applied
    const existing = await db
      .select()
      .from(Applications)
      .where(and(eq(Applications.userId, user.userId), eq(Applications.trainingId, trainingId)))
      .execute();
    if (existing.length > 0) {
      return NextResponse.json({ error: "Already applied" }, { status: 409 });
    }
    // Insert application
    await db.insert(Applications).values({
      userId: user.userId,
      trainingId,
      status: "pending",
      description: "",
    }).execute();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/applications - Withdraw application
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserData();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { trainingId } = await request.json();
    if (!trainingId) {
      return NextResponse.json({ error: "Missing trainingId" }, { status: 400 });
    }
    // Update status to withdrawn
    const result = await db
      .update(Applications)
      .set({ status: "withdrawn" })
      .where(and(eq(Applications.userId, user.userId), eq(Applications.trainingId, trainingId)))
      .execute();
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/applications - List all applications for the current user
export async function GET() {
  try {
    const user = await getUserData();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const applications = await db
      .select()
      .from(Applications)
      .where(eq(Applications.userId, user.userId))
      .execute();
    return NextResponse.json({ applications }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 