"use client";
import { userFullDataValid } from "@/lib/validation/userFulldataValidations";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import HandlesForm from "./_handlesForm";
import AcademicForm from "./_academicForm";
import SocialForm from "./_socialForm";
import PersonalForm from "./_personalForm";
import { z } from "zod";
import {
  FaUser,
  FaGraduationCap,
  FaCode,
  FaLink,
  FaSave,
} from "react-icons/fa";

type PageType = "personal" | "academic" | "competitive" | "social";

interface NavSection {
  id: PageType;
  label: string;
  icon: React.ReactNode;
}

const sections: NavSection[] = [
  {
    id: "personal",
    label: "Personal Info",
    icon: <FaUser className="w-4 h-4" />,
  },
  {
    id: "academic",
    label: "Academic Info",
    icon: <FaGraduationCap className="w-4 h-4" />,
  },
  {
    id: "competitive",
    label: "CP Handles",
    icon: <FaCode className="w-4 h-4" />,
  },
  { id: "social", label: "Social Links", icon: <FaLink className="w-4 h-4" /> },
];

const components: Record<PageType, React.ReactNode> = {
  personal: <PersonalForm />,
  academic: <AcademicForm />,
  competitive: <HandlesForm />,
  social: <SocialForm />,
};

export default function Profile({
  userData,
}: {
  userData: z.infer<typeof userFullDataValid>;
}) {
  const [currentPage, setCurrentPage] = useState<PageType>("personal");
  const form = useForm<z.infer<typeof userFullDataValid>>({
    defaultValues: userData,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        <aside>
          <div className="flex-shrink-0 w-64 bg-card rounded-lg border p-4">
            <nav>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentPage(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap
                  ${
                    currentPage === section.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
              <button
                type="submit"
                form="edit-profile-form"
                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium text-left"
              >
                <FaSave className="w-4 h-4 inline-block mr-3 mb-1" />
                Save Changes
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 bg-card rounded-lg border p-6">
          <FormProvider {...form}>
            <form
              id="edit-profile-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {components[currentPage]}
            </form>
          </FormProvider>
        </main>
      </div>
    </div>
  );

  function onSubmit(data: z.infer<typeof userFullDataValid>) {
    console.log(data);
    fetch("/api/edit-profile", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    });
  }
}
