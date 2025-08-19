import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import { rateLimit } from "@/lib/rate-limit";
import expectedBody from "./_expectedBody";

async function POSTfn(request: NextRequest, user: AuthenticatedUser) {
  try {
    const { success, data: trainingData } = expectedBody.safeParse(
      await request.json(),
    );
    if (!success) {
      return new NextResponse(null, { status: 400 });
    }
    const training = {
      ...trainingData,
      headId: parseInt(user.id), // Convert string ID to number
    };
    await db.insert(Trainings).values(training).execute();
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.log(e);
    return new NextResponse(null, { status: 500 });
  }
}

// Apply rate limiting and admin auth
const POST = rateLimit({ maxRequests: 5, windowMs: 60000 })(
  withAdminAuth(POSTfn)
);

export { POST };
