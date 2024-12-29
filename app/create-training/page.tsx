import { createTraining } from "@/api/create_training";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form
          className={styles.form}
          action={async (formdata) => {
            "use server";
            // check that all the elements are evalablue
            for (const val of [
              "name",
              "description",
              "start-date",
              "end-date",
            ]) {
              if (!formdata.get(val)) {
                alert("All fields are required");
                return;
              }
            }

            if (formdata.get("start-date")!! >= formdata.get("end-date")!!) {
              alert("Start date must be before end date");
              return;
            }

            createTraining(
              {
                name: formdata.get("name")?.toString() ?? "Default Name",
                description:
                  formdata.get("description")?.toString() ??
                  "No description provided",
                startDate:
                  formdata.get("start-date")?.toString() ?? "1970-01-01", // Use an appropriate default or null

                endDate: formdata.get("end-date")?.toString() ?? "1970-01-01",
              },
              "",
            );
          }}
        >
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" required />

          <label htmlFor="start-date">Start Date:</label>
          <input type="date" id="start-date" name="start-date" required />

          <label htmlFor="end-date">End Date:</label>
          <input type="date" id="end-date" name="end-date" required />

          <button type="submit">Submit</button>
        </form>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
