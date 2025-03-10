"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, User, IdCard, Globe, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import React from "react";

export default function PersonList() {
  const form = useFormContext<z.infer<typeof userFullDataValid>>();

  const personalFields = [
    { name: "firstNameEn", label: "First Name (English)" },
    { name: "lastNameEn", label: "Last Name (English)" },
    { name: "nameAR1", label: "First Name (Arabic)" },
    { name: "nameAR2", label: "Second Name (Arabic)" },
    { name: "nameAR3", label: "Third Name (Arabic)" },
    { name: "nameAR4", label: "Last Name (Arabic)" },
  ] as const;

  const countryOptions = userFullDataValid.shape.country._def.innerType.options;

  const [isEnglishNamePublic, setIsEnglishNamePublic] = useState(false);
  const [isArabicNamePublic, setIsArabicNamePublic] = useState(false);
  const [isNationalIdPublic, setIsNationalIdPublic] = useState(false);
  const [isCountryPublic, setIsCountryPublic] = useState(false);
  const [isCityPublic, setIsCityPublic] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
    event.preventDefault();
    form.handleSubmit(
      () => {
        toast.success("Changes saved successfully!");
      },
      () => {
        toast.error("Please fix the errors before saving.");
      }
    )();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex space-x-4 items-center">
          {personalFields.slice(0, 2).map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      required={false}
                      className="bg-background text-foreground"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsEnglishNamePublic(!isEnglishNamePublic)}
            className="text-muted-foreground"
          >
            {isEnglishNamePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex space-x-4 items-center">
          {personalFields.slice(2).map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      required={false}
                      className="bg-background text-foreground"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsArabicNamePublic(!isArabicNamePublic)}
            className="text-muted-foreground"
          >
            {isArabicNamePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>

        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground flex items-center">
                <IdCard className="mr-2 h-4 w-4" />
                National ID Number
              </FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input
                    {...field}
                    required={false}
                    placeholder="14 digits national ID"
                    className="bg-background text-foreground"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setIsNationalIdPublic(!isNationalIdPublic)}
                  className="text-muted-foreground"
                >
                  {isNationalIdPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                Country of Residence
              </FormLabel>
              <div className="flex items-center space-x-2">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="!bg-popover border shadow-md !z-[100]"
                    style={{
                      backgroundColor: "var(--background)",
                      backdropFilter: "none",
                      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {countryOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="hover:bg-accent focus:bg-accent"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => setIsCountryPublic(!isCountryPublic)}
                  className="text-muted-foreground"
                >
                  {isCountryPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                City
              </FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input
                    {...field}
                    required={false}
                    placeholder="Enter your city"
                    className="bg-background text-foreground"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setIsCityPublic(!isCityPublic)}
                  className="text-muted-foreground"
                >
                  {isCityPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
}
