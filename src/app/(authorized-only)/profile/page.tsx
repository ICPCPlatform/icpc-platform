import "@/app/globals.css";

import Sidebar from "../../../components/profile/_Sidebar";
import Profile from "../../../components/profile/_Profile";
import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserFullData } from "@/actions/getUserFullData";
import { UserProfile } from "@/lib/types/userProfileType";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const validation = await decryptSession(session);
  if (!validation) return null;
  const { userId } = validation;
  const user: UserProfile<false> | null = await getUserFullData({ userId });
  if (!user) redirect("/404");

  return (
    <div className="container mx-auto p-4 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Profile user={user} className="w-full lg:flex-[3]" />
        <Sidebar className="w-full lg:w-[320px] lg:self-start" />
      </div>
    </div>
  );
}
