"use client";
import { redirect, useParams } from "next/navigation";
import { Material } from "@/lib/types/Training";
import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateMaterial } from "../../actions/_updateMaterial";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateMaterialSchema } from "@/lib/validation/training/updateMaterial";

export default function Page() {
  const urlparams = useParams();
  const trainingId = Number(urlparams.trainingId);
  const blockId = Number(urlparams.blockId);

  if (isNaN(trainingId) || isNaN(blockId)) {
    redirect("not-found");
  }

  if (window === undefined) {
    return;
  }
  const materialData = JSON.parse(
    localStorage.getItem(blockId.toString()) ?? "[]",
  ) as Material[];

  return (
    <div className="container mx-auto py-6">
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
  const { toast } = useToast();
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
    <Card>
      <CardHeader>
        <CardTitle>Edit Training Materials</CardTitle>
        <CardDescription>Add or modify materials for this training block</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {entries.map((entry, index) => (
          <Card key={index} className="p-4">
            <CardContent className="p-0 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Material {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter material title"
                    value={entry.title}
                    onChange={(e) => updateEntry(index, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link</label>
                  <Input
                    placeholder="Enter material link"
                    value={entry.link}
                    onChange={(e) => updateEntry(index, "link", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Enter material description"
                    value={entry.des}
                    onChange={(e) => updateEntry(index, "des", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button
            onClick={addEntry}
            variant="outline"
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        </div>

        <Button
          onClick={() => {
            const {
              data: newMaterials,
              success,
              error: err,
            } = updateMaterialSchema.safeParse(entries);
            if (!success) {
              toast({
                variant: "destructive",
                title: "Validation Error",
                description: err.errors[0].message,
              });
              return;
            }
            startTransition(async () => {
              const res = await updateMaterial({
                blockNumber,
                trainingId,
                newMaterials,
              });
              console.log(res);
              if (res.success) {
                localStorage.setItem(
                  blockNumber.toString(),
                  JSON.stringify(newMaterials),
                );
                toast({
                  title: "Success",
                  description: "Materials updated successfully",
                });
              } else {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: res.error,
                });
              }
            });
          }}
          className="w-full"
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
