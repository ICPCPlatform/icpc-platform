import { db } from "@/lib/db";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { getUserData } from "@/lib/session";
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Profile from "./_page";
import { z } from "zod";

export default async function Page() {
  const user = await getUserData();
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
