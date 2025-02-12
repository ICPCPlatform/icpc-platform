"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { userFullData } from "@/lib/validation/userFulldataValidations";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { Sidebar } from "@/components/ui/sidebar";
import styles from "./page.module.css";
import AcademicForm from "./_academicFrom";
import HandlesForm from "./_handlesForm";
import SocialForm from "./_socialForm";
import PersonalForm from "./_personalForm";

interface NavSection {
  id: typeof pages[number];
  label: string;
  icon?: string;
}

const sections: NavSection[] = [
  { id: "Personal", label: "Basic Info" },
  { id: "Academic", label: "Education" },
  { id: "Handles", label: "Coding Profiles" },
  { id: "Social", label: "Social Links" },
] as const;

const pages = sections.map(section => section.id) as const;

export default function Profile() {
  const [page, setPage] = useState<typeof pages[number]>("Personal");
  const form = useForm<z.infer<typeof userFullData>>({
    resolver: zodResolver(userFullData),
  });

  return (
    <main className={styles.main}>
      <Nav />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(submit)} className={styles.formContainer}>
          {
            {
              Handles: <HandlesForm />,
              Personal: <PersonalForm />,
              Academic: <AcademicForm />,
              Social: <SocialForm />,
            }[page]
          }
        </form>
      </FormProvider>
    </main>
  );

  function submit(data: z.infer<typeof userFullData>) {
    console.log(data);
  }

  function Nav() {
    return (
      <aside className={styles.navbar}>
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <Button
                variant="ghost"
                onClick={() => setPage(section.id)}
                data-active={page === section.id}
              >
                {section.label}
              </Button>
            </li>
          ))}
          <Button type="submit" className={styles.submit}>
            Save Changes
          </Button>
        </ul>
      </aside>
    );
  }
}
