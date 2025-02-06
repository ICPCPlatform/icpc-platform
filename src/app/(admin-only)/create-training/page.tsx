'use client';

import expectedBody from "@/app/api/create-training/_expectedBody";
import styles from './page.module.css';
import { useState } from 'react';

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Training</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Training Name</label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            placeholder="Enter training name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            placeholder="Enter training description"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate" className={styles.label}>Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="duration" className={styles.label}>Duration (hours)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            className={styles.input}
            min="1"
            placeholder="Enter duration in hours"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Training'}
        </button>
      </form>
    </div>
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const { success, data } = expectedBody.safeParse(
        Object.fromEntries(formData.entries()),
      );

      if (!success) {
        alert("Please check your input and try again");
        return;
      }

      const response = await fetch('/api/create-training', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        alert("Training created successfully");
        form.reset();
      } else {
        throw new Error('Failed to create training');
      }
    } catch (error) {
      alert("An error occurred while creating the training");
    } finally {
      setIsSubmitting(false);
    }
  }
}
