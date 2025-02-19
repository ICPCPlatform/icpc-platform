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
import { UserProfile } from "@/lib/types/userProfileType";

export async function getUserFullData<
  T extends
    | {
        username: string;
      }
    | {
        userId: string;
      },
>(
  ident: T,
): Promise<UserProfile<T extends { username: string } ? true : false> | null> {
  const comp =
    "username" in ident
      ? eq(Users.username, ident.username)
      : eq(Users.userId, ident.userId);
  const userData =
    (
      await db
        .select({
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
          visibilityMask: UsersFullData.visibilityMask,
        })
        .from(UsersFullData)
        .leftJoin(Users, eq(UsersFullData.userId, Users.userId))
        .where(comp)
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
    )[0] ?? null;



  return userData
}
