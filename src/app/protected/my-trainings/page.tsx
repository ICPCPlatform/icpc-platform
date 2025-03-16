"use client";

import { useState } from "react";
import { TrainingCard } from "@/components/training/TrainingCard";
import { mockUserTrainings } from "@/lib/mock/trainings";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MyTrainingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrainings = mockUserTrainings.filter(
    (training) =>
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">My Trainings</h1>
          <p className="text-muted-foreground">
            Track your progress in enrolled training programs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Trainings Grid */}
        {filteredTrainings.length === 0 ? (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">
              You haven&apos;t joined any trainings yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTrainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                isUserTraining={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
