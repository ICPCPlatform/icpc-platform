import { NextRequest, NextResponse } from "next/server";
import { Trainings } from "@/lib/db/schema/Trainings";
import { db } from "@/lib/db/index";

type Training = typeof Trainings.$inferInsert;

export async function POST(request: NextRequest) {
    try {
        const training: Training = await request.json();

        // TODO: Add user authentication check
        // TODO: Add validation

        await db.insert(Trainings).values(training).execute();

        return NextResponse.json({ message: "Training created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating training:", error);
        return NextResponse.json(
            { error: "Failed to create training" },
            { status: 500 }
        );
    }
} 