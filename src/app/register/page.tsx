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
      confirmPassword:"",
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground dark:bg-black dark:text-white">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-10 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center dark:text-gray-400">
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
                    <Input
                      placeholder="username123"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
              name="gmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gmail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
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
                    <Input
                      placeholder="mohamed_reda"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </FormControl>
                  <FormDescription>
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
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
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
                    <Input
                      type="password"
                      placeholder="*****"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </FormControl>
                  <FormDescription>
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
                                  className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              />
                          </FormControl>
                          <FormDescription>

                          </FormDescription>
                          <FormMessage />
                      </FormItem>
                  )}
              />
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        field.onChange(e);
                      }}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline">
                        terms of service
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md dark:bg-white dark:text-black"
              disabled={loading}
            >
              {loading ? "Loading..." : "Create Account"}
            </Button>
          </form>
        </Form>

        {error && (
          <p className="text-red-500 mt-4 text-center flex items-center">
            <XCircle className="mr-2" />
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 mt-4 text-center flex items-center">
            <CheckCircle className="mr-2" />
            {success}
          </p>
        )}

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary dark:text-white">
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
