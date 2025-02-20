"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
  const username = searchParams.get("username") ?? "";
  const form = useForm<z.infer<typeof userLoginValid>>({
    resolver: zodResolver(userLoginValid),
    defaultValues: {
      username,
    },
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Please enter your credentials to continue
        </p>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username123"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2"
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
                      className="mt-1 border border-gray-300 rounded-md p-2"
                    />
                    {/* for the memes */}
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <p className="text-sm text-center mt-6">
          Don{"'"}t have an account?{" "}
          <Link href="/register" className="text-primary">
            Sign up
          </Link>
        </p>
      </Card>
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
        router.push("/profile");
      }
    });
  }
}
