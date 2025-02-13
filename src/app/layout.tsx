import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { ThemeProvider } from "next-themes";
import { decryptSession } from "@/lib/session";
import { cookies } from "next/headers";
import UserProvider from "@/providers/user";

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
  const user = await decryptSession(session);
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <UserProvider user={user}>
            <Navbar />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
