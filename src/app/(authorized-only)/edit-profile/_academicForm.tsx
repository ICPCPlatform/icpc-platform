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
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AcademicForm() {
  const form = useFormContext<z.infer<typeof userFullDataValid>>();
  const universityOptions =
    userFullDataValid.shape.institute._def.innerType.options;
  const facultyOptions = userFullDataValid.shape.faculty._def.innerType.options;
  const communitiesOptions = userFullDataValid.shape.community._def.innerType.options;
  const departmentOptions =
    userFullDataValid.shape.department._def.innerType.options;

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="institute"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">University</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your university" />
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
                {universityOptions.map((option) => (
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
            <FormDescription className="text-muted-foreground">
              Select the university you are currently enrolled in or graduated
              from.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="faculty"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Faculty</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your faculty" />
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
                {facultyOptions.map((option) => (
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
            <FormDescription className="text-muted-foreground">
              Choose your faculty or college within the university.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Department</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your department" />
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
                {departmentOptions.map((option) => (
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
            <FormDescription className="text-muted-foreground">
              Select your specific department or major.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="graduationDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              Expected Graduation Date
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                className="w-full bg-background text-foreground"
              />
            </FormControl>
            <FormDescription className="text-muted-foreground">
              Your expected or actual graduation date.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="academicYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              Current Academic Year
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                min="1"
                max="7"
                placeholder="Enter your current year (1-7)"
                className="w-full bg-background text-foreground"
              />
            </FormControl>
            <FormDescription className="text-muted-foreground">
              Your current year of study (1st year, 2nd year, etc.).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="community"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Department</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your department" />
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
                {communitiesOptions.map((option) => (
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
            <FormDescription className="text-muted-foreground">
              Select your specific department or major.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
