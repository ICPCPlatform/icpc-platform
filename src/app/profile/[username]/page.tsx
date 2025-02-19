import Profile from "@/app/(authorized-only)/profile/_Profile";
import Sidebar from "@/app/(authorized-only)/profile/_Sidebar";
import { type User } from "@/app/(authorized-only)/profile/page";
import { db } from "@/lib/db";
import { Cities } from "@/lib/db/schema/user/Cities";
import { Countries } from "@/lib/db/schema/user/Countries";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { Users } from "@/lib/db/schema/user/Users";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Departments } from "@/lib/db/schema/user/Departments";
import { Communities } from "@/lib/db/schema/user/Communities";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = decodeURIComponent((await params).username);
  const user = (
    await db
      .select({
        userId: UsersFullData.userId,
        username: Users.username,
        imageUrl: UsersFullData.imageUrl,
        email: Users.gmail,
        createdAt: UsersFullData.registrationDate,

        country: Countries.countryName,
        city: Cities.cityName,
        department: Departments.departmentName,
        community: Communities.communityName,

        nameAR1: UsersFullData.nameAR1,
        nameAR2: UsersFullData.nameAR2,
        nameAR3: UsersFullData.nameAR3,
        nameAR4: UsersFullData.nameAR4,
        firstNameEn: UsersFullData.firstNameEn,
        lastNameEn: UsersFullData.lastNameEn,

        codeforces: Users.cfHandle,
        vjudge: Users.vjHandle,
        atcoder: UsersFullData.atcoder,
        codechef: UsersFullData.codechef,
        leetcode: UsersFullData.leetcode,
        cses: UsersFullData.cses,

        facebook: UsersFullData.facebook,
        linkedIn: UsersFullData.linkedIn,
        twitter: UsersFullData.twitter,
        github: UsersFullData.github,
        telegram: UsersFullData.telegram,

        academicYear: UsersFullData.academicYear,
        graduationDate: UsersFullData.graduationDate,
      })
      .from(UsersFullData)
      .leftJoin(Users, eq(UsersFullData.userId, Users.userId))
      .where(eq(Users.username, username))
      .leftJoin(Countries, eq(UsersFullData.countryId, Countries.countryId))
      .leftJoin(Cities, eq(UsersFullData.cityId, Cities.cityId))
      .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
      .leftJoin(
        Departments,
        eq(UsersFullData.departmentId, Departments.departmentId),
      )
      .leftJoin(
        Communities,
        eq(UsersFullData.communityId, Communities.communityId),
      )
      .execute()
  )[0];
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
