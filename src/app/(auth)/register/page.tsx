"use client";
import expectedBody from "@/app/api/auth/register/expectedBody";
import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Create Account</h1>
        <p className={styles.subtitle}>Join our competitive programming community</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="gmail">Email Address</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              required
              placeholder="01XXXXXXXXX"
              disabled={loading}
              pattern="^01[0125]\d{8}$"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="cfHandle">Codeforces Handle</label>
            <input
              type="text"
              id="cfHandle"
              name="cfHandle"
              required
              placeholder="Enter your Codeforces handle"
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
              placeholder="Choose a strong password"
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
          Already have an account? <Link href="/login">Sign in</Link>
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
    console.log(data);

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
