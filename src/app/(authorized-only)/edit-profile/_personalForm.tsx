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
  
  const personalFields = [
    { name: "nameEnFirst", label: "First Name (English)" },
    { name: "nameEnLast", label: "Last Name (English)" },
    { name: "nameAR1", label: "First Name (Arabic)" },
    { name: "nameAR2", label: "Second Name (Arabic)" },
    { name: "nameAR3", label: "Third Name (Arabic)" },
    { name: "nameAR4", label: "Last Name (Arabic)" },
  ] as const;
  
  const countryOptions = userFullData.shape.country._def.innerType.options;
  return (
    <div className="space-y-4">
      {personalFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Input {...formField} required={false} />
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
            <FormLabel>National ID Number</FormLabel>
            <FormControl>
              <Input {...field} required={false} pattern="^\d{14}$" placeholder="14 digits national ID" />
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
            <FormLabel>Country of Residence</FormLabel>
            <FormControl>
              <select {...field} className="w-full p-2 border rounded-md">
                <option value="">Select a country</option>
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
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} required={false} placeholder="Enter your city" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
