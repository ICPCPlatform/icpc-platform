"use client";
import { resetPasswordValid } from "@/lib/validation/resetPassword";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPasswordAction } from "./_ResetPasswordAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FromReset({ token }: { token: string }) {
  // note: token is ingected into the server action call
  const form = useForm<z.infer<typeof resetPasswordValid>>({
    resolver: zodResolver(resetPasswordValid),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token,
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground dark:bg-black dark:text-white">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-10 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center dark:text-gray-400">
          Join our competitive programming community
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => {
              const req = { ...e, token };
              console.log("req", req);
              resetPasswordAction(e);
            })}
            className="space-y-6"
          >
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
                    At least 8 characters with a mix of letters, numbers, and
                    symbols.
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
                    Please confirm your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="*****"
                      {...field}
                      className="mt-1 border border-gray-300 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      defaultValue={token}
                      hidden={true}
                      value={token}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

              />
            {form.formState.errors && <p className="text-sm text-muted-foreground mb-6 text-center dark:text-gray-400">
            </p>}
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md dark:bg-white dark:text-black"
            >
              Update Password
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
