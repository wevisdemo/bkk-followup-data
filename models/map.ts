import { ProblemType } from './problem-type.ts';

export type Maps = { [key in ProblemType ]: MapEntry };

export interface MapEntry {
  byYear: { [key:number]: MapPointByDistrict };
}

export type MapPointByDistrict = { [key:number]: MapPoint };

export interface MapPoint {
  districtName: string;
  value: number | null;
}
