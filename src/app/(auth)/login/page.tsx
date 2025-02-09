"use client";
import styles from "../page.module.css";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense,} from "react";

export default function LoginPage() {
    return <Suspense >
        <Login/>
    </Suspense>


}

function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get("username")?? "";

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1>Welcome Back</h1>
                <p className={styles.subtitle}>
                    Please enter your credentials to continue
                </p>
                <form onSubmit={onSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            defaultValue={username}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Sign In
                    </button>
                </form>
                <p className={styles.loginLink}>
                    Don{"'"}t have an account? <Link href="/register">Sign up</Link>
                </p>
            </div>
        </div>
    )

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
                router.push("/profile");
            }
        });
    }
}
