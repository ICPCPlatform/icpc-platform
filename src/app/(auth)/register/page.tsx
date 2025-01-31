"use client";
import expectedBody from "@/app/api/auth/register/expectedBody";
import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("google sing");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Create Account</h1>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
          disabled={loading}
        >
          <Image src={"google.svg"} alt="google-icon" width={24} height={24} />
          Continue with Google
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="omar2"
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="Omar"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Abbas"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="omar_abbas@example.com"
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">phone number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              required
              placeholder="01001001000"
              disabled={loading}
              pattern="^01[0125]\d{8}$"
            />
          </div>

          {/* cfHandle */}

          <div className={styles.inputGroup}>
            <label htmlFor="cfHandle">codeforces handle</label>
            <input
              type="text"
              id="cfHandle"
              name="cfHandle"
              required
              placeholder="mohamed_reda"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              minLength={8}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <p className={styles.loginLink}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return; // don't flod with requestes
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { success, data: payload } = expectedBody.safeParse(data);

    if (!success) {
      setError("Invalid input");
      setLoading(false);
      return;
    }

    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .then(async (response) => {
        if (!response) return;

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Failed to register");
          return;
        }
        setSuccess("Account created successfully! Redirecting to profile...");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}
