/**
 * Training Data send to the client
 */
export type TrainingFullDTO = {
  title: string;
  standing:
    | {
        contestInfo: ContestInfo;
        rankings: RankingEntryWithTrainees[];
        problems: string[];
      }[]
    | undefined;
  leaderBoard: LeaderBoardWithTrainees[];
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
  startTime: string;
  duration: string;
  participantCount: number;
  problemCount: number;
};

/**
 * Standing type from db.training.standing
 */
export type StandingEntry = {
  contestInfo: ContestInfo;
  rankings: Ranking[];
  problems: string[];
};

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

export interface LeaderBoardEntry {
  userId: string;
  points: number;
}
export type LeaderBoard = LeaderBoardEntry[];
/**
 * Standing Entry with Trainee Details
 */
export type RankingEntryWithTrainees = Omit<Trainee & Ranking, "userId">;

export type LeaderBoardWithTrainees = Omit<
  Trainee & LeaderBoardEntry,
  "userId"
>;

export { type TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
