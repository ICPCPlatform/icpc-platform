import "@/app/globals.css";

import Sidebar from "./_Sidebar";
import Profile from "./_Profile";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export type User = typeof UsersFullData.$inferSelect;

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const validation = await decryptSession(session);
  if (!validation) return null;
  const { userId } = validation;
  const user: User | undefined = (
    await db
      .select()
      .from(UsersFullData)
      .where(eq(UsersFullData.userId, userId))
      .execute()
  )[0]?? { userId };

  return (
    <div className="container mx-auto p-4 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Profile user={user} className="w-full lg:flex-[3]" allowEdit />
        <Sidebar className="w-full lg:w-[320px] lg:self-start" />
      </div>
    </div>
  );
}
