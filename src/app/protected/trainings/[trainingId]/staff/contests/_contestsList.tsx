import { Card, CardContent } from "@/components/ui/card";
import { ContestCard } from "./_contestCard";

type Contest = {
  trainingId: number;
  blockNumber: number;
  blockTitle: string;
  contestId: string;
  judge: string;
  type: string;
  title: string;
  description: string;
  date: Date;
};

type ContestsListProps = {
  contests: Contest[];
  trainingId: number;
};

export function ContestsList({ contests, trainingId }: ContestsListProps) {
  if (contests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No contests found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contests.map((contest) => (
        <ContestCard
          key={`${contest.blockNumber}-${contest.contestId}`}
          contest={contest}
          trainingId={trainingId}
        />
      ))}
    </div>
  );
} 
