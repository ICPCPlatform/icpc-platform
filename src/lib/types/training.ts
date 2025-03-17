export type TrainingFullData = {
  standing: {
    ContestInfo: ContestInfo;
    rankings: StandingEntryWithDetails[];
    problems: string[];
  }[];
};
export type Training = {
  standing: StandingData;
  standingView: string[]; // Dynamic configuration
};
export type ContestInfo = {
  id: number;
  title: string;
  start_time: string;
  duration: string;
  participant_count: number;
  problem_count: number;
};

export type StandingData = {
  ContestInfo: ContestInfo;
  rankings: StandingEntry[];
  problems: string[];
}[];

export type StandingEntry = {
  userId: string;
  penalty: number;
  solved: string[];
  attempted: string[];
};

export type Trainee = {
  userId?: string;
  name?: string | null;
  cfHandle?: string;
  vjudge?: string | null;
  gmail?: string;
  level?: number;
  university?: string;
  faculty?: string;
};

export type StandingEntryWithDetails = Omit<Trainee & StandingEntry, "userId">;
