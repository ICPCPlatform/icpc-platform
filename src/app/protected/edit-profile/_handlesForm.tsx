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
import { Eye, EyeOff, Terminal, Code } from "lucide-react";
import { useState } from "react";
import "@/styles/components/profile/profile-form.css";

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

  const [isAtcoderPublic, setIsAtcoderPublic] = useState(false);
  const [isCodechefPublic, setIsCodechefPublic] = useState(false);
  const [isLeetcodePublic, setIsLeetcodePublic] = useState(false);
  const [isCsesPublic, setIsCsesPublic] = useState(false);

  const handleIcons = {
    atcoder: <Terminal className="profile-form-icon" />,
    codechef: <Code className="profile-form-icon" />,
    leetcode: <Code className="profile-form-icon" />,
    cses: <Terminal className="profile-form-icon" />,
  };

  return (
    <div className="profile-form-section">
      {handles.map((handle) => (
        <FormField
          key={handle.id}
          control={form.control}
          name={handle.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="profile-form-label">
                {handleIcons[handle.id]}
                {handle.label}
              </FormLabel>
              <div className="profile-form-group">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={handle.placeholder}
                    className="profile-form-input"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => {
                    if (handle.id === "atcoder") setIsAtcoderPublic(!isAtcoderPublic);
                    if (handle.id === "codechef") setIsCodechefPublic(!isCodechefPublic);
                    if (handle.id === "leetcode") setIsLeetcodePublic(!isLeetcodePublic);
                    if (handle.id === "cses") setIsCsesPublic(!isCsesPublic);
                  }}
                  className="profile-form-visibility-btn"
                >
                  {(handle.id === "atcoder" && isAtcoderPublic) ||
                  (handle.id === "codechef" && isCodechefPublic) ||
                  (handle.id === "leetcode" && isLeetcodePublic) ||
                  (handle.id === "cses" && isCsesPublic) ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              <FormMessage>
                {form.formState.errors[handle.id]?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
