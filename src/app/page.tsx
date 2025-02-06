import styles from "./page.module.css";
import Link from "next/link";
import { cookies } from "next/headers";
export default async function Home() {
  const cookie = await cookies();
  const isLoggedIn = !!cookie.get("session");
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Welcome to ICPC Training Platform</h1>
          <p className={styles.heroText}>
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
                onClick={() => {
                  window.location.reload();
                }}
                className={`${styles.cta} ${styles.secondary}`} />
            ) : (
              <Link
                href="/login"
                className={`${styles.cta} ${styles.secondary}`}
              ></Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Why Choose Our Platform?</h2>
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
          <h2>Ready to Begin Your Journey?</h2>
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
