import { DashboardStaticData } from "../models/dashboard-static-data.ts";
import { DashboardStaticRawData } from "../extracts/dashboard-static.ts";

const WASTE_NATIONWIDE_CAPITA_KEY = "waste.nationwidePerCapita"

export function transformDashboardStatic(
  input: DashboardStaticRawData
): DashboardStaticData {
  return {
    green: {
      date: guardString(input["green.date"]),
      perCapita: guardNumber(input["green.perCapita"]),
      accessiblePerCapita: guardNumber(input["green.accessiblePerCapita"]),
      standard: guardNumber(input["green.standard"]),
    },
    water: {
      standard: guardNumber(input["water.standard"]),
    },
    air: {
      latestYearAverage: guardNumber(input["air.latestYearAverage"]),
      standard: guardNumber(input["air.standard"]),
    },
    waste: {
      nationwidePerCapita: getWasteNationwidePerCapita(input),
    },
  };
}

function guardString(input: string | number): string {
  if (typeof input === "string") {
    return input;
  } else {
    return "";
  }
}

function guardNumber(input: string | number): number {
  if (typeof input === "number") {
    return input;
  } else {
    return NaN;
  }
}

function getWasteNationwidePerCapita(input: DashboardStaticRawData): DashboardStaticData['waste']['nationwidePerCapita'] {
  const output: DashboardStaticData['waste']['nationwidePerCapita'] = {}
  Object.keys(input).forEach((k) => {
    if (!k.startsWith(WASTE_NATIONWIDE_CAPITA_KEY)) {
      return
    }

    const year = k.split('.')[2];

    output[year] = guardNumber(input[k]);
  })

  return output;
}
