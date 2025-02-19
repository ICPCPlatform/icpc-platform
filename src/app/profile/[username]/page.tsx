import Profile from "@/components/profile/_Profile";
import Sidebar from "@/components/profile/_Sidebar";
import { type UserProfile } from "@/lib/types/userProfileType";
import { redirect } from "next/navigation";
import { getUserFullData } from "@/actions/getUserFullData";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = decodeURIComponent((await params).username);
  const user = await getUserFullData({ username });
  if (!user) return redirect("/404");

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Profile user={user} className="w-full lg:flex-[3]" allowEdit={false} />
        <Sidebar className="w-full lg:w-[320px] lg:self-start" />
      </div>
    </div>
  );
}
