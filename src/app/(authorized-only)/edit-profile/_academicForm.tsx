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
import { Eye, EyeOff, GraduationCap, Building, Calendar, Layers, Users } from "lucide-react";
import { useState } from "react";

export default function AcademicForm() {
  const form = useFormContext<z.infer<typeof userFullDataValid>>();
  const universityOptions =
    userFullDataValid.shape.institute._def.innerType.options;
  const facultyOptions = userFullDataValid.shape.faculty._def.innerType.options;
  const communitiesOptions = userFullDataValid.shape.community._def.innerType.options;
  const departmentOptions =
    userFullDataValid.shape.department._def.innerType.options;

  const [isInstitutePublic, setIsInstitutePublic] = useState(false);
  const [isFacultyPublic, setIsFacultyPublic] = useState(false);
  const [isCommunityPublic, setIsCommunityPublic] = useState(false);
  const [isDepartmentPublic, setIsDepartmentPublic] = useState(false);
  const [isGraduationDatePublic, setIsGraduationDatePublic] = useState(false);
  const [isAcademicYearPublic, setIsAcademicYearPublic] = useState(false);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="institute"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground flex items-center">
              <Building className="mr-2 h-4 w-4" />
              University
            </FormLabel>
            <div className="flex items-center space-x-2">
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
                  }}
                >
                  {universityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setIsInstitutePublic(!isInstitutePublic)}
                className="text-muted-foreground"
              >
                {isInstitutePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
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
            <FormLabel className="text-foreground flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              Faculty
            </FormLabel>
            <div className="flex items-center space-x-2">
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
                  }}
                >
                  {facultyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setIsFacultyPublic(!isFacultyPublic)}
                className="text-muted-foreground"
              >
                {isFacultyPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
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
            <FormLabel className="text-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Department
            </FormLabel>
            <div className="flex items-center space-x-2">
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
                  }}
                >
                  {departmentOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setIsDepartmentPublic(!isDepartmentPublic)}
                className="text-muted-foreground"
              >
                {isDepartmentPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
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
            <FormLabel className="text-foreground flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Expected Graduation Date
            </FormLabel>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="w-full bg-background text-foreground"
                />
              </FormControl>
              <button
                type="button"
                onClick={() => setIsGraduationDatePublic(!isGraduationDatePublic)}
                className="text-muted-foreground"
              >
                {isGraduationDatePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
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
            <FormLabel className="text-foreground flex items-center">
              <GraduationCap className="mr-2 h-4 w-4" />
              Current Academic Year
            </FormLabel>
            <div className="flex items-center space-x-2">
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
              <button
                type="button"
                onClick={() => setIsAcademicYearPublic(!isAcademicYearPublic)}
                className="text-muted-foreground"
              >
                {isAcademicYearPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
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
            <FormLabel className="text-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Community
            </FormLabel>
            <div className="flex items-center space-x-2">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your community" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  className="!bg-popover border shadow-md !z-[100]"
                  style={{
                    backgroundColor: "var(--background)",
                    backdropFilter: "none",
                  }}
                >
                  {communitiesOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setIsCommunityPublic(!isCommunityPublic)}
                className="text-muted-foreground"
              >
                {isCommunityPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="text-muted-foreground">
              Select your specific community or group.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
