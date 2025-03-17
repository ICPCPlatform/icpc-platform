"use client";

import { useTrainingContext } from "@/providers/training";




export default function Page() {
  const data = useTrainingContext();

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
