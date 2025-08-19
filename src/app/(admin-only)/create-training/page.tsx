'use client';

import expectedBody from "../api/create-training/_expectedBody";
import styles from './page.module.css';
import { useState } from 'react';

/**
 * Admin page for creating new training programs
 * 
 * @description
 * Provides a form interface for administrators to create new training programs.
 * Includes form validation, submission handling, and user feedback.
 * 
 * Features:
 * - Form validation using Zod schema
 * - Loading state management during submission
 * - Success/error feedback to users
 * - Form reset after successful creation
 * 
 * @requires Admin authentication (enforced by route group)
 * @returns JSX element containing the training creation form
 */
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

  /**
   * Handles form submission for creating a new training
   * 
   * @param event - Form submission event
   * 
   * @description
   * Processes training creation form data through the following steps:
   * 1. Prevents default form submission
   * 2. Extracts and validates form data using Zod schema
   * 3. Sends POST request to training creation API
   * 4. Provides user feedback and resets form on success
   * 5. Handles errors with appropriate user messaging
   * 
   * @todo Replace alert() calls with proper toast notifications
   * @todo Add more specific error handling for different failure scenarios
   * @todo Implement form field validation feedback
   */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const givenBody = Object.fromEntries(formData.entries());
      const givenData = {
        ...givenBody,
        duration: Number(givenBody.duration),
      }


      const { success, data } = expectedBody.safeParse(
        givenData
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
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        alert("Training created successfully");
        form.reset();
      } else {
        throw new Error('Failed to create training');
      }
    } catch  {
      alert("An error occurred while creating the training");
    } finally {
      setIsSubmitting(false);
    }
  }
}
