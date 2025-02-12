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

export default function PersonList() {
  const form = useFormContext<z.infer<typeof userFullData>>();
  const personNamesList = [
    ["nameEnFirst", "First Name (English)"],
    ["nameEnLast", "Last Name (English)"],
    ["nameAR1", "First Name (Arabic)"],
    ["nameAR2", "Second Name (Arabic)"],
    ["nameAR3", "Third Name (Arabic)"],
    ["nameAR4", "Fourth Name (Arabic)"],
  ] as const;
  const countryOptions = userFullData.shape.country._def.innerType.options;
  return (
    <div>
      {personNamesList.map(([handle, viewText], index) => (
        <FormField
          key={index}
          control={form.control}
          name={handle}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{viewText}</FormLabel>
              <FormControl>
                <Input {...field} required={false} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <FormField
        control={form.control}
        name="nationalID"
        render={({ field }) => (
          <FormItem>
            <FormLabel>National ID</FormLabel>
            <FormControl>
              <Input {...field} required={false} pattern="^\d{14}$" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel> Country </FormLabel>
            <FormControl>
              <select {...field} defaultValue={"Egypt"}>
                {countryOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel> City </FormLabel>
            <FormControl>
              <Input {...field} required={false} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
