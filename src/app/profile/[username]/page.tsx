import Profile from "@/app/(authorized-only)/profile/_Profile";
import Sidebar from "@/app/(authorized-only)/profile/_Sidebar";
import { type User } from "@/app/(authorized-only)/profile/page";
import { db } from "@/lib/db";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { eq } from "drizzle-orm";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = decodeURIComponent((await params).username);
  console.log(username);
  const user: User = (
    await db
      .select()
      .from(UsersFullData)
      .where(eq(UsersFullData.username, username))
      .execute()
  )[0] ?? { username };
  console.log(user);

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Profile user={user} className="w-full lg:flex-[3]" />
        <Sidebar className="w-full lg:w-[320px] lg:self-start" />
      </div>
    </div>
  );
}
