"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userLoginValid } from "@/lib/validation/userLogin";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const username = searchParams.get("username") ?? "";
  const form = useForm<z.infer<typeof userLoginValid>>({
    resolver: zodResolver(userLoginValid),
    defaultValues: {
      usernameOrGmail: username ?? "",
    },
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground dark:bg-black dark:text-white">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-10 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center dark:text-gray-400">
          Please enter your credentials to continue
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="usernameOrGmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username123"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:text-white"
                    />
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="strongpassword123"
                      {...field}
                      type="password"
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600  dark:text-white"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage id="cow" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md dark:bg-white dark:text-black"
            >
              Sign In
            </Button>
            <p className="text-sm text-center error-messages">
              {form.formState.errors.root?.message || error}
              
            </p>
          </form>
        </Form>
        <p className="text-sm text-center mt-6">
          Don{"'"}t have an account?{" "}
          <Link href="/register" className="text-primary dark:text-white">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );

  async function onSubmit(data: z.infer<typeof userLoginValid>) {

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (response.status === 200 || response.status === 307) {
          router.push("/profile");
        }
        const res = await response.json();
        setError(res.error);
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
