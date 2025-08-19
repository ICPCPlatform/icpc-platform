import { NextRequest, NextResponse } from "next/server";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { db } from "@/lib/db/index";

type Training = typeof Trainings.$inferInsert;

/**
 * Creates a new training program
 * 
 * @param request - The incoming HTTP request containing training data
 * @returns A NextResponse indicating training creation status
 * 
 * @description
 * Creates a new training program in the database. Currently accepts training data
 * and inserts it directly into the Trainings table. 
 * 
 * @todo Add user authentication check to verify admin permissions
 * @todo Add input validation using Zod schema
 * @todo Add authorization to ensure only authorized users can create trainings
 * 
 * @example
 * Request body:
 * ```json
 * {
 *   "title": "Advanced Algorithms",
 *   "description": "Deep dive into advanced algorithmic concepts",
 *   "startDate": "2024-03-01",
 *   "duration": 8
 * }
 * ```
 * 
 * Success response (201):
 * ```json
 * {
 *   "message": "Training created successfully"
 * }
 * ```
 * 
 * Error response (500):
 * ```json
 * {
 *   "error": "Failed to create training"
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const training: Training = await request.json();

    // TODO: Add user authentication check
    // TODO: Add validation

    await db.insert(Trainings).values(training).execute();

    return NextResponse.json(
      { message: "Training created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating training:", error);
    return NextResponse.json(
      { error: "Failed to create training" },
      { status: 500 },
    );
  }
}
