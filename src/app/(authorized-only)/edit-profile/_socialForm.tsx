"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userFullData } from "@/validation/user-fulldata-validations";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export default function SocialForm() {
  const form = useFormContext<z.infer<typeof userFullData>>();
  const socialList = ["facebook", "linkedIn", "twitter", "github"] as const;
  return (
    <div>
      {socialList.map((handle, index) => (
        <FormField
          key={index}
          control={form.control}
          name={handle}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{handle}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
