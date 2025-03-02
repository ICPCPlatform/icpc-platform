import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ResetPassword } from "@/lib/db/schema/user/ResetPassword";
import { Users } from "@/lib/db/schema/user/Users";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).token as string;
  const users = await db
    .select({ userId: ResetPassword.userId })
    .from(ResetPassword)
    .where(eq(ResetPassword.token, token))
    .execute();
  if (users.length === 0) {
    redirect("/login");
  }
  async function handleSubmit(formData: FormData) {
    "use server";
    console.log("Change password");
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const token = formData.get("token") as string;
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    console.log(token);
    const  users  = await db
      .select({ userId: ResetPassword.userId })
      .from(ResetPassword)
      .where(eq(ResetPassword.token, token))
      .execute();
    console.log(users);
    if (!users) {
      console.log("Invalid token");
    }
    if (users.length === 0) {
      console.log("Invalid token");
    }
    const userId = users[0].userId;
    await db.update(Users)
      .set({ password: await bcrypt.hash(password, 10) })
      .where(eq(Users.userId, userId))
      .execute();
    await db.delete(ResetPassword).where(eq(ResetPassword.userId, userId)).execute();
    redirect("/login");

    
  }

  return (
    <>
      <h1>Change Password</h1>
      <form action={handleSubmit} method="post">
        <input type="password" name="password"  required />
        <input type="password" name="confirmPassword" required />
        <input type="hidden" name="token" value={token} />
        <button type="submit">Change Password</button>
      </form>
    </>
  );
}
