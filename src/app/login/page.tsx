"use client";
import {redirect, useRouter} from "next/navigation";
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
import "@/styles/components/auth/auth.css";

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
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Please enter your credentials to continue
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
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
                      className="auth-input"
                    />
                  </FormControl>
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
                    <div className="auth-input-wrapper">
                      <Input
                        placeholder="strongpassword123"
                        {...field}
                        type={isPasswordVisible ? 'text' : 'password'}
                        className="auth-input"
                      />
                      <Button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent"
                      >
                        {isPasswordVisible ? <EyeOff className="text-muted-foreground" /> : <Eye className="text-muted-foreground" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
            {error && (
              <div className="auth-error">
                <XCircle className="mr-2" />
                {error}
              </div>
            )}
            {success && (
              <div className="auth-success">
                <CheckCircle className="mr-2" />
                {success}
              </div>
            )}
          </form>
        </Form>
        <p className="auth-link">
          Don't have an account?{" "}
          <Link href="/register" className="auth-link-text">
            Sign up
          </Link>
        </p>
        <p className="auth-link">
          Forgot your password?{" "}
          <Link href="/reset-password" className="auth-link-text">
            Reset it here
          </Link>
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
