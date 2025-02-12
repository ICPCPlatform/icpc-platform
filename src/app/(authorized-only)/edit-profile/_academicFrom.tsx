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
import { userFullData } from "@/lib/validation/userFulldataValidations";
import { z } from "zod";

export default function AcademicForm() {
  const form = useFormContext<z.infer<typeof userFullData>>();
  const universityOptions =
    userFullData.shape.university._def.innerType.options;
  const facultyOptions = userFullData.shape.faculty._def.innerType.options;
  const departmentOptions =
    userFullData.shape.department._def.innerType.options;
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="university"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University</FormLabel>
            <FormControl>
              <select {...field} className="w-full p-2 border rounded-md">
                <option value="">Select your university</option>
                {universityOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>Select the university you are currently enrolled in or graduated from.</FormDescription>
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
            <FormControl>
              <select {...field} className="w-full p-2 border rounded-md">
                <option value="">Select your faculty</option>
                {facultyOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>Choose your faculty or college within the university.</FormDescription>
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
            <FormControl>
              <select {...field} className="w-full p-2 border rounded-md">
                <option value="">Select your department</option>
                {departmentOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>Select your specific department or major.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expected Graduation Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="w-full" />
            </FormControl>
            <FormDescription>Your expected or actual graduation date.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="academicYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Academic Year</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                min="1" 
                max="7" 
                placeholder="Enter your current year (1-7)"
                className="w-full"
              />
            </FormControl>
            <FormDescription>Your current year of study (1st year, 2nd year, etc.).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
