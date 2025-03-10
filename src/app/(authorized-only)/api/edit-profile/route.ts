import { db } from "@/lib/db";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { type userData } from "@/lib/session";
import authOnly from "@/middelwares/authOnly";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { userFullDataValid as userFulldataValidations } from "@/lib/validation/userFulldataValidations";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { Departments } from "@/lib/db/schema/user/Departments";
import { Cities } from "@/lib/db/schema/user/Cities";
import { Countries } from "@/lib/db/schema/user/Countries";
import { Institutes } from "@/lib/db/schema/user/Institutes";
import { Faculties } from "@/lib/db/schema/user/Faculties";
import { Communities } from "@/lib/db/schema/user/Communities";

async function POSTfn(request: NextRequest, user: userData) {
  try {
    const { success, data } = userFulldataValidations.safeParse(
      await request.json(),
    );
    if (!success) {
      return new NextResponse(null, { status: 400 });
    }
    const userFullData = await db
      .select()
      .from(UsersFullData)
      .where(eq(UsersFullData.userId, user.userId))
      .execute();
    if (userFullData.length === 0) {
      await db
        .insert(UsersFullData)
        .values({
          userId: user.userId,
        })
        .execute();
    }
    const cityId = await insertOrGetLookupTable(data.city, Cities);
    const countryId = await insertOrGetLookupTable(data.country, Countries);
    const instituteId = await insertOrGetLookupTable(
      data.institute,
      Institutes,
    );
    const facultyId = await insertOrGetLookupTable(data.faculty, Faculties);
    const departmentId = await insertOrGetLookupTable(
      data.department,
      Departments,
    );

    const communityId = await insertOrGetLookupTable(
      data.community,
      Communities,
    );
    const updateData = {
      ...data,
      cityId,
      countryId,
      instituteId,
      facultyId,
      departmentId,
      communityId,
    };
    await db
      .update(UsersFullData)
      .set(updateData)
      .where(eq(UsersFullData.userId, user.userId))
      .execute();
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
}

const POST = authOnly(POSTfn);
export { POST };

async function insertOrGetLookupTable<T extends AnyPgTable>(
  name: string | undefined,
  table: T,
): Promise<number | null> {
  if (name === undefined) return null;
  const res = await db
    .select()
    .from(table)
    // @ts-expect-error - unknown key
    .where(eq(table.name, name))
    .execute();

  if (res.length === 0) {
    const inserted = await db
      .insert(table)
      // @ts-expect-error - unknown key
      .values({ name: name })
      // @ts-expect-error - unknown key
      .returning({ id: table.id }) // Ensure ID column is returned properly
      .execute();

    return inserted[0].id;
  }

  return res[0].id as number;
}
