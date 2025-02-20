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

export default function SocialForm() {
  const form = useFormContext<z.infer<typeof userFullDataValid>>();
  const socialProfiles = [
    {
      id: "facebook",
      label: "Facebook Profile",
      placeholder: "Enter your Facebook profile URL",
    },
    {
      id: "linkedIn",
      label: "LinkedIn Profile",
      placeholder: "Enter your LinkedIn profile URL",
    },
    {
      id: "twitter",
      label: "Twitter/X Profile",
      placeholder: "Enter your Twitter/X profile URL",
    },
    {
      id: "github",
      label: "GitHub Profile",
      placeholder: "Enter your GitHub profile URL",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {socialProfiles.map((profile) => (
        <FormField
          key={profile.id}
          control={form.control}
          name={profile.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{profile.label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={profile.placeholder}
                  className="w-full"
                  type="url"
                />
              </FormControl>
              <FormMessage >
                {form.formState.errors[profile.id]?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
