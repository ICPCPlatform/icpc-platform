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

export default function PersonList() {
  const form = useFormContext<z.infer<typeof userFullData>>();
  const personNamesList = [
    "nameEnFirst",
    "nameEnLast",
    "NameAR1",
    "NameAR2",
    "NameAR3",
    "NameAR4",
  ] as const ;
  const countryOptions = userFullData.shape.countryName.options;
  return (
    <div>
      {personNamesList.map((handle, index) => (
        <FormField
          key={index}
          control={form.control}
          name={handle}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{handle}</FormLabel>
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
        name="nationalId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>national Id</FormLabel>
            <FormControl>
              <Input {...field} required={false} pattern="^\d{14}$" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="countryName"
        render={({ field }) => (
          <FormItem>
            <FormLabel> country </FormLabel>
            <FormControl>
              <select {...field}>
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
              <FormLabel>city</FormLabel>
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
