import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const user: typeof Users.$inferInsert = await request.json();
  user.password = await bcrypt.hash(user.password, process.env.HASH_SALT ?? 10);
  db.insert(Users).values(user).execute();
  return Response.redirect("/");
}
