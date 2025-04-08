"use client";
import {
  FormControl,
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
    <form onSubmit={handleSubmit} className="profile-form-container">
      <div className="profile-form-section">
        <div className="profile-form-row">
          {personalFields.slice(0, 2).map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="profile-form-label">
                    <User className="profile-form-icon" />
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      required={false}
                      className="profile-form-input"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsEnglishNamePublic(!isEnglishNamePublic)}
            className="profile-form-visibility-btn"
          >
            {isEnglishNamePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>

        <div className="profile-form-row">
          {personalFields.slice(2).map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="profile-form-label">
                    <User className="profile-form-icon" />
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      required={false}
                      className="profile-form-input"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsArabicNamePublic(!isArabicNamePublic)}
            className="profile-form-visibility-btn"
          >
            {isArabicNamePublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>

        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="profile-form-label">
                <IdCard className="profile-form-icon" />
                National ID Number
              </FormLabel>
              <div className="profile-form-group">
                <FormControl>
                  <Input
                    {...field}
                    required={false}
                    placeholder="14 digits national ID"
                    className="profile-form-input"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setIsNationalIdPublic(!isNationalIdPublic)}
                  className="profile-form-visibility-btn"
                >
                  {isNationalIdPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="profile-form-label">
                <Globe className="profile-form-icon" />
                Country of Residence
              </FormLabel>
              <div className="profile-form-group">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="profile-form-select">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="profile-form-select-content">
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
                  className="profile-form-visibility-btn"
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
              <FormLabel className="profile-form-label">
                <MapPin className="profile-form-icon" />
                City
              </FormLabel>
              <div className="profile-form-group">
                <FormControl>
                  <Input
                    {...field}
                    required={false}
                    placeholder="Enter your city"
                    className="profile-form-input"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setIsCityPublic(!isCityPublic)}
                  className="profile-form-visibility-btn"
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
