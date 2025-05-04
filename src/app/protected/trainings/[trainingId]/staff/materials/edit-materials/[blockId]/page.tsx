"use client";
import { redirect, useParams } from "next/navigation";
import { Material } from "@/lib/types/Training";
import { useState } from "react";
import { useTrainingContext } from "@/providers/training";
import { updateMaterial } from "../../actions/_updateMaterial";
import { Button } from "@/components/ui/button";
import { updateMaterialSchema } from "@/lib/validation/training/updateMaterial";

export default function Page() {
  // get the trainingId and blockId from the url
  const urlparams = useParams();
  const trainingId = Number(urlparams.trainingId);
  const blockId = Number(urlparams.blockId);

  if (isNaN(trainingId) || isNaN(blockId)) {
    redirect("not-found");
  }
  const training = useTrainingContext();
  if (training === null) {
    return;
  }

  const materialData =
    training.blocks.find(({ id }) => id == blockId)?.materials ?? [];

  return (
    <div>
      <DynamicForm
        materialData={materialData}
        trainingId={trainingId}
        blockNumber={blockId}
      />
    </div>
  );
}

function DynamicForm({
  materialData,
  trainingId,
  blockNumber,
}: {
  materialData: Material[];
  trainingId: number;
  blockNumber: number;
}) {
  const [entries, setEntries] = useState<Material[]>(materialData ?? []);
  const addEntry = () => {
    setEntries([...entries, { title: "", link: "", des: "" }]);
  };

  const updateEntry = (
    index: number,
    field: "link" | "title" | "des",
    value: string,
  ) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const deleteEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dynamic Form</h2>

      {entries.map((entry, index) => (
        <div key={index} className="border p-4 rounded-xl mb-4 shadow">
          <input
            type="text"
            placeholder="Title"
            value={entry.title}
            onChange={(e) => updateEntry(index, "title", e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Link"
            value={entry.link}
            onChange={(e) => updateEntry(index, "link", e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={entry.des}
            onChange={(e) => updateEntry(index, "des", e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          ></textarea>
          <button
            onClick={() => deleteEntry(index)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addEntry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <Button
        onClick={() => {
          const { data: newMaterials, success, error: err } =
            updateMaterialSchema.safeParse(entries);
          if (!success) {
            // ui should show error
            // show err 
            console.error(err);

            return;
          }
          updateMaterial({ blockNumber, trainingId, newMaterials });
        }}
      >
        apply changes
      </Button>
    </div>
  );
}
