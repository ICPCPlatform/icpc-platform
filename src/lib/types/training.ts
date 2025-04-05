/**
 * Training Data send to the client
 */
export type TrainingFullData = {
  standing: {
    ContestInfo: ContestInfo;
    rankings: RankingEntryWithDetails[];
    problems: string[];
  }[];
  material: Material;
};

export type Material = Record<
  string,
  {
    title: string;
    link: string;
    des: string;
  } | null
>;

/**
 * Training Data riveted from the Database
 */
export type Training = {
  standing: StandingData;
  standingView: string[]; // Dynamic configuration
  material: Material;
};


/**
 * Contest Info 
 */
export type ContestInfo = {
  id: number;
  title: string;
  start_time: string;
  duration: string;
  participant_count: number;
  problem_count: number;
};


/**
 * Standing type from db.training.standing 
 */
export type StandingData = {
  ContestInfo: ContestInfo;
  rankings: RankingEntry[];
  problems: string[];
}[];


/**
 * Ranking Entry
 */
export type RankingEntry = {
  userId: string;
  penalty: number;
  solved: string[];
  attempted: string[];
};

/** 
 * Trainee Details
 * this type is used from the database
 */
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

/**
 * Standing Entry with Trainee Details
 */
export type RankingEntryWithDetails = Omit<Trainee & RankingEntry, "userId">;





