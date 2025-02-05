import expectedBody from "@/app/api/create-training/_expectedBody";
import { NextURL } from "next/dist/server/web/next-url";
export default function Page() {
  return (
    <div>
      <h1>Create Training</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Name</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" />
        <label htmlFor="startDate">Start</label>
        <input type="date" id="startDate" name="startDate" />

        <label htmlFor="duration">Duration</label>
        <input type="number" id="duration" name="duration" />

        <button type="submit">Create</button>
      </form>
    </div>
  );
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const { success, data } = expectedBody.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!success) {
      alert("Invalid form data");
      return;
    }
    fetch(new NextURL("/api/create-training"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 201) {
        alert("Training created");
      }
    });
  }
}
