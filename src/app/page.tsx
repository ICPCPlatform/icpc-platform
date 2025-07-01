import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { FaUserPlus, FaSignInAlt, FaChalkboardTeacher } from "react-icons/fa";
import { getUserData } from "@/lib/session";

const iconSize = "text-xl";

export default async function Home() {
  const user = await getUserData();
  const isLoggedIn = !!user;
  let userName: string | null = null;

  if (isLoggedIn) {
    userName = user.username || null;
  }

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col justify-between">
      <main className="mt-8 text-center flex-1">
        <section className="flex flex-col items-center justify-center min-h-[60vh]">
          {isLoggedIn ? (
            <div className="w-full max-w-xl mx-auto">
              <Card className="shadow-lg border bg-card/90 dark:bg-card/80">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-primary mb-2">
                    Welcome{userName ? `, ${userName}` : ""}!
                  </CardTitle>
                  <p className="text-muted-foreground text-base md:text-lg">
                    Access all your trainings, track your progress, and start your journey to excellence.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center py-8">
                    <Link
                      href="/protected/trainings"
                      className={buttonVariants({ variant: "default", size: "lg" }) + " px-12 py-6 text-2xl font-bold flex items-center gap-4 shadow-lg"}
                    >
                      <FaChalkboardTeacher className="text-3xl" />
                      Go to Trainings
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
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
                <Link href="/login">
                  <Button
                    variant="secondary"
                    className="flex items-center space-x-1 ml-4"
                  >
                    <FaSignInAlt className={iconSize} />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>
        <section className="py-10 md:py-16">
          <TypographyH2>Join Our Community</TypographyH2>
          <p className="mt-4">
            Connect with fellow programmers and enhance your skills.
          </p>
        </section>
      </main>
      <footer className="py-8 text-center border-t bg-white/60 dark:bg-background mt-8">
        <p>
          © {new Date().getFullYear()} ICPC Training Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
