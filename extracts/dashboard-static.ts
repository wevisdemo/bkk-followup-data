import { parse } from "https://deno.land/std@0.224.0/csv/parse.ts";
import { numberParser } from "./utils.ts";

export type DashboardStaticRawData = { [title: string]: number | string };

export async function extractDashboardStatic(
  csvPath: string
): Promise<DashboardStaticRawData> {
  const raw = await (await fetch(csvPath)).text();
  const rows = await parse(raw, {
    skipFirstRow: true,
    columns,
  });

  const output: DashboardStaticRawData = {};

  for (let i = 0; i < rows.length; i++) {
    if (
      numberRowKeys.some((k) => {
        return rows[i]["title"]!.startsWith(k);
      })
    ) {
      output[rows[i]["title"]!] = numberParser(rows[i]["value"])!;
    } else {
      output[rows[i]["title"]!] = rows[i]["value"]!;
    }
  }

  return output;
}

const columns = ["title", "value"];
const numberRowKeys = [
  "green.perCapita",
  "green.accessiblePerCapita",
  "air.latestYearAverage",
  "waste.nationwidePerCapita",
];
