"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { gmail } from "@/lib/validation/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  gmail,
});

export default function Page() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      gmail: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
              name="gmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gmail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your gmail"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormDescription>
                    enter your gmail to reset your password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md dark:bg-white dark:text-black"
            >
              Sign In
            </Button>

            {error && (
              <div className="text-red-500 mt-4 text-center error-message">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 mt-4 text-center">{success}</div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );

  async function onSubmit(data: z.infer<typeof validationSchema>) {
    fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const res = await response.json();
        console.log(res)
        if ("err" in res) return setError(res.err);
        else if ("msg" in res) return setSuccess(res.msg);
      })
      .catch(async(response) => {
        const res = await response.json();
        console.log(res)
        if ("err" in res) return setError(res.err);
        else if ("msg" in res) return setSuccess(res.msg);
        // console.error("Error:", error);
      });
  }
}
