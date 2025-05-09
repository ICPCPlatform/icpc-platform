"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userFullData } from "@/lib/validation/userFulldataValidations";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export default function HandlesForm() {
  const form = useFormContext<z.infer<typeof userFullData>>();
  const handles = [
    { id: "vjudge", label: "VJudge Handle", placeholder: "Enter your VJudge username" },
    { id: "atcoder", label: "AtCoder Handle", placeholder: "Enter your AtCoder username" },
    { id: "topcoder", label: "TopCoder Handle", placeholder: "Enter your TopCoder username" },
    { id: "spoj", label: "SPOJ Handle", placeholder: "Enter your SPOJ username" },
    { id: "codechef", label: "CodeChef Handle", placeholder: "Enter your CodeChef username" },
    { id: "csacademy", label: "CS Academy Handle", placeholder: "Enter your CS Academy username" },
    { id: "leetcode", label: "LeetCode Handle", placeholder: "Enter your LeetCode username" },
    { id: "cses", label: "CSES Handle", placeholder: "Enter your CSES username" },
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
                <Input {...field} placeholder={handle.placeholder} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
