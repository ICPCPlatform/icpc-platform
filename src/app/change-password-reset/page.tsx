import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ResetPassword } from "@/lib/db/schema/user/ResetPassword";
import { Users } from "@/lib/db/schema/user/Users";
import  bcrypt  from "bcrypt";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;
  console.log(token)
  const users = await db.select({ userId: ResetPassword.userId })
    .from(ResetPassword)
    .where(eq(ResetPassword.token, token))
    .execute();
  if (users.length === 0) {
    redirect("/login");
  }
  
  return (
    <>
      <h1>Change Password</h1>
      <form action={handleSubmit}>
        <input type="password" name="password" />
        <input type="password" name="confirmPassword" />
        <button type="submit">Change Password</button>
      </form>
    </>
  );
  async function handleSubmit(formData: FormData) {
    "use server"
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const [{userId}] = await db
      .select({ userId: ResetPassword.userId })
      .from(ResetPassword)
      .where(eq(ResetPassword.token, token))
      .execute();
    if (!userId) {
      console.log("Invalid token");
    }
    db.update(Users)
      .set({ password: await bcrypt.hash(password, 10) })
      .where(eq(Users.userId, userId))
      .execute();
  }
}
