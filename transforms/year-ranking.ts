import { ProblemType } from '../models/problem-type.ts';
import { YearReport } from '../models/year-report.ts';

export type YearRanking = {
  [key:number]: {
    [key in ProblemType]: string[]
  }
};

export function getYearRankings(yearReports: YearReport[]): YearRanking {
  const rankingsByYear = {} as {
    [key:number]: {
      [key in ProblemType]: string[]
    }
  };
  for (const r of yearReports) {
    rankingsByYear[r.year] = getEachYearRanking(r);
  }
  return rankingsByYear;
}

function getEachYearRanking(yearReport: YearReport): { [key in ProblemType]: string[] } {
  return {
    [ProblemType.Flood]: getEachProblemRanking(yearReport, ProblemType.Flood),
    [ProblemType.Waste]: getEachProblemRanking(yearReport, ProblemType.Waste),
    [ProblemType.Green]: getEachProblemRanking(yearReport, ProblemType.Green),
    [ProblemType.Water]: getEachProblemRanking(yearReport, ProblemType.Water),
    [ProblemType.Air]: getEachProblemRanking(yearReport, ProblemType.Air),
  }
}

function getEachProblemRanking(yearReport: YearReport, problem: ProblemType): string[] {
  const filtered = [...yearReport.districts]
    .filter(yr => yr.getValueOf(problem) !== null);
  filtered.sort((yr1, yr2) => yr2.getValueOf(problem)! - yr1.getValueOf(problem)!);

  return filtered.map(yr => yr.district!);
}