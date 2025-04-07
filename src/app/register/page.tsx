"use client";
import { userRegisterValid } from "@/lib/validation/userValidations";
import { useState } from "react";
import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { XCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof userRegisterValid>>({
    resolver: zodResolver(userRegisterValid),
    defaultValues: {
      username: "",
      gmail: "",
      cfHandle: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">
          Join our competitive programming community
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
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
                      className="auth-input"
                    />
                  </FormControl>
                  <FormDescription className="auth-form-description">
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
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      className="auth-input"
                    />
                  </FormControl>
                  <FormDescription className="auth-form-description">
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
                    <Input
                      placeholder="mohamed_reda"
                      {...field}
                      className="auth-input"
                    />
                  </FormControl>
                  <FormDescription className="auth-form-description">
                    This is your Codeforces handle.
                  </FormDescription>
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
                    <Input
                      placeholder="01001001000"
                      {...field}
                      className="auth-input"
                    />
                  </FormControl>
                  <FormDescription className="auth-form-description">
                    This is your phone number.
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
                      type="password"
                      placeholder="*****"
                      {...field}
                      className="auth-input"
                    />
                  </FormControl>
                  <FormDescription className="auth-form-description">
                    At least 8 characters with a mix of letters, numbers, and symbols.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*****"
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
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="auth-checkbox-wrapper">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        field.onChange(e);
                      }}
                      className="auth-checkbox"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{" "}
                      <Link href="/privacy-policy" className="auth-link-text">
                        terms of service
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Loading..." : "Create Account"}
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
          Already have an account?{" "}
          <Link href="/login" className="auth-link-text">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );

  async function onSubmit(data: z.infer<typeof userRegisterValid>) {
    setLoading(true);
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const res = await response.json();
        console.log(res);
        setLoading(false);
        if ("err" in res) return setError(res.err);
        else if ("msg" in res) {
          setSuccess(res.msg);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
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
