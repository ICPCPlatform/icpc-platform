"use client";
import { useRouter } from "next/navigation";
import type { TrainingType } from "./page";
import styles from "./training.module.css";

export default function TrainingComp({ training }: { training: TrainingType }) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "Duration not specified";
    if (duration < 60) return `${duration} minutes`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h${minutes ? ` ${minutes}m` : ""}`;
  };

  return (
    <div className={styles.trainingCard}>
      <div className={styles.cardContent}>
        <div>
          <div className={styles.header}>
            <h3 className={styles.title}>{training.title}</h3>
            <span className={styles.badge}>Active</span>
          </div>

          <p className={styles.description}>{training.description}</p>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(training.startDate)}</span>
            </div>
            <div className={styles.infoItem}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatDuration(training.duration)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            fetch("/protected/api/training/join/" + training.id).then((res) => {
              if (res.ok) {
                alert("You have successfully joined the training!");
                router.push("/protected/profile");
              } else {
                alert("Failed to join the training. Please try again.");
              }
            });
          }}
          className={styles.button}
        >
          <span>Join Training</span>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
