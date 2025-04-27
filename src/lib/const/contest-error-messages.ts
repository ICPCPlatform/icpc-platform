export const CONTEST_ERROR_MESSAGES = {
  GROUP_ID_REQUIRED: 'Group ID is required',
  GROUP_ID_TOO_LONG: 'Group ID is too long',
  JUDGE_REQUIRED: 'Judge is required',
  JUDGE_TOO_LONG: 'Judge is too long',
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: 'Title is too long',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_TOO_LONG: 'Description is too long',
  TYPE_INVALID: 'Type must be either "practice" or "contest"',
  POINTSPP_INVALID: 'Points per submission must be at least 1',
  FIRST_POINTS_INVALID: 'First points must be at least 1',
  CALC_SYSTEM_REQUIRED: 'Calculation system is required',
  CALC_SYSTEM_TOO_LONG: 'Calculation system is too long',
} as const;
export const BLOCK_ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: 'Title is too long',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_TOO_LONG: 'Description is too long',

} as const;
