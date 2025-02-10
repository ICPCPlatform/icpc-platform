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
import { useFormContext } from "react-hook-form";
import { userFullData } from "@/validation/user-fulldata-validations";
import { z } from "zod";

export default function AcademicForm() {
  const form = useFormContext<z.infer<typeof userFullData>>();
  const universityOptions =
    userFullData.shape.university._def.innerType.options;
  const facultyOptions = userFullData.shape.faculty._def.innerType.options;
  const departmentOptions =
    userFullData.shape.department._def.innerType.options;
  return (
    <div>
      <FormField
        control={form.control}
        name="university"
        render={({ field }) => (
          <FormItem>
            <FormLabel>university</FormLabel>
            <br />
            <FormControl>
              <select {...field}>
                {universityOptions.map((option, index) => (
                  <option key={index} defaultValue={undefined} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>this is your academic year.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="faculty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faculty</FormLabel>
            <br />
            <FormControl>
              <select {...field}>
                {facultyOptions.map((option, index) => (
                  <option key={index} defaultValue={undefined} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>this is your faculty.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <br />
            <FormControl>
              <select {...field}>
                {departmentOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>this is your department.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>graduation year</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription>this is your department.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="academicYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>academic year</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>this is year you are in.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
