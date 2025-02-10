import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cookies } from "next/headers";
import { decryptSession, userData } from "@/lib/session";
import { redirect } from "next/navigation";
import UserProvider from "@/providers/user";
import "@/app/page.module.css";
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/NavBar';

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
  const user = validation as userData;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <Navbar />
          <UserProvider user={user}>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
