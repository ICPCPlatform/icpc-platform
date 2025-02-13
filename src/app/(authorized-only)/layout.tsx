import type { Metadata } from "next";
import "@/app/globals.css";
import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import { redirect } from "next/navigation";
import "@/app/page.module.css";

export const metadata: Metadata = {
  title: "ICPC Platform",
  description: "A platform for managing ICPC-style programming competitions",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const validation = await decryptSession(session);
  if (!validation) {
    // is not logged in
    redirect("/login");
  }
  return <> {children} </>;
}
