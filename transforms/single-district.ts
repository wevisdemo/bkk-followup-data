import { ProblemType } from '../models/problem-type.ts';
import { District } from './district.ts';
import { BaseReport } from '../models/base-report.ts';
import {
  AirSingleDistrictReport,
  FloodSingleDistrictReport,
  GreenSingleDistrictReport,
  WasteSingleDistrictReport,
  WaterSingleDistrictReport
} from '../models/reports.ts';
import { SingleDistrictReport } from '../models/zonetype-reports.ts';

export function getSingleDistrict(
  district: District,
  rankings: {
    [key in ProblemType]: {
      ranked: number;
      districtId: number;
      districtName: string;
      value: number;
    }[]
  }): {
  id: number,
  name: string,
  problems: {
    [ProblemType.Flood]: FloodSingleDistrictReport,
    [ProblemType.Waste]: WasteSingleDistrictReport,
    [ProblemType.Green]: GreenSingleDistrictReport,
    [ProblemType.Water]: WaterSingleDistrictReport,
    [ProblemType.Air]: AirSingleDistrictReport,
  }
} {
  return {
    id: district.id,
    name: district.name,
    problems: {
      [ProblemType.Flood]: {
        ...getReport(ProblemType.Flood, district, rankings),
        floodHotspots: district.floodHotspot,
        meanFloodLevel: district.latestYear.floodWaterLevel,
        meanFloodLevelMaximumPoint: {
          ...district.getMaximumValue(ProblemType.Flood, yr => yr.floodWaterLevel)!,
          districtId: district.id,
          districtName: district.name
        },
      },
      [ProblemType.Waste]: {
        ...getReport(ProblemType.Waste, district, rankings),
      },
      [ProblemType.Green]: {
        ...getReport(ProblemType.Green, district, rankings),
        publicGreenSpacePerCapita: district.publicGreenSpace,
      },
      [ProblemType.Water]: {
        ...getReport(ProblemType.Water, district, rankings),
      },
      [ProblemType.Air]: {
        ...getReport(ProblemType.Air, district, rankings),
        sampling: district.pm25MeasurementCount !== null && district.pm25OverThresholdCount !== null ? {
          count: district.pm25MeasurementCount,
          aboveThresholdCount: district.pm25OverThresholdCount,
        } : null,
      }
    }
  };
}

function getReport(
  problem: ProblemType,
  district: District,
  rankings: {
    [key in ProblemType]: {
      ranked: number;
      districtId: number;
      districtName: string;
      value: number;
    }[]
  }): GenericSingleDistrictReport {
  return {
    value: district.latestYear.getValueOf(problem),
    valuePerYear: district.getValuePerYear(problem),
    minimumPoint: { ...district.getMinimumValue(problem)!, districtId: district.id, districtName: district.name },
    maximumPoint: { ...district.getMaximumValue(problem)!, districtId: district.id, districtName: district.name },
    budgetPerYear: district.getReportBudgets(problem),
    budgetOverall: district.getOverallReportBudget(problem),
    ranked: getRanked(problem, district.id, rankings)?.ranked || null,
    rankings: district.getRankings(problem),
  };
}

function getRanked(
  problem: ProblemType,
  districtId: number,
  rankings: { [key in ProblemType]: {
    ranked: number;
    districtId: number;
    districtName: string;
    value: number;
  }[]
}): {
  ranked: number;
  districtId: number;
  districtName: string;
  value: number;
} | null {
  return rankings[problem].find(r => r.districtId === districtId) || null;
}

interface GenericSingleDistrictReport extends BaseReport, SingleDistrictReport {}