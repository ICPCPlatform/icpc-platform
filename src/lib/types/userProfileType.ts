export type UserProfile<Filter extends boolean> = {
  username: string | null;
  imageUrl: string | null;
  gmail: string | null;
  createdAt: Date | null;
  country: string | null;
  city: string | null;
  institute: string | null;
  department: string | null;
  community: string | null;
  faculty: string | null;
  nameAR1: string | null;
  nameAR2: string | null;
  nameAR3: string | null;
  nameAR4: string | null;
  firstNameEn: string | null;
  lastNameEn: string | null;
  codeforces: string | null;
  vjudge: string | null;
  atcoder: string | null;
  codechef: string | null;
  leetcode: string | null;
  cses: string | null;
  facebook: string | null;
  linkedIn: string | null;
  twitter: string | null;
  github: string | null;
  telegram: string | null;
  academicYear: number | null;
  graduationDate: string | null;
} & (Filter extends false
  ? { visibilityMask: number | null }
  : unknown);
