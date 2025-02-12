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

const pages = ["Personal", "Academic", "Handles", "Social"] as const;
export default function Profile() {
  const [page, setPage] = useState("Personal");
  const form = useForm<z.infer<typeof userFullData>>({
    resolver: zodResolver(userFullData),
  });
  return (
    <main>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(submit)} className={styles.main}>
          <Nav />
          <div style={{ padding: 30 }}>
            {
              {
                Handles: <HandlesForm />,
                Personal: <PersonalForm />,
                Academic: <AcademicForm />,
                Social: <SocialForm />,
              }[page]
            }
          </div>
        </form>
      </FormProvider>
    </main>
  );
  function submit(data: z.infer<typeof userFullData>) {
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
  function Nav() {
    return (
      <aside className={styles.navbar}>
        <ul>
          {pages.map((page, idx) => (
            <li key={idx}>
              <Button onClick={() => setPage(page)}>Edit {page}</Button>
            </li>
          ))}
          <li>
            <Button type="submit" className={styles.submit}>
              Save
            </Button>
          </li>
        </ul>
      </aside>
    );
  }
}
