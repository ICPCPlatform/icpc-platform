"use server";
import "server-only";
import { db } from "@/lib/db";
import { Cities } from "@/lib/db/schema/user/Cities";
import { Countries } from "@/lib/db/schema/user/Countries";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { Users } from "@/lib/db/schema/user/Users";
import { eq } from "drizzle-orm";
import { Departments } from "@/lib/db/schema/user/Departments";
import { Communities } from "@/lib/db/schema/user/Communities";
import { type UserProfile } from "@/lib/types/userProfileType";
import { Institutes } from "@/lib/db/schema/user/Institutes";
import { faculties } from "@/lib/const";
import { Faculties } from "@/lib/db/schema/user/Faculties";

export async function getUserFullData<
  T extends
    | {
        username: string;
      }
    | {
        userId: string;
      },
    U extends (T extends { username: string } ? true : false)
>(
  ident: T
): Promise<UserProfile<U> | null> {
  const comp =
    "username" in ident
      ? eq(Users.username, ident.username)
      : eq(Users.userId, ident.userId);
  const userData : UserProfile<false> | null =
    (
      await db
        .select({
          username: Users.username,
          imageUrl: UsersFullData.imageUrl,
          gmail: Users.gmail,
          createdAt: UsersFullData.registrationDate,

          country: Countries.countryName,
          city: Cities.cityName,
          institute: Institutes.instituteName,
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
          visibilityMask: UsersFullData.visibilityMask,
        })
        .from(UsersFullData)
        .leftJoin(Countries, eq(UsersFullData.countryId, Countries.countryId))
        .leftJoin(Cities, eq(UsersFullData.cityId, Cities.cityId))
        .leftJoin(Users, eq(UsersFullData.userId, Users.userId))
        .leftJoin(Institutes, eq(UsersFullData.cityId, Institutes.instituteId))
        .leftJoin(Faculties, eq(UsersFullData.userId, Faculties.facultyId))
        .leftJoin(
          Departments,
          eq(UsersFullData.departmentId, Departments.departmentId)
        )
        .leftJoin(
          Communities,
          eq(UsersFullData.communityId, Communities.communityId)
        )
        .where(comp)
        .execute()
    )[0] ?? null ;
  if (userData === null) return null;
  if ("username" in ident) {
    //TODO: check visibility
  }
  return userData as UserProfile<false>;
}
