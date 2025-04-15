import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { ThemeProvider } from "next-themes";
import {  getUserData } from "@/lib/session";
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
  const user = await getUserData();
  return (
    <html lang="en" suppressHydrationWarning={true}>
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
