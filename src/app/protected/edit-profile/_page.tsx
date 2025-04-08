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
import { toast } from "react-toastify";

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
    icon: <FaUser className="profile-edit-icon" />,
  },
  {
    id: "academic",
    label: "Academic Info",
    icon: <FaGraduationCap className="profile-edit-icon" />,
  },
  {
    id: "competitive",
    label: "CP Handles",
    icon: <FaCode className="profile-edit-icon" />,
  },
  { 
    id: "social", 
    label: "Social Links", 
    icon: <FaLink className="profile-edit-icon" /> 
  },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-layout">
        <aside>
          <div className="profile-edit-sidebar">
            <nav>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentPage(section.id)}
                  className={`profile-edit-nav-button ${
                    currentPage === section.id
                      ? "profile-edit-nav-button-active"
                      : "profile-edit-nav-button-inactive"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
              <button
                type="submit"
                form="edit-profile-form"
                className="profile-edit-save-button"
                disabled={isSubmitting}
              >
                <FaSave className="profile-edit-icon" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </nav>
          </div>
        </aside>

        <main className="profile-edit-main">
          <FormProvider {...form}>
            <form
              id="edit-profile-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="profile-edit-form"
            >
              {components[currentPage]}
            </form>
          </FormProvider>
        </main>
      </div>
    </div>
  );

  async function onSubmit(data: z.infer<typeof userFullDataValid>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/protected/api/edit-profile", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Changes saved successfully!");
      } else {
        toast.error("Failed to save changes. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }
}
