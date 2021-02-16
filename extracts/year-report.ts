import { YearRow } from '../models/year-row.ts';

export interface YearReport {
  year: number;
  all: YearRow;
  districts: YearRow[];
  districtGroups: YearRow[];
}