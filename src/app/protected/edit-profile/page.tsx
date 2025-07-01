import { getUserData } from "@/lib/session";
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { redirect } from "next/navigation";
import Profile from "./_page";
import { z } from "zod";
import "@/styles/components/profile/profile-edit.css";
import { getUserFullData } from "@/dao/getUserFullData";

export default async function Page() {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }

  // TODO make type safe (replace nulls with undefined)
  const userData = Object.fromEntries(
    Object.entries(
      ((await getUserFullData({ userId: user.userId })) as z.infer<
        typeof userFullDataValid
      >) ?? { userId: user.userId },
    ).map(([key, value]) => [key, value ?? undefined]),
  ) as z.infer<typeof userFullDataValid>;

  return (
    <>
      <Profile userData={userData} />
    </>
  );
}
