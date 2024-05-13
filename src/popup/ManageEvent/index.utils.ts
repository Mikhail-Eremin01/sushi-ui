export const MAX_FUTURE_YEAR_FROM_NOW = 10;

export const maybeAddLeadingZero = (date: number | string): string => {
  return ('0' + String(date)).slice(-2);
};
