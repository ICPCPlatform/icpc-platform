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

const pages = [ "Personal","Academic", "Handles", "Social"] as const;
export default function Profile() {
  const [page, setPage] = useState("Academic");
  const form = useForm<z.infer<typeof userFullData>>({
    resolver: zodResolver(userFullData),
  });
  return (
    <main className={styles.main}>
      <Nav />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(submit)} style={{ padding: 30}}>
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
          {pages.map((page, idx) => (
            <li key={idx}>
              <Button onClick={() => setPage(page)}>Edit {page}</Button>
            </li>
          ))}
          <Button type="submit" className={styles.submit}>Save</Button>
        </ul>

      </aside>
    );
  }
}
