import { ProblemType } from './problem-type.ts';

export class YearRow {
  district?: string;
  budgetTotal: number | null = null;
  floodBudget: number | null = null;
  floodFrequency: number | null = null;
  wasteBudget: number | null = null;
  wasteData: number | null = null;
  greenBudget: number | null = null;
  greenData: number | null = null;
  waterBudget: number | null = null;
  waterData: number | null = null;
  airBudget: number | null = null;
  airData: number | null = null;
  floodWaterLevel: number | null = null;

  getValueOf(problem: ProblemType): number | null {
    switch (problem) {
      case ProblemType.Flood:
        return this.floodFrequency;
      case ProblemType.Waste:
        return this.wasteData;
      case ProblemType.Green:
        return this.greenData;
      case ProblemType.Water:
        return this.waterData;
      case ProblemType.Air:
        return this.airData;
    }
  }
}