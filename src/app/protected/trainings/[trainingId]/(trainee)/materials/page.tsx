"use client";
import { useTrainingContext } from "@/providers/training";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Page() {
  const training = useTrainingContext();

  if (!training) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">Loading training materials...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Training Materials</h1>
      
      {training.blocks.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No materials are available for this training yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {training.blocks.map((block) => (
            <Card key={block.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>{block.title}</CardTitle>
                {block.materials.length > 0 && (
                  <CardDescription>{block.materials.length} resource{block.materials.length > 1 ? 's' : ''}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {block.materials.length === 0 ? (
                  <p className="text-muted-foreground">No materials available for this block.</p>
                ) : (
                  <div className="space-y-4">
                    {block.materials.map((material, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-card">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{material.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{material.des}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="mt-2 md:mt-0 w-full md:w-auto"
                          >
                            <a 
                              href={material.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              Open Resource <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
