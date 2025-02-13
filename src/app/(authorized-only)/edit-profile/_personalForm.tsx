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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
              <FormLabel className="text-foreground">{field.label}</FormLabel>
              <FormControl>
                <Input 
                  {...formField} 
                  required={false}
                  className="bg-background text-foreground" 
                />
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
            <FormLabel className="text-foreground">National ID Number</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                required={false} 
                pattern="^\d{14}$" 
                placeholder="14 digits national ID"
                className="bg-background text-foreground" 
              />
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
            <FormLabel className="text-foreground">Country of Residence</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent 
                className="!bg-popover border shadow-md !z-[100]"
                style={{ 
                  backgroundColor: 'var(--background)',
                  backdropFilter: 'none',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">City</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                required={false} 
                placeholder="Enter your city"
                className="bg-background text-foreground" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
