import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { decryptSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const trainingId = decodeURIComponent((await params).trainingId);
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const validated = await decryptSession(sessionCookie ?? "");
  if (!validated) {
    redirect("/login");
  }

  const { userId } = validated;
  const permissions = await getUserTrainingPermissions(
    userId,
    Number(trainingId),
  );
  console.log(permissions);

  if (permissions.length === 0) {
    redirect("/404");
  }
  return <>
    <h1> omarr</h1>
    <div>
      aSDklJw lkjKL
    </div>
  </>
}
