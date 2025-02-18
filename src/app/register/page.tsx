"use client";
import { userRegisterValid } from "@/lib/validation/userValidations"
import { useState } from "react";
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
  const form = useForm<z.infer<typeof userRegisterValid>>({
    resolver: zodResolver(userRegisterValid),
    defaultValues: {
      username: "",
    },
  });



  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Join our competitive programming community
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username123" {...field} className="mt-1 border border-gray-300 rounded-md p-2" />
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
                    <Input placeholder="example@gmail.com" {...field} className="mt-1 border border-gray-300 rounded-md p-2" />
                  </FormControl>
                  <FormDescription>
                    This is your email address. Only Gmail is allowed.
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
                  <FormLabel>Codeforces Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="mohamed_reda" {...field} className="mt-1 border border-gray-300 rounded-md p-2" />
                  </FormControl>
                  <FormDescription>This is your Codeforces handle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="01001001000" {...field} className="mt-1 border border-gray-300 rounded-md p-2" />
                  </FormControl>
                  <FormDescription>This is your phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*****" {...field} className="mt-1 border border-gray-300 rounded-md p-2" />
                  </FormControl>
                  <FormDescription>
                    At least 8 characters with a mix of letters, numbers, and symbols.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-black text-white py-2 rounded-md">Create Account</Button>
          </form>
        </Form>

        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        {success && <div className="text-green-500 mt-4 text-center">{success}</div>}

        <p className="text-sm text-center mt-6">
          Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
        </p>
      </Card>
    </div>
  );

  async function onSubmit(data: z.infer<typeof userRegisterValid>) {
    setError("");
    setSuccess("");

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
