import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ResetPassword } from "@/lib/db/schema/user/ResetPassword";
import { redirect } from "next/navigation";
import { FromReset } from "./_ResetPasswordForm";

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

  return <FromReset token={token} />;
}

