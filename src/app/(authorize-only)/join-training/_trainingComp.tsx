"use client";
import { useRouter } from "next/navigation";
import type { TrainingType } from "./page";

export default function TrainingComp({ training }: { training: TrainingType }) {
  const router = useRouter();
  return (
    <div>
      <h3>{training.title}</h3>
      <p>{training.description}</p>
      <h5>{training.startDate}</h5>
      <h5>{training.duration}</h5>
      <button
        onClick={() => {
          fetch("/api/training/join/" + training.id).then((res) => {
            if (res.ok) {
              alert("You have joined the training");
              router.push("/profile");
            } else {
              alert("Failed to join the training");
            }
          });
        }}
      >
        Apply
      </button>
    </div>
  );
}
