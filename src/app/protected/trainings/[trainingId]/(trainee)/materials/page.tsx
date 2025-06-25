"use client";
import { useTrainingContext } from "@/providers/training";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const training = useTrainingContext();
  const [accordionMode, setAccordionMode] = useState(false);
  const [openBlock, setOpenBlock] = useState<number | null>(null);

  if (!training) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">Loading training materials...</p>
      </div>
    );
  }

  const handleBlockClick = (blockId: number) => {
    if (!accordionMode) return;
    setOpenBlock((prev) => (prev === blockId ? null : blockId));
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Training Materials</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAccordionMode((prev) => !prev)}
        >
          {accordionMode ? "Show All Expanded" : "Accordion Mode"}
        </Button>
      </div>
      {training.blocks.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No materials are available for this training yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {training.blocks.map((block) => {
            const isOpen = !accordionMode || openBlock === block.id;
            // Defensive: ensure materials is an array
            const materials = Array.isArray(block.materials) ? block.materials : [];
            return (
              <Card key={block.id} className="overflow-hidden">
                <CardHeader
                  className="bg-muted/50 cursor-pointer select-none"
                  onClick={() => handleBlockClick(block.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{block.title}</CardTitle>
                      {block.description && (
                        <CardDescription className="mb-1">{block.description}</CardDescription>
                      )}
                      {materials.length > 0 && (
                        <CardDescription>{materials.length} resource{materials.length > 1 ? 's' : ''}</CardDescription>
                      )}
                    </div>
                    {accordionMode && (
                      <span className="ml-2 text-xs text-muted-foreground">{isOpen ? "▼" : "►"}</span>
                    )}
                  </div>
                </CardHeader>
                {isOpen && (
                  <CardContent className="p-6">
                    {materials.length === 0 ? (
                      <p className="text-muted-foreground">No materials available for this block.</p>
                    ) : (
                      <div className="space-y-4">
                        {materials.map((material, index) => {
                          if (!material || typeof material !== "object") return null;
                          const { title, link, des } = material;
                          if (!title && !link && !des) return null;
                          return (
                            <div key={index} className="border rounded-lg p-4 bg-card">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                  <h3 className="font-medium">{title || "Untitled Material"}</h3>
                                  {des && <p className="text-sm text-muted-foreground mt-1">{des}</p>}
                                </div>
                                {link && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    asChild
                                    className="mt-2 md:mt-0 w-full md:w-auto"
                                  >
                                    <a 
                                      href={link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2"
                                    >
                                      Open Resource <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
