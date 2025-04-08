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
import { Eye, EyeOff, Facebook, Linkedin, Twitter, Github } from "lucide-react";
import { useState } from "react";

const socialIcons = {
  facebook: <Facebook className="profile-form-icon" />,
  linkedIn: <Linkedin className="profile-form-icon" />,
  twitter: <Twitter className="profile-form-icon" />,
  github: <Github className="profile-form-icon" />,
};

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

  const [isFacebookPublic, setIsFacebookPublic] = useState(false);
  const [isLinkedInPublic, setIsLinkedInPublic] = useState(false);
  const [isTwitterPublic, setIsTwitterPublic] = useState(false);
  const [isGithubPublic, setIsGithubPublic] = useState(false);

  return (
    <div className="profile-form-section">
      {socialProfiles.map((profile) => (
        <FormField
          key={profile.id}
          control={form.control}
          name={profile.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="profile-form-label">
                {socialIcons[profile.id]}
                {profile.label}
              </FormLabel>
              <div className="profile-form-group">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={profile.placeholder}
                    className="profile-form-input"
                    type="url"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => {
                    if (profile.id === "facebook") setIsFacebookPublic(!isFacebookPublic);
                    if (profile.id === "linkedIn") setIsLinkedInPublic(!isLinkedInPublic);
                    if (profile.id === "twitter") setIsTwitterPublic(!isTwitterPublic);
                    if (profile.id === "github") setIsGithubPublic(!isGithubPublic);
                  }}
                  className="profile-form-visibility-btn"
                >
                  {(profile.id === "facebook" && isFacebookPublic) ||
                  (profile.id === "linkedIn" && isLinkedInPublic) ||
                  (profile.id === "twitter" && isTwitterPublic) ||
                  (profile.id === "github" && isGithubPublic) ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              <FormMessage>
                {form.formState.errors[profile.id]?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
