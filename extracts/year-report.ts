import { YearRow } from './year-row.ts';

export interface YearReport {
  year: number;
  all: YearRow;
  districts: YearRow[];
}