import styles from "./page.module.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const iconSize = "text-xl";

export default async function Home() {
  const cookie = await cookies();
  const isLoggedIn = !!cookie.get("session");
  return (
    <div className="container mx-auto px-4">

      <main className="mt-8 text-center">
        <section className="py-16">
          <TypographyH1>Welcome</TypographyH1>
          <p className="mt-4 text-lg">
            Elevate your skills with our structured training and community support.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/register">
              <Button variant="default" className="flex items-center space-x-1">
                <FaUserPlus className={iconSize} />
                <span>Get Started</span>
              </Button>
            </Link>
            {isLoggedIn ? (
              <Button variant="secondary" className="flex items-center space-x-1 ml-4" onClick={async () => {
                "use server";
                const cookie = await cookies();
                cookie.delete("session");
                redirect("/");
              }}>
                <FaSignOutAlt className={iconSize} />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="secondary" className="flex items-center space-x-1 ml-4">
                  <FaSignInAlt className={iconSize} />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </section>

        <section className="py-16">
          <TypographyH2>Join Our Community</TypographyH2>
          <p className="mt-4">
            Connect with fellow programmers and enhance your skills.
          </p>
        </section>
      </main>

      <footer className="py-8 text-center">
        <p>© {new Date().getFullYear()} ICPC Training Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
