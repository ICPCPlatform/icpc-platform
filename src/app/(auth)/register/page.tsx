"use client";
import expectedBody from "@/app/api/auth/register/expectedBody";
import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof expectedBody>>({
    resolver: zodResolver(expectedBody),
    defaultValues: {
      username: "",
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-11">
      <Card style={{ width: 350 }}>
        <h1>Create Account</h1>
        <p className={styles.subtitle}>
          Join our competitive programming community
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username123" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gmail</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    this is your email address. only gmail is allowed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cfHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>codeforces handle</FormLabel>
                  <FormControl>
                    <Input placeholder="mohamed_reda" {...field} />
                  </FormControl>
                  <FormDescription>this is your phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="01001001000" {...field} />
                  </FormControl>
                  <FormDescription>this is your phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*****" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  at least 8 characters with a mix of letters, numbers, and
                  symbols.
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*****" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button type="submit">Create Account</Button>
          </form>
        </Form>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <p className={styles.loginLink}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );

  async function onSubmit(data: z.infer<typeof expectedBody>) {
    setError("");
    setSuccess("");

    if (!success) {
      setError("Invalid input");
      return;
    }

    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
      });
  }
}
