"use client";

import { useState } from "react";
import { TrainingCard } from "@/components/training/TrainingCard";
import {
  mockUserTrainings,
  mockAvailableTrainings,
} from "@/lib/mock/trainings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUserTrainings = mockUserTrainings.filter(
    (training) =>
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredAvailableTrainings = mockAvailableTrainings.filter(
    (training) =>
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEnroll = async (trainingId: string) => {
    // This will be replaced with actual API call later
    console.log(`Enrolling in training: ${trainingId}`);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
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

        {/* My Trainings Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              My Trainings
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          {filteredUserTrainings.length === 0 ? (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                You haven&apos;t joined any trainings yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredUserTrainings.map((training) => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  isUserTraining={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Available Trainings Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Available Trainings
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          {filteredAvailableTrainings.length === 0 ? (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                No trainings found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredAvailableTrainings.map((training) => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
