/**
 * Training Data send to the client
 */
export type TrainingFullDTO = {
  standing:
    | {
        ContestInfo: ContestInfo;
        rankings: RankingEntryWithDetails[];
        problems: string[];
      }[]
    | undefined;
  blocks: Blocks; // to in the DAO
};

export type Blocks = {
  id: number;
  title: string;
  materials: Material[];
}[];

/**
 * Material type from db.training.material
 * this type is used from the database
 */
export type MaterialsEntry = Material[];

/**
 * map from blockId to array of materials
 */
export type MaterialsDTO = Record<string, Material[]>;

export type Material = {
  title: string;
  link: string;
  des: string;
};

/**
 * Training Data riveted from the Database
 */
export type Training = {
  standing: StandingEntry | null;
  standingView: string[]; // Dynamic configuration
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
export type StandingEntry = {
  ContestInfo: ContestInfo;
  rankings: Ranking[];
  problems: string[];
}[];

/**
 * Ranking Entry
 */
export type Ranking = {
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
export type RankingEntryWithDetails = Omit<Trainee & Ranking, "userId">;
