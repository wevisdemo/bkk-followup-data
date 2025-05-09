import { parse } from "https://deno.land/std@0.224.0/csv/parse.ts";
import { numberParser } from "./utils.ts";
import { BudgetFrameworkRow } from "../models/budget-framework-row.ts";


export async function extractBudgetFramework(csvPath: string): Promise<BudgetFrameworkRow[]> {
  const raw = await (await fetch(csvPath)).text();
  const rows = await parse(raw, {
    skipFirstRow: true,
    columns,
  });
  
  return rows.map(parseBudgetFrameworkRow)
}

function parseBudgetFrameworkRow(i: Record<string, string | undefined>): BudgetFrameworkRow {
  return {
    year: numberParser(i["year"])!,
    adminBudget: parseBudget(i, "admin_budget"),
    securityBudget: parseBudget(i, "security_budget"),
    cityBudget: parseBudget(i, "city_budget"),
    environmentBudget: parseBudget(i, "environment_budget"),
    communityBudget: parseBudget(i, "community_budget"),
    healthBudget: parseBudget(i, "health_budget"),
    educationBudget: parseBudget(i, "education_budget"),
    commercialBudget: parseBudget(i, "commercial_budget"),
  }
}

function parseBudget(i: Record<string, string | undefined>, key: string): number {
  return (numberParser(i[key]) || 0) * 1000000;
}

const columns = [
  "year",
  "admin_budget",
  "security_budget",
  "city_budget",
  "environment_budget",
  "community_budget",
  "health_budget",
  "education_budget",
  "commercial_budget",
]
