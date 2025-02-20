"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export default function HandlesForm() {
  const form = useFormContext<z.infer<typeof userFullDataValid>>();
  const handles = [
    {
      id: "atcoder",
      label: "AtCoder Handle",
      placeholder: "Enter your AtCoder username",
    },
    {
      id: "codechef",
      label: "CodeChef Handle",
      placeholder: "Enter your CodeChef username",
    },
    {
      id: "leetcode",
      label: "LeetCode Handle",
      placeholder: "Enter your LeetCode username",
    },
    {
      id: "cses",
      label: "CSES Handle",
      placeholder: "Enter your CSES username",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {handles.map((handle) => (
        <FormField
          key={handle.id}
          control={form.control}
          name={handle.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{handle.label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={handle.placeholder}
                  className="w-full"
                />
              </FormControl>
              {form.formState.errors[handle.id]?.message}
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
