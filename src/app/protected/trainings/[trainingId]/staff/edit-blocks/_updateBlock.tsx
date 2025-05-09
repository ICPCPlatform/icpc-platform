"use client";

import { useState } from "react";
import { BlockForm } from "./_blockForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBlockSchema } from "@/lib/validation/training/updateBlocks";
import { z } from "zod";

type BlockData = z.infer<typeof updateBlockSchema> & {
  blockNumber: number;
};

interface UpdateBlockProps {
  trainingId: number;
  initialBlocks: BlockData[];
}

export function UpdateBlock({ trainingId, initialBlocks }: UpdateBlockProps) {
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Select Block to Edit</h2>
        <Select
          onValueChange={(value) => {
            const block = initialBlocks.find((b) => b.blockNumber.toString() === value);
            setSelectedBlock(block || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a block" />
          </SelectTrigger>
          <SelectContent>
            {initialBlocks.map((block) => (
              <SelectItem
                key={block.blockNumber}
                value={block.blockNumber.toString()}
              >
                Block {block.blockNumber}: {block.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBlock && (
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">
            Edit Block {selectedBlock.blockNumber}
          </h3>
          <BlockForm
            trainingId={trainingId}
            blockNumber={selectedBlock.blockNumber}
            initialData={{
              title: selectedBlock.title,
              description: selectedBlock.description,
              date: selectedBlock.date,
              hidden: selectedBlock.hidden,
            }}
          />
        </div>
      )}
    </div>
  );
}
