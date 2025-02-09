import styles from "./page.module.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
export default async function Home() {
  const cookie = await cookies();
  const isLoggedIn = !!cookie.get("session");
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <TypographyH1>Welcome to ICPC Training Platform</TypographyH1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Elevate your competitive programming skills with structured
            training, real-time contests, and a supportive community of problem
            solvers.
          </p>
          <div className={styles.ctas}>
            <Link
              href="/register"
              className={`${styles.cta} ${styles.primary}`}
            >
              Get Started
            </Link>
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  "use server";
                  const cookie = await cookies();
                  cookie.delete("session");
                  redirect("/");
                }}
                className={`${styles.cta} ${styles.secondary}`}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className={`${styles.cta} ${styles.secondary}`}
              >
                Sign In
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <TypographyH2 >
            Why Choose Our Platform?
          </TypographyH2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>Structured Learning</h3>
              <p>
                Carefully crafted training paths from beginner to advanced
                levels
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏆</div>
              <h3>Practice Contests</h3>
              <p>
                Regular contests to test your skills in real competition
                settings
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Community Support</h3>
              <p>
                Connect with fellow programmers and learn from experienced
                mentors
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Progress Tracking</h3>
              <p>
                Monitor your improvement with detailed performance analytics
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className={styles.joinSection}>
          <TypographyH2>Ready to Begin Your Journey?</TypographyH2>
          <p>
            Join thousands of programmers who are already improving their skills
          </p>
          <Link href="/register" className={`${styles.cta} ${styles.primary}`}>
            Create Your Account
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
            <a href="mailto:icpcplatform@gmail.com">Support</a>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ICPC Training Platform. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
