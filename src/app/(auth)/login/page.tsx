"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1> Login </h1>
        <form onSubmit={onSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="omar2"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="********"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200 || response.status === 307) {
        console.log("hi");
        router.push("/profile");
      }
    });
  }
}
