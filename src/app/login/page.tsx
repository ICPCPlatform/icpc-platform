"use client";
import { redirect, useRouter } from "next/navigation";
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
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useUserContext } from "@/providers/user";

export default function Page() {
  const user  = useUserContext();
  if (user) return redirect("/protected/profile");
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
  const [success, setSuccess] = useState("");
  const username = searchParams.get("username") ?? "";
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof userLoginValid>>({
    resolver: zodResolver(userLoginValid),
    defaultValues: {
      usernameOrGmail: username ?? "",
      password: ""
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
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username or email"
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
                    <div className="relative">
                      <Input
                        placeholder="strongpassword123"
                        {...field}
                        type={isPasswordVisible ? 'text' : 'password'}
                        className="mt-1 border border-gray-300 rounded-md p-2 pr-10 dark:border-gray-600 dark:text-white"
                      />
                      <Button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none hover:bg-transparent text-gray-600 dark:text-gray-300"
                      >
                        {isPasswordVisible ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md dark:bg-white dark:text-black"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
            {error && (
              <p className="text-red-500 mt-4 text-center flex items-center">
                <XCircle className="mr-2" />
                {form.formState.errors.root?.message || error}
              </p>
            )}
            {success && (
              <p className="text-green-500 mt-4 text-center flex items-center">
                <CheckCircle className="mr-2" />
                {success}
              </p>
            )}
          </form>
        </Form>
        <p className="text-sm text-center mt-6">
          Don{"'"}t have an account?{" "}
          <Link href="/register" className="text-primary dark:text-white">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-center mt-4">
          Forgot your password? <Link href="/reset-password" className="text-primary dark:text-white">Reset it here</Link>
        </p>
      </Card>
    </div>
  );

  async function onSubmit(data: z.infer<typeof userLoginValid>) {
    setLoading(true);
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
        const res = await response.json();
        console.log(res);
        setLoading(false);
        if ("err" in res) return setError(res.err);
        else if ("msg" in res) {
          router.push("/protected/profile");
        }
      })
      .catch(async (err) => {
        const res = await err.json();
        console.log(res);
        setLoading(false);
        if ("err" in res) return setError(res.err);
        else if ("msg" in res) return setSuccess(res.msg);
      });
  }
}
