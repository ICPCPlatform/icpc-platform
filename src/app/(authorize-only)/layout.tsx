import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import { redirect } from "next/navigation";
import UserProvider from "@/providers/user";
import "@/app/page.module.css";

const inter = Inter({ subsets: ["latin"] });

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
    redirect("/login");
  }
  const user = validation as { userId: string; username: string; role: string };
  return (
    <html lang="en">
      <body className={inter.className}>
        <h1> {validation.userId} </h1>
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
