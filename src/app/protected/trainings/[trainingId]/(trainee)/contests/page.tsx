"use client";

import { useTrainingContext } from "@/providers/training";
import { Card, CardContent } from "@/components/ui/card";

export default function ContestsPage() {
  const training = useTrainingContext();
  const contests = Array.isArray(training?.standing) ? training.standing : [];

  return (
    <div className="container py-8 px-4 md:px-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Contests</h1>
      {contests.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground text-lg font-medium">
              There are currently no contests in this training.<br />
              Please check back later or contact your instructor if you think this is a mistake.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contests.map((c, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <span className="font-semibold">{c.contestInfo.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

