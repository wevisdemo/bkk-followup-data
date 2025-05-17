import { Population } from "../extracts/population.ts";
import { BudgetFrameworkRow } from "../models/budget-framework-row.ts";
import { Landing } from "../models/landing.ts";
import { YearReport } from "../models/year-report.ts";

export function transformLanding(
  years: YearReport[],
  population: Population,
  budgetFrameworks: BudgetFrameworkRow[]
): Landing {
  const descSorted = years.toSorted((a, b) => b.year - a.year);
  const ascSorted = years.toSorted((a, b) => a.year - b.year);
  const latestYear = descSorted[0];

  return {
    latestYear: {
      year: latestYear.year,
      budget: latestYear.all.budgetTotal!,
      population: population[latestYear.year],
      budgetPerCapita:
        latestYear.all.budgetTotal! / population[latestYear.year],
    },
    yearCount: years.length,

    budgetPerCapita: ascSorted.map((y) => ({
      year: y.year,
      value: y.all.budgetTotal! / population[y.year],
    })),
    totalBudget: descSorted.reduce((prev, next) => {
      return prev + next.all.budgetTotal!;
    }, 0),
    yearlyBudgetSummaries: budgetFrameworks.map((y) => {
      return {
        year: y.year,
        values: [
          {
            title: "การศึกษา",
            value: y.educationBudget,
          },
          {
            title: "สาธารณสุข",
            value: y.healthBudget,
          },
          {
            title: "พัฒนาสังคมและชุมชนเมือง",
            value: y.communityBudget,
          },
          {
            title: "ทรัพยากรธรรมชาติและสิ่งแวดล้อม",
            value: y.environmentBudget,
          },
          {
            title: "เมืองและการพัฒนาเมือง",
            value: y.cityBudget,
          },
          {
            title: "ความปลอดภัยและความเป็นระเบียบเรียบร้อย",
            value: y.securityBudget,
          },
          {
            title: "การบริหารจัดการและบริหารราชการ",
            value: y.adminBudget,
          },
          {
            title: "เศรษฐกิจและการพาณิชย์",
            value: y.commercialBudget,
          },
        ],
      };
    }),
  };
}
