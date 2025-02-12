"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HandlesForm from "./_handlesForm";
import AcademicForm from "./_academicForm";
import SocialForm from "./_socialForm";
import PersonalForm from "./_personalForm";
import { FaUser, FaGraduationCap, FaCode, FaLink } from 'react-icons/fa';

type PageType = "personal" | "academic" | "competitive" | "social";

interface NavSection {
  id: PageType;
  label: string;
  icon: React.ReactNode;
}

const sections: NavSection[] = [
  { id: "personal", label: "Personal Info", icon: <FaUser className="w-4 h-4" /> },
  { id: "academic", label: "Academic Info", icon: <FaGraduationCap className="w-4 h-4" /> },
  { id: "competitive", label: "CP Handles", icon: <FaCode className="w-4 h-4" /> },
  { id: "social", label: "Social Links", icon: <FaLink className="w-4 h-4" /> },
];

const components: Record<PageType, React.ReactNode> = {
  personal: <PersonalForm />,
  academic: <AcademicForm />,
  competitive: <HandlesForm />,
  social: <SocialForm />,
};

// Define your form schema
const userFullData = z.object({
  // Personal Info
  name: z.string().min(2).max(50),
  email: z.string().email(),
  birthdate: z.string(),
  location: z.string(),
  
  // Academic Info
  institute: z.string().min(2),
  graduationYear: z.string(),
  academicEmail: z.string().email(),
  
  // Competitive Programming
  codeforcesHandle: z.string().optional(),
  vjudgeHandle: z.string().optional(),
  atcoderHandle: z.string().optional(),
  codechefHandle: z.string().optional(),
  leetCodeHandle: z.string().optional(),
  
  // Social Links
  linkedIn: z.string().url().optional(),
  facebook: z.string().url().optional(),
  telegram: z.string().url().optional(),
});

export default function Profile() {
  const [currentPage, setCurrentPage] = useState<PageType>("personal");
  const form = useForm<z.infer<typeof userFullData>>({
    resolver: zodResolver(userFullData),
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        <aside className="w-64 bg-card rounded-lg border p-4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentPage(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap
                  ${currentPage === section.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </nav>
          <button 
            type="submit"
            form="edit-profile-form"
            className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
          >
            Save Changes
          </button>
        </aside>

        <main className="flex-1 bg-card rounded-lg border p-6">
          <FormProvider {...form}>
            <form id="edit-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {components[currentPage]}
            </form>
          </FormProvider>
        </main>
      </div>
    </div>
  );
}

function onSubmit(data: z.infer<typeof userFullData>) {
  console.log(data);
}
