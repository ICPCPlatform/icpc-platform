import { decryptSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const viewTrainingPaths: RegExp[] = [
  /^\/protected\/trainings\/(?<trainingId>\d+)\/.*$/,
];
export async function middleware(
  req: NextRequest,
): Promise<null | NextResponse> {
  const url = req.nextUrl.pathname;
  const session = req.cookies.get("session")?.value;
  const validation = await decryptSession(session);
  let ret = null;
  for (const regex of viewTrainingPaths) {
    const match = url.match(regex);
    if (match) {
      ret = NextResponse.redirect(new URL("/not-found", req.url));
      if (!validation) {
        // is not logged in
        return NextResponse.redirect(new URL("/login", req.url));
      }
      const trainingId = Number(match.groups?.trainingId);
      if (isNaN(trainingId)) continue;

      const permission = await (
        // you need to host on port 3000
        await fetch(`http://localhost:3000/api/auth/access-control/trainings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainingId, userId: validation.userId }),
        })
      ).json();

      if (permission.includes("View:standing")) return null;
    }
  }
  return ret;
}
