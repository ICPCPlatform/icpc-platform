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
    <div className="profile-form-container">
      <FormField
        control={form.control}
        name="institute"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="profile-form-label">
              <Building className="profile-form-icon" />
              University
            </FormLabel>
            <div className="profile-form-group">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="profile-form-select">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="profile-form-select-content">
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
                className="profile-form-visibility-btn"
              >
                {isInstitutePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="profile-form-description">
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
            <FormLabel className="profile-form-label">
              <Layers className="profile-form-icon" />
              Faculty
            </FormLabel>
            <div className="profile-form-group">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="profile-form-select">
                    <SelectValue placeholder="Select your faculty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="profile-form-select-content">
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
                className="profile-form-visibility-btn"
              >
                {isFacultyPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="profile-form-description">
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
            <FormLabel className="profile-form-label">
              <Users className="profile-form-icon" />
              Department
            </FormLabel>
            <div className="profile-form-group">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="profile-form-select">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="profile-form-select-content">
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
                className="profile-form-visibility-btn"
              >
                {isDepartmentPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="profile-form-description">
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
            <FormLabel className="profile-form-label">
              <Calendar className="profile-form-icon" />
              Expected Graduation Date
            </FormLabel>
            <div className="profile-form-group">
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="profile-form-input"
                />
              </FormControl>
              <button
                type="button"
                onClick={() => setIsGraduationDatePublic(!isGraduationDatePublic)}
                className="profile-form-visibility-btn"
              >
                {isGraduationDatePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="profile-form-description">
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
            <FormLabel className="profile-form-label">
              <GraduationCap className="profile-form-icon" />
              Current Academic Year
            </FormLabel>
            <div className="profile-form-group">
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min="1"
                  max="7"
                  placeholder="Enter your current year (1-7)"
                  className="profile-form-input"
                />
              </FormControl>
              <button
                type="button"
                onClick={() => setIsAcademicYearPublic(!isAcademicYearPublic)}
                className="profile-form-visibility-btn"
              >
                {isAcademicYearPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="profile-form-description">
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
            <FormLabel className="profile-form-label">
              <Users className="profile-form-icon" />
              Community
            </FormLabel>
            <div className="profile-form-group">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="profile-form-select">
                    <SelectValue placeholder="Select your community" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="profile-form-select-content">
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
                className="profile-form-visibility-btn"
              >
                {isCommunityPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormDescription className="profile-form-description">
              Select your specific community or group.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
