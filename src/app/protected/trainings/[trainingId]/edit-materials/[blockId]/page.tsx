"use client";
import { redirect } from "next/navigation";
import { editMaterial } from "./_action";

export default function Page() {
  // get the trainingId and blockId from the url
  const url = window.location.href;
  const urlParts = url.split("/");
  const trainingId = Number(urlParts[urlParts.length - 3]);
  const blockId = Number(urlParts[urlParts.length - 1]);
  if (isNaN(trainingId) || isNaN(blockId)) {
    redirect('not-found');
  }

  return <div>
    <h1>Edit Material</h1>
    <p>This is the edit material page.</p>
    <p>Implement the edit material functionality here.</p>
    <pre>{JSON.stringify({ trainingId, blockId }, null, 2)}</pre>
    <form action={editMaterial}>
      <input type="hidden" name="trainingId" value={trainingId} />
      <input type="hidden" name="blockId" value={blockId} />
      <input type="text" name="newMaterialName" placeholder="New Material Name" required />

      <button type="submit">Edit Material</button>
    </form>
  </div>;
}
