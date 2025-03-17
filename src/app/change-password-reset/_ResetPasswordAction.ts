"use server";
import { db } from "@/lib/db";
import { ResetPassword } from "@/lib/db/schema/user/ResetPassword";
import { resetPasswordValid } from "@/lib/validation/resetPassword";
import { eq } from "drizzle-orm";
import { Users } from "@/lib/db/schema/user/Users";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function resetPasswordAction(
  submitData: z.infer<typeof resetPasswordValid>,
) {
  "use server";
  const { password, confirmPassword, token } = submitData;
  if (password !== confirmPassword) {
    console.log("Passwords do not match");
    return;
  }
  console.log("Token:", token);
  const users = await db
    .select({ userId: ResetPassword.userId })
    .from(ResetPassword)
    .where(eq(ResetPassword.token, token))
    .execute();
  if (users.length === 0) {
    console.log("Invalid token");
    return;
  }
  const userId = users[0].userId;
  await db
    .update(Users)
    .set({ password: await bcrypt.hash(password, 10) })
    .where(eq(Users.userId, userId))
    .execute();
  await db
    .delete(ResetPassword)
    .where(eq(ResetPassword.userId, userId))
    .execute();
  redirect("/login");
}
