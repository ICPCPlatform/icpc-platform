import { db } from "@/lib/db";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { decryptSession } from "@/lib/session";
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Profile from "./_page";
import { z } from "zod";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const user = await decryptSession(session);
  if (!user) {
    redirect("/login");
  }

  // TODO make type safe (replace nulls with undefined)
  const userData = Object.fromEntries(
    Object.entries(
      (
        await db
          .select()
          .from(UsersFullData)
          .where(eq(UsersFullData.userId, user.userId))
          .execute()
      )[0] ?? { userId: user.userId },
    ).map(([key, value]) => [key, value ?? undefined]),
  ) as z.infer<typeof userFullDataValid>;

  return (
    <>
      <Profile userData={userData} />
    </>
  );
}
