import { parse } from "https://deno.land/std@0.224.0/csv/parse.ts";
import { numberParser } from "./utils.ts";

export type Population = { [year: string]: number };

export async function extractPopulation(csvPath: string): Promise<Population> {
  const raw = await (await fetch(csvPath)).text();
  const rows = await parse(raw, {
    skipFirstRow: true,
    columns,
  });

  const population: Population = {};
  rows.forEach((row) => {
    const y = row["year"];
    const p = numberParser(row["population"]);
    if (!y || p === null) {
      console.error(
        `Extract:population: year or population is empty: ${y}, ${p}`
      );
      return;
    }
    population[y] = p;
  });

  return population;
}

const columns = ["year", "population"];
