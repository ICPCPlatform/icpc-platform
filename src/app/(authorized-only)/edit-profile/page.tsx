"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { userFullData } from "@/validation/user-fulldata-validations";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { Sidebar } from "@/components/ui/sidebar";
import styles from "./page.module.css";
import AcademicForm from "./_academicFrom";
import HandlesForm from "./_handlesForm";
import SocialForm from "./_socialForm";
import PersonalForm from "./_personalForm";

export default function Profile() {
  const [page, setPage] = useState("Academic");
  const form = useForm<z.infer<typeof userFullData>>({
    resolver: zodResolver(userFullData),
  });
  return (
    <main className={styles.main}>
      <Nav />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          {
            {
              Handles: <HandlesForm />,
              Personal: <PersonalForm />,
              Academic: <AcademicForm />,
              Social: <SocialForm />,
            }[page]
          }
          <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
          <Button type="submit">Save</Button>
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
          <li>
            <Button onClick={() => setPage("Handles")}>Edit Handles</Button>
          </li>
          <li>
            <Button onClick={() => setPage("Personal")}>Edit Profile</Button>
          </li>
          <li>
            <Button onClick={() => setPage("Academic")}>Edit Academic</Button>
          </li>
          <li>
            <Button onClick={() => setPage("Social")}>Edit Social</Button>
          </li>
        </ul>
      </aside>
    );
  }
}
