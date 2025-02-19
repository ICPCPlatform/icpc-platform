import "@/app/globals.css";

import Sidebar from "./_Sidebar";
import Profile from "./_Profile";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Users } from "@/lib/db/schema/user/Users";
import { Countries } from "@/lib/db/schema/user/Countries";
import { Cities } from "@/lib/db/schema/user/Cities";
import { Departments } from "@/lib/db/schema/user/Departments";
import { Communities } from "@/lib/db/schema/user/Communities";
import { redirect } from "next/navigation";
import { Faculties } from "@/lib/db/schema/user/Faculties";
import { Institutes } from "@/lib/db/schema/user/Institutes";

export type User = {
  username: string | null;
  imageUrl: string | null;
  gmail: string | null;
  createdAt: Date | null;
  country: string | null;
  city: string | null;
  department: string | null;
  community: string | null;
  faculty: string | null;
  nameAR1: string | null;
  nameAR2: string | null;
  nameAR3: string | null;
  nameAR4: string | null;
  firstNameEn: string | null;
  lastNameEn: string | null;
  codeforces: string | null;
  vjudge: string | null;
  atcoder: string | null;
  codechef: string | null;
  leetcode: string | null;
  cses: string | null;
  facebook : string | null;
  linkedIn: string | null;
  twitter: string | null;
  github: string | null;
  telegram: string | null;
  academicYear: number | null;
  graduationDate: string | null;
};
export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const validation = await decryptSession(session);
  if (!validation) return null;
  const { userId } = validation;
  const user =
    (
      await db
        .select({
          username: Users.username,
          imageUrl: UsersFullData.imageUrl,
          gmail: Users.gmail,
          createdAt: UsersFullData.registrationDate,

          country: Countries.countryName,
          city: Cities.cityName,
          department: Departments.departmentName,
          community: Communities.communityName,
          faculty: Faculties.facultyName,

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
        .where(eq(UsersFullData.userId, userId))
        .leftJoin(Users, eq(UsersFullData.userId, Users.userId))
        .leftJoin(Countries, eq(UsersFullData.countryId, Countries.countryId))
        .leftJoin(Cities, eq(UsersFullData.cityId, Cities.cityId))
        .leftJoin(
          Departments,
          eq(UsersFullData.departmentId, Departments.departmentId),
        )
        .leftJoin(
          Communities,
          eq(UsersFullData.communityId, Communities.communityId),
        )
        .leftJoin(Faculties, eq(UsersFullData.facultyId, Faculties.facultyId))
        .leftJoin(Institutes, eq(UsersFullData.instituteId, Institutes.instituteId))
        .execute()
    )[0] ?? null;
  if (!user) redirect("/404");

  return (
    <div className="container mx-auto p-4 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Profile user={user} className="w-full lg:flex-[3]" allowEdit />
        <Sidebar className="w-full lg:w-[320px] lg:self-start" />
      </div>
    </div>
  ); }
